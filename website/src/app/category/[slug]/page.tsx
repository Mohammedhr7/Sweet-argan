export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { ShopView, type Filters } from '@/features/catalog/shop-view';
import { getCategories } from '@/services/catalog';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = (await getCategories()).find(c => c.slug === slug);
  return {
    title: c ? `${c.name} · Sweet Argan` : 'Catégorie',
    description: c?.description || 'Découvrez notre collection de soins et produits du terroir marocain.',
    alternates: { canonical: '/category/' + slug }
  };
}

export default async function Category({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Filters>;
}) {
  const { slug } = await params;
  const c = (await getCategories()).find(c => c.slug === slug);
  if (!c) notFound();
  return (
    <ShopView
      title={c.name}
      description={c.description || ''}
      bannerUrl={c.image_url}
      filters={{ ...(await searchParams), category: slug }}
    />
  );
}
