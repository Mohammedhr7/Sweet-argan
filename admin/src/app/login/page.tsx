import Image from 'next/image';
import { redirect } from 'next/navigation';
import { sessionDb } from '@/lib/supabase/server';
import { adminDb } from '@/lib/supabase/admin';
import { LoginForm } from '@/features/auth/login-form';

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const db = await sessionDb();

  if (db) {
    try {
      const {
        data: { user },
      } = await db.auth.getUser();

      if (user) {
        const profile = await adminDb()
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profile.data && ['admin', 'super_admin'].includes(profile.data.role)) {
          redirect('/');
        }
      }
    } catch {
      // ignore
    }
  }

  return (
    <main className="login-page">
      <section className="login-brand">
        <Image
          src="/assets/brand/collection.jpg"
          alt="Collection Sweet Argan"
          fill
          sizes="50vw"
          priority
        />
        <div>
          <p className="eyebrow">COOPÉRATIVE MAROCAINE</p>
          <h1>
            De belles attentions.
            <br />
            Une gestion sereine.
          </h1>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-inner">
          <div className="wordmark">
            Sweet Argan<span>ESPACE ÉQUIPE</span>
          </div>
          <div className="eyebrow">BONJOUR & BIENVENUE</div>
          <h2>Ravi de vous retrouver.</h2>
          <p>Connectez-vous pour prendre soin de vos commandes.</p>
          {reason === 'session' && (
            <p className="notice">
              Connectez-vous pour continuer. Votre session peut avoir expiré.
            </p>
          )}
          {reason === 'forbidden' && (
            <p className="error">Ce compte n’a pas accès à l’administration.</p>
          )}
          {reason === 'setup' && (
            <p className="notice">
              L’espace équipe attend la configuration du nouveau projet Supabase.
            </p>
          )}
          <LoginForm />
          <p className="muted" style={{ marginTop: 30, fontSize: 12 }}>
            Accès réservé aux administrateurs autorisés.
            <br />
            Pour obtenir un accès, contactez le responsable de la coopérative.
          </p>
        </div>
      </section>
    </main>
  );
}
