'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackageCheck, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { customerSchema, type CustomerInput, type Customer } from './validation';
import { useCart, lineKey } from '@/features/cart/cart-provider';
import { money } from '@/utils/money';
import { track } from '@/services/analytics';
import { useLanguage } from '@/features/i18n/language-context';
import type { ShippingSettings } from '@/types/commerce';

export function CheckoutForm({ shipping }: { shipping: ShippingSettings }) {
  const { t, locale, dir } = useLanguage();
  const cart = useCart();
  const router = useRouter();
  const [error, setError] = useState('');
  const key = useRef('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CustomerInput, unknown, Customer>({
    resolver: zodResolver(customerSchema),
    defaultValues: { email: '', notes: '' }
  });

  useEffect(() => {
    key.current = crypto.randomUUID();
    track('begin_checkout');
  }, []);

  const subtotal = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery =
    shipping.free_threshold !== null && subtotal >= shipping.free_threshold
      ? 0
      : shipping.amount;

  async function submit(customer: Customer) {
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          items: cart.items.map(({ product_id, variant_id, quantity }) => ({
            product_id,
            variant_id,
            quantity
          })),
          idempotency_key: key.current
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error ||
            (locale === 'ar'
              ? 'تعذر تسجيل الطلب، يرجى المحاولة مرة أخرى.'
              : locale === 'en'
              ? 'Could not record order, please try again.'
              : 'Commande non enregistrée. Veuillez réessayer.')
        );
        return;
      }

      track('purchase', { value: data.total, currency: 'MAD' });
      cart.clear();
      router.push('/order/' + data.code + '/confirmation');
    } catch {
      setError(
        locale === 'ar'
          ? 'انقطع الاتصال بالخادم. يرجى المحاولة مرة أخرى: لن يتكرر طلبكِ مرتين.'
          : locale === 'en'
          ? 'Connection interrupted. Please try again: your order will not be created twice.'
          : 'Connexion interrompue. Réessayez : votre commande ne sera pas créée deux fois.'
      );
    }
  }

  const fields = [
    {
      name: 'full_name' as const,
      label: t.checkout.name_label,
      placeholder:
        locale === 'ar'
          ? 'مثال: فاطمة الزهراء العمراني'
          : locale === 'en'
          ? 'e.g. Fatima-Zahra El Amrani'
          : 'Ex: Fatima-Zahra El Amrani',
      type: 'text',
      auto: 'name',
      full: false
    },
    {
      name: 'phone' as const,
      label: t.checkout.phone_label,
      placeholder: '06 61 98 33 29',
      type: 'tel',
      auto: 'tel',
      full: false
    },
    {
      name: 'city' as const,
      label: t.checkout.city_label,
      placeholder:
        locale === 'ar'
          ? 'مثال: الدار البيضاء، أكادير، مراكش…'
          : locale === 'en'
          ? 'e.g. Casablanca, Agadir, Marrakech…'
          : 'Ex: Casablanca, Agadir, Marrakech…',
      type: 'text',
      auto: 'address-level2',
      full: false
    },
    {
      name: 'email' as const,
      label: t.checkout.email_label,
      placeholder: 'contact@exemple.ma',
      type: 'email',
      auto: 'email',
      full: false
    },
    {
      name: 'address' as const,
      label: t.checkout.address_label,
      placeholder:
        locale === 'ar'
          ? 'الحي، اسم الشارع، رقم العمارة أو المنزل'
          : locale === 'en'
          ? 'Neighborhood, street name, house or apartment number'
          : 'Quartier, nom de la rue, n° immeuble ou résidence',
      type: 'text',
      auto: 'street-address',
      full: true
    }
  ];

  if (!cart.ready) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p role="status">
          {locale === 'ar'
            ? 'جاري التحميل…'
            : locale === 'en'
            ? 'Loading…'
            : 'Chargement…'}
        </p>
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="empty-state" dir={dir}>
        <h2>{t.cart.empty}</h2>
        <p style={{ margin: '14px 0 24px', color: 'var(--muted)' }}>{t.cart.empty_sub}</p>
        <Link href="/shop" className="button">
          {t.cart.explore}
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-layout" dir={dir}>
      <form
        onSubmit={event => {
          void handleSubmit(submit)(event);
        }}
        noValidate
      >
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', marginBottom: 8 }}>
          {t.checkout.title}
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>
          {t.checkout.subtitle}
        </p>

        <div className="form-grid">
          {fields.map(f => (
            <div className={'field ' + (f.full ? 'full' : '')} key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              <input
                id={f.name}
                type={f.type}
                autoComplete={f.auto}
                placeholder={f.placeholder}
                {...register(f.name)}
                aria-invalid={!!errors[f.name]}
                aria-describedby={errors[f.name] ? f.name + '-error' : undefined}
              />
              {errors[f.name] && (
                <div className="field-error" id={f.name + '-error'}>
                  {errors[f.name]?.message}
                </div>
              )}
            </div>
          ))}
          <div className="field full">
            <label htmlFor="notes">{t.checkout.notes_label}</label>
            <textarea
              id="notes"
              rows={3}
              placeholder={
                locale === 'ar'
                  ? 'تعليمات للموزع (مثال: الاتصال قبل الوصول، تسليم الحارس…)'
                  : locale === 'en'
                  ? 'Instructions for delivery driver (e.g. call upon arrival)'
                  : 'Instructions pour le livreur (ex: appeler à l’arrivée)'
              }
              {...register('notes')}
            />
            {errors.notes && <div className="field-error">{errors.notes.message}</div>}
          </div>
        </div>

        {error && (
          <p role="alert" className="error" style={{ margin: '20px 0' }}>
            {error}
          </p>
        )}

        {!shipping.enabled && (
          <p className="notice">
            {locale === 'ar'
              ? 'الطلبات غير مفعلة حالياً. ستبقى سلتكِ محفوظة.'
              : locale === 'en'
              ? 'Orders are currently closed. Your cart remains saved.'
              : 'Les commandes ne sont pas encore ouvertes. Votre panier reste enregistré.'}
          </p>
        )}

        <div
          style={{
            background: 'var(--paper-alt)',
            border: '1px solid var(--line)',
            borderRadius: 4,
            padding: 16,
            margin: '24px 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 12,
            fontSize: 13
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PackageCheck size={18} color="var(--gold)" />
            <span>{t.checkout.cod_reassurance}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={18} color="var(--gold)" />
            <span>
              {locale === 'ar'
                ? 'توصيل 24/48 ساعة بالمغرب'
                : locale === 'en'
                ? '24/48h delivery across Morocco'
                : 'Livraison 24/48h au Maroc'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MessageCircle size={18} color="var(--gold)" />
            <span>
              {locale === 'ar'
                ? 'تأكيد ودعم عبر واتساب'
                : locale === 'en'
                ? 'WhatsApp support & care'
                : 'Support & confirmation WhatsApp'}
            </span>
          </div>
        </div>

        <p style={{ marginBottom: 20 }}>
          <small>
            {t.checkout.terms_notice}{' '}
            <Link className="text-link" href="/terms">
              {locale === 'ar'
                ? 'الشروط العامة'
                : locale === 'en'
                ? 'Terms of Service'
                : 'Conditions de vente'}
            </Link>
            .
          </small>
        </p>

        <button
          className="button"
          type="submit"
          style={{ width: '100%', fontSize: 16, padding: '16px 24px' }}
          disabled={isSubmitting || !shipping.enabled}
        >
          {isSubmitting
            ? t.checkout.submitting
            : `${t.checkout.submit} · ${money(subtotal + delivery)}`}
        </button>
      </form>

      <aside className="panel" style={{ alignSelf: 'start' }}>
        <h3>{t.checkout.summary_title}</h3>
        {cart.items.map(i => (
          <div className="summary-line" key={lineKey(i)}>
            <span>
              {i.name} × {i.quantity}
            </span>
            <strong>{money(i.price * i.quantity)}</strong>
          </div>
        ))}
        <div className="summary-line" style={{ marginTop: 16 }}>
          <span>{t.checkout.subtotal}</span>
          <span>{money(subtotal)}</span>
        </div>
        <div className="summary-line">
          <span>{t.checkout.shipping}</span>
          <span>
            {shipping.enabled
              ? delivery === 0
                ? t.checkout.free
                : money(delivery)
              : locale === 'ar'
              ? 'قيد التفعيل'
              : 'À configurer'}
          </span>
        </div>
        <div className="summary-line summary-total">
          <span>{t.checkout.total}</span>
          <span>{money(subtotal + delivery)}</span>
        </div>
        <p style={{ marginTop: 14 }}>
          <small style={{ color: 'var(--muted)' }}>
            {locale === 'ar'
              ? 'يتم التحقق من الأسعار والمخزون بشكل آمن وفوري.'
              : locale === 'en'
              ? 'Prices and stock are securely verified before order creation.'
              : 'Le serveur vérifie les prix et le stock avant d’enregistrer la commande.'}
          </small>
        </p>
        <div style={{ marginTop: 14 }}>
          <Link href="/cart" className="text-link">
            {locale === 'ar'
              ? 'تعديل السلة'
              : locale === 'en'
              ? 'Edit shopping cart'
              : 'Modifier le panier'}
          </Link>
        </div>
      </aside>
    </div>
  );
}
