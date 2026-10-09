import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';
import { listOrders } from '@/services/orders';
import { DashboardClientView } from '@/features/dashboard/dashboard-client-view';

export const dynamic = 'force-dynamic';

async function fetchMetrics(db: SupabaseClient) {
  const now = new Date();
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Casablanca',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const startOfDay = `${todayStr}T00:00:00+01:00`;

  const [ordersRes, customersRes] = await Promise.all([
    db
      .from('orders')
      .select(
        'created_at,confirmation_status,fulfillment_status,payment_status,total,updated_at'
      ),
    db.from('customers').select('id', { count: 'exact', head: true }),
  ]);

  const orders = ordersRes.data || [];
  const customersCount = customersRes.count || 0;

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let today = 0;
  let confirmed = 0;
  let pending = 0;
  let review = 0;
  let processing = 0;
  let delivered = 0;
  let revenue_today = 0;
  let revenue_month = 0;

  for (const o of orders) {
    const updatedAt = new Date(o.updated_at || o.created_at);

    if (o.created_at >= startOfDay) {
      today++;
    }
    if (
      o.confirmation_status === 'confirmed' &&
      !['cancelled', 'returned'].includes(o.fulfillment_status)
    ) {
      confirmed++;
    }
    if (o.confirmation_status === 'pending' && o.fulfillment_status === 'new') {
      pending++;
    }
    if (o.confirmation_status === 'needs_review' && o.fulfillment_status === 'new') {
      review++;
    }
    if (['processing', 'ready'].includes(o.fulfillment_status)) {
      processing++;
    }
    if (o.fulfillment_status === 'delivered') {
      delivered++;
    }

    // STRICT BUSINESS RULE:
    // Revenue is counted ONLY when an order is BOTH Confirmed AND Delivered!
    const isConfirmedAndDelivered =
      o.confirmation_status === 'confirmed' && o.fulfillment_status === 'delivered';

    if (isConfirmedAndDelivered) {
      const orderDate = new Date(o.created_at);
      if (o.created_at >= startOfDay || (o.updated_at && o.updated_at >= startOfDay)) {
        revenue_today += Number(o.total) || 0;
      }
      if (
        orderDate.getFullYear() === currentYear &&
        orderDate.getMonth() === currentMonth
      ) {
        revenue_month += Number(o.total) || 0;
      }
    }
  }

  return {
    today,
    confirmed,
    pending,
    review,
    processing,
    delivered,
    revenue_today,
    revenue_month,
    customers: customersCount,
  };
}

export default async function Dashboard() {
  const { db, profile } = await requireAdmin();
  const [metrics, recent] = await Promise.all([fetchMetrics(db), listOrders()]);
  const profileName = profile.full_name?.split(' ')[0] || 'فريق العمل';

  return (
    <DashboardClientView
      metrics={metrics}
      recent={recent}
      profileName={profileName}
    />
  );
}
