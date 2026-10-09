'use client';

import Link from 'next/link';
import type { Product } from '@/types/commerce';
import { ProductPurchase } from '@/features/catalog/product-purchase';
import { ProductCard } from '@/components/product-card';
import { useLanguage } from '@/features/i18n/language-context';

export function ProductPageView({
  product,
  related
}: {
  product: Product;
  related: Product[];
}) {
  const { t, locale, dir } = useLanguage();

  const isAr = locale === 'ar';
  const isEn = locale === 'en';

  const relatedList = related.filter(r => r.id !== product.id).slice(0, 4);

  return (
    <div className="container section" dir={dir}>
      <div className="breadcrumbs">
        <Link href="/">{t.nav.home}</Link> / <Link href="/shop">{t.nav.shop}</Link> /{' '}
        <span>{product.name}</span>
      </div>

      <ProductPurchase product={product} />

      {relatedList.length > 0 && (
        <section className="section" style={{ paddingTop: 60 }}>
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                {isAr ? 'عناية متكاملة' : isEn ? 'HARMONIOUS CARE' : 'RITUEL COMPLÉMENTAIRE'}
              </div>
              <h2>
                {isAr
                  ? 'مستحضرات مكملة لروتينكِ اليومي'
                  : isEn
                  ? 'Complete Your Daily Ritual'
                  : 'Prolongez votre rituel.'}
              </h2>
            </div>
            <Link className="text-link" href="/shop">
              {t.categories_section.view_all}
            </Link>
          </div>
          <div className="product-grid">
            {relatedList.map(r => (
              <ProductCard product={r} key={r.id} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
