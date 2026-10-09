'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Order } from '@/types/commerce';
import { money } from '@/utils/money';
import { StatusBadge } from '@/components/status-badge';
import { bulkProcess, deleteOrder, bulkDeleteOrders } from './actions';
import { useAdminLanguage } from '@/features/i18n/language-context';
import { Printer, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export function OrderTable({
  orders,
  bulk = false,
}: {
  orders: Order[];
  bulk?: boolean;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmProcess, setConfirmProcess] = useState(false);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const { t, locale } = useAdminLanguage();

  const handleSingleDelete = async () => {
    if (!orderToDelete) return;
    setBusy(true);
    setMessage('');
    try {
      const res = await deleteOrder(orderToDelete.id);
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage(
          locale === 'ar'
            ? `✓ تم حذف الطلب ${orderToDelete.public_order_code} بنجاح.`
            : `✓ Commande ${orderToDelete.public_order_code} supprimée avec succès.`
        );
      }
    } catch {
      setMessage(locale === 'ar' ? 'فشل حذف الطلب.' : 'Échec de la suppression.');
    } finally {
      setBusy(false);
      setOrderToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    setBusy(true);
    setMessage('');
    try {
      const res = await bulkDeleteOrders(ids);
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage(
          locale === 'ar'
            ? `✓ تم حذف ${res.count} طلب(طلبات) بنجاح.`
            : `✓ ${res.count} commande(s) supprimée(s) avec succès.`
        );
        setIds([]);
      }
    } catch {
      setMessage(locale === 'ar' ? 'فشل الحذف الجماعي.' : 'Échec de la suppression groupée.');
    } finally {
      setBusy(false);
      setConfirmBulkDelete(false);
    }
  };

  return (
    <>
      {bulk && ids.length > 0 && (
        <div className="bulk-bar flex flex-wrap items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3">
          <span className="font-semibold text-xs text-neutral-800">
            {ids.length} {locale === 'ar' ? 'محددة' : 'sélectionnée(s)'}
          </span>

          <button
            type="button"
            className="button small"
            disabled={busy}
            onClick={() => setConfirmProcess(true)}
          >
            {locale === 'ar' ? 'وضع في قيد التحضير' : 'Mettre en préparation'}
          </button>

          <button
            type="button"
            className="button secondary small text-rose-700 border-rose-300 hover:bg-rose-50"
            disabled={busy}
            onClick={() => setConfirmBulkDelete(true)}
          >
            <Trash2 size={13} className="inline mr-1" />
            <span>{locale === 'ar' ? 'حذف المحدد' : 'Supprimer la sélection'}</span>
          </button>

          {confirmProcess && (
            <div role="alert" className="inline-flex items-center gap-2 text-xs">
              <span>
                {locale === 'ar'
                  ? 'تأكيد تجهيز الطلبات المحددة؟'
                  : 'Appliquer aux commandes sélectionnées ?'}
              </span>
              <button
                type="button"
                className="button small"
                disabled={busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    const r = await bulkProcess(ids);
                    setMessage(r.error || r.message || 'Terminé');
                    setIds([]);
                  } catch {
                    setMessage('Action impossible.');
                  } finally {
                    setBusy(false);
                    setConfirmProcess(false);
                  }
                }}
              >
                {locale === 'ar' ? 'نعم' : 'Confirmer'}
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setConfirmProcess(false)}
              >
                {locale === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          )}

          {confirmBulkDelete && (
            <div role="alert" className="inline-flex items-center gap-2 text-xs bg-rose-100 p-1.5 rounded">
              <span className="text-rose-900 font-semibold">
                {locale === 'ar'
                  ? `حذف ${ids.length} طلب نهائياً؟`
                  : `Supprimer ${ids.length} commande(s) définitivement ?`}
              </span>
              <button
                type="button"
                className="button small bg-rose-700 text-white"
                disabled={busy}
                onClick={handleBulkDelete}
              >
                {locale === 'ar' ? 'تأكيد الحذف' : 'Confirmer'}
              </button>
              <button
                type="button"
                className="text-button"
                onClick={() => setConfirmBulkDelete(false)}
              >
                {locale === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
            </div>
          )}
        </div>
      )}

      {message && (
        <p role="status" className="notice mb-3 p-2 rounded text-xs bg-amber-50 border border-amber-200">
          {message}
        </p>
      )}

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              {bulk && <th className="w-8">اختيار</th>}
              <th>{locale === 'ar' ? 'رقم الطلب' : 'Commande'}</th>
              <th>{locale === 'ar' ? 'الزبون' : 'Client'}</th>
              <th>{locale === 'ar' ? 'المدينة' : 'Ville'}</th>
              <th>{locale === 'ar' ? 'المبلغ' : 'Montant'}</th>
              <th>{locale === 'ar' ? 'التأكيد' : 'Confirmation'}</th>
              <th>{locale === 'ar' ? 'حالة التوصيل' : 'Livraison'}</th>
              <th>{locale === 'ar' ? 'التاريخ' : 'Date'}</th>
              <th className="text-right">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                {bulk && (
                  <td>
                    <input
                      type="checkbox"
                      aria-label={'Sélectionner ' + o.public_order_code}
                      checked={ids.includes(o.id)}
                      onChange={(e) =>
                        setIds(
                          e.target.checked
                            ? [...ids, o.id]
                            : ids.filter((id) => id !== o.id)
                        )
                      }
                    />
                  </td>
                )}
                <td>
                  <Link className="order-link font-mono font-bold" href={'/orders/' + o.id}>
                    {o.public_order_code}
                  </Link>
                </td>
                <td>
                  <div className="font-medium">{o.customer_name}</div>
                  <small className="font-mono text-neutral-500">{o.customer_phone}</small>
                </td>
                <td>{o.shipping_city}</td>
                <td className="nowrap font-bold text-neutral-900">{money(o.total)}</td>
                <td>
                  <StatusBadge status={o.confirmation_status} />
                </td>
                <td>
                  <StatusBadge status={o.fulfillment_status} type="fulfillment" />
                </td>
                <td className="muted nowrap">
                  {new Date(o.created_at).toLocaleDateString('fr-MA', {
                    timeZone: 'Africa/Casablanca',
                  })}
                </td>
                <td className="text-right nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    <Link
                      href={`/orders/${o.id}/invoice`}
                      className="p-1.5 text-neutral-600 hover:text-amber-800 hover:bg-amber-50 rounded"
                      title={locale === 'ar' ? 'طباعة الفاتورة' : 'Imprimer la facture'}
                    >
                      <Printer size={15} />
                    </Link>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setOrderToDelete(o)}
                      className="p-1.5 text-neutral-400 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                      title={locale === 'ar' ? 'حذف الطلب' : 'Supprimer'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!orders.length && (
          <div className="empty-state p-8 text-center text-neutral-500">
            <h3 className="font-semibold text-base mb-1">
              {locale === 'ar' ? 'لا توجد طلبات في هذه القائمة.' : 'Aucune commande pour le moment.'}
            </h3>
            <p className="text-xs">
              {locale === 'ar' ? 'ستظهر الطلبات الجديدة هنا فور تسجيلها.' : 'Les nouvelles commandes apparaîtront ici.'}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-700">
              <div className="p-2 bg-rose-100 rounded-full">
                <AlertTriangle size={24} />
              </div>
              <h4 className="font-bold text-lg text-neutral-900 m-0">
                {locale === 'ar' ? 'تأكيد حذف الطلب' : 'Confirmer la suppression'}
              </h4>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {locale === 'ar'
                ? `هل تريد بالتأكيد حذف الطلب ${orderToDelete.public_order_code} من قاعدة البيانات؟`
                : `Voulez-vous supprimer définitivement la commande ${orderToDelete.public_order_code} ?`}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                disabled={busy}
              >
                {locale === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleSingleDelete}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-rose-700 text-white hover:bg-rose-800 disabled:opacity-50"
                disabled={busy}
              >
                {busy ? (locale === 'ar' ? 'جاري الحذف...' : 'Suppression...') : (locale === 'ar' ? 'نعم، حذف' : 'Supprimer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
