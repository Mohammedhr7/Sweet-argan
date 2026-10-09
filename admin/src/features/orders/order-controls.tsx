'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Order } from '@/types/commerce';
import { updateOrder, deleteOrder } from './actions';
import { useAdminLanguage } from '@/features/i18n/language-context';
import {
  Printer,
  Trash2,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  RotateCcw,
  XCircle,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export function OrderControls({ order: o }: { order: Order }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const { t, locale } = useAdminLanguage();

  async function handleUpdate(action: 'confirm' | 'status' | 'confirmation_status' | 'note', value = '') {
    setBusy(true);
    setMessage('');
    try {
      const res = await updateOrder({ id: o.id, action, value });
      if (res.error) {
        setMessage(res.error);
      } else {
        setMessage(
          locale === 'ar'
            ? '✓ تم حفظ التعديل بنجاح!'
            : locale === 'fr'
            ? '✓ Modification enregistrée avec succès !'
            : '✓ Status updated successfully!'
        );
        router.refresh();
      }
    } catch {
      setMessage(
        locale === 'ar'
          ? 'حدث خطأ أثناء التحديث. يرجى المحاولة ثانية.'
          : 'Action impossible. Réessayez.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setMessage('');
    try {
      const res = await deleteOrder(o.id);
      if (res.error) {
        setMessage(res.error);
        setBusy(false);
      } else {
        // Redirect back to orders list
        router.push('/orders');
      }
    } catch {
      setMessage(locale === 'ar' ? 'تعذر حذف الطلب.' : 'Échec de la suppression.');
      setBusy(false);
    }
  }

  return (
    <>
      {/* Quick Action Box */}
      <section className="card space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base text-neutral-900 m-0">
            {locale === 'ar' ? 'إدارة حالة الطلب' : locale === 'fr' ? 'Gestion du statut' : 'Order Status Management'}
          </h3>
          <Link
            href={`/orders/${o.id}/invoice`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-amber-100/80 text-amber-950 px-3 py-1.5 rounded-md hover:bg-amber-200 transition-colors"
          >
            <Printer size={14} />
            <span>{locale === 'ar' ? 'طباعة الفاتورة' : locale === 'fr' ? 'Imprimer la facture' : 'Print Invoice'}</span>
          </Link>
        </div>

        {/* 1-Click Confirmation Control */}
        <div>
          <label className="text-xs font-semibold text-neutral-500 block mb-1.5">
            {locale === 'ar' ? 'حالة التأكيد' : locale === 'fr' ? 'Confirmation client' : 'Customer Confirmation'}
          </label>
          <div className="flex flex-wrap gap-2">
            {o.confirmation_status !== 'confirmed' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => handleUpdate('confirm')}
                className="inline-flex items-center gap-1.5 bg-emerald-700 text-white font-semibold text-xs px-3 py-2 rounded-lg hover:bg-emerald-800 disabled:opacity-50 transition-all cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>{locale === 'ar' ? 'تأكيد الطلب الآن' : locale === 'fr' ? 'Confirmer la commande' : 'Confirm Order'}</span>
              </button>
            )}
            {o.confirmation_status !== 'pending' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => handleUpdate('confirmation_status', 'pending')}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                <Clock size={12} />
                <span>{locale === 'ar' ? 'قيد الانتظار' : 'En attente'}</span>
              </button>
            )}
            {o.confirmation_status !== 'needs_review' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => handleUpdate('confirmation_status', 'needs_review')}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                <AlertTriangle size={12} />
                <span>{locale === 'ar' ? 'بحاجة لمراجعة' : 'À vérifier'}</span>
              </button>
            )}
          </div>
        </div>

        {/* 1-Click Fulfillment Progression */}
        <div className="pt-2 border-t border-neutral-100">
          <label className="text-xs font-semibold text-neutral-500 block mb-2">
            {locale === 'ar' ? 'مراحل التوصيل والشحن' : locale === 'fr' ? 'Étapes de livraison' : 'Delivery Stages'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy || o.fulfillment_status === 'processing'}
              onClick={() => handleUpdate('status', 'processing')}
              className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all ${
                o.fulfillment_status === 'processing'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                  : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <Package size={14} />
              <span>{locale === 'ar' ? 'قيد التحضير' : 'En préparation'}</span>
            </button>

            <button
              type="button"
              disabled={busy || o.fulfillment_status === 'ready'}
              onClick={() => handleUpdate('status', 'ready')}
              className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all ${
                o.fulfillment_status === 'ready'
                  ? 'bg-blue-100 border-blue-400 text-blue-900 font-bold'
                  : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{locale === 'ar' ? 'جاهز للشحن' : 'Prête à expédier'}</span>
            </button>

            <button
              type="button"
              disabled={busy || o.fulfillment_status === 'shipped'}
              onClick={() => handleUpdate('status', 'shipped')}
              className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all ${
                o.fulfillment_status === 'shipped'
                  ? 'bg-purple-100 border-purple-400 text-purple-900 font-bold'
                  : 'bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <Truck size={14} />
              <span>{locale === 'ar' ? 'تم الشحن' : 'Expédiée'}</span>
            </button>

            <button
              type="button"
              disabled={busy || o.fulfillment_status === 'delivered'}
              onClick={() => handleUpdate('status', 'delivered')}
              className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-lg border transition-all ${
                o.fulfillment_status === 'delivered'
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>{locale === 'ar' ? 'تم التسليم وقبض المبلغ' : 'Livrée & Encaissée'}</span>
            </button>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              disabled={busy || o.fulfillment_status === 'returned'}
              onClick={() => handleUpdate('status', 'returned')}
              className="flex-1 inline-flex items-center justify-center gap-1 text-xs py-1.5 rounded border border-rose-200 text-rose-800 hover:bg-rose-50"
            >
              <RotateCcw size={13} />
              <span>{locale === 'ar' ? 'إرجاع (Retourné)' : 'Colis Retourné'}</span>
            </button>
            <button
              type="button"
              disabled={busy || o.fulfillment_status === 'cancelled'}
              onClick={() => handleUpdate('status', 'cancelled')}
              className="flex-1 inline-flex items-center justify-center gap-1 text-xs py-1.5 rounded border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
            >
              <XCircle size={13} />
              <span>{locale === 'ar' ? 'إلغاء الطلب' : 'Annuler'}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className="p-2.5 rounded-lg text-xs bg-amber-50 border border-amber-200 text-amber-950">
            {message}
          </div>
        )}

        {/* Delete Order Action */}
        <div className="pt-3 border-t border-neutral-200 flex justify-between items-center">
          <button
            type="button"
            disabled={busy}
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 px-2.5 py-1.5 rounded transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            <span>{locale === 'ar' ? 'حذف هذا الطلب من القاعدة' : 'Supprimer définitivement'}</span>
          </button>
        </div>
      </section>

      {/* Internal Note Card */}
      <section className="card">
        <h3 className="font-bold text-sm text-neutral-900 mb-2">
          {locale === 'ar' ? 'إضافة ملاحظة داخلية' : locale === 'fr' ? 'Ajouter une note interne' : 'Add Internal Note'}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const text = String(new FormData(form).get('note') || '');
            void handleUpdate('note', text).then(() => form.reset());
          }}
        >
          <textarea
            name="note"
            id="note"
            rows={3}
            maxLength={2000}
            required
            placeholder={
              locale === 'ar'
                ? 'معلومات مفيدة للفريق بخصوص هذا الطلب أو الزبون...'
                : 'Information utile pour l’équipe ou le livreur…'
            }
            className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
          <button
            type="submit"
            className="button secondary small mt-2 w-full"
            disabled={busy}
          >
            {locale === 'ar' ? 'حفظ الملاحظة' : 'Enregistrer la note'}
          </button>
        </form>
      </section>

      {/* Confirmation Modal for Deletion */}
      {showDeleteModal && (
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
                ? `هل أنت متأكد من رغبتك في حذف الطلب ${o.public_order_code} نهائياً من قاعدة البيانات؟ سيتم حفظ نسخة مؤرشفة في السجلات تلقائياً.`
                : `Êtes-vous sûr de vouloir supprimer définitivement la commande ${o.public_order_code} ? Une copie d’archive sécurisée sera conservée dans les logs.`}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                disabled={busy}
              >
                {locale === 'ar' ? 'إلغاء' : 'Annuler'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-bold rounded-lg bg-rose-700 text-white hover:bg-rose-800 disabled:opacity-50"
                disabled={busy}
              >
                {busy
                  ? locale === 'ar'
                    ? 'جاري الحذف...'
                    : 'Suppression...'
                  : locale === 'ar'
                  ? 'نعم، حذف الطلب'
                  : 'Oui, supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
