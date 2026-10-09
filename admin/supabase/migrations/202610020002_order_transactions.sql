begin;
create function public.consume_rate_limit(p_key text, p_max integer, p_seconds integer) returns boolean
language plpgsql security definer set search_path = '' as $$
declare n integer; begin
 insert into public.rate_limits(key,hits,resets_at) values(p_key,1,now()+make_interval(secs=>p_seconds))
 on conflict(key) do update set hits = case when public.rate_limits.resets_at <= now() then 1 else public.rate_limits.hits+1 end,
 resets_at = case when public.rate_limits.resets_at <= now() then now()+make_interval(secs=>p_seconds) else public.rate_limits.resets_at end
 returning hits into n; return n <= p_max;
end $$;

create function public.create_guest_order(p_customer jsonb,p_items jsonb,p_idempotency_key uuid,p_fingerprint text,p_token_hash text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare o public.orders; p public.products; v public.product_variants; item jsonb; cid uuid; oid uuid := gen_random_uuid(); code text;
 qty integer; unit numeric; sub numeric := 0; ship numeric; cfg jsonb; image text; pid uuid; vid uuid;
begin
 perform pg_advisory_xact_lock(hashtextextended(p_idempotency_key::text,0));
 select * into o from public.orders where idempotency_key = p_idempotency_key for update;
 if found then
   if o.request_fingerprint <> p_fingerprint then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
   update public.orders set access_token_hash=p_token_hash where id=o.id;
   return jsonb_build_object('code',o.public_order_code,'total',o.total);
 end if;
 if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) not between 1 and 30 then raise exception 'INVALID_CART'; end if;
 if coalesce(p_customer->>'phone','') !~ '^\+212[67][0-9]{8}$' or length(coalesce(p_customer->>'full_name','')) not between 2 and 100
 or length(coalesce(p_customer->>'city','')) not between 2 and 100 or length(coalesce(p_customer->>'address','')) not between 8 and 500 then raise exception 'INVALID_CUSTOMER'; end if;
 select value into cfg from public.settings where key='shipping';
 if coalesce((cfg->>'enabled')::boolean,false) = false then raise exception 'CHECKOUT_DISABLED'; end if;
 ship := (cfg->>'amount')::numeric;
 if ship is null or ship < 0 then raise exception 'CHECKOUT_DISABLED'; end if;
 -- Lock every parent in UUID order to avoid stock races and lock-order deadlocks.
 perform id from public.products where id in(select (x->>'product_id')::uuid from jsonb_array_elements(p_items) x) order by id for update;
 insert into public.customers(full_name,phone,email,city) values(p_customer->>'full_name',p_customer->>'phone',nullif(p_customer->>'email',''),p_customer->>'city')
 on conflict(phone) do update set phone=excluded.phone returning id into cid;
 code := 'SA-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text,8,'0');
 insert into public.orders(id,public_order_code,customer_id,customer_name,customer_phone,customer_email,shipping_city,shipping_address,shipping_notes,subtotal,total,idempotency_key,request_fingerprint,access_token_hash)
 values(oid,code,cid,p_customer->>'full_name',p_customer->>'phone',nullif(p_customer->>'email',''),p_customer->>'city',p_customer->>'address',p_customer->>'notes',0,0,p_idempotency_key,p_fingerprint,p_token_hash);
 for item in select value from jsonb_array_elements(p_items) order by value->>'product_id',value->>'variant_id' loop
  pid := (item->>'product_id')::uuid; vid := nullif(item->>'variant_id','')::uuid; qty := (item->>'quantity')::integer;
  if qty is null or qty not between 1 and 20 or (item->>'quantity')::numeric <> qty then raise exception 'INVALID_QUANTITY'; end if;
  select * into p from public.products where id=pid;
  if not found or not p.is_active or p.status <> 'active' or (p.category_id is not null and not exists(select 1 from public.categories where id=p.category_id and is_active)) then raise exception 'UNAVAILABLE_PRODUCT'; end if;
  unit := p.price;
  if vid is not null then
   select * into v from public.product_variants where id=vid and product_id=pid and is_active for update;
   if not found then raise exception 'UNAVAILABLE_PRODUCT'; end if;
   unit := v.price;
   if p.track_inventory and v.stock_quantity < qty then raise exception 'OUT_OF_STOCK'; end if;
   if p.track_inventory then update public.product_variants set stock_quantity=stock_quantity-qty where id=vid; end if;
  else
   if exists(select 1 from public.product_variants where product_id=pid and is_active) then raise exception 'VARIANT_REQUIRED'; end if;
   if p.track_inventory and p.stock_quantity < qty then raise exception 'OUT_OF_STOCK'; end if;
   if p.track_inventory then update public.products set stock_quantity=stock_quantity-qty where id=pid; end if;
  end if;
  select image_url into image from public.product_images where product_id=pid order by sort_order,id limit 1;
  insert into public.order_items(order_id,product_id,variant_id,product_name,product_sku,product_image_url,quantity,unit_price,line_total,inventory_reserved)
  values(oid,pid,vid,p.name || case when vid is null then '' else ' — '||v.name end,case when vid is null then p.sku else v.sku end,image,qty,unit,qty*unit,p.track_inventory);
  sub := sub + qty*unit;
 end loop;
 if cfg->>'free_threshold' is not null and sub >= (cfg->>'free_threshold')::numeric then ship := 0; end if;
 update public.orders set subtotal=sub,shipping_amount=ship,total=sub+ship where id=oid;
 insert into public.addresses(customer_id,full_name,phone,city,address_line,notes) values(cid,p_customer->>'full_name',p_customer->>'phone',p_customer->>'city',p_customer->>'address',p_customer->>'notes');
 insert into public.order_confirmation_events(order_id,event_type,method) values(oid,'confirmation_requested','website');
 insert into public.order_status_history(order_id,status_type,new_status) values(oid,'fulfillment','new');
 return jsonb_build_object('code',code,'total',sub+ship);
