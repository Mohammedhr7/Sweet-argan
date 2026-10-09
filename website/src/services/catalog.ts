import 'server-only';
import { cache } from 'react';
import { publicDb } from '@/lib/supabase/public';
import type { Category, Product, SiteContent, ShippingSettings } from '@/types/commerce';
import { defaultContent } from '@/constants/content';
import preview from '@/lib/preview/catalog.json';
export const isPreview = () => process.env.CATALOG_PREVIEW==='true' && !process.env.NEXT_PUBLIC_SUPABASE_URL;
export const getCategories = cache(async (): Promise<Category[]> => {
 if(isPreview())return preview.categories;
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return [];
 const {data,error}=await publicDb().from('categories').select('*').eq('is_active',true).order('sort_order');
 if(error)return []; return data || [];
});
export async function getProducts(filters: { q?: string; category?: string; sort?: string; min?: string; max?: string; stock?: string; page?: string; best?: string } = {}) {
 const page=Math.max(1,Math.min(10000,Number.parseInt(filters.page||'1')||1)); const size=12;
 const categories=await getCategories(); const category=categories.find(c=>c.slug===filters.category);
 if(filters.category&&!category)return {products:[] as Product[],total:0,page};
 if(isPreview()) {
  let rows=preview.products as unknown as Product[];
  if(filters.q) rows=rows.filter(p=>[p.name,p.description,p.keywords,p.categories?.name].join(' ').toLowerCase().includes(filters.q!.toLowerCase()));
  if(category)rows=rows.filter(p=>p.category_id===category.id);
  if(filters.best)rows=rows.filter(p=>p.is_best_seller);
  if(filters.min)rows=rows.filter(p=>p.price>=Number(filters.min)); if(filters.max)rows=rows.filter(p=>p.price<=Number(filters.max));
  if(filters.stock)rows=rows.filter(p=>p.stock_quantity>0||!p.track_inventory);
  rows=[...rows].sort((a,b)=>filters.sort==='price-asc'?a.price-b.price:filters.sort==='price-desc'?b.price-a.price:filters.sort==='newest'?b.created_at.localeCompare(a.created_at):Number(b.is_featured)-Number(a.is_featured));
  return {products:rows.slice((page-1)*size,page*size),total:rows.length,page};
 }
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return {products:[] as Product[],total:0,page};
 let query=publicDb().from('products').select('id,category_id,name,slug,short_description,description,ingredients,usage_instructions,benefits,sku,price,compare_at_price,stock_quantity,track_inventory,is_active,is_featured,is_best_seller,seo_title,seo_description,keywords,created_at,status,categories(*),product_images(*),product_variants(*)',{count:'exact'}).eq('status','active').eq('is_active',true);
 if(category)query=query.eq('category_id',category.id);
 if(filters.q){ const q=filters.q.replace(/[^\p{L}\p{N}\s-]/gu,'').slice(0,100); if(q){const ids=categories.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())).map(c=>c.id);query=query.or(`name.ilike.%${q}%,description.ilike.%${q}%,keywords.ilike.%${q}%${ids.length?',category_id.in.('+ids.join(',')+')':''}`);} }
 if(filters.best)query=query.eq('is_best_seller',true);
 if(filters.min&&Number.isFinite(Number(filters.min)))query=query.gte('price',Number(filters.min));
 if(filters.max&&Number.isFinite(Number(filters.max)))query=query.lte('price',Number(filters.max));
 if(filters.stock)query=query.or('stock_quantity.gt.0,track_inventory.eq.false');
 query=filters.sort==='price-asc'?query.order('price'):filters.sort==='price-desc'?query.order('price',{ascending:false}):filters.sort==='newest'?query.order('created_at',{ascending:false}):query.order('is_featured',{ascending:false});
 const {data,error,count}=await query.order('id').range((page-1)*size,page*size-1);
 if(error)return {products:[] as Product[],total:0,page}; return {products:(data||[]) as unknown as Product[],total:count||0,page};
}
export const getProduct = cache(async(slug:string):Promise<Product|null>=>{
 if(isPreview())return (preview.products.find(p=>p.slug===slug) as unknown as Product)||null;
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return null;
 const {data,error}=await publicDb().from('products').select('id,category_id,name,slug,short_description,description,ingredients,usage_instructions,benefits,sku,price,compare_at_price,stock_quantity,track_inventory,is_active,is_featured,is_best_seller,seo_title,seo_description,keywords,created_at,status,categories(*),product_images(*),product_variants(*)').eq('slug',slug).eq('status','active').eq('is_active',true).maybeSingle();
 if(error)return null; return data as unknown as Product|null;
});
export const getContent = cache(async():Promise<SiteContent>=>{
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return defaultContent;
 const {data,error}=await publicDb().from('settings').select('value').eq('key','site_content').maybeSingle();
 if(error)return defaultContent; return {...defaultContent,...data?.value};
});
export const getShipping = cache(async():Promise<ShippingSettings>=>{
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL)return {amount:0,free_threshold:null,enabled:false};
 const {data,error}=await publicDb().from('settings').select('value').eq('key','shipping').maybeSingle();
 if(error)return {amount:0,free_threshold:null,enabled:false}; return data?.value||{amount:0,free_threshold:null,enabled:false};
});

