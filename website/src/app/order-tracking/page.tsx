'use client';

import { useState } from 'react';
import type { ManagedOrder } from '@/types/order-management';
import { ManagedOrderPanel } from '@/features/confirmation/managed-order';

export default function Tracking() {
  const [order, setOrder] = useState<ManagedOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  return (
    <main className="container section">
      <div className="narrow">
        <div className="eyebrow">SWEET ARGAN · ESPACE CLIENT</div>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Suivre ma commande</h1>
        <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '28px' }}>
          Consultez l’état d’avancement de votre commande, confirmez-la ou modifiez-la en saisissant votre numéro public de commande et votre numéro de téléphone.
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
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Service momentanément indisponible. Réessayez.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <label htmlFor="code">Numéro de commande (ex: SA-2026-00000001)</label>
          <input
            id="code"
            name="code"
            placeholder="SA-2026-00000001"
            required
            maxLength={30}
            style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
          />

          <label htmlFor="phone" style={{ marginTop: '16px' }}>
            Numéro de téléphone utilisé lors de la commande
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="06 61 98 33 29"
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
              {busy ? 'Recherche en cours…' : 'Retrouver ma commande'}
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