end $$;

create function public.release_order_stock(p_order_id uuid) returns void language plpgsql security definer set search_path = '' as $$
declare i public.order_items; o public.orders; begin
 select * into o from public.orders where id=p_order_id for update;
 if not found or o.stock_released then return; end if;
 perform id from public.products where id in(select product_id from public.order_items where order_id=p_order_id) order by id for update;
 for i in select * from public.order_items where order_id=p_order_id and inventory_reserved order by product_id,variant_id loop
  if i.variant_id is null then update public.products set stock_quantity=stock_quantity+i.quantity where id=i.product_id;
  else update public.product_variants set stock_quantity=stock_quantity+i.quantity where id=i.variant_id; end if;
 end loop;
 update public.orders set stock_released=true where id=p_order_id;
end $$;

create function public.confirm_order(p_code text,p_token_hash text,p_action text,p_message text default '',p_method text default 'button') returns text
language plpgsql security definer set search_path = '' as $$
declare o public.orders; s text; norm text; ev text; begin
 select * into o from public.orders where public_order_code=p_code and access_token_hash=p_token_hash and access_expires_at>now() for update;
 if not found then raise exception 'INVALID_ACCESS'; end if;
 if o.confirmation_status in ('rejected','expired') or o.fulfillment_status <> 'new' then raise exception 'ORDER_LOCKED'; end if;
 if o.confirmation_status='confirmed' then return 'confirmed'; end if;
 if o.reservation_expires_at <= now() then
  perform public.release_order_stock(o.id);
  update public.orders set confirmation_status='expired',fulfillment_status='cancelled' where id=o.id;
  insert into public.order_confirmation_events(order_id,event_type,method) values(o.id,'expired','system');
  return 'expired';
 end if;
 norm := lower(trim(translate(coalesce(p_message,''),'éèêëàâäîïôöùûüç','eeeeaaaiioouuuc')));
 if p_action='confirm' and p_method='button' then s:='confirmed';
 elsif p_action='reject' then s:='rejected';
 elsif p_action='message' and norm in ('oui','yes','ok','confirmer','confirme','confirmation','تأكيد','نعم') then s:='confirmed';
 else s:='needs_review'; end if;
 if s='rejected' then perform public.release_order_stock(o.id); end if;
 update public.orders set confirmation_status=s, confirmation_method=case when p_method='button' then 'website_button' else 'website_text' end,
 confirmation_message=left(p_message,1000),confirmed_at=case when s='confirmed' then now() else null end,
 fulfillment_status=case when s='rejected' then 'cancelled' else fulfillment_status end where id=o.id;
 ev := case s when 'confirmed' then 'customer_confirmed' when 'rejected' then 'customer_rejected' else 'needs_review' end;
 insert into public.order_confirmation_events(order_id,event_type,message,normalized_message,method) values(o.id,ev,left(p_message,1000),left(norm,1000),p_method);
 insert into public.order_status_history(order_id,status_type,old_status,new_status) values(o.id,'confirmation',o.confirmation_status,s);
 if s='rejected' then insert into public.order_status_history(order_id,status_type,old_status,new_status) values(o.id,'fulfillment',o.fulfillment_status,'cancelled'); end if;
 return s;
