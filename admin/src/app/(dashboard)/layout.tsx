import { requireAdmin } from '@/lib/auth';
import { Sidebar } from '@/components/sidebar';
import { Realtime } from '@/components/realtime';
import { AdminLanguageSwitcher } from '@/features/i18n/language-context';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, user } = await requireAdmin();

  return (
    <div className="admin-shell">
      <Sidebar name={profile.full_name || user.email || 'فريق العمل'} />
      <div className="workspace">
        <header className="topbar">
          <div className="flex items-center gap-3">
            <span>
              Sweet Argan <span className="muted">/ لوحة التحكم</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <AdminLanguageSwitcher />
            <Realtime />
          </div>
        </header>
        <main id="main" className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
