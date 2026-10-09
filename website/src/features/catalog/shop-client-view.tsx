'use client';

import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { StorefrontImage } from '@/components/storefront-image';
import { useLanguage } from '@/features/i18n/language-context';
import type { Category, Product } from '@/types/commerce';

export type Filters = Record<string, string | undefined>;

export function ShopClientView({
  categories,
  products,
  total,
  page,
  filters,
  title,
  description,
  bannerUrl
}: {
  categories: Category[];
  products: Product[];
  total: number;
  page: number;
  filters: Filters;
  title?: string;
  description?: string;
  bannerUrl?: string | null;
}) {
  const { t, locale, dir } = useLanguage();

  const categoryTranslations: Record<string, string> = {
    'soins-du-visage': locale === 'ar' ? 'العناية بالوجه' : locale === 'en' ? 'Facial Care' : 'Soins du visage',
    'soins-du-corps': locale === 'ar' ? 'العناية بالجسم' : locale === 'en' ? 'Body Care' : 'Soins du corps',
    'savons': locale === 'ar' ? 'الصوابين الطبيعية' : locale === 'en' ? 'Natural Soaps' : 'Savons naturels',
    'huiles-et-solaires': locale === 'ar' ? 'الزيوت والتسمير' : locale === 'en' ? 'Oils & Sun Care' : 'Huiles & Solaires',
    'masques-et-soins': locale === 'ar' ? 'أقنعة وطقوس الحمام' : locale === 'en' ? 'Masks & Rituals' : 'Masques & Soins',
    'terroir-marocain': locale === 'ar' ? 'كنوز التراث المغربي' : locale === 'en' ? 'Moroccan Terroir' : 'Terroir marocain',
    'coffrets': locale === 'ar' ? 'باقات وهدايا راقية' : locale === 'en' ? 'Gift Sets' : 'Coffrets & Rituels'
  };

  const defaultTitle =
    locale === 'ar'
      ? 'المتجر وكافة المجموعات'
      : locale === 'en'
      ? 'The Collection'
      : 'La collection';

  const defaultDesc =
    locale === 'ar'
      ? 'مستحضرات طبيعية نقية للعناية اليومية، مستخلصة من خيرات شجرة الأركان وسوس.'
      : locale === 'en'
      ? 'Botanical skincare and treasures crafted for your daily rituals.'
      : 'Des soins et des découvertes, pour composer votre rituel.';

  const url = (n: number) => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    p.set('page', String(n));
    return '?' + p.toString();
  };

  return (
    <div className="container section" dir={dir}>
      {bannerUrl && (
        <div className="category-banner">
          <StorefrontImage
            src={bannerUrl}
            alt={title || defaultTitle}
            fill
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div className="page-heading" style={{ paddingTop: 0 }}>
        <div className="breadcrumbs">
          <Link href="/">{t.nav.home}</Link> / {t.nav.shop}
        </div>
        <div className="eyebrow">
          {locale === 'ar'
            ? 'كنوز سويت أركان الطبيعية'
            : locale === 'en'
            ? 'SWEET ARGAN TREASURES'
            : 'LES TRÉSORS SWEET ARGAN'}
        </div>
        <h1>{title || defaultTitle}</h1>
        <p>{description || defaultDesc}</p>
      </div>

      <div className="shop-layout">
        <aside className="filters">
          <form action="/shop">
            <details open>
              <summary>
                {locale === 'ar'
                  ? 'تصفية وترتيب المنتجات'
                  : locale === 'en'
                  ? 'Filter & Refine'
                  : 'Affiner la sélection'}
              </summary>
              <label htmlFor="q">{t.nav.search_button}</label>
              <input
                id="q"
                name="q"
                defaultValue={filters.q}
                placeholder={t.nav.search_placeholder}
                maxLength={100}
              />
              <label htmlFor="category">
                {locale === 'ar'
                  ? 'العوالم والتصنيفات'
                  : locale === 'en'
                  ? 'Collection'
                  : 'Univers'}
              </label>
              <select id="category" name="category" defaultValue={filters.category || ''}>
                <option value="">
                  {locale === 'ar'
                    ? 'كافة العوالم'
                    : locale === 'en'
                    ? 'All Collections'
                    : 'Tous les univers'}
                </option>
                {categories.map(c => (
                  <option value={c.slug} key={c.id}>
                    {categoryTranslations[c.slug] || c.name}
                  </option>
                ))}
              </select>
              <label htmlFor="sort">
                {locale === 'ar'
                  ? 'ترتيب حسب'
                  : locale === 'en'
                  ? 'Sort by'
                  : 'Trier par'}
              </label>
              <select id="sort" name="sort" defaultValue={filters.sort || 'featured'}>
                <option value="featured">
                  {locale === 'ar'
                    ? 'مختاراتنا المفضلة'
                    : locale === 'en'
                    ? 'Featured'
                    : 'Notre sélection'}
                </option>
                <option value="newest">
                  {locale === 'ar'
                    ? 'الأحدث إضافتاً'
                    : locale === 'en'
                    ? 'Newest'
                    : 'Nouveautés'}
                </option>
                <option value="price-asc">
                  {locale === 'ar'
                    ? 'السعر: من الأقل للأعلى'
                    : locale === 'en'
                    ? 'Price: Low to High'
                    : 'Prix croissant'}
                </option>
                <option value="price-desc">
                  {locale === 'ar'
                    ? 'السعر: من الأعلى للأقل'
                    : locale === 'en'
                    ? 'Price: High to Low'
                    : 'Prix décroissant'}
                </option>
              </select>
              <label htmlFor="min">
                {locale === 'ar'
                  ? 'السعر الأدنى (درهم)'
                  : locale === 'en'
                  ? 'Min Price (MAD)'
                  : 'Prix minimum (MAD)'}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                id="min"
                name="min"
                defaultValue={filters.min}
              />
              <label htmlFor="max">
                {locale === 'ar'
                  ? 'السعر الأقصى (درهم)'
                  : locale === 'en'
                  ? 'Max Price (MAD)'
                  : 'Prix maximum (MAD)'}
              </label>
              <input
                type="number"
                min="0"
                step="1"
                id="max"
                name="max"
                defaultValue={filters.max}
              />
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="stock"
                  value="1"
                  defaultChecked={!!filters.stock}
                />
                {locale === 'ar'
                  ? 'المتوفر في المخزون فقط'
                  : locale === 'en'
                  ? 'In stock only'
                  : 'En stock uniquement'}
              </label>
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="best"
                  value="1"
                  defaultChecked={!!filters.best}
                />
                {t.bestsellers.badge}
              </label>
              <button className="button" type="submit">
                {locale === 'ar'
                  ? 'تطبيق الفلتر'
                  : locale === 'en'
                  ? 'Apply'
                  : 'Appliquer'}
              </button>
              <Link href="/shop" className="text-link" style={{ marginTop: 15 }}>
                {locale === 'ar'
                  ? 'إلغاء الفلاتر'
                  : locale === 'en'
                  ? 'Clear filters'
                  : 'Effacer les filtres'}
              </Link>
            </details>
          </form>
        </aside>

        <div>
          <div className="catalog-bar">
            <span>
              {total}{' '}
              {locale === 'ar'
                ? 'مستحضر طبيعي'
                : locale === 'en'
                ? 'natural products'
                : `produit${total !== 1 ? 's' : ''}`}
            </span>
            <small>
              {locale === 'ar'
                ? 'عناية أصيلة لكل يوم من سوس.'
                : locale === 'en'
                ? 'Authentic Moroccan care for everyday.'
                : 'Une attention pour chaque jour.'}
            </small>
          </div>

          {products.length ? (
            <div className="product-grid">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>
                {locale === 'ar'
                  ? 'لا توجد منتجات مطابقة لهذا البحث.'
                  : locale === 'en'
                  ? 'No products found.'
                  : 'Aucun produit pour le moment.'}
              </h2>
              <p>
                {locale === 'ar'
                  ? 'جربي تعديل خيارات الفلترة أو تصفحي كامل المعروضات.'
                  : locale === 'en'
                  ? 'Try adjusting your filters or browse the complete catalog.'
                  : 'Essayez une autre recherche ou revenez découvrir nos nouveautés.'}
              </p>
              <Link href="/shop" className="button secondary">
                {t.categories_section.view_all}
              </Link>
            </div>
          )}

          <nav className="pagination" aria-label="Pagination">
            {page > 1 && (
              <Link href={url(page - 1)} className="button secondary">
                {locale === 'ar' ? 'السابق' : locale === 'en' ? 'Previous' : 'Précédent'}
              </Link>
            )}
            {page * 12 < total && (
              <Link href={url(page + 1)} className="button secondary">
                {locale === 'ar' ? 'التالي' : locale === 'en' ? 'Next' : 'Suivant'}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
