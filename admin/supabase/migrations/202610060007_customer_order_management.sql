begin;
alter table public.orders add column if not exists editable_until timestamptz;
alter table public.orders add column if not exists last_modified_at timestamptz;
alter table public.orders add column if not exists cancelled_at timestamptz;
alter table public.orders add column if not exists cancellation_reason text;
alter table public.orders add column if not exists revision integer not null default 1;
create table public.order_change_events (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 change_type text not null, before_data jsonb, after_data jsonb, actor_id uuid references public.profiles(id), created_at timestamptz not null default now()
);
alter table public.order_change_events enable row level security;
create policy changes_admin_read on public.order_change_events for select to authenticated using(public.is_admin());
grant select on public.order_change_events to authenticated;
grant all on public.order_change_events to service_role;

-- A single database rule is authoritative for pages, mutations and admin indicators.
create function public.customer_order_editable(o public.orders) returns boolean language sql stable set search_path='' as $$
 select coalesce(o.fulfillment_status='new' and not o.stock_released and o.confirmation_status in ('pending','needs_review','confirmed')
 and case when o.editable_until is not null then now()<o.editable_until
 when o.confirmation_status='confirmed' then false else now()<o.reservation_expires_at end,false);
$$;
create function public.order_lifecycle_fields() returns trigger language plpgsql set search_path='' as $$
begin
 new.revision:=old.revision+1;
 if new.confirmation_status='confirmed' and old.confirmation_status<>'confirmed' then
  new.confirmed_at:=now(); new.editable_until:=now()+interval '24 hours'; new.reservation_expires_at:=new.editable_until;
 end if;
 if new.fulfillment_status='cancelled' and old.fulfillment_status<>'cancelled' then new.cancelled_at:=now(); end if;
 return new;
end $$;
create trigger order_lifecycle before update on public.orders for each row execute function public.order_lifecycle_fields();

create function public.customer_order_view(p_code text,p_token_hash text) returns jsonb language plpgsql security definer set search_path='' as $$
declare o public.orders; result jsonb; begin
 select * into o from public.orders where public_order_code=p_code and access_token_hash=p_token_hash and access_expires_at>now();
 if not found then raise exception 'INVALID_ACCESS'; end if;
 result:=jsonb_build_object('public_order_code',o.public_order_code,'customer_name',o.customer_name,'shipping_city',o.shipping_city,'shipping_address',o.shipping_address,'shipping_notes',o.shipping_notes,
 'subtotal',o.subtotal,'shipping_amount',o.shipping_amount,'discount_amount',o.discount_amount,'total',o.total,'confirmation_status',o.confirmation_status,'fulfillment_status',o.fulfillment_status,
 'created_at',o.created_at,'confirmed_at',o.confirmed_at,'editable_until',o.editable_until,'last_modified_at',o.last_modified_at,'cancelled_at',o.cancelled_at,'cancellation_reason',o.cancellation_reason,
 'revision',o.revision,'server_now',now(),'remaining_seconds',greatest(0,extract(epoch from (coalesce(o.editable_until,o.reservation_expires_at)-now()))::integer),
 'can_modify',public.customer_order_editable(o),'can_cancel',public.customer_order_editable(o),'can_confirm',public.customer_order_editable(o) and o.confirmation_status in ('pending','needs_review'));
 return result||jsonb_build_object('order_items',coalesce((select jsonb_agg(jsonb_build_object('product_id',i.product_id,'variant_id',i.variant_id,'product_name',i.product_name,'product_image_url',i.product_image_url,'quantity',i.quantity,'unit_price',i.unit_price,'line_total',i.line_total) order by i.created_at,i.id) from public.order_items i where i.order_id=o.id),'[]'::jsonb),
 'timeline',coalesce((select jsonb_agg(jsonb_build_object('status_type',h.status_type,'new_status',h.new_status,'created_at',h.created_at) order by h.created_at,h.id) from public.order_status_history h where h.order_id=o.id and h.status_type<>'note'),'[]'::jsonb));
end $$;

