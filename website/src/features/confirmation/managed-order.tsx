'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { ManagedOrder } from '@/types/order-management';
import { StorefrontImage } from '@/components/storefront-image';
import { money } from '@/utils/money';
import { formatRemainingTime } from '@/lib/order-rules';
import { useLanguage } from '@/features/i18n/language-context';

export function OrderSummary({ order: o }: { order: ManagedOrder }) {
  const { t, locale } = useLanguage();
  const m = t.order_management;
  const dateLocale = locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-MA';

  return (
    <section className="panel" aria-labelledby="summary-title">
      <h2 id="summary-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
        {m.order_details_title}
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
        {o.customer_name} · {m.order_placed_on}{' '}
        {new Date(o.created_at).toLocaleDateString(dateLocale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}
      </p>

      <div style={{ marginBottom: '20px' }}>
        {o.order_items.map((i, idx) => (
          <div className="managed-item" key={idx}>
            <StorefrontImage
              src={i.product_image_url || ''}
              alt={i.product_name}
              width={72}
              height={90}
              style={{ objectFit: 'contain', width: '72px', height: '90px' }}
            />
            <div>
              <strong style={{ display: 'block', fontSize: '15px' }}>{i.product_name}</strong>
              <p style={{ margin: '4px 0', color: 'var(--muted)', fontSize: '13px' }}>
                {m.quantity_label} {i.quantity} × {money(i.unit_price)}
              </p>
            </div>
            <strong style={{ fontSize: '15px' }}>{money(i.line_total)}</strong>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', marginBottom: '24px' }}>
        <div className="summary-line">
          <span>{m.subtotal}</span>
          <strong>{money(o.subtotal)}</strong>
        </div>
        <div className="summary-line">
          <span>{m.shipping}</span>
          <strong>{o.shipping_amount === 0 ? m.free_shipping : money(o.shipping_amount)}</strong>
        </div>
        {o.discount_amount > 0 && (
          <div className="summary-line" style={{ color: '#15803d' }}>
            <span>{m.discount}</span>
            <strong>− {money(o.discount_amount)}</strong>
          </div>
        )}
        <div className="summary-line summary-total">
          <span>{m.total_with_tax}</span>
          <strong style={{ color: 'var(--olive)', fontSize: '22px' }}>{money(o.total)}</strong>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
        <h3 style={{ fontSize: '17px', marginBottom: '10px' }}>{m.delivery_address_title}</h3>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6' }}>
          <strong>{m.city_label}</strong> {o.shipping_city}<br />
          <strong>{m.address_label}</strong> {o.shipping_address}
        </p>
        {o.shipping_notes && (
          <p style={{ marginTop: '10px', fontSize: '13px', fontStyle: 'italic', color: 'var(--muted)' }}>
            <strong>{m.notes_label}</strong> {o.shipping_notes}
          </p>
        )}
      </div>
    </section>
  );
}

export function OrderTimeline({ order: o }: { order: ManagedOrder }) {
  const { t, locale } = useLanguage();
  const m = t.order_management;
  const isCancelled = o.fulfillment_status === 'cancelled';
  const dateLocale = locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-MA';

  const steps = isCancelled
    ? [
        { key: 'new', label: m.fulfillment_statuses.new || 'Commande reçue' },
        { key: 'cancelled', label: m.fulfillment_statuses.cancelled || 'Annulée' }
      ]
    : [
        { key: 'new', label: m.fulfillment_statuses.new || 'Commande reçue' },
        { key: 'confirmed', label: m.confirmation_statuses.confirmed || 'Confirmée' },
        { key: 'processing', label: m.fulfillment_statuses.processing || 'En préparation' },
        { key: 'ready', label: m.fulfillment_statuses.ready || 'Prête' },
        { key: 'shipped', label: m.fulfillment_statuses.shipped || 'Expédiée' },
        { key: 'delivered', label: m.fulfillment_statuses.delivered || 'Livrée' }
      ];

  const getStepStatus = (key: string) => {
    if (isCancelled) {
      if (key === 'new') return { state: 'completed', date: o.created_at };
      if (key === 'cancelled') return { state: 'cancelled', date: o.cancelled_at };
    }

    const orderRank: Record<string, number> = {
      new: 1,
      processing: 3,
      ready: 4,
      shipped: 5,
      delivered: 6
    };

    const currentFulfillmentRank = orderRank[o.fulfillment_status] || 1;
    const isConfirmed = o.confirmation_status === 'confirmed';

    if (key === 'new') {
      return { state: 'completed', date: o.created_at };
    }

    if (key === 'confirmed') {
      if (isConfirmed) return { state: 'completed', date: o.confirmed_at };
      if (o.confirmation_status === 'pending') return { state: 'active', date: null };
      return { state: 'pending', date: null };
    }

    const rank = orderRank[key] || 0;
    if (currentFulfillmentRank > rank) {
      const match = o.timeline.find((item) => item.new_status === key);
      return { state: 'completed', date: match?.created_at };
    }
    if (currentFulfillmentRank === rank && isConfirmed) {
      const match = o.timeline.find((item) => item.new_status === key);
      return { state: 'active', date: match?.created_at };
    }
    return { state: 'pending', date: null };
  };

  return (
    <section className="panel timeline-container" aria-labelledby="timeline-title">
      <h2 id="timeline-title" style={{ fontSize: '22px', marginBottom: '20px' }}>
        {m.timeline_title}
      </h2>
      <ol className="timeline-list">
        {steps.map((s, idx) => {
          const { state, date } = getStepStatus(s.key);
          return (
            <li key={s.key} className={`timeline-step ${state}`}>
              <div className="timeline-step-bullet" aria-hidden="true">
                {state === 'completed' ? '✓' : state === 'cancelled' ? '✕' : idx + 1}
              </div>
              <div className="timeline-step-body">
                <strong>{s.label}</strong>
                {date && (
                  <span>
                    {new Date(date).toLocaleString(dateLocale, {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
                {!date && state === 'active' && <span>{m.in_progress}</span>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function ManagedOrderPanel({
  order,
  contact,
  initialToken
}: {
  order: ManagedOrder;
  contact?: string;
  initialToken?: string;
}) {
  const { t, locale, dir } = useLanguage();
  const m = t.order_management;
  const dateLocale = locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-MA';

  const [o, setOrder] = useState(order);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(order.remaining_seconds);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const start = performance.now();
    const tick = () => {
      const elapsed = Math.floor((performance.now() - start) / 1000);
      setRemaining(Math.max(0, o.remaining_seconds - elapsed));
    };
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [o.remaining_seconds, o.server_now]);

  async function act(action: 'confirm' | 'cancel', reason = '') {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/order-management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: o.public_order_code,
          revision: o.revision,
          action,
          reason,
          token: initialToken
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrder(data);
      setRemaining(data.remaining_seconds);
      dialog.current?.close();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : locale === 'ar'
          ? 'تعذر الاتصال بالخادم. يرجى إعادة المحاولة.'
          : 'Connexion interrompue. Réessayez.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyOrderCode() {
    try {
      await navigator.clipboard.writeText(o.public_order_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setError(
        locale === 'ar'
          ? 'يرجى تحديد رقم الطلب ونسخه يدوياً.'
          : 'Sélectionnez le numéro pour le copier manuellement.'
      );
    }
  }

  const isCancelled = o.fulfillment_status === 'cancelled';
  const isConfirmed = o.confirmation_status === 'confirmed' && !isCancelled;

  const editUrl = `/order/${o.public_order_code}/edit${
    initialToken ? '?token=' + encodeURIComponent(initialToken) : ''
  }`;

  return (
    <div className="managed-order" lang={locale} dir={dir}>
      <div className="eyebrow">{m.eyebrow}</div>

      {/* TOP DECISION / STATUS HERO */}
      {isCancelled ? (
        <div className="order-hero-box cancelled">
          <h1 style={{ color: '#991b1b' }}>{m.cancelled_title}</h1>
          <div className="order-code-badge">{o.public_order_code}</div>
          <p style={{ margin: '12px 0', fontSize: '15px' }}>
            {m.cancelled_date_prefix}
            {o.cancelled_at &&
              new Date(o.cancelled_at).toLocaleString(dateLocale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            .
          </p>
          {o.cancellation_reason && (
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '16px' }}>
              <strong>{m.cancelled_reason_label}</strong> {o.cancellation_reason}
            </p>
          )}
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
            {m.cancelled_stock_freed}
          </p>
          <div className="managed-actions">
            <Link className="button" href="/shop">
              {m.back_to_shop}
            </Link>
          </div>
        </div>
      ) : isConfirmed ? (
        <div className="order-hero-box confirmed">
          <h1 style={{ color: 'var(--olive)' }}>{m.confirmed_title}</h1>
          <p style={{ fontSize: '15px', color: 'var(--ink)' }}>{m.order_number_label}</p>
          <div className="order-code-badge">{o.public_order_code}</div>

          <div className="managed-actions">
            <button type="button" className="button secondary" onClick={copyOrderCode}>
              {copied ? m.copied_btn : m.copy_number_btn}
            </button>
            <Link className="button secondary" href="/order-tracking">
              {m.track_order_btn}
            </Link>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: 'var(--muted)',
              maxWidth: '520px',
              margin: '14px auto 0'
            }}
          >
            {m.confirmed_notice}
          </p>

          {/* EDITABLE NOTICE & COUNTDOWN */}
          {(o.can_modify || o.can_cancel) && remaining > 0 && (
            <div className="countdown-box" role="status">
              <span>⏱️</span>
              <span>
                {m.countdown_text.replace('{time}', formatRemainingTime(remaining, locale))}
              </span>
            </div>
          )}

          {(o.can_modify || o.can_cancel) && (
            <div className="managed-actions" style={{ marginTop: '16px' }}>
              {o.can_modify && (
                <Link className="button secondary" href={editUrl}>
                  {m.btn_modify}
                </Link>
              )}
              {o.can_cancel && (
                <button
                  type="button"
                  className="button secondary button-cancel-trigger"
                  disabled={busy}
                  onClick={() => dialog.current?.showModal()}
                >
                  {m.btn_cancel}
                </button>
              )}
            </div>
          )}

          {!o.can_modify && !o.can_cancel && (
            <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '20px' }}>
              {m.order_locked_notice}{' '}
              {contact && (
                <Link href={contact} style={{ textDecoration: 'underline' }}>
                  {m.contact_support}
                </Link>
              )}
            </p>
          )}
        </div>
      ) : (
        /* PENDING CONFIRMATION STATE */
        <div className="order-prompt-box">
          <h1 className="order-prompt-title">{m.prompt_title}</h1>
          <div className="order-code-badge">{o.public_order_code}</div>

          {o.last_modified_at ? (
            <p className="notice" style={{ margin: '14px 0', textAlign: dir === 'rtl' ? 'right' : 'left' }}>
              {m.prompt_modified_notice}
            </p>
          ) : (
            <p
              style={{
                color: 'var(--muted)',
                fontSize: '14px',
                maxWidth: '540px',
                margin: '10px auto 20px'
              }}
            >
              {m.prompt_desc}
            </p>
          )}

          {/* 3 MAIN ACTIONS PROMINENTLY DISPLAYED */}
          <div className="managed-actions">
            {o.can_confirm && (
              <button
                type="button"
                className="button button-confirm"
                disabled={busy}
                onClick={() => act('confirm')}
              >
                {busy ? m.btn_confirming : m.btn_confirm}
              </button>
            )}
            {o.can_modify && (
              <Link className="button secondary" href={editUrl}>
                {m.btn_modify}
              </Link>
            )}
            {o.can_cancel && (
              <button
                type="button"
                className="button secondary button-cancel-trigger"
                disabled={busy}
                onClick={() => dialog.current?.showModal()}
              >
                {m.btn_cancel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* STATUS BADGES */}
      <div className="order-status-badges" style={{ marginBottom: '24px' }}>
        <span className={`order-badge ${o.confirmation_status}`}>
          {m.status_confirmation_label} : {m.confirmation_statuses[o.confirmation_status] || o.confirmation_status}
        </span>
        <span className={`order-badge ${o.fulfillment_status}`}>
          {m.status_fulfillment_label} : {m.fulfillment_statuses[o.fulfillment_status] || o.fulfillment_status}
        </span>
      </div>

      {error && (
        <div className="error" role="alert" style={{ marginBottom: '20px' }}>
          {error}{' '}
          <button
            type="button"
            onClick={() => location.reload()}
            style={{
              marginLeft: dir === 'rtl' ? 0 : '10px',
              marginRight: dir === 'rtl' ? '10px' : 0,
              textDecoration: 'underline',
              border: 0,
              background: 'none',
              cursor: 'pointer'
            }}
          >
            {locale === 'ar' ? 'تحديث' : 'Actualiser'}
          </button>
        </div>
      )}

      {/* ORDER SUMMARY */}
      <OrderSummary order={o} />

      {/* VISUAL TIMELINE */}
      <OrderTimeline order={o} />

      {/* CANCELLATION DIALOG */}
      <dialog ref={dialog} className="order-dialog" dir={dir}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const reason = String(new FormData(e.currentTarget).get('reason') || '');
            void act('cancel', reason);
          }}
        >
          <h2 style={{ fontSize: '22px', marginBottom: '12px' }}>{m.cancel_modal_title}</h2>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'var(--muted)',
              marginBottom: '18px'
            }}
          >
            {m.cancel_modal_desc}
          </p>

          <label htmlFor="cancel-reason">{m.cancel_modal_reason_label}</label>
          <select name="reason" id="cancel-reason" defaultValue="">
            <option value="">{m.cancel_modal_reason_label}</option>
            {m.cancel_reasons.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          {error && (
            <p className="error" role="alert" style={{ marginTop: '12px' }}>
              {error}
            </p>
          )}

          <div className="managed-actions" style={{ marginTop: '24px' }}>
            <button
              type="button"
              className="button secondary"
              disabled={busy}
              onClick={() => dialog.current?.close()}
            >
              {m.cancel_keep_btn}
            </button>
            <button
              type="submit"
              className="button"
              style={{ background: '#b91c1c', borderColor: '#b91c1c' }}
              disabled={busy}
            >
              {busy ? m.cancel_cancelling : m.cancel_confirm_btn}
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
