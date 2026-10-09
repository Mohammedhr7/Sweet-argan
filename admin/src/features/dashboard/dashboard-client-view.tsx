'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  ShoppingBag,
  CheckCheck,
  Clock,
  MessageSquare,
  Package,
  Truck,
  Users,
  Coins,
} from 'lucide-react';
import type { Order } from '@/types/commerce';
import { OrderTable } from '@/features/orders/order-table';
import { money } from '@/utils/money';
import { useAdminLanguage } from '@/features/i18n/language-context';

interface DashboardMetrics {
  today: number;
  confirmed: number;
  pending: number;
  review: number;
  processing: number;
  delivered: number;
  revenue_today: number;
  revenue_month: number;
  customers: number;
}

export function DashboardClientView({
  metrics,
  recent,
  profileName,
}: {
  metrics: DashboardMetrics;
  recent: { orders: Order[] };
  profileName: string;
}) {
  const { t, locale } = useAdminLanguage();

  const formattedDate = new Date().toLocaleDateString(
    locale === 'ar' ? 'ar-MA' : locale === 'fr' ? 'fr-MA' : 'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: 'Africa/Casablanca',
    }
  );

  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">{t.dashboard.eyebrow}</div>
          <h1>
            {t.dashboard.greeting}, {profileName}.
          </h1>
          <p>{t.dashboard.subtitle}</p>
        </div>
        <span className="date-label">{formattedDate}</span>
      </div>

      <div className="metric-grid">
        {[
          {
            label: t.dashboard.orders_today,
            value: metrics.today,
            icon: ShoppingBag,
            href: '/orders?today=1',
          },
          {
            label: t.dashboard.orders_confirmed,
            value: metrics.confirmed,
            icon: CheckCheck,
            href: '/orders?confirmation=confirmed',
          },
          {
            label: t.dashboard.orders_pending,
            value: metrics.pending,
            icon: Clock,
            href: '/orders?confirmation=pending',
          },
          {
            label: t.dashboard.orders_review,
            value: metrics.review,
            icon: MessageSquare,
            href: '/orders?confirmation=needs_review',
          },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link href={href} className="metric-card" key={label}>
            <div>
              <span>{label}</span>
              <Icon size={18} />
            </div>
            <strong>{value}</strong>
            <small>
              {t.dashboard.view_orders} <ArrowUpRight size={13} />
            </small>
          </Link>
        ))}
      </div>

      <section className="attention-banner">
        <div>
          <span className="eyebrow">{t.dashboard.attention_eyebrow}</span>
          <h2>
            {metrics.pending + metrics.review}{' '}
            {locale === 'ar'
              ? 'طلب(طلبات) بحاجة لمتابعتكم.'
              : 'commande(s) à accompagner.'}
          </h2>
          <p>{t.dashboard.attention_desc}</p>
        </div>
        <Link href="/orders?confirmation=needs_review" className="button">
          {t.dashboard.attention_btn} <ArrowUpRight size={15} />
        </Link>
      </section>

      {/* Financial & Delivery Overview */}
      <div className="secondary-metrics">
        <div>
          <span>{t.dashboard.revenue_today}</span>
          <strong>{money(metrics.revenue_today)}</strong>
          <span className="text-[10px] text-neutral-400 block mt-0.5">{t.dashboard.revenue_hint}</span>
        </div>
        <div>
          <span>{t.dashboard.revenue_month}</span>
          <strong>{money(metrics.revenue_month)}</strong>
          <span className="text-[10px] text-neutral-400 block mt-0.5">{t.dashboard.revenue_hint}</span>
        </div>
        <div>
          <span>{t.dashboard.in_processing}</span>
          <strong>{metrics.processing}</strong>
        </div>
        <div>
          <span>{t.dashboard.delivered}</span>
          <strong>{metrics.delivered}</strong>
        </div>
        <div>
          <span>{t.dashboard.total_customers}</span>
          <strong>{metrics.customers}</strong>
        </div>
      </div>

      <section className="card table-card">
        <div className="card-header">
          <div>
            <h2>{t.dashboard.recent_orders}</h2>
            <p>{t.dashboard.recent_subtitle}</p>
          </div>
          <Link href="/orders" className="text-button">
            {t.dashboard.view_all} →
          </Link>
        </div>
        <OrderTable orders={recent.orders.slice(0, 8)} />
      </section>
    </>
  );
}
