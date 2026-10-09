'use client';

import Link from 'next/link';
import { useCart } from '@/features/cart/cart-provider';
import { CartItems } from '@/features/cart/cart-items';
import { money } from '@/utils/money';
import { useLanguage } from '@/features/i18n/language-context';

export default function Cart() {
  const cart = useCart();
  const { t, locale, dir } = useLanguage();

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="container section" dir={dir}>
      <div className="page-heading">
        <div className="eyebrow">
          {locale === 'ar'
            ? 'سلة مشترياتكِ الطبيعية'
            : locale === 'en'
            ? 'YOUR SELECTION'
            : 'VOTRE SÉLECTION'}
        </div>
        <h1>{t.cart.title}</h1>
      </div>

      {!cart.ready ? (
        <p role="status">
          {locale === 'ar'
            ? 'جاري تحميل السلة…'
            : locale === 'en'
            ? 'Loading cart…'
            : 'Chargement du panier…'}
        </p>
      ) : cart.items.length ? (
        <div className="checkout-layout">
          <div>
            <CartItems />
            <div style={{ marginTop: 28 }}>
              <Link href="/shop" className="text-link">
                ← {t.cart.continue}
              </Link>
            </div>
          </div>
          <aside className="panel" style={{ alignSelf: 'start' }}>
            <h3>{t.checkout.summary_title}</h3>
            <div className="summary-line" style={{ margin: '16px 0' }}>
              <span>{t.cart.subtotal}</span>
              <strong style={{ fontSize: 20 }}>{money(subtotal)}</strong>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              {locale === 'ar'
                ? 'مصاريف التوصيل تُحسب في الخطوة التالية (مجاناً للطلبات فوق 300 درهم). الدفع نقداً عند الاستلام.'
                : locale === 'en'
                ? 'Shipping is calculated at next step (free over 300 MAD). Cash on delivery.'
                : 'Frais de livraison calculés à l’étape suivante (offerts dès 300 MAD). Paiement à la livraison.'}
            </p>
            <div style={{ marginTop: 24 }}>
              <Link href="/checkout" className="button" style={{ width: '100%', textAlign: 'center' }}>
                {t.cart.checkout} →
              </Link>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
              {t.checkout.cod_reassurance}
            </div>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <h2>{t.cart.empty}</h2>
          <p style={{ margin: '12px 0 24px', color: 'var(--muted)' }}>{t.cart.empty_sub}</p>
          <Link href="/shop" className="button">
            {t.cart.explore}
          </Link>
        </div>
      )}
    </div>
  );
}
