import Link from 'next/link';
import { getPrivateOrder } from '@/services/orders';
import { OrderEditor } from '@/features/confirmation/order-editor';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Modifier votre commande · Sweet Argan',
  robots: { index: false, follow: false },
  referrer: 'no-referrer' as const
};

export default async function Edit({
  params,
  searchParams
}: {
  params: Promise<{ publicOrderCode: string }>;
  searchParams?: Promise<{ token?: string }>;
}) {
  const { publicOrderCode } = await params;
  const sp = searchParams ? await searchParams : {};
  const o = await getPrivateOrder(publicOrderCode, sp.token);

  return (
    <main className="container section">
      <div className="narrow">
        {o?.can_modify ? (
          <OrderEditor order={o} initialToken={sp.token} />
        ) : (
          <section className="panel" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '14px' }}>Modification indisponible</h1>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '24px' }}>
              {o
                ? 'Cette commande ne peut plus être modifiée ou annulée en ligne (la préparation a commencé ou le délai de 24 h est écoulé).'
                : 'Retrouvez votre commande avec votre numéro de commande et votre téléphone.'}
            </p>
            <Link
              className="button"
              href={o ? '/order/' + o.public_order_code + '/confirmation' : '/order-tracking'}
            >
              {o ? 'Voir ma commande' : 'Retrouver ma commande'}
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
