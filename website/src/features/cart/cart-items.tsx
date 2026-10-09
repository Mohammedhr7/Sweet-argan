'use client';

import { StorefrontImage } from '@/components/storefront-image';
import Link from 'next/link';
import { useCart, lineKey } from './cart-provider';
import { money } from '@/utils/money';
import { useLanguage } from '@/features/i18n/language-context';

export function CartItems() {
  const cart = useCart();
  const { locale } = useLanguage();

  const removeLabel = locale === 'ar' ? 'حذف' : locale === 'en' ? 'Remove' : 'Retirer';

  return (
    <>
      {cart.items.map(item => (
        <div className="cart-row" key={lineKey(item)}>
          <StorefrontImage
            src={item.image || '/assets/brand/image-placeholder.svg'}
            alt={item.name}
            width={80}
            height={100}
          />
          <div>
            <Link href={'/product/' + item.slug} onClick={() => cart.setOpen(false)}>
              <h3>{item.name}</h3>
            </Link>
            <small>{money(item.price)}</small>
            <div className="row-actions">
              <div className="quantity">
                <button
                  type="button"
                  aria-label={(locale === 'ar' ? 'إنقاص ' : 'Réduire ') + item.name}
                  disabled={item.quantity <= 1}
                  onClick={() => cart.update(lineKey(item), item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  aria-label={(locale === 'ar' ? 'زيادة ' : 'Augmenter ') + item.name}
                  disabled={item.quantity >= 20}
                  onClick={() => cart.update(lineKey(item), item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="remove"
                onClick={() => cart.remove(lineKey(item))}
              >
                {removeLabel}
              </button>
            </div>
          </div>
          <strong>{money(item.price * item.quantity)}</strong>
        </div>
      ))}
    </>
  );
}
