'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Users,
  Settings,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';
import { logout } from '@/features/auth/actions';
import { useAdminLanguage, AdminLanguageSwitcher } from '@/features/i18n/language-context';

export function Sidebar({ name }: { name: string }) {
  const path = usePathname();
  const { t, locale } = useAdminLanguage();

  const links = [
    { href: '/', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/orders', label: t.nav.orders, icon: ShoppingBag },
    { href: '/products', label: t.nav.products, icon: Package },
    { href: '/categories', label: t.nav.categories, icon: Layers },
    { href: '/customers', label: t.nav.customers, icon: Users },
    { href: '/content', label: t.nav.content, icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <Link href="/" className="wordmark">
        Sweet Argan
        <span>{t.brand.sub}</span>
      </Link>
      <div className="side-caption">{t.brand.cooperative}</div>

      <div className="my-2 px-1">
        <AdminLanguageSwitcher className="w-full justify-center" />
      </div>

      <nav aria-label="Navigation administration">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            className={
              (href === '/' ? path === href : path.startsWith(href)) ? 'active' : ''
            }
            key={href}
            href={href}
          >
            <Icon size={18} strokeWidth={1.6} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="side-bottom">
        <a
          href={process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{t.nav.view_store}</span>
          <ArrowUpRight size={16} />
        </a>

        <div className="account">
          <span className="avatar">{name.slice(0, 1).toUpperCase()}</span>
          <div>
            {name}
            <small>{t.brand.role}</small>
          </div>
          <form action={logout}>
            <button className="icon-button" aria-label={t.nav.logout} title={t.nav.logout}>
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
