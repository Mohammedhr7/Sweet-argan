begin;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('products','products',true,5242880,array['image/jpeg','image/png','image/webp']),
 ('categories','categories',true,5242880,array['image/jpeg','image/png','image/webp']),
 ('site-content','site-content',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy brand_assets_read on storage.objects for select to anon,authenticated using(bucket_id in ('products','categories','site-content'));
create policy brand_assets_insert on storage.objects for insert to authenticated with check(bucket_id in ('products','categories','site-content') and public.is_admin());
create policy brand_assets_update on storage.objects for update to authenticated using(bucket_id in ('products','categories','site-content') and public.is_admin()) with check(bucket_id in ('products','categories','site-content') and public.is_admin());
create policy brand_assets_delete on storage.objects for delete to authenticated using(bucket_id in ('products','categories','site-content') and public.is_admin());
alter publication supabase_realtime add table public.orders;
-- Schedule SELECT public.expire_reservations() every 5 minutes using Supabase Cron.
commit;