create function public.manage_customer_order(p_code text,p_token_hash text,p_action text,p_revision integer,p_items jsonb default null,p_shipping jsonb default null,p_reason text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare o public.orders; p public.products; v public.product_variants; item jsonb; qty integer; unit numeric; sub numeric:=0; ship numeric; cfg jsonb; image text; pid uuid; vid uuid; before_items jsonb; after_items jsonb; previous_confirmed boolean;
begin
 select * into o from public.orders where public_order_code=p_code and access_token_hash=p_token_hash and access_expires_at>now() for update;
 if not found then raise exception 'INVALID_ACCESS'; end if;
 if p_action='cancel' and o.fulfillment_status='cancelled' then return public.customer_order_view(p_code,p_token_hash); end if;
 if p_action='confirm' and o.confirmation_status='confirmed' and o.fulfillment_status not in ('cancelled','returned') then return public.customer_order_view(p_code,p_token_hash); end if;
 if p_revision is null or p_revision<>o.revision then raise exception 'STALE_ORDER'; end if;
 if not public.customer_order_editable(o) then raise exception 'ORDER_LOCKED'; end if;
 if p_action='cancel' then
  if length(coalesce(p_reason,''))>500 then raise exception 'INVALID_REASON'; end if;
  perform public.release_order_stock(o.id);
  update public.orders set fulfillment_status='cancelled',cancellation_reason=nullif(trim(p_reason),''),cancelled_at=now() where id=o.id;
  insert into public.order_status_history(order_id,status_type,old_status,new_status) values(o.id,'fulfillment',o.fulfillment_status,'cancelled');
  insert into public.order_change_events(order_id,change_type,before_data,after_data) values(o.id,'order_cancelled',jsonb_build_object('status',o.fulfillment_status),jsonb_build_object('status','cancelled'));
 elsif p_action='confirm' then
  -- Stock was reserved at checkout; do not deduct a second time.
  perform id from public.products where id in(select product_id from public.order_items where order_id=o.id) order by id for update;
  if not exists(select 1 from public.order_items where order_id=o.id) or exists(select 1 from public.order_items i left join public.products pr on pr.id=i.product_id left join public.product_variants vr on vr.id=i.variant_id where i.order_id=o.id and (pr.id is null or not pr.is_active or pr.status<>'active' or (pr.category_id is not null and not exists(select 1 from public.categories c where c.id=pr.category_id and c.is_active)) or (i.variant_id is not null and (vr.id is null or not vr.is_active)))) then raise exception 'UNAVAILABLE_PRODUCT'; end if;
  update public.orders set confirmation_status='confirmed',confirmation_method='website_button',confirmed_at=now() where id=o.id;
  insert into public.order_confirmation_events(order_id,event_type,method) values(o.id,'customer_confirmed','website_button');
  insert into public.order_status_history(order_id,status_type,old_status,new_status) values(o.id,'confirmation',o.confirmation_status,'confirmed');
  if o.last_modified_at is not null then insert into public.order_change_events(order_id,change_type) values(o.id,'order_reconfirmed'); end if;
 elsif p_action='modify' then
  if p_items is null or jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items) not between 1 and 30 then raise exception 'INVALID_CART'; end if;
  if exists(select 1 from jsonb_array_elements(p_items) x group by x->>'product_id',coalesce(x->>'variant_id','') having count(*)>1) then raise exception 'INVALID_CART'; end if;
  if p_shipping is null or length(trim(coalesce(p_shipping->>'city',''))) not between 2 and 100 or length(trim(coalesce(p_shipping->>'address',''))) not between 8 and 500 or length(coalesce(p_shipping->>'notes',''))>1000 then raise exception 'INVALID_CUSTOMER'; end if;
  select value into cfg from public.settings where key='shipping';
  ship:=(cfg->>'amount')::numeric;
  if not coalesce((cfg->>'enabled')::boolean,false) or ship is null or ship<0 then raise exception 'CHECKOUT_DISABLED'; end if;
  -- Lock the union of old and new inventory in the same order as checkout.
  perform id from public.products where id in(select product_id from public.order_items where order_id=o.id union select (x->>'product_id')::uuid from jsonb_array_elements(p_items) x) order by id for update;
  select jsonb_agg(jsonb_build_object('product',product_name,'product_id',product_id,'variant_id',variant_id,'quantity',quantity,'unit_price',unit_price)) into before_items from public.order_items where order_id=o.id;
  perform public.release_order_stock(o.id);
  delete from public.order_items where order_id=o.id;
  for item in select value from jsonb_array_elements(p_items) order by value->>'product_id',value->>'variant_id' loop
   pid:=(item->>'product_id')::uuid; vid:=nullif(item->>'variant_id','')::uuid; qty:=(item->>'quantity')::integer;
   if qty is null or qty not between 1 and 20 or (item->>'quantity')::numeric<>qty then raise exception 'INVALID_QUANTITY'; end if;
   select * into p from public.products where id=pid;
   if not found or not p.is_active or p.status<>'active' or (p.category_id is not null and not exists(select 1 from public.categories where id=p.category_id and is_active)) then raise exception 'UNAVAILABLE_PRODUCT'; end if;
   unit:=p.price;
   if vid is not null then
    select * into v from public.product_variants where id=vid and product_id=pid and is_active for update;
    if not found then raise exception 'UNAVAILABLE_PRODUCT'; end if;
    unit:=v.price;
    if p.track_inventory and v.stock_quantity<qty then raise exception 'OUT_OF_STOCK'; end if;
    if p.track_inventory then update public.product_variants set stock_quantity=stock_quantity-qty where id=vid; end if;
   else
    if exists(select 1 from public.product_variants where product_id=pid and is_active) then raise exception 'VARIANT_REQUIRED'; end if;
    if p.track_inventory and p.stock_quantity<qty then raise exception 'OUT_OF_STOCK'; end if;
    if p.track_inventory then update public.products set stock_quantity=stock_quantity-qty where id=pid; end if;
   end if;
   select image_url into image from public.product_images where product_id=pid order by sort_order,id limit 1;
   insert into public.order_items(order_id,product_id,variant_id,product_name,product_sku,product_image_url,quantity,unit_price,line_total,inventory_reserved)
   values(o.id,pid,vid,p.name||case when vid is null then '' else ' — '||v.name end,case when vid is null then p.sku else v.sku end,image,qty,unit,qty*unit,p.track_inventory);
   sub:=sub+qty*unit;
  end loop;
  if cfg->>'free_threshold' is not null and sub>=(cfg->>'free_threshold')::numeric then ship:=0; end if;
  update public.orders set subtotal=sub,shipping_amount=ship,discount_amount=least(o.discount_amount,sub),total=sub+ship-least(o.discount_amount,sub),stock_released=false,
   shipping_city=trim(p_shipping->>'city'),shipping_address=trim(p_shipping->>'address'),shipping_notes=p_shipping->>'notes',last_modified_at=now(),confirmation_status='pending',confirmed_at=null,confirmation_method=null,confirmed_by=null,
   reservation_expires_at=coalesce(o.editable_until,o.reservation_expires_at) where id=o.id;
  select jsonb_agg(jsonb_build_object('product',product_name,'product_id',product_id,'variant_id',variant_id,'quantity',quantity,'unit_price',unit_price)) into after_items from public.order_items where order_id=o.id;
  insert into public.order_change_events(order_id,change_type,before_data,after_data) values(o.id,'items_updated',jsonb_build_object('items',before_items,'total',o.total),jsonb_build_object('items',after_items,'total',sub+ship-least(o.discount_amount,sub)));
  if o.shipping_city is distinct from trim(p_shipping->>'city') or o.shipping_address is distinct from trim(p_shipping->>'address') or o.shipping_notes is distinct from p_shipping->>'notes' then
   insert into public.order_change_events(order_id,change_type) values(o.id,'address_updated');
  end if;
  insert into public.order_status_history(order_id,status_type,old_status,new_status) values(o.id,'confirmation',o.confirmation_status,'pending');
  insert into public.order_confirmation_events(order_id,event_type,method) values(o.id,'confirmation_requested','customer_edit');
 else raise exception 'INVALID_ACTION'; end if;
 return public.customer_order_view(p_code,p_token_hash);
