'use client';

import { useState, useEffect } from 'react';
import { StorefrontImage } from '@/components/storefront-image';
import { useRouter } from 'next/navigation';
import { ArrowRight, PackageCheck, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import type { Product } from '@/types/commerce';
import { money } from '@/utils/money';
import { useCart } from '@/features/cart/cart-provider';
import { track } from '@/services/analytics';
import { useLanguage } from '@/features/i18n/language-context';

export function ProductPurchase({ product: p }: { product: Product }) {
  const { t, locale, dir } = useLanguage();
  const images = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);
  const variants = p.product_variants.filter(v => v.is_active);
  const [variant, setVariant] = useState(variants[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();
  const router = useRouter();

  const v = variants.find(item => item.id === variant);
  const price = v?.price ?? p.price;
  const stock = v?.stock_quantity ?? p.stock_quantity;
  const available = !p.track_inventory || stock >= quantity;

  useEffect(() => {
    track('view_product', { product_id: p.id, value: p.price, currency: 'MAD' });
  }, [p.id, p.price]);

  const add = (buy = false) => {
    cart.add({
      product_id: p.id,
      variant_id: v?.id || null,
      name: p.name + (v ? ' — ' + v.name : ''),
      slug: p.slug,
      image: images[0]?.image_url || '',
      price,
      quantity
    });
    if (buy) router.push('/checkout');
  };

  const sections = [
    {
      label:
        locale === 'ar'
          ? 'الوصف والمميزات'
          : locale === 'en'
          ? 'Product Description'
          : 'Description',
      text: p.description
    },
    {
      label:
        locale === 'ar'
          ? 'طريقة الاستعمال والطقوس'
          : locale === 'en'
          ? 'How to Use'
          : 'Conseils d’utilisation',
      text: p.usage_instructions
    },
    {
      label:
        locale === 'ar'
          ? 'المكونات الطبيعية'
          : locale === 'en'
          ? 'Natural Ingredients'
          : 'Ingrédients',
      text: p.ingredients
    },
    {
      label:
        locale === 'ar'
          ? 'الفوائد والخصائص'
          : locale === 'en'
          ? 'Benefits'
          : 'Les petits plus',
      text: p.benefits
    }
  ].filter(s => Boolean(s.text));

  return (
    <div className="product-detail" dir={dir}>
      <div>
        <div className="gallery-main">
          <StorefrontImage
            src={images[active]?.image_url || '/assets/brand/image-placeholder.svg'}
            alt={images[active]?.alt_text || p.name}
            fill
            priority
            sizes="(max-width:760px) 100vw, 50vw"
          />
        </div>
        {images.length > 1 && (
          <div className="thumbnails">
            {images.map((im, i) => (
              <button
                key={im.id}
                aria-label={'Image ' + (i + 1)}
                aria-pressed={active === i}
                onClick={() => setActive(i)}
              >
                <StorefrontImage src={im.image_url} alt="" width={65} height={65} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="product-copy">
        <div className="eyebrow">{p.categories?.name || 'SWEET ARGAN'}</div>
        <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', margin: '8px 0 16px' }}>
          {p.name}
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--muted)' }}>
          {p.short_description}
        </p>

        <div className="price" style={{ margin: '20px 0' }}>
          <span>{money(price)}</span>
          {p.compare_at_price && p.compare_at_price > price ? (
            <del style={{ fontSize: 16, color: 'var(--muted)', marginLeft: 12 }}>
              {money(p.compare_at_price)}
            </del>
          ) : null}
        </div>

        <p className="stock" style={{ color: available ? '#27ae60' : '#c0392b' }}>
          {available
            ? locale === 'ar'
              ? '✓ متوفر بالمخزون'
              : locale === 'en'
              ? '✓ In Stock'
              : '✓ Disponible'
            : locale === 'ar'
            ? '✕ نفد من المخزون'
            : locale === 'en'
            ? '✕ Out of Stock'
            : '✕ Stock insuffisant'}
        </p>

        {variants.length > 0 && (
          <div style={{ margin: '16px 0' }}>
            <label htmlFor="variant" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
              {locale === 'ar'
                ? 'اختاري الحجم أو النوع'
                : locale === 'en'
                ? 'Select Format'
                : 'Choisir votre format'}
            </label>
            <select
              id="variant"
              value={variant}
              onChange={e => setVariant(e.target.value)}
              style={{ width: '100%', padding: '12px 14px' }}
            >
              {variants.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} · {money(item.price)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="purchase-actions" style={{ margin: '24px 0 16px' }}>
          <div className="quantity">
            <button
              aria-label="Réduire la quantité"
              disabled={quantity <= 1}
              onClick={() => setQuantity(q => q - 1)}
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              aria-label="Augmenter la quantité"
              disabled={quantity >= 20}
              onClick={() => setQuantity(q => q + 1)}
            >
              +
            </button>
          </div>
          <button
            className="button"
            disabled={!available}
            onClick={() => add()}
            style={{ flex: 1 }}
          >
            {t.cart.quick_add}
            <ArrowRight size={16} />
          </button>
        </div>

        <button
          className="button secondary"
          style={{ width: '100%', padding: '14px 20px', fontSize: 15 }}
          disabled={!available}
          onClick={() => add(true)}
        >
          {locale === 'ar'
            ? 'طلب فوري والدفع عند الاستلام'
            : locale === 'en'
            ? 'Fast Order · Cash on Delivery'
            : 'Commander en 1 clic · Paiement à la livraison'}
        </button>

        <div
          style={{
            background: 'var(--paper-alt)',
            border: '1px solid var(--line)',
            borderRadius: 4,
            padding: 14,
            marginTop: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 13
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PackageCheck size={16} color="var(--gold)" />
            <span>{t.checkout.cod_reassurance}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={16} color="var(--gold)" />
            <span>
              {locale === 'ar'
                ? 'توصيل 24/48 ساعة · مجاناً فوق 300 درهم'
                : locale === 'en'
                ? '24/48h delivery · Free over 300 MAD'
                : 'Livraison 24/48h · Offerte dès 300 MAD'}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          {sections.map((s, i) => (
            <details key={s.label} open={i === 0} style={{ marginBottom: 12 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600, padding: '10px 0' }}>
                {s.label}
              </summary>
              <p style={{ marginTop: 8, lineHeight: 1.8, color: 'var(--foreground)' }}>
                {s.text}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