end $$;

create function public.admin_update_order(p_order_id uuid,p_action text,p_value text default '') returns void
language plpgsql security definer set search_path = '' as $$
declare o public.orders; allowed text[]; begin
 if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found then raise exception 'NOT_FOUND'; end if;
 if p_action='confirm' then
  if o.confirmation_status='confirmed' then return; end if;
  if o.confirmation_status not in ('pending','needs_review') or o.fulfillment_status <> 'new' or o.reservation_expires_at<=now() then raise exception 'ORDER_LOCKED'; end if;
  update public.orders set confirmation_status='confirmed',confirmation_method='manual_admin',confirmed_at=now(),confirmed_by=auth.uid() where id=o.id;
  insert into public.order_confirmation_events(order_id,event_type,method,metadata) values(o.id,'admin_confirmed','manual_admin',jsonb_build_object('admin_id',auth.uid()));
  insert into public.order_status_history(order_id,status_type,old_status,new_status,changed_by) values(o.id,'confirmation',o.confirmation_status,'confirmed',auth.uid());
 elsif p_action='status' then
  if o.fulfillment_status=p_value then return; end if;
  allowed:=case o.fulfillment_status when 'new' then array['processing','cancelled'] when 'processing' then array['ready','cancelled'] when 'ready' then array['shipped','cancelled'] when 'shipped' then array['delivered','returned'] when 'delivered' then array['returned'] else array[]::text[] end;
  if not(p_value=any(allowed)) or (p_value not in ('cancelled','returned') and o.confirmation_status<>'confirmed') then raise exception 'INVALID_TRANSITION'; end if;
  if p_value='cancelled' then perform public.release_order_stock(o.id); end if;
  -- Returns are quarantined; a human checks goods before manually adjusting stock.
  update public.orders set fulfillment_status=p_value,payment_status=case when p_value='delivered' then 'paid' when p_value='returned' and payment_status='paid' then 'refunded' else payment_status end where id=o.id;
  insert into public.order_status_history(order_id,status_type,old_status,new_status,changed_by) values(o.id,'fulfillment',o.fulfillment_status,p_value,auth.uid());
 elsif p_action='note' then
  if length(trim(p_value)) not between 1 and 2000 then raise exception 'INVALID_NOTE'; end if;
  insert into public.order_status_history(order_id,status_type,note,changed_by) values(o.id,'note',p_value,auth.uid());
 else raise exception 'INVALID_ACTION'; end if;
end $$;

create function public.expire_reservations() returns integer language plpgsql security definer set search_path = '' as $$
declare o public.orders; n integer:=0; begin
 for o in select * from public.orders where confirmation_status in ('pending','needs_review') and fulfillment_status='new' and reservation_expires_at<=now() for update skip locked loop
  perform public.release_order_stock(o.id);
  update public.orders set confirmation_status='expired',fulfillment_status='cancelled' where id=o.id;
  insert into public.order_confirmation_events(order_id,event_type,method) values(o.id,'expired','system');
  insert into public.order_status_history(order_id,status_type,old_status,new_status) values(o.id,'confirmation',o.confirmation_status,'expired'),(o.id,'fulfillment',o.fulfillment_status,'cancelled');
  n:=n+1;
 end loop;
 delete from public.rate_limits where resets_at<now()-interval '1 day';
 return n;
end $$;

revoke all on function public.consume_rate_limit(text,integer,integer),public.create_guest_order(jsonb,jsonb,uuid,text,text),public.release_order_stock(uuid),public.confirm_order(text,text,text,text,text),public.admin_update_order(uuid,text,text),public.expire_reservations() from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer),public.create_guest_order(jsonb,jsonb,uuid,text,text),public.confirm_order(text,text,text,text,text),public.expire_reservations() to service_role;
grant execute on function public.admin_update_order(uuid,text,text) to authenticated;
commit;
