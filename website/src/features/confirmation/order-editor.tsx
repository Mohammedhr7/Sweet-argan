'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ManagedOrder } from '@/types/order-management';
import { StorefrontImage } from '@/components/storefront-image';
import { money } from '@/utils/money';
import { useLanguage } from '@/features/i18n/language-context';

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
  const { t, locale, dir } = useLanguage();
  const e = t.order_editor;

  const [items, setItems] = useState(o.order_items);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const dialog = useRef<HTMLDialogElement>(null);

  async function loadCatalog(q = '') {
    setSearching(true);
    setError('');
    try {
      const r = await fetch('/api/order-catalog?q=' + encodeURIComponent(q));
      if (!r.ok) throw new Error();
      const data: Choice[] = await r.json();
      setChoices(data);
      setCatalogLoaded(true);
    } catch {
      setError(
        locale === 'ar'
          ? 'تعذر تحميل المنتجات حالياً. يرجى إعادة المحاولة.'
          : 'Catalogue momentanément indisponible. Réessayez.'
      );
    } finally {
      setSearching(false);
    }
  }

  function handleOpenDialog() {
    dialog.current?.showModal();
    if (!catalogLoaded) {
      void loadCatalog('');
    }
  }

  function add(p: Choice, variantId?: string | null) {
    const v = variantId ? p.variants.find((vr) => vr.id === variantId) : null;
    const finalVariantId = v ? v.id : null;
    const index = items.findIndex(
      (item) => item.product_id === p.id && item.variant_id === finalVariantId
    );

    if (index >= 0) {
      setItems(
        items.map((item, n) =>
          n === index ? { ...item, quantity: Math.min(20, item.quantity + 1) } : item
        )
      );
    } else if (items.length < 30) {
      const unitPrice = v ? v.price : p.price;
      setItems([
        ...items,
        {
          product_id: p.id,
          variant_id: finalVariantId,
          product_name: p.name + (v ? ' — ' + v.name : ''),
          product_image_url: p.image,
          quantity: 1,
          unit_price: unitPrice,
          line_total: unitPrice
        }
      ]);
    }
    dialog.current?.close();
  }

  const filteredChoices = choices.filter((p) =>
    searchQuery.trim() === ''
      ? true
      : p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const returnUrl = `/order/${o.public_order_code}/confirmation${
    initialToken ? '?token=' + encodeURIComponent(initialToken) : ''
  }`;

  return (
    <div className="managed-order" lang={locale} dir={dir}>
      <div className="eyebrow">{e.eyebrow}</div>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{e.title}</h1>
      <div className="order-code-badge" style={{ marginBottom: '16px' }}>
        {o.public_order_code}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '24px' }}>
        {e.subtitle}
      </p>

      <form
        onSubmit={async (evt) => {
          evt.preventDefault();
          setBusy(true);
          setError('');
          const f = new FormData(evt.currentTarget);
          try {
            const r = await fetch('/api/order-management', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: o.public_order_code,
                revision: o.revision,
                action: 'modify',
                items: items.map((item) => ({
                  product_id: item.product_id,
                  variant_id: item.variant_id,
                  quantity: item.quantity
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
          } catch (err) {
            setError(
              err instanceof Error
                ? err.message
                : locale === 'ar'
                ? 'تعذر حفظ التعديلات. يرجى إعادة المحاولة.'
                : 'Connexion interrompue. Réessayez.'
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <fieldset disabled={busy} style={{ border: 0, padding: 0, minWidth: 0, margin: 0 }}>
          {/* ITEMS SECTION */}
          <section className="panel">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <h2 style={{ fontSize: '20px', margin: 0 }}>{e.items_title}</h2>
              <button
                type="button"
                className="button secondary"
                style={{ padding: '8px 16px', minHeight: '38px', fontSize: '13px' }}
                disabled={items.length >= 30}
                onClick={handleOpenDialog}
              >
                {e.add_product_btn}
              </button>
            </div>

            {items.map((item, n) => (
              <div
                className="managed-item"
                key={item.product_id + ':' + (item.variant_id || '')}
              >
                <StorefrontImage
                  src={item.product_image_url || ''}
                  alt={item.product_name}
                  width={64}
                  height={80}
                  style={{ objectFit: 'contain' }}
                />
                <div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>
                    {item.product_name}
                  </strong>
                  <p style={{ margin: '4px 0 8px', color: 'var(--muted)', fontSize: '13px' }}>
                    {money(item.unit_price)} {e.per_unit}
                  </p>
                  <div className="quantity-controls">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        setItems(
                          items.map((x, k) =>
                            k === n ? { ...x, quantity: x.quantity - 1 } : x
                          )
                        )
                      }
                    >
                      −
                    </button>
                    <span
                      aria-live="polite"
                      style={{ minWidth: '24px', textAlign: 'center', fontWeight: 600 }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={item.quantity >= 20}
                      onClick={() =>
                        setItems(
                          items.map((x, k) =>
                            k === n ? { ...x, quantity: x.quantity + 1 } : x
                          )
                        )
                      }
                    >
                      +
                    </button>
                    <button
                      type="button"
                      style={{
                        color: '#b91c1c',
                        border: '1px solid #fecaca',
                        background: '#fff',
                        marginLeft: dir === 'rtl' ? 0 : '8px',
                        marginRight: dir === 'rtl' ? '8px' : 0
                      }}
                      onClick={() => setItems(items.filter((_, k) => k !== n))}
                    >
                      {e.remove_item}
                    </button>
                  </div>
                </div>
                <strong style={{ fontSize: '15px' }}>
                  {money(item.unit_price * item.quantity)}
                </strong>
              </div>
            ))}

            {!items.length && (
              <p role="alert" className="error" style={{ marginTop: '16px' }}>
                {e.empty_items_error}
              </p>
            )}
          </section>

          {/* SHIPPING ADDRESS */}
          <section className="panel">
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>{e.delivery_title}</h2>
            <label htmlFor="edit-city">{e.city_label}</label>
            <input
              id="edit-city"
              name="city"
              required
              minLength={2}
              maxLength={100}
              defaultValue={o.shipping_city}
            />

            <label htmlFor="edit-address">{e.address_label}</label>
            <textarea
              id="edit-address"
              name="address"
              required
              minLength={2}
              maxLength={500}
              defaultValue={o.shipping_address}
            />

            <label htmlFor="edit-notes">{e.notes_label}</label>
            <textarea
              id="edit-notes"
              name="notes"
              maxLength={1000}
              placeholder={e.notes_placeholder}
              defaultValue={o.shipping_notes || ''}
            />
          </section>

          {/* PROVISIONAL SUMMARY */}
          <section className="panel">
            <h2 style={{ fontSize: '20px', marginBottom: '12px' }}>{e.provisional_title}</h2>
            <div className="summary-line">
              <span>
                {e.articles_count} ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </span>
              <strong>
                {money(
                  items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
                )}
              </strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '10px' }}>
              {e.provisional_notice}
            </p>
          </section>

          {error && (
            <div className="error" role="alert" style={{ marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <div className="managed-actions">
            <button className="button button-confirm" disabled={busy || !items.length}>
              {busy ? e.saving_btn : e.save_btn}
            </button>
            <Link className="button secondary" href={returnUrl}>
              {e.back_to_order_btn}
            </Link>
          </div>
        </fieldset>
      </form>

      {/* RICH VISUAL CATALOG SELECTION DIALOG */}
      <dialog
        ref={dialog}
        className="order-dialog"
        dir={dir}
        style={{ maxWidth: '640px', width: '92vw', padding: '24px' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <h2 style={{ fontSize: '22px', margin: 0 }}>{e.modal_title}</h2>
          <button
            type="button"
            className="text-button"
            onClick={() => dialog.current?.close()}
            style={{ fontSize: '18px', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {/* Live Search Input */}
        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="catalog-search" style={{ fontSize: '13px', fontWeight: 600 }}>
            {e.modal_search_label}
          </label>
          <input
            id="catalog-search"
            value={searchQuery}
            onChange={(evt) => setSearchQuery(evt.target.value)}
            placeholder={e.modal_search_placeholder}
            style={{ width: '100%', boxSizing: 'border-box', marginTop: '6px' }}
          />
        </div>

        {searching ? (
          <p role="status" style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
            {e.modal_loading}
          </p>
        ) : filteredChoices.length > 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '440px',
              overflowY: 'auto',
              paddingRight: dir === 'rtl' ? 0 : '4px',
              paddingLeft: dir === 'rtl' ? '4px' : 0
            }}
          >
            {filteredChoices.map((p) => {
              const activeVariantId = selectedVariants[p.id] || (p.variants[0]?.id ?? '');
              const activeVariant = p.variants.find((v) => v.id === activeVariantId);
              const displayPrice = activeVariant ? activeVariant.price : p.price;

              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px',
                    background: '#fff',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <StorefrontImage
                    src={p.image}
                    alt={p.name}
                    width={72}
                    height={88}
                    style={{
                      objectFit: 'contain',
                      borderRadius: '6px',
                      background: '#fcfaf6',
                      flexShrink: 0
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '15px',
                        marginBottom: '4px',
                        color: 'var(--ink)'
                      }}
                    >
                      {p.name}
                    </strong>
                    <div style={{ fontSize: '14px', color: 'var(--olive)', fontWeight: 600 }}>
                      {money(displayPrice)}
                    </div>

                    {p.variants.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          flexWrap: 'wrap',
                          marginTop: '8px'
                        }}
                      >
                        {p.variants.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            className={`badge ${activeVariantId === v.id ? 'confirmed' : 'pending'}`}
                            style={{
                              cursor: 'pointer',
                              border: activeVariantId === v.id ? '1px solid var(--olive)' : '1px solid var(--line)',
                              background: activeVariantId === v.id ? 'var(--olive)' : '#fff',
                              color: activeVariantId === v.id ? '#fff' : 'var(--ink)',
                              padding: '3px 8px',
                              fontSize: '11px',
                              borderRadius: '4px'
                            }}
                            onClick={() =>
                              setSelectedVariants({ ...selectedVariants, [p.id]: v.id })
                            }
                          >
                            {v.name} ({money(v.price)})
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="button secondary"
                    style={{
                      padding: '8px 14px',
                      fontSize: '13px',
                      minHeight: '38px',
                      flexShrink: 0
                    }}
                    onClick={() => add(p, p.variants.length ? activeVariantId : null)}
                  >
                    + {e.modal_add_btn}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p
            style={{
              color: 'var(--muted)',
              textAlign: 'center',
              padding: '30px'
            }}
          >
            {e.modal_no_products}
          </p>
        )}

        <div style={{ marginTop: '20px', textAlign: dir === 'rtl' ? 'left' : 'right' }}>
          <button
            type="button"
            className="button secondary"
            onClick={() => dialog.current?.close()}
          >
            {e.modal_close_btn}
          </button>
        </div>
      </dialog>
    </div>
  );
}
