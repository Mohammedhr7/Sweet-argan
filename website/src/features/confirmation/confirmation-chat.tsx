'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, CheckCircle2, PackageCheck, Copy, Check, Truck } from 'lucide-react';
import type { Order } from '@/types/commerce';
import { money } from '@/utils/money';
import { track } from '@/services/analytics';
import { useLanguage } from '@/features/i18n/language-context';
import { StorefrontImage } from '@/components/storefront-image';

export function ConfirmationChat({ order: o }: { order: Order }) {
  const { t, locale, dir } = useLanguage();
  const [status, setStatus] = useState(o.confirmation_status);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [cancel, setCancel] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const labels: Record<string, Record<string, string>> = {
    pending: {
      ar: 'في انتظار تأكيدكِ',
      fr: 'À confirmer',
      en: 'Pending confirmation'
    },
    confirmed: {
      ar: 'تم تأكيد الطلب',
      fr: 'Confirmée',
      en: 'Confirmed'
    },
    needs_review: {
      ar: 'طلبك قيد المراجعة',
      fr: 'Demande en cours d’examen',
      en: 'Under review'
    },
    rejected: {
      ar: 'ملغاة',
      fr: 'Annulée',
      en: 'Cancelled'
    },
    expired: {
      ar: 'انتهت صلاحية التأكيد',
      fr: 'Délai expiré',
      en: 'Expired'
    }
  };

  const copyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(o.public_order_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  async function send(action: string) {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: o.public_order_code, action, message })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        return;
      }
      setStatus(data.status);
      if (data.status === 'confirmed') {
        track('order_confirmed', { value: o.total, currency: 'MAD' });
      }
      router.refresh();
    } catch {
      setError(
        locale === 'ar'
          ? 'تعذر الاتصال، يرجى إعادة المحاولة.'
          : locale === 'en'
          ? 'Connection error, please retry.'
          : 'Connexion interrompue. Réessayez.'
      );
    } finally {
      setBusy(false);
      setCancel(false);
    }
  }

  const actionable =
    ['pending', 'needs_review'].includes(status) && o.fulfillment_status === 'new';

  const firstName = o.customer_name ? o.customer_name.split(' ')[0] : '';

  const whatsappMessage = encodeURIComponent(
    `السلام عليكم، قمت بطلب رقم ${o.public_order_code} بمبلغ ${o.total} درهم من موقع سويت أركان وأرغب في تأكيده.`
  );

  return (
    <div className="chat" dir={dir}>
      <div className="eyebrow">
        {locale === 'ar'
          ? 'سويت أركان · تأكيد طلبيتكِ'
          : locale === 'en'
          ? 'SWEET ARGAN · ORDER CONFIRMATION'
          : 'SWEET ARGAN · VOTRE COMMANDE'}
      </div>

      <span className={'status ' + status}>
        {labels[status]?.[locale] || labels[status]?.fr || status}
      </span>

      {/* PROMINENT ORDER CODE COPY & TRACKING BOX */}
      <div
        style={{
          background: 'var(--paper-alt)',
          border: '2px dashed var(--gold)',
          borderRadius: 8,
          padding: '22px 20px',
          margin: '18px 0 24px',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--muted)',
            marginBottom: 6,
            fontWeight: 600
          }}
        >
          {t.order_copy.title}
        </div>
        <div
          style={{
            fontSize: 'clamp(24px, 4.5vw, 34px)',
            fontWeight: 700,
            fontFamily: 'monospace',
            color: 'var(--olive)',
            letterSpacing: '0.04em',
            marginBottom: 10
          }}
        >
          {o.public_order_code}
        </div>
        <p
          style={{
            fontSize: 14,
            color: 'var(--foreground)',
            maxWidth: 500,
            margin: '0 auto 16px',
            lineHeight: 1.7
          }}
        >
          {t.order_copy.instruction}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={copyCode}
            className="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              fontSize: 14
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? t.order_copy.copied : t.order_copy.copy_btn}
          </button>
          <Link
            href="/order-tracking"
            className="button secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              fontSize: 14
            }}
          >
            <Truck size={16} />
            {t.order_copy.track_btn}
          </Link>
        </div>
      </div>

      <div className="chat-bubble">
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>
          {locale === 'ar'
            ? `مرحباً بكِ ${firstName}`
            : locale === 'en'
            ? `Hello ${firstName}`
            : `Bonjour ${firstName}`}
          .
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
          {locale === 'ar'
            ? 'شكراً لثقتكِ بتعاونية سويت أركان. تم تسجيل طلبيتكِ بنجاح، لنراجع التفاصيل معاً.'
            : locale === 'en'
            ? 'Thank you for your order with Sweet Argan. We have recorded your items.'
            : 'Merci pour votre commande. Vérifions les derniers détails ensemble.'}
        </p>

        {/* ORDER ITEMS WITH REAL PRODUCT IMAGES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {o.order_items.map(i => (
            <div
              key={i.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 0',
                borderBottom: '1px solid var(--line)'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: 56,
                  height: 56,
                  borderRadius: 6,
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'var(--paper-alt)',
                  border: '1px solid var(--line)'
                }}
              >
                <StorefrontImage
                  src={i.product_image_url || '/assets/brand/creams.jpg'}
                  alt={i.product_name}
                  fill
                  sizes="56px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                  {i.product_name}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {i.quantity} × {money(i.unit_price)}
                </div>
              </div>
              <strong style={{ fontSize: 15, whiteSpace: 'nowrap' }}>
                {money(i.line_total)}
              </strong>
            </div>
          ))}
        </div>

        <div className="summary-line" style={{ marginTop: 14 }}>
          <span>
            {locale === 'ar' ? 'مصاريف التوصيل' : locale === 'en' ? 'Shipping' : 'Livraison'}
          </span>
          <span>
            {o.shipping_amount === 0
              ? locale === 'ar'
                ? 'مجاناً'
                : 'Offerte'
              : money(o.shipping_amount)}
          </span>
        </div>

        <div className="summary-line summary-total">
          <span>{locale === 'ar' ? 'المجموع الإجمالي' : locale === 'en' ? 'Total' : 'Total'}</span>
          <strong>{money(o.total)}</strong>
        </div>

        <p style={{ marginTop: 20, lineHeight: 1.6, fontSize: 14, color: 'var(--foreground)' }}>
          <strong>{locale === 'ar' ? 'عنوان التوصيل:' : 'Adresse de livraison :'}</strong>
          <br />
          {o.shipping_city}, {o.shipping_address}
        </p>

        <div style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
          {t.checkout.cod_reassurance} · {o.public_order_code}
        </div>
      </div>

      {status === 'confirmed' ? (
        <div role="status" className="success" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <CheckCircle2 size={24} color="#27ae60" />
          <div>
            <strong>
              {locale === 'ar'
                ? 'تم تأكيد طلبيتكِ بنجاح!'
                : locale === 'en'
                ? 'Your order is confirmed!'
                : 'Votre commande est confirmée.'}
            </strong>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              {locale === 'ar'
                ? 'نقوم الآن بتجهيز طردكِ في ورشتنا بأكادير للشحن السريع خلال 24-48 ساعة.'
                : 'Nous préparons votre colis pour une expédition sous 24-48h.'}
            </div>
          </div>
        </div>
      ) : status === 'needs_review' ? (
        <p role="status" className="notice" style={{ marginTop: 16 }}>
          {locale === 'ar'
            ? 'تم إرسال رسالتكِ إلى فريق التعاونية لمراجعتها فوراً.'
            : 'Votre message a été transmis à l’équipe.'}
        </p>
      ) : null}

      {actionable && (
        <>
          <h3 style={{ marginTop: 24, fontSize: 18 }}>
            {locale === 'ar'
              ? 'هل ترغبين في تأكيد هذه الطلبية الآن؟'
              : locale === 'en'
              ? 'Do you confirm this order?'
              : 'Confirmez-vous cette commande ?'}
          </h3>

          <div className="chat-actions">
            <button className="button" disabled={busy} onClick={() => send('confirm')}>
              {locale === 'ar'
                ? 'تأكيد طلبيتي الآن'
                : locale === 'en'
                ? 'Confirm My Order'
                : 'Confirmer ma commande'}
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => {
                setMessage(
                  locale === 'ar'
                    ? 'أرغب في تعديل طلبيتي: '
                    : 'Je souhaite modifier ma commande : '
                );
                document.getElementById('reply')?.focus();
              }}
            >
              {locale === 'ar' ? 'تعديل' : locale === 'en' ? 'Modify' : 'Modifier'}
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => setCancel(true)}
            >
              {locale === 'ar' ? 'إلغاء' : locale === 'en' ? 'Cancel' : 'Annuler'}
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <a
              href={`https://wa.me/212661983329?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <MessageCircle size={16} />
              {locale === 'ar'
                ? 'تأكيد أو استفسار عبر واتساب'
                : locale === 'en'
                ? 'Confirm via WhatsApp'
                : 'Confirmer par WhatsApp'}
            </a>
          </div>

          {cancel && (
            <div className="notice" role="alert" style={{ marginTop: 20 }}>
              <p>
                {locale === 'ar'
                  ? 'هل أنتِ متأكدة من رغبتكِ في إلغاء هذه الطلبية وتحرير المنتجات المحجوزة؟'
                  : 'Annuler cette commande et libérer les produits réservés ?'}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button className="button" disabled={busy} onClick={() => send('reject')}>
                  {locale === 'ar' ? 'نعم، تأكيد الإلغاء' : 'Oui, annuler'}
                </button>
                <button className="button secondary" onClick={() => setCancel(false)}>
                  {locale === 'ar' ? 'الاحتفاظ بطلبيتي' : 'Garder ma commande'}
                </button>
              </div>
            </div>
          )}

          <form
            className="chat-input"
            onSubmit={e => {
              e.preventDefault();
              send('message');
            }}
            style={{ marginTop: 24 }}
          >
            <label htmlFor="reply" className="sr-only">
              {locale === 'ar' ? 'رسالتكِ أو تعديلكِ' : 'Votre réponse ou modification'}
            </label>
            <input
              id="reply"
              value={message}
              maxLength={1000}
              onChange={e => setMessage(e.target.value)}
              placeholder={
                locale === 'ar'
                  ? 'لديكِ سؤال أو رغبة في تعديل العنوان أو الطلب؟'
                  : 'Une question ou une modification ?'
              }
            />
            <button className="button secondary" disabled={busy || !message.trim()}>
              {locale === 'ar' ? 'إرسال' : 'Envoyer'}
            </button>
          </form>
        </>
      )}

      {error && (
        <p role="alert" className="error" style={{ marginTop: 16 }}>
          {error}
        </p>
      )}
    </div>
  );
}
