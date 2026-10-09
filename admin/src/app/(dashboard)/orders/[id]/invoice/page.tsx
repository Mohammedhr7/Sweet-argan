import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOrder } from '@/services/orders';
import { money } from '@/utils/money';
import { Printer, ArrowLeft } from 'lucide-react';
import { PrintButton } from './print-button';

export const dynamic = 'force-dynamic';

export default async function OrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { order: o } = await getOrder(id);

  if (!o) {
    notFound();
  }

  const orderDate = new Date(o.created_at).toLocaleDateString('fr-MA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Africa/Casablanca',
  });

  const orderTime = new Date(o.created_at).toLocaleTimeString('fr-MA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Casablanca',
  });

  return (
    <div className="invoice-container min-h-screen bg-neutral-100 py-8 px-4 text-neutral-900 print:bg-white print:p-0">
      {/* Top action toolbar - hidden when printing */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href={`/orders/${o.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 bg-white px-4 py-2 rounded-lg border border-neutral-200 shadow-xs"
        >
          <ArrowLeft size={16} />
          <span>الرجوع إلى تفاصيل الطلب / Retour à la commande</span>
        </Link>
        <div className="flex items-center gap-3">
          <PrintButton />
        </div>
      </div>

      {/* Main Invoice Card (A4 format) */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-neutral-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-8 print:max-w-none">
        {/* Cooperative & Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b-2 border-neutral-800 gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-tight text-brand-primary">Sweet Argan</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold mt-1">
              Coopérative Agricole & Terroir Marocain
            </p>
            <div className="text-xs text-neutral-600 mt-2 space-y-0.5 leading-relaxed">
              <p>Région du Souss-Massa · Agadir & Taroudant, Maroc</p>
              <p>Tél : +212 661-840652 / +212 661-983329</p>
              <p>E-mail : contact@sweetargan.com · www.sweetargan.com</p>
              <p className="text-[11px] text-neutral-400">Patente N° 48921004 · RC 29482 · IF 38920194</p>
            </div>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto bg-amber-50/60 p-4 rounded-lg border border-amber-200/80 print:bg-transparent print:border-neutral-300 print:p-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded print:text-neutral-900 print:bg-transparent">
              FACTURE & BON DE LIVRAISON
            </span>
            <h1 className="text-2xl font-bold text-neutral-900 mt-2 font-mono">{o.public_order_code}</h1>
            <p className="text-xs text-neutral-600 mt-1">
              Date : <span className="font-semibold text-neutral-900">{orderDate}</span> à {orderTime}
            </p>
            <div className="mt-2 text-xs">
              <span className="text-neutral-500">Paiement : </span>
              <span className="font-semibold text-emerald-800">
                {o.payment_method === 'cash_on_delivery'
                  ? 'Espèces à la livraison (COD)'
                  : o.payment_method}
              </span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-neutral-200 text-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Client & Destinataire / العميل
            </span>
            <div className="mt-2 text-neutral-900 space-y-1">
              <p className="text-base font-bold">{o.customer_name}</p>
              <p className="font-mono text-neutral-700">Tél : {o.customer_phone}</p>
              {o.customer_email && <p className="text-neutral-500 text-xs">Email : {o.customer_email}</p>}
            </div>
          </div>

          <div className="md:border-l md:border-neutral-200 md:pl-8">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Adresse de livraison / عنوان التسليم
            </span>
            <div className="mt-2 text-neutral-900 space-y-1">
              <p className="font-semibold text-neutral-800">
                Ville : <span className="text-base font-bold text-neutral-900">{o.shipping_city}</span>
              </p>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{o.shipping_address}</p>
              {o.shipping_notes && (
                <div className="mt-2 text-xs bg-neutral-50 p-2 rounded border border-neutral-200 text-neutral-600">
                  <span className="font-semibold">Note pour le livreur : </span>
                  {o.shipping_notes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="py-8 border-b border-neutral-200">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-neutral-300 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                <th className="py-3 pr-4">Désignation du soin</th>
                <th className="py-3 px-3 text-center">Réf / SKU</th>
                <th className="py-3 px-3 text-center">Qté</th>
                <th className="py-3 px-3 text-right">Prix Unitaire</th>
                <th className="py-3 pl-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {o.order_items.map((it, idx) => (
                <tr key={it.id || idx} className="hover:bg-neutral-50/50">
                  <td className="py-3.5 pr-4">
                    <span className="font-medium text-neutral-900">{it.product_name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center text-xs font-mono text-neutral-500">
                    {it.product_sku || '—'}
                  </td>
                  <td className="py-3.5 px-3 text-center font-bold text-neutral-900">
                    {it.quantity}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-neutral-700">
                    {money(it.unit_price)}
                  </td>
                  <td className="py-3.5 pl-3 text-right font-mono font-semibold text-neutral-900">
                    {money(it.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="py-6 flex justify-end">
          <div className="w-full sm:w-72 space-y-2 text-sm">
            <div className="flex justify-between py-1 text-neutral-600">
              <span>Sous-total</span>
              <span className="font-mono font-medium">{money(o.subtotal)}</span>
            </div>
            <div className="flex justify-between py-1 text-neutral-600">
              <span>Frais de livraison</span>
              <span className="font-mono font-medium">
                {Number(o.shipping_amount) === 0 ? 'Offerte (مجاناً)' : money(o.shipping_amount)}
              </span>
            </div>
            {Number(o.discount_amount) > 0 && (
              <div className="flex justify-between py-1 text-emerald-700">
                <span>Remise</span>
                <span className="font-mono font-medium">- {money(o.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-neutral-900 text-base font-bold text-neutral-900 bg-amber-50/80 px-3 rounded print:bg-transparent">
              <span>TOTAL À PAYER</span>
              <span className="font-mono text-xl text-amber-950 font-black">
                {money(o.total)}
              </span>
            </div>
            <p className="text-[11px] text-right text-neutral-500 italic mt-1">
              Montant net à encaisser en espèces par le livreur
            </p>
          </div>
        </div>

        {/* Delivery Slip Signatures & Legal Footer */}
        <div className="mt-8 pt-8 border-t border-dashed border-neutral-300">
          <div className="grid grid-cols-2 gap-8 text-xs text-neutral-600">
            <div className="border border-neutral-200 rounded p-4 h-28 flex flex-col justify-between">
              <span className="font-semibold text-neutral-700">Cachet & Signature du livreur :</span>
              <span className="text-[10px] text-neutral-400">Date de livraison : ____ / ____ / 2026</span>
            </div>
            <div className="border border-neutral-200 rounded p-4 h-28 flex flex-col justify-between text-right">
              <span className="font-semibold text-neutral-700">إمضاء وتأكيد استلام الزبون / Signature client :</span>
              <span className="text-[10px] text-neutral-400">توقيع المستلم : ________________________</span>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-neutral-400 space-y-1">
            <p className="font-medium text-neutral-600">
              شكراً لثقتكم في تعاونية سويت أرغان لمنتجات التجميل الطبيعية.
            </p>
            <p>
              Merci de votre confiance en Sweet Argan. Pour toute assistance : WhatsApp +212 661-983329.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
