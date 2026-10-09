import {DeliveryOverride} from '@/features/orders/delivery-override';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrder } from '@/services/orders';
import { OrderControls } from '@/features/orders/order-controls';
import { StatusBadge } from '@/components/status-badge';
import { money } from '@/utils/money';
import { Printer, ArrowRight, ArrowLeft } from 'lucide-react';

export default async function OrderDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { order: o, history, confirmations,changes,editable } = await getOrder(id);

  if (!o) {
    notFound();
  }

  const dateFormatted = new Date(o.created_at).toLocaleString('fr-MA', {
    timeZone: 'Africa/Casablanca',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Link href="/orders" className="text-button inline-flex items-center gap-1">
          <span>← كل الطلبات / Toutes les commandes</span>
        </Link>
        <Link
          href={`/orders/${o.id}/invoice`}
          className="button secondary small inline-flex items-center gap-1.5"
        >
          <Printer size={15} />
          <span>طباعة الفاتورة / Imprimer facture</span>
        </Link>
      </div>

      <div className="page-title">
        <div>
          <h1>{o.public_order_code}</h1>
          <p>{dateFormatted}</p>
        </div>
        <div className="inline flex gap-2">
          <StatusBadge status={o.confirmation_status} />
          <StatusBadge status={o.fulfillment_status} type="fulfillment" />
        </div>
      </div>

      <div className="detail-grid">
        <div>
          {/* Order Items */}
          <section className="card">
            <h2>المنتجات المطلوبة / Produits commandés</h2>
            {o.order_items.map((i) => (
              <div className="order-item" key={i.id}>
                <Image
                  src={i.product_image_url || '/assets/brand/creams.jpg'}
                  alt={i.product_name}
                  width={60}
                  height={70}
                  className="rounded-md object-cover"
                />
                <div>
                  <strong>{i.product_name}</strong>
                  <small>
                    {i.product_sku ? `${i.product_sku} · ` : ''}
                    {i.quantity} × {money(i.unit_price)}
                  </small>
                </div>
                <strong>{money(i.line_total)}</strong>
              </div>
            ))}

            {[
              ['المجموع الفرعي / Sous-total', o.subtotal],
              ['مصاريف التوصيل / Livraison', o.shipping_amount],
              ['الخصم / Remise', -o.discount_amount],
              ['المجموع الكلي / Total', o.total],
            ].map(([label, value]) => (
              <div className="summary-line" key={label as string}>
                <span>{label}</span>
                <strong>{money(Number(value))}</strong>
              </div>
            ))}
            <p className="mt-3 text-xs text-neutral-500">
              الدفع عند الاستلام (COD) · حالة الأداء : {o.payment_status}
            </p>
          </section>

          {/* Customer Confirmation Timeline */}
          <section className="card">
            <h2>تأكيد الزبون / Confirmation client</h2>
            <p>
              طريقة التأكيد : {o.confirmation_method || 'في انتظار التأكيد / En attente'}
            </p>
            {o.confirmed_at && (
              <p className="text-emerald-700 font-medium">
                تم التأكيد في{' '}
                {new Date(o.confirmed_at).toLocaleString('fr-MA', {
                  timeZone: 'Africa/Casablanca',
                })}
              </p>
            )}
            {confirmations.map((e) => (
              <div className="timeline-item" key={e.id}>
                <strong>{e.event_type}</strong>
                <p>{e.message || '—'}</p>
                <small>
                  {new Date(e.created_at).toLocaleString('fr-MA', {
                    timeZone: 'Africa/Casablanca',
                  })}
                </small>
              </div>
            ))}
          </section>

          {/* History & Internal Notes */}
          <section className="card">
            <h2>السجل والملاحظات / Historique & notes</h2>
            {history.map((e) => (
              <div className="timeline-item" key={e.id}>
                <strong>
                  {e.status_type === 'note'
                    ? 'ملاحظة داخلية / Note interne'
                    : `${e.status_type} · ${e.old_status || 'Création'} → ${e.new_status}`}
                </strong>
                {e.note && <p>{e.note}</p>}
                <small>
                  {new Date(e.created_at).toLocaleString('fr-MA', {
                    timeZone: 'Africa/Casablanca',
                  })}{' '}
                  {e.changed_by ? '· فريق العمل' : ''}
                </small>
              </div>
            ))}
          </section>
        </div>

        <aside>
<section className="card"><h2>Modifications client</h2><p>{editable?'Le client peut encore modifier cette commande.':'La fenêtre de modification client est fermée.'}</p>{[['Limite',o.editable_until],['Dernière modification',o.last_modified_at],['Annulation',o.cancelled_at]].map(([label,value])=><p key={label}>{label} : {value?new Date(value).toLocaleString('fr-MA'):'—'}</p>)}{o.cancellation_reason&&<p>Motif : {o.cancellation_reason}</p>}</section>
<section className="card"><h2>Historique des modifications</h2>{changes.map(e=><details key={e.id}><summary>{new Date(e.created_at).toLocaleString('fr-MA')} · {e.change_type}{e.actor_id?' · Équipe':' · Client'}</summary>{e.before_data&&<pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>Avant : {JSON.stringify(e.before_data,null,2)}</pre>}{e.after_data&&<pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere'}}>Après : {JSON.stringify(e.after_data,null,2)}</pre>}</details>)}</section>
<DeliveryOverride id={o.id} city={o.shipping_city} address={o.shipping_address} notes={o.shipping_notes}/>
          {/* Customer & Shipping info */}
          <section className="card">
            <h2>الزبون وعنوان التسليم / Client & livraison</h2>
            <Link className="order-link font-bold text-base" href={'/customers/' + o.customer_id}>
              {o.customer_name}
            </Link>
            <p className="font-mono text-sm">
              {o.customer_phone}
              {o.customer_email && (
                <>
                  <br />
                  <span className="text-neutral-500">{o.customer_email}</span>
                </>
              )}
            </p>
            <h3 className="mt-3 font-semibold text-neutral-800">{o.shipping_city}</h3>
            <p className="text-neutral-600 text-sm whitespace-pre-line">{o.shipping_address}</p>
            {o.shipping_notes && (
              <div className="notice mt-3">
                <span className="font-bold">ملاحظة التوصيل : </span>
                {o.shipping_notes}
              </div>
            )}
          </section>

          {/* Status Controls, Invoice, and Delete */}
          <OrderControls order={o} />
        </aside>
      </div>
    </>
  );
}

