begin;
create or replace function public.save_product(p_id uuid,p_data jsonb,p_images jsonb,p_variants jsonb) returns uuid language plpgsql security definer set search_path = '' as $$
declare result uuid; row jsonb; vid uuid; prior_status text; begin
 if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
 if jsonb_typeof(p_images)<>'array' or jsonb_array_length(p_images)>12 or jsonb_typeof(p_variants)<>'array' or jsonb_array_length(p_variants)>30 then raise exception 'INVALID_DATA'; end if;
 if p_id is not null then
  select status into prior_status from public.products where id=p_id for update;
  if not found then raise exception 'NOT_FOUND'; end if;
 end if;
 insert into public.products(id,name,slug,category_id,sku,price,compare_at_price,stock_quantity,track_inventory,status,is_active,is_featured,is_best_seller,short_description,description,ingredients,usage_instructions,benefits,keywords,seo_title,seo_description)
 values(coalesce(p_id,gen_random_uuid()),p_data->>'name',p_data->>'slug',nullif(p_data->>'category_id','')::uuid,nullif(p_data->>'sku',''),(p_data->>'price')::numeric,nullif(p_data->>'compare_at_price','')::numeric,(p_data->>'stock_quantity')::integer,(p_data->>'track_inventory')::boolean,case when prior_status='archived' and not coalesce((p_data->>'is_active')::boolean,false) then 'archived' else 'draft' end,false,(p_data->>'is_featured')::boolean,(p_data->>'is_best_seller')::boolean,p_data->>'short_description',p_data->>'description',p_data->>'ingredients',p_data->>'usage_instructions',p_data->>'benefits',p_data->>'keywords',p_data->>'seo_title',p_data->>'seo_description')
 on conflict(id) do update set name=excluded.name,slug=excluded.slug,category_id=excluded.category_id,sku=excluded.sku,price=excluded.price,compare_at_price=excluded.compare_at_price,stock_quantity=excluded.stock_quantity,track_inventory=excluded.track_inventory,status=excluded.status,is_active=excluded.is_active,is_featured=excluded.is_featured,is_best_seller=excluded.is_best_seller,short_description=excluded.short_description,description=excluded.description,ingredients=excluded.ingredients,usage_instructions=excluded.usage_instructions,benefits=excluded.benefits,keywords=excluded.keywords,seo_title=excluded.seo_title,seo_description=excluded.seo_description returning id into result;
 delete from public.product_images where product_id=result;
 for row in select value from jsonb_array_elements(p_images) loop
  insert into public.product_images(product_id,image_url,alt_text,sort_order) values(result,row->>'image_url',row->>'alt_text',(row->>'sort_order')::integer);
 end loop;
 -- Omitted variants are archived, preserving historical order references.
 update public.product_variants set is_active=false where product_id=result;
 for row in select value from jsonb_array_elements(p_variants) loop
  vid:=nullif(row->>'id','')::uuid;
  if vid is not null and exists(select 1 from public.product_variants where id=vid and product_id<>result) then raise exception 'INVALID_VARIANT'; end if;
  insert into public.product_variants(id,product_id,name,sku,price,stock_quantity,is_active) values(coalesce(vid,gen_random_uuid()),result,row->>'name',nullif(row->>'sku',''),(row->>'price')::numeric,(row->>'stock_quantity')::integer,(row->>'is_active')::boolean)
  on conflict(id) do update set name=excluded.name,sku=excluded.sku,price=excluded.price,stock_quantity=excluded.stock_quantity,is_active=excluded.is_active;
 end loop;
 if coalesce((p_data->>'is_active')::boolean,false) then perform public.publish_product(result); end if;
 return result;
end $$;

commit;
