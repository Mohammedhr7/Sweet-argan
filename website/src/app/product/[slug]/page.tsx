export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { getProduct, getProducts, isPreview } from '@/services/catalog';
import { ProductPageView } from '@/features/catalog/product-page-view';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  return {
    title: p?.seo_title || (p ? `${p.name} · سويت أركان` : 'المنتج'),
    description: p?.seo_description || p?.short_description,
    alternates: { canonical: '/product/' + p?.slug },
    openGraph: { images: p?.product_images.slice(0, 1).map(i => i.image_url) || [] }
  };
}

export default async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  const related = await getProducts({ category: p.categories?.slug });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.product_images.map(i => i.image_url),
    description: p.short_description,
    sku: p.sku,
    brand: { '@type': 'Brand', name: 'Sweet Argan' },
    offers: {
      '@type': 'Offer',
      price: p.price,
      priceCurrency: 'MAD',
      availability:
        'https://schema.org/' +
        (!p.track_inventory || p.stock_quantity > 0 ? 'InStock' : 'OutOfStock'),
      url: (process.env.NEXT_PUBLIC_SITE_URL || '') + '/product/' + p.slug
    }
  };

  return (
    <>
      {!isPreview() && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      )}
      <ProductPageView product={p} related={related.products} />
    </>
  );
}
