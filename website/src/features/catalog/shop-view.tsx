import { getCategories, getProducts } from '@/services/catalog';
import { ShopClientView, type Filters } from './shop-client-view';

export type { Filters };

export async function ShopView({
  filters,
  title,
  description,
  bannerUrl
}: {
  filters: Filters;
  title?: string;
  description?: string;
  bannerUrl?: string | null;
}) {
  const [categories, { products, total, page }] = await Promise.all([
    getCategories(),
    getProducts(filters)
  ]);

  return (
    <ShopClientView
      categories={categories}
      products={products}
      total={total}
      page={page}
      filters={filters}
      title={title}
      description={description}
      bannerUrl={bannerUrl}
    />
  );
}
