-- Catalog import workflow. Imported Instagram records remain drafts until reviewed.
begin;
alter table public.products add column if not exists status text;
update public.products set status = case when is_active then 'active' else 'draft' end where status is null;
alter table public.products alter column status set default 'draft';
alter table public.products alter column status set not null;
alter table public.products drop constraint if exists products_status_check;
alter table public.products add constraint products_status_check check(status in ('draft','active','archived'));
alter table public.products add column if not exists source_type text;
alter table public.products add column if not exists source_url text;
alter table public.products drop constraint if exists products_source_type_check;
alter table public.products add constraint products_source_type_check check(source_type is null or source_type in ('instagram','admin','other'));
alter table public.products drop constraint if exists products_status_active_consistency;
alter table public.products add constraint products_status_active_consistency check(is_active = (status = 'active'));
create index if not exists products_status_idx on public.products(status, created_at desc);
create index if not exists products_source_idx on public.products(source_type, source_url);
drop policy if exists products_public on public.products;
create policy products_public on public.products for select to anon,authenticated
 using(((status = 'active' and is_active and (category_id is null or exists(select 1 from public.categories c where c.id = category_id and c.is_active))) or public.is_admin()));

create or replace function public.publish_product(p_id uuid)
returns uuid language plpgsql security definer set search_path = '' as $$
declare p public.products; image_count integer;
begin
 if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
 select * into p from public.products where id=p_id for update;
 if not found then raise exception 'PRODUCT_NOT_FOUND'; end if;
 select count(*) into image_count from public.product_images where product_id=p_id;
 if p.name is null or length(trim(p.name)) < 2 or p.category_id is null or p.price is null or p.price <= 0 or image_count < 1 then
   raise exception 'PRODUCT_INCOMPLETE';
 end if;
 update public.products set status='active', is_active=true, updated_at=now() where id=p_id;
 return p_id;
end $$;
revoke all on function public.publish_product(uuid) from public;
grant execute on function public.publish_product(uuid) to authenticated,service_role;
commit;
