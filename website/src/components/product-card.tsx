'use client';

import Link from 'next/link';
import { StorefrontImage } from './storefront-image';
import type { Product } from '@/types/commerce';
import { money } from '@/utils/money';
import { QuickAdd } from '@/features/catalog/quick-add';
import { useLanguage } from '@/features/i18n/language-context';

export function ProductCard({ product: p }: { product: Product }) {
  const { t, locale, dir } = useLanguage();
  const image = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];

  const categoryTranslations: Record<string, string> = {
    'soins-du-visage': locale === 'ar' ? 'العناية بالوجه' : locale === 'en' ? 'Facial Care' : 'Soins du visage',
    'soins-du-corps': locale === 'ar' ? 'العناية بالجسم' : locale === 'en' ? 'Body Care' : 'Soins du corps',
    'savons': locale === 'ar' ? 'الصوابين الطبيعية' : locale === 'en' ? 'Natural Soaps' : 'Savons naturels',
    'huiles-et-solaires': locale === 'ar' ? 'الزيوت والتسمير' : locale === 'en' ? 'Oils & Sun Care' : 'Huiles & Solaires',
    'masques-et-soins': locale === 'ar' ? 'أقنعة وطقوس الحمام' : locale === 'en' ? 'Masks & Rituals' : 'Masques & Soins',
    'terroir-marocain': locale === 'ar' ? 'كنوز التراث المغربي' : locale === 'en' ? 'Moroccan Terroir' : 'Terroir marocain',
    'coffrets': locale === 'ar' ? 'باقات وهدايا راقية' : locale === 'en' ? 'Gift Sets' : 'Coffrets & Rituels'
  };

  const isSoldOut =
    p.track_inventory &&
    p.stock_quantity === 0 &&
    !p.product_variants.some(v => v.is_active && v.stock_quantity > 0);

  const categoryLabel = p.categories?.slug
    ? categoryTranslations[p.categories.slug] || p.categories.name
    : p.categories?.name || (locale === 'ar' ? 'سويت أركان' : 'Sweet Argan');

  return (
    <article className="product-card" dir={dir}>
      <div className="product-photo">
        <Link href={'/product/' + p.slug}>
          <StorefrontImage
            src={image?.image_url || '/assets/brand/image-placeholder.svg'}
            alt={image?.alt_text || p.name}
            fill
            sizes="(max-width:760px) 45vw, 25vw"
          />
        </Link>
        {p.is_best_seller && <span className="badge">{t.bestsellers.badge}</span>}
        <QuickAdd product={p} />
      </div>
      <div className="product-meta">
        <span className="category">{categoryLabel}</span>
        <Link href={'/product/' + p.slug}>
          <h3>{p.name}</h3>
        </Link>
        <div className="product-price">
          <span>{money(p.price)}</span>
          {p.compare_at_price && p.compare_at_price > p.price ? (
            <del>{money(p.compare_at_price)}</del>
          ) : null}
        </div>
        {isSoldOut && (
          <small style={{ color: '#c0392b' }}>
            {locale === 'ar'
              ? 'نفد من المخزون'
              : locale === 'en'
              ? 'Sold Out'
              : 'Épuisé'}
          </small>
        )}
      </div>
    </article>
  );
}
