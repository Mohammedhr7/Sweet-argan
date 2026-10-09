import 'server-only';
import { requireAdmin } from '@/lib/auth';
import { adminDb } from '@/lib/supabase/admin';
import type { Order } from '@/types/commerce';

export async function listOrders(filters: Record<string, string | undefined> = {}) {
  await requireAdmin();
  const page = Math.max(1, Number.parseInt(filters.page || '1') || 1);
  const client = adminDb();

  let query = client
    .from('orders')
    .select(
      'id,public_order_code,customer_name,customer_phone,shipping_city,total,confirmation_status,fulfillment_status,created_at',
      { count: 'exact' }
    );

  if (filters.q) {
    const q = filters.q.replace(/[^\p{L}\p{N}+ -]/gu, '').slice(0, 100);
    if (q) {
      query = query.or(
        `public_order_code.ilike.%${q}%,customer_phone.ilike.%${q}%,customer_name.ilike.%${q}%`
      );
    }
  }

  if (filters.confirmation) {
    query = query.eq('confirmation_status', filters.confirmation);
  }
  if (filters.fulfillment) {
    query = query.eq('fulfillment_status', filters.fulfillment);
  }
  if (filters.today) {
    const date = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Casablanca',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
    query = query.gte('created_at', date + 'T00:00:00+01:00');
  }

  const { data, error, count } = await query
    .order(filters.sort === 'total' ? 'total' : 'created_at', {
      ascending: filters.direction === 'asc',
    })
    .range((page - 1) * 25, page * 25 - 1);

  if (error) {
    console.error('listOrders error:', error);
    return { orders: [], count: 0, page };
  }

  return { orders: (data || []) as Order[], count: count || 0, page };
}

export async function getOrder(id: string) {
  const {db:session}=await requireAdmin();
  const client = adminDb();

  const { data, error } = await client
    .from('orders')
    .select(
      'id,public_order_code,customer_id,customer_name,customer_phone,customer_email,shipping_city,shipping_address,shipping_notes,subtotal,shipping_amount,discount_amount,total,confirmation_status,fulfillment_status,confirmation_method,confirmation_message,confirmed_at,editable_until,last_modified_at,cancelled_at,cancellation_reason,revision,created_at,payment_status,payment_method,admin_notes,order_items(*)'
    )
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return { order: null, history: [], confirmations: [],changes:[],editable:false };
  }

  const [historyRes, confirmationsRes,changesRes,editableRes] = await Promise.all([
    client.from('order_status_history').select('*').eq('order_id', id).order('created_at'),
    client.from('order_confirmation_events').select('*').eq('order_id', id).order('created_at'),
    client.from('order_change_events').select('*').eq('order_id',id).order('created_at'),
    session.rpc('admin_order_editability',{p_order_id:id}),
  ]);

  return {
    order: data as Order | null,
    history: historyRes.data || [],
    confirmations: confirmationsRes.data || [],changes:changesRes.data||[],editable:editableRes.data===true,
  };
}


