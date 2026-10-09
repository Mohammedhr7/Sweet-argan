export const dynamic = 'force-dynamic';

import { getContent, getProducts, getCategories } from '@/services/catalog';
import { HomeView } from '@/features/home/home-view';

export default async function Home() {
  const [content, catalog, categories] = await Promise.all([
    getContent(),
    getProducts({}),
    getCategories()
  ]);

  return <HomeView catalog={catalog} categories={categories} content={content} />;
}
