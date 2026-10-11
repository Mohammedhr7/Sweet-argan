'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ManagedOrder } from '@/types/order-management';
import { StorefrontImage } from '@/components/storefront-image';
import { money } from '@/utils/money';

interface Choice {
  id: string;
  name: string;
  price: number;
  image: string;
  variants: { id: string; name: string; price: number }[];
}

export function OrderEditor({
  order: o,
  initialToken
}: {
  order: ManagedOrder;
  initialToken?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(o.order_items);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [choices, setChoices] = useState<Choice[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);

  async function search(q: string) {
    setSearching(true);
    setError('');
    try {
      const r = await fetch('/api/order-catalog?q=' + encodeURIComponent(q));
      if (!r.ok) throw new Error();
      setChoices(await r.json());
    } catch {
      setError('Catalogue momentanément indisponible. Réessayez.');
    } finally {
      setSearching(false);
    }
  }

  function add(p: Choice, v?: Choice['variants'][number]) {
    const variantId = v?.id || null;
    const index = items.findIndex(
      (i) => i.product_id === p.id && i.variant_id === variantId
    );

    if (index >= 0) {
      setItems(
        items.map((i, n) =>
          n === index ? { ...i, quantity: Math.min(20, i.quantity + 1) } : i
        )
      );
    } else if (items.length < 30) {
      setItems([
        ...items,
        {
          product_id: p.id,
          variant_id: variantId,
          product_name: p.name + (v ? ' — ' + v.name : ''),
          product_image_url: p.image,
          quantity: 1,
          unit_price: v?.price ?? p.price,
          line_total: v?.price ?? p.price
        }
      ]);
    }
    dialog.current?.close();
  }

  const returnUrl = `/order/${o.public_order_code}/confirmation${
    initialToken ? '?token=' + encodeURIComponent(initialToken) : ''
  }`;

  return (
    <div className="managed-order" lang="fr">
      <div className="eyebrow">SWEET ARGAN · MODIFICATION</div>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Modifier votre commande</h1>
      <div className="order-code-badge" style={{ marginBottom: '16px' }}>
        {o.public_order_code}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
        Vous modifiez directement votre commande existante. Les prix, la disponibilité du stock et les frais de livraison seront vérifiés par le serveur lors de l’enregistrement.
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          const f = new FormData(e.currentTarget);
          try {
            const r = await fetch('/api/order-management', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: o.public_order_code,
                revision: o.revision,
                action: 'modify',
                items: items.map((i) => ({
                  product_id: i.product_id,
                  variant_id: i.variant_id,
                  quantity: i.quantity
                })),
                shipping: {
                  city: f.get('city'),
                  address: f.get('address'),
                  notes: f.get('notes')
                },
                token: initialToken
              })
            });

            const data = await r.json();
            if (!r.ok) throw new Error(data.error);

            router.push(returnUrl);
            router.refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Connexion interrompue. Réessayez.');
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy} style={{ border: 0, padding: 0, minWidth: 0, margin: 0 }}>
          {/* ITEMS SECTION */}
          <section className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Articles de la commande</h2>
              <button
                type="button"
                className="button secondary"
                style={{ padding: '8px 16px', minHeight: '38px', fontSize: '12px' }}
                disabled={items.length >= 30}
                onClick={() => {
                  dialog.current?.showModal();
                  void search('');
                }}
              >
                + Ajouter un produit
              </button>
            </div>

            {items.map((i, n) => (
              <div className="managed-item" key={i.product_id + ':' + (i.variant_id || '')}>
                <StorefrontImage
                  src={i.product_image_url || ''}
                  alt={i.product_name}
                  width={64}
                  height={80}
                  style={{ objectFit: 'contain' }}
                />
                <div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>{i.product_name}</strong>
                  <p style={{ margin: '4px 0 8px', color: 'var(--muted)', fontSize: '13px' }}>
                    {money(i.unit_price)} / unité
                  </p>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      aria-label={'Diminuer ' + i.product_name}
                      disabled={i.quantity <= 1}
                      onClick={() =>
                        setItems(items.map((x, k) => (k === n ? { ...x, quantity: x.quantity - 1 } : x)))
                      }
                    >
                      −
                    </button>
                    <span aria-live="polite" style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}>
                      {i.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={'Augmenter ' + i.product_name}
                      disabled={i.quantity >= 20}
                      onClick={() =>
                        setItems(items.map((x, k) => (k === n ? { ...x, quantity: x.quantity + 1 } : x)))
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      style={{ color: '#b91c1c', border: '1px solid #fecaca', background: '#fff' }}
                      onClick={() => setItems(items.filter((_, k) => k !== n))}
                    >
                      Retirer
                    </button>
                  </div>
                </div>
                <strong style={{ fontSize: '15px' }}>{money(i.unit_price * i.quantity)}</strong>
              </div>
            ))}

            {!items.length && (
              <p role="alert" className="error" style={{ marginTop: '16px' }}>
                Votre commande doit contenir au moins un produit. Ajoutez un produit ou retournez à la commande pour l’annuler.
              </p>
            )}
          </section>

          {/* SHIPPING ADDRESS */}
          <section className="panel">
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Adresse de livraison</h2>
            <label htmlFor="edit-city">Ville de livraison</label>
            <input
              id="edit-city"
              name="city"
              required
              minLength={2}
              maxLength={100}
              defaultValue={o.shipping_city}
            />

            <label htmlFor="edit-address">Adresse complète</label>
            <textarea
              id="edit-address"
              name="address"
              required
              minLength={8}
              maxLength={500}
              defaultValue={o.shipping_address}
            />

            <label htmlFor="edit-notes">Précisions de livraison (facultatif)</label>
            <textarea
              id="edit-notes"
              name="notes"
              maxLength={1000}
              defaultValue={o.shipping_notes || ''}
            />
          </section>

          {/* PROVISIONAL SUMMARY */}
          <section className="panel">
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>Récapitulatif provisoire</h2>
            <div className="summary-line">
              <span>Articles ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <strong>{money(items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0))}</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '10px' }}>
              ℹ️ Le total définitif et les frais de livraison seront recalculés automatiquement par le serveur. Vous pourrez confirmer la nouvelle version sur la page suivante.
            </p>
          </section>

          {error && (
            <div className="error" role="alert" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <div className="managed-actions">
            <button className="button button-confirm" disabled={busy || !items.length}>
              {busy ? 'Enregistrement…' : 'Enregistrer les modifications'}
            </button>
            <Link className="button secondary" href={returnUrl}>
              Retour à la commande
            </Link>
          </div>
        </fieldset>
      </form>

      {/* CATALOG SEARCH DIALOG */}
      <dialog ref={dialog} className="order-dialog">
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Ajouter un produit</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search(String(new FormData(e.currentTarget).get('search') || ''));
          }}
          style={{ marginBottom: '20px' }}
        >
          <label htmlFor="catalog-search">Rechercher par nom</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input name="search" id="catalog-search" maxLength={100} placeholder="ex. Huile d’argan, Savon…" />
            <button className="button secondary" style={{ minWidth: '100px' }} disabled={searching}>
              Rechercher
            </button>
          </div>
        </form>

        {searching ? (
          <p role="status">Chargement du catalogue…</p>
        ) : choices.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '380px', overflowY: 'auto' }}>
            {choices.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#fff',
                  border: '1px solid var(--line)',
                  borderRadius: '4px'
                }}
              >
                <div>
                  <strong>{p.name}</strong>
                  <span style={{ display: 'block', fontSize: '13px', color: 'var(--muted)' }}>
                    {money(p.price)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {p.variants.length > 0 ? (
                    p.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        className="button secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', minHeight: '36px' }}
                        onClick={() => add(p, v)}
                      >
                        {v.name} · {money(v.price)}
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      className="button secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', minHeight: '36px' }}
                      onClick={() => add(p)}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--muted)' }}>Aucun produit trouvé.</p>
        )}

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button
            type="button"
            className="button secondary"
            onClick={() => dialog.current?.close()}
          >
            Fermer
          </button>
        </div>
      </dialog>
    </div>
  );
}
