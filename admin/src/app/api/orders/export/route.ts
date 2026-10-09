import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { adminDb } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const db = adminDb();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    // Fetch all orders with all related data
    const [ordersRes, itemsRes, historyRes, eventsRes, archivesRes] = await Promise.all([
      db.from('orders').select('*').order('created_at', { ascending: false }),
      db.from('order_items').select('*'),
      db.from('order_status_history').select('*'),
      db.from('order_confirmation_events').select('*'),
      db.from('settings').select('value').eq('key', 'archived_orders').maybeSingle(),
    ]);

    const orders = ordersRes.data || [];
    const items = itemsRes.data || [];
    const history = historyRes.data || [];
    const events = eventsRes.data || [];
    const archives = archivesRes?.data?.value ? (archivesRes.data.value as unknown[]) : [];

    const nowStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Casablanca',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    if (format === 'csv') {
      const headers = [
        'ID',
        'Code_Commande',
        'Date_Creation',
        'Nom_Client',
        'Telephone',
        'Ville',
        'Adresse',
        'Total_MAD',
        'Statut_Confirmation',
        'Statut_Livraison',
        'Paiement',
        'Articles',
      ];

      const rows = orders.map((o) => {
        const orderItems = items.filter((it) => it.order_id === o.id);
        const itemsSummary = orderItems
          .map((it) => `${it.product_name} (x${it.quantity})`)
          .join(' ; ');

        return [
          `"${o.id}"`,
          `"${o.public_order_code}"`,
          `"${o.created_at}"`,
          `"${(o.customer_name || '').replace(/"/g, '""')}"`,
          `"${o.customer_phone || ''}"`,
          `"${(o.shipping_city || '').replace(/"/g, '""')}"`,
          `"${(o.shipping_address || '').replace(/"/g, '""')}"`,
          o.total,
          `"${o.confirmation_status}"`,
          `"${o.fulfillment_status}"`,
          `"${o.payment_status}"`,
          `"${itemsSummary.replace(/"/g, '""')}"`,
        ].join(',');
      });

      const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="sweetargan-commandes-backup-${nowStr}.csv"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    // JSON export containing complete relational tree and archived records
    const fullExport = {
      app: 'Sweet Argan Admin',
      backup_date: new Date().toISOString(),
      casablanca_date: nowStr,
      total_active_orders: orders.length,
      total_archived_orders: archives.length,
      active_orders: orders.map((o) => ({
        ...o,
        items: items.filter((it) => it.order_id === o.id),
        status_history: history.filter((h) => h.order_id === o.id),
        confirmation_events: events.filter((e) => e.order_id === o.id),
      })),
      archived_orders: archives,
    };

    const jsonString = JSON.stringify(fullExport, null, 2);

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="sweetargan-commandes-backup-${nowStr}.json"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Export failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
