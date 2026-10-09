import Link from 'next/link';
import { listOrders } from '@/services/orders';
import { OrderTable } from '@/features/orders/order-table';
import { confirmationLabels, fulfillmentLabels } from '@/constants/status';
import { OrderBackupBanner } from '@/features/orders/order-backup-banner';

export const dynamic = 'force-dynamic';

export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const f = await searchParams;
  const { orders, count, page } = await listOrders(f);

  const url = (n: number) => {
    const q = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    q.set('page', String(n));
    return '?' + q.toString();
  };

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">إدارة ومتابعة المبيعات / GESTION DES COMMANDES</div>
          <h1>الطلبات / Commandes</h1>
          <p>{count} طلب(طلبات) مسجلة في هذا التحديد.</p>
        </div>
      </div>

      {/* 9-Day Backup & 10-Day Database Cleanup Banner */}
      <OrderBackupBanner />

      <div className="tabs">
        <Link href="/orders">الكل / Toutes</Link>
        <Link href="/orders?today=1">اليوم / Aujourd’hui</Link>
        <Link href="/orders?confirmation=pending">قيد التأكيد / À confirmer</Link>
        <Link href="/orders?confirmation=needs_review">بحاجة لمراجعة / À vérifier</Link>
        <Link href="/orders?fulfillment=processing">قيد التحضير / En préparation</Link>
        <Link href="/orders?fulfillment=shipped">تم الشحن / Expédiées</Link>
      </div>

      <form className="filter-bar">
        <label className="sr-only" htmlFor="q">
          بحث
        </label>
        <input
          id="q"
          name="q"
          placeholder="رقم الطلب، اسم الزبون، رقم الهاتف..."
          defaultValue={f.q}
        />
        <select
          name="confirmation"
          aria-label="Confirmation"
          defaultValue={f.confirmation || ''}
        >
          <option value="">جميع حالات التأكيد</option>
          <option value="pending">في انتظار التأكيد (Pending)</option>
          <option value="confirmed">مؤكدة (Confirmed)</option>
          <option value="needs_review">بحاجة لمراجعة (Review)</option>
          <option value="rejected">مرفوضة (Rejected)</option>
          <option value="expired">منتهية (Expired)</option>
        </select>
        <select
          name="fulfillment"
          aria-label="Livraison"
          defaultValue={f.fulfillment || ''}
        >
          <option value="">جميع حالات الشحن</option>
          <option value="new">جديدة (New)</option>
          <option value="processing">قيد التحضير (Processing)</option>
          <option value="ready">جاهزة للشحن (Ready)</option>
          <option value="shipped">تم الشحن (Shipped)</option>
          <option value="delivered">تم التسليم وقبض المبلغ (Delivered)</option>
          <option value="returned">مرتجعة (Returned)</option>
          <option value="cancelled">ملغاة (Cancelled)</option>
        </select>
        <select name="sort" aria-label="Trier" defaultValue={f.sort || 'date'}>
          <option value="date">الأحدث أولاً / Plus récent</option>
          <option value="total">الأعلى مبلغاً / Montant décroissant</option>
        </select>
        <button className="button small">تصفية / Filtrer</button>
      </form>

      <section className="card table-card">
        <OrderTable orders={orders} bulk />
      </section>

      <nav className="pagination" aria-label="Pagination">
        {page > 1 && <Link href={url(page - 1)}>← السابق / Précédent</Link>}
        <span>الصفحة / Page {page}</span>
        {page * 25 < count && <Link href={url(page + 1)}>التالي / Suivant →</Link>}
      </nav>
    </>
  );
}
