'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCart } from './cart-provider';
import { CartItems } from './cart-items';
import { money } from '@/utils/money';
import { useLanguage } from '@/features/i18n/language-context';

export function CartDrawer() {
  const cart = useCart();
  const { t, locale, dir } = useLanguage();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (cart.open) {
      dialog?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog?.close();
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cart.open]);

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <dialog
      ref={ref}
      className="dialog"
      dir={dir}
      onCancel={() => cart.setOpen(false)}
      onClose={() => cart.setOpen(false)}
      aria-labelledby="drawer-title"
    >
      <div className="dialog-header">
        <h2 id="drawer-title">{t.cart.title}</h2>
        <button
          className="icon-button"
          aria-label={
            locale === 'ar'
              ? 'إغلاق السلة'
              : locale === 'en'
              ? 'Close cart'
              : 'Fermer le panier'
          }
          onClick={() => cart.setOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      {cart.items.length ? (
        <>
          <CartItems />
          <div className="summary-line" style={{ marginTop: 20 }}>
            <span>{t.cart.subtotal}</span>
            <strong>{money(subtotal)}</strong>
          </div>
          <p>
            <small style={{ color: 'var(--muted)' }}>
              {locale === 'ar'
                ? 'يتم التحقق من الأسعار ومصاريف التوصيل عند إتمام الطلب.'
                : locale === 'en'
                ? 'Prices and shipping are verified at checkout.'
                : 'Prix et livraison vérifiés à la commande.'}
            </small>
          </p>
          <div className="dialog-actions">
            <Link
              className="button"
              href="/checkout"
              onClick={() => cart.setOpen(false)}
            >
              {t.cart.checkout}
            </Link>
            <Link
              className="button secondary"
              href="/cart"
              onClick={() => cart.setOpen(false)}
            >
              {locale === 'ar'
                ? 'عرض السلة الكاملة'
                : locale === 'en'
                ? 'View Full Cart'
                : 'Voir le panier'}
            </Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>{t.cart.empty}</h3>
          <p style={{ margin: '12px 0 20px', color: 'var(--muted)' }}>
            {t.cart.empty_sub}
          </p>
          <Link
            href="/shop"
            className="button"
            onClick={() => cart.setOpen(false)}
          >
            {t.cart.explore}
          </Link>
        </div>
      )}
    </dialog>
  );
}
