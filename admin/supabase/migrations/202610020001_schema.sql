-- Fresh Supabase project only. All money uses exact numeric arithmetic.
begin;
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text, role text not null check(role in ('admin','super_admin')), avatar_url text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','super_admin'));
$$;
create table public.categories (
 id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), description text, image_url text,
 is_active boolean not null default false, sort_order integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.products (
 id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id) on delete set null,
 name text not null, slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'), short_description text, description text, ingredients text, usage_instructions text, benefits text, keywords text,
 sku text unique, price numeric(12,2) not null check(price >= 0), compare_at_price numeric(12,2) check(compare_at_price >= price),
 stock_quantity integer not null default 0 check(stock_quantity >= 0), track_inventory boolean not null default true,
 is_active boolean not null default false, is_featured boolean not null default false, is_best_seller boolean not null default false,
 seo_title text, seo_description text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index products_category_idx on public.products(category_id);
create table public.product_images (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 image_url text not null, alt_text text, sort_order integer not null default 0, created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images(product_id);
create table public.product_variants (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
 name text not null, sku text unique, price numeric(12,2) not null check(price >= 0), stock_quantity integer not null default 0 check(stock_quantity >= 0),
 is_active boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index product_variants_product_idx on public.product_variants(product_id);
create table public.customers (
 id uuid primary key default gen_random_uuid(), full_name text not null, phone text not null unique check(phone ~ '^\+212[67][0-9]{8}$'),
 email text, city text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.addresses (
 id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id), full_name text, phone text, city text, address_line text, notes text, created_at timestamptz not null default now()
);
create sequence public.order_number_seq;
create table public.orders (
 id uuid primary key default gen_random_uuid(), public_order_code text not null unique,
 customer_id uuid not null references public.customers(id), customer_name text not null, customer_phone text not null, customer_email text,
 shipping_city text not null, shipping_address text not null, shipping_notes text,
 subtotal numeric(12,2) not null check(subtotal >= 0), shipping_amount numeric(12,2) not null default 0 check(shipping_amount >= 0),
 discount_amount numeric(12,2) not null default 0 check(discount_amount >= 0), total numeric(12,2) not null check(total = subtotal + shipping_amount - discount_amount and total >= 0),
 currency text not null default 'MAD' check(currency = 'MAD'), payment_method text not null default 'cash_on_delivery' check(payment_method = 'cash_on_delivery'),
 payment_status text not null default 'pending' check(payment_status in ('pending','paid','refunded')),
 confirmation_status text not null default 'pending' check(confirmation_status in ('pending','confirmed','needs_review','rejected','expired')),
 confirmation_method text, confirmation_message text, confirmed_at timestamptz, confirmed_by uuid references public.profiles(id),
 fulfillment_status text not null default 'new' check(fulfillment_status in ('new','processing','ready','shipped','delivered','cancelled','returned')),
 admin_notes text, stock_released boolean not null default false,
 access_token_hash text not null, access_expires_at timestamptz not null default (now() + interval '30 days'),
 reservation_expires_at timestamptz not null default (now() + interval '24 hours'),
 idempotency_key uuid not null unique, request_fingerprint text not null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index orders_phone_idx on public.orders(customer_phone);
create index orders_created_idx on public.orders(created_at desc);
create index orders_confirmation_idx on public.orders(confirmation_status,created_at desc);
create index orders_fulfillment_idx on public.orders(fulfillment_status,created_at desc);
create index orders_customer_idx on public.orders(customer_id);
create table public.order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 product_id uuid references public.products(id), variant_id uuid references public.product_variants(id),
 product_name text not null, product_sku text, product_image_url text,
 quantity integer not null check(quantity between 1 and 20), unit_price numeric(12,2) not null check(unit_price >= 0),
 line_total numeric(12,2) not null check(line_total = quantity * unit_price), inventory_reserved boolean not null,
 created_at timestamptz not null default now()
);
create index order_items_order_idx on public.order_items(order_id);
create table public.order_confirmation_events (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 message text, normalized_message text, event_type text not null check(event_type in ('confirmation_requested','customer_confirmed','customer_rejected','needs_review','admin_confirmed','expired')),
 method text, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create index confirmation_events_order_idx on public.order_confirmation_events(order_id);
create table public.order_status_history (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
 status_type text not null check(status_type in ('confirmation','fulfillment','note')), old_status text, new_status text,
 changed_by uuid references public.profiles(id), note text, created_at timestamptz not null default now()
);
create index status_history_order_idx on public.order_status_history(order_id);
create table public.settings (
 id uuid primary key default gen_random_uuid(), key text not null unique, value jsonb not null, is_public boolean not null default false, updated_at timestamptz not null default now()
);
create table public.rate_limits (key text primary key, hits integer not null, resets_at timestamptz not null);
create index rate_limits_expiry_idx on public.rate_limits(resets_at);

create function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
do $$ declare t text; begin
 foreach t in array array['profiles','categories','products','product_variants','customers','orders','settings'] loop
 execute format('create trigger touch_updated before update on public.%I for each row execute function public.touch_updated_at()',t);
 end loop;
 foreach t in array array['profiles','categories','products','product_images','product_variants','customers','addresses','orders','order_items','order_confirmation_events','order_status_history','settings','rate_limits'] loop
 execute format('alter table public.%I enable row level security',t);
 end loop;
end $$;

create policy profiles_read on public.profiles for select to authenticated using(id = auth.uid() or public.is_admin());
create policy categories_public on public.categories for select to anon,authenticated using(is_active or public.is_admin());
create policy categories_admin on public.categories for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy products_public on public.products for select to anon,authenticated using((is_active and (category_id is null or exists(select 1 from public.categories c where c.id = category_id and c.is_active))) or public.is_admin());
create policy products_admin on public.products for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy images_public on public.product_images for select to anon,authenticated using(exists(select 1 from public.products p where p.id = product_id));
create policy images_admin on public.product_images for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy variants_public on public.product_variants for select to anon,authenticated using((is_active and exists(select 1 from public.products p where p.id = product_id)) or public.is_admin());
create policy variants_admin on public.product_variants for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy settings_public on public.settings for select to anon,authenticated using(is_public or public.is_admin());
create policy settings_admin on public.settings for all to authenticated using(public.is_admin()) with check(public.is_admin());
do $$ declare t text; begin
 foreach t in array array['customers','addresses','orders','order_items','order_confirmation_events','order_status_history'] loop
 execute format('create policy admin_read on public.%I for select to authenticated using(public.is_admin())',t);
 end loop;
end $$;
-- Private commerce writes only via audited transaction functions; no direct admin writes.
grant select on public.categories,public.products,public.product_images,public.product_variants,public.settings to anon;
grant select on all tables in schema public to authenticated;
grant insert,update,delete on public.categories,public.products,public.product_images,public.product_variants,public.settings to authenticated;
grant all on all tables in schema public to service_role;
grant usage,select on all sequences in schema public to service_role;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon,authenticated,service_role;
commit;
