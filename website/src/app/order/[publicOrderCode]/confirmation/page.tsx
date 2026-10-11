import Link from 'next/link';
import { getPrivateOrder } from '@/services/orders';
import { getContent } from '@/services/catalog';
import { ManagedOrderPanel } from '@/features/confirmation/managed-order';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Confirmation de commande · Sweet Argan',
  robots: { index: false, follow: false },
  referrer: 'no-referrer' as const
};

export default async function Confirmation({
  params,
  searchParams
}: {
  params: Promise<{ publicOrderCode: string }>;
  searchParams?: Promise<{ token?: string }>;
}) {
  const { publicOrderCode } = await params;
  const sp = searchParams ? await searchParams : {};
  const o = await getPrivateOrder(publicOrderCode, sp.token);
  const content = await getContent();

  return (
    <main className="container section">
      <div className="narrow">
        {o ? (
          <ManagedOrderPanel
            order={o}
            contact={content.contact_email ? '/contact' : undefined}
            initialToken={sp.token}
          />
        ) : (
          <div className="empty-state">
            <h1>Retrouvons votre commande.</h1>
            <p style={{ margin: '14px 0 24px', color: 'var(--muted)', fontSize: '15px' }}>
              Utilisez votre numéro de commande et le numéro de téléphone saisi lors de votre achat pour accéder à votre commande.
            </p>
            <Link className="button" href="/order-tracking">
              Accéder au suivi de commande
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
