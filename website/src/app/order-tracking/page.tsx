'use client';

import { useState } from 'react';
import type { ManagedOrder } from '@/types/order-management';
import { ManagedOrderPanel } from '@/features/confirmation/managed-order';
import { useLanguage } from '@/features/i18n/language-context';

export default function Tracking() {
  const { t, locale, dir } = useLanguage();
  const tr = t.tracking_page;

  const [order, setOrder] = useState<ManagedOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <main className="container section" lang={locale} dir={dir}>
      <div className="narrow">
        <div className="eyebrow">{tr.eyebrow}</div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{tr.title}</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '28px' }}>
          {tr.subtitle}
        </p>

        <form
          className="panel"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError('');
            setOrder(null);
            const f = new FormData(e.currentTarget);
            try {
              const r = await fetch('/api/tracking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  code: String(f.get('code')).trim().toUpperCase(),
                  phone: f.get('phone')
                })
              });
              const data = await r.json();
              if (!r.ok) throw new Error(data.error);
              setOrder(data);
            } catch (err) {
              setError(
                err instanceof Error
                  ? err.message
                  : tr.error_fallback
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label htmlFor="code">{tr.code_label}</label>
          <input
            id="code"
            name="code"
            placeholder={tr.code_placeholder}
            required
            maxLength={30}
            style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
          />

          <label htmlFor="phone" style={{ marginTop: '16px' }}>
            {tr.phone_label}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={tr.phone_placeholder}
            required
            maxLength={30}
          />

          {error && (
            <div className="error" role="alert" style={{ marginTop: '16px' }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <button className="button" disabled={busy} style={{ width: '100%' }}>
              {busy ? tr.submitting_btn : tr.submit_btn}
            </button>
          </div>
        </form>

        {order && (
          <div style={{ marginTop: '40px' }}>
            <ManagedOrderPanel key={order.server_now} order={order} />
          </div>
        )}
      </div>
    </main>
  );
}