end $$;
revoke all on function public.customer_order_editable(public.orders),public.customer_order_view(text,text),public.manage_customer_order(text,text,text,integer,jsonb,jsonb,text),public.order_lifecycle_fields() from public,anon,authenticated;
grant execute on function public.customer_order_editable(public.orders) to authenticated,service_role;
grant execute on function public.customer_order_view(text,text),public.manage_customer_order(text,text,text,integer,jsonb,jsonb,text) to service_role;
create function public.admin_order_delivery(p_order_id uuid,p_city text,p_address text,p_notes text) returns void language plpgsql security definer set search_path='' as $$
declare o public.orders; begin
 if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if length(trim(p_city)) not between 2 and 100 or length(trim(p_address)) not between 8 and 500 or length(p_notes)>1000 then raise exception 'INVALID_CUSTOMER'; end if;
 update public.orders set shipping_city=trim(p_city),shipping_address=trim(p_address),shipping_notes=p_notes,last_modified_at=now() where id=o.id;
 insert into public.order_change_events(order_id,change_type,actor_id) values(o.id,'address_updated',auth.uid());
 insert into public.order_status_history(order_id,status_type,note,changed_by) values(o.id,'note','Adresse de livraison modifiée manuellement.',auth.uid());
end $$;
revoke all on function public.admin_order_delivery(uuid,text,text,text) from public,anon;
grant execute on function public.admin_order_delivery(uuid,text,text,text) to authenticated;
create function public.admin_order_editability(p_order_id uuid) returns boolean language plpgsql stable security definer set search_path='' as $$
declare o public.orders;begin
 if not public.is_admin() then raise exception 'FORBIDDEN';end if;
 select * into o from public.orders where id=p_order_id;
 return public.customer_order_editable(o);
end $$;
revoke all on function public.admin_order_editability(uuid) from public,anon;
grant execute on function public.admin_order_editability(uuid) to authenticated;
commit;


