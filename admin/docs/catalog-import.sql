begin;
insert into public.categories(name,slug,is_active) values ('Savons','savons',false),('Soins du corps','soins-du-corps',false),('Huiles de soin','huiles-de-soin',false),('Coffrets','coffrets',false) on conflict(slug) do nothing;
insert into public.products(name,slug,category_id,price,stock_quantity,status,is_active,source_type,source_url)
select v.name,v.slug,c.id,0,0,'draft',false,'instagram',v.url from (values
('Savon de charbon','savon-de-charbon','savons','https://www.instagram.com/sweet_argan/p/DKe10LLtx4d/'),
('Déodorant musc','deodorant-musc','soins-du-corps','https://www.instagram.com/sweet_argan/p/DKe1fyaNNY1/'),
('Déodorant oud','deodorant-oud','soins-du-corps','https://www.instagram.com/sweet_argan/p/DKe1NS5ttM1/'),
('Huile de bronzage','huile-de-bronzage','huiles-de-soin','https://www.instagram.com/sweet_argan/p/DDXmoQzNoOs/'),
('Pack Timomouchin','pack-timomouchin','coffrets','https://www.instagram.com/sweet_argan/reel/DDhM5N3t8bJ/')
) v(name,slug,category,url) join public.categories c on c.slug=v.category on conflict(slug) do nothing;
insert into public.product_images(product_id,image_url,alt_text,sort_order)
select p.id,'https://wpcqqpzkavciiugwvqsn.supabase.co/storage/v1/object/public/products/'||v.filename,p.name||' Sweet Argan',0 from (values
('savon-de-charbon','savon-charbon.jpg'),('deodorant-musc','deodorant-musc.jpg'),('deodorant-oud','deodorant-oud.jpg'),('huile-de-bronzage','huile-bronzage.jpg'),('pack-timomouchin','baqa-timomouchin.jpg')
) v(slug,filename) join public.products p on p.slug=v.slug where not exists(select 1 from public.product_images i where i.product_id=p.id);
commit;