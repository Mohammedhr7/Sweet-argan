'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, ShoppingBag, Truck } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/features/cart/cart-provider';
import { useLanguage, LanguageSwitcher } from '@/features/i18n/language-context';

export function Header({ announcement: defaultAnnouncement }: { announcement: string }) {
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const cart = useCart();
  const { t } = useLanguage();

  const links = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.shop, href: '/shop' },
    { label: t.nav.categories, href: '/#categories' },
    { label: t.nav.bestsellers, href: '/shop?best=1' },
    { label: t.nav.story, href: '/about' },
    { label: t.nav.contact, href: '/contact' },
    { label: t.nav.tracking, href: '/order-tracking' }
  ];

  return (
    <>
      <div className="announcement">{t.announcement || defaultAnnouncement}</div>
      <header className="site-header">
        <div className="container nav">
          {/* PROMINENT LOGO & WORDMARK */}
          <Link href="/" className="wordmark" aria-label="Sweet Argan — accueil">
            <Image
              src="/assets/brand/logo.jpg"
              width={64}
              height={64}
              priority
              quality={95}
              alt="Sweet Argan Logo"
              style={{ objectFit: 'cover' }}
            />
            <div className="wordmark-text">
              <span className="wordmark-brand">
                {t.brand.name}
              </span>
              <small className="wordmark-tagline">
                {t.brand.sub}
              </small>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="desktop-nav" aria-label="Navigation principale">
            {links.map(l => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ACTIONS & LANGUAGE SWITCHER */}
          <div className="nav-actions">
            <LanguageSwitcher />

            <Link
              href="/order-tracking"
              className="icon-button"
              aria-label={t.nav.tracking}
              title={t.nav.tracking}
            >
              <Truck size={19} />
            </Link>

            <button
              className="icon-button"
              aria-label="Rechercher"
              aria-expanded={search}
              aria-controls="site-search"
              onClick={() => setSearch(!search)}
            >
              <Search size={19} />
            </button>

            <button
              className="icon-button"
              aria-label={'Ouvrir le panier, ' + cart.items.reduce((sum, i) => sum + i.quantity, 0) + ' articles'}
              onClick={() => cart.setOpen(true)}
            >
              <ShoppingBag size={19} />
              <span className="cart-count">
                {cart.items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </button>

            <button
              className="icon-button mobile-toggle"
              aria-label="Menu"
              aria-expanded={mobile}
              aria-controls="mobile-nav"
              onClick={() => setMobile(!mobile)}
            >
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        {search && (
          <form id="site-search" action="/shop" className="container search-bar">
            <label htmlFor="search" className="sr-only">
              {t.nav.search_placeholder}
            </label>
            <input
              autoFocus
              id="search"
              name="q"
              placeholder={t.nav.search_placeholder}
              maxLength={100}
            />
            <button className="button" type="submit">
              {t.nav.search_button}
            </button>
          </form>
        )}

        {/* MOBILE NAVIGATION */}
        {mobile && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="Navigation mobile">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobile(false)}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
