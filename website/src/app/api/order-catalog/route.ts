import { serviceDb } from '@/lib/supabase/public';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() || '';
  const db = serviceDb();

  let query = db
    .from('products')
    .select(
      'id, name, price, product_images(image_url, sort_order), product_variants(id, name, price, is_active)'
    )
    .eq('status', 'active')
    .eq('is_active', true);

  if (q) {
    query = query.ilike('name', `%${q}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(100);

  if (error || !data) {
    return Response.json([], { headers: { 'Cache-Control': 'no-store' } });
  }

  const mapped = data.map((p) => {
    const sortedImages = (p.product_images || []).sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      image: sortedImages[0]?.image_url || '/assets/brand/creams.jpg',
      variants: (p.product_variants || [])
        .filter((v: { is_active: boolean }) => v.is_active)
        .map((v: { id: string; name: string; price: number }) => ({
          id: v.id,
          name: v.name,
          price: Number(v.price)
        }))
    };
  });

  return Response.json(mapped, { headers: { 'Cache-Control': 'no-store' } });
}
