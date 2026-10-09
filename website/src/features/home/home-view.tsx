'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  Leaf,
  PackageCheck,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Clock,
  HeartHandshake
} from 'lucide-react';
import type { Category, Product, SiteContent } from '@/types/commerce';
import { ProductCard } from '@/components/product-card';
import { StorefrontImage } from '@/components/storefront-image';
import { money } from '@/utils/money';
import { useLanguage } from '@/features/i18n/language-context';

export function HomeView({
  catalog,
  categories,
  content
}: {
  catalog: { products: Product[] };
  categories: Category[];
  content: SiteContent;
}) {
  const { t, locale, dir } = useLanguage();

  const bestSellers = catalog.products.filter(p => p.is_best_seller);
  const displayBestSellers = bestSellers.length >= 4 ? bestSellers : catalog.products.slice(0, 4);

  const skincareProducts = catalog.products
    .filter(p => p.slug.includes('creme') || p.categories?.slug === 'soins-du-visage')
    .slice(0, 3);

  const hammamProducts = catalog.products
    .filter(p => p.slug.includes('savon') || p.slug.includes('argile') || p.categories?.slug === 'masques-et-soins')
    .slice(0, 3);

  const packTimomouchin =
    catalog.products.find(p => p.slug === 'pack-timomouchin') || catalog.products[0];

  const categoryTranslations: Record<string, string> = {
    'soins-du-visage': locale === 'ar' ? 'العناية بالوجه' : locale === 'en' ? 'Facial Care' : 'Soins du visage',
    'soins-du-corps': locale === 'ar' ? 'العناية بالجسم' : locale === 'en' ? 'Body Care' : 'Soins du corps',
    'savons': locale === 'ar' ? 'الصوابين الطبيعية' : locale === 'en' ? 'Natural Soaps' : 'Savons naturels',
    'huiles-et-solaires': locale === 'ar' ? 'الزيوت والتسمير' : locale === 'en' ? 'Oils & Sun Care' : 'Huiles & Solaires',
    'masques-et-soins': locale === 'ar' ? 'أقنعة وطقوس الحمام' : locale === 'en' ? 'Masks & Rituals' : 'Masques & Soins',
    'terroir-marocain': locale === 'ar' ? 'كنوز التراث المغربي' : locale === 'en' ? 'Moroccan Terroir' : 'Terroir marocain',
    'coffrets': locale === 'ar' ? 'باقات وهدايا راقية' : locale === 'en' ? 'Gift Sets' : 'Coffrets & Rituels'
  };

  return (
    <div dir={dir}>
      {/* SECTION 1: HERO */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{t.hero.eyebrow}</div>
          <h1 style={{ fontSize: locale === 'ar' ? 'clamp(32px, 5.2vw, 56px)' : undefined }}>
            {t.hero.title}
          </h1>
          <p style={{ maxWidth: 440, fontSize: 15, lineHeight: 1.8 }}>
            {t.hero.subtitle}
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href={content.hero_cta_href || '/shop'} className="button">
              {t.hero.cta}
              <ArrowRight size={16} />
            </Link>
            <a
              href={content.whatsapp ? `https://wa.me/${content.whatsapp.replace(/\D/g, '')}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="button secondary"
            >
              {t.hero.whatsapp_cta}
            </a>
          </div>
        </div>
        <div className="hero-media">
          <StorefrontImage
            src="/assets/site-content/home-hero.jpg"
            alt={t.hero.title}
            fill
            priority
            quality={98}
            sizes="(max-width:760px) 100vw, 50vw"
          />
          <div className="hero-caption">
            {t.hero.caption_title}
            <span>{t.hero.caption_sub}</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRUST STRIP */}
      <div className="container trust-strip">
        <div className="trust-item">
          <Leaf size={26} strokeWidth={1.5} />
          <div>
            {t.trust.argan_title}
            <small>{t.trust.argan_sub}</small>
          </div>
        </div>
        <div className="trust-item">
          <PackageCheck size={26} strokeWidth={1.5} />
          <div>
            {t.trust.cod_title}
            <small>{t.trust.cod_sub}</small>
          </div>
        </div>
        <div className="trust-item">
          <Clock size={26} strokeWidth={1.5} />
          <div>
            {t.trust.shipping_title}
            <small>{t.trust.shipping_sub}</small>
          </div>
        </div>
        <div className="trust-item">
          <MessageCircle size={26} strokeWidth={1.5} />
          <div>
            {t.trust.support_title}
            <small>{t.trust.support_sub}</small>
          </div>
        </div>
      </div>

      {/* SECTION 3: CATEGORY GRID */}
      <section className="section container" id="categories">
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.categories_section.eyebrow}</div>
            <h2>{t.categories_section.title}</h2>
          </div>
          <Link className="text-link" href="/shop">
            {t.categories_section.view_all}
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => (
            <Link className="category-card-img" href={'/category/' + c.slug} key={c.id}>
              {c.image_url && (
                <div className="cat-bg">
                  <StorefrontImage
                    src={c.image_url}
                    alt={c.name}
                    fill
                    sizes="(max-width:760px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="cat-content">
                <span className="number">0{i + 1}</span>
                <h3 style={{ fontSize: 22, margin: '6px 0 10px' }}>
                  {categoryTranslations[c.slug] || c.name}
                </h3>
                <span className="text-link" style={{ fontSize: 11 }}>
                  {t.categories_section.discover}
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4: BEST SELLERS */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.bestsellers.eyebrow}</div>
            <h2>{t.bestsellers.title}</h2>
          </div>
          <Link className="text-link" href="/shop?best=1">
            {t.bestsellers.view_all}
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="product-grid">
          {displayBestSellers.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* SECTION 5: BRAND STORY */}
      <section className="section container story-grid">
        <div className="story-photo">
          <StorefrontImage
            src="/assets/site-content/about-story.jpg"
            alt={t.story.title}
            fill
            sizes="(max-width:760px) 100vw, 50vw"
          />
        </div>
        <div className="story-copy">
          <div className="eyebrow">{t.story.eyebrow}</div>
          <h2>{t.story.title}</h2>
          <p>{t.story.p1}</p>
          <p>{t.story.p2}</p>
          <p>{t.story.p3}</p>
          <div style={{ marginTop: 28 }}>
            <Link href="/about" className="button">
              {t.story.cta}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY SWEET ARGAN (4 VALUE PILLARS) */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.pillars.eyebrow}</div>
            <h2>{t.pillars.title}</h2>
          </div>
        </div>
        <div className="pillars-grid">
          <div className="pillar-card">
            <Sparkles size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{t.pillars.p1_title}</h3>
            <p>{t.pillars.p1_desc}</p>
          </div>
          <div className="pillar-card">
            <Leaf size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{t.pillars.p2_title}</h3>
            <p>{t.pillars.p2_desc}</p>
          </div>
          <div className="pillar-card">
            <HeartHandshake size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{t.pillars.p3_title}</h3>
            <p>{t.pillars.p3_desc}</p>
          </div>
          <div className="pillar-card">
            <ShieldCheck size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{t.pillars.p4_title}</h3>
            <p>{t.pillars.p4_desc}</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: NATURAL INGREDIENTS */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.ingredients.eyebrow}</div>
            <h2>{t.ingredients.title}</h2>
          </div>
        </div>
        <div className="ingredients-grid">
          <div className="ingredient-card">
            <span className="ing-badge">{t.ingredients.i1_badge}</span>
            <h3>{t.ingredients.i1_title}</h3>
            <p>{t.ingredients.i1_desc}</p>
          </div>
          <div className="ingredient-card">
            <span className="ing-badge">{t.ingredients.i2_badge}</span>
            <h3>{t.ingredients.i2_title}</h3>
            <p>{t.ingredients.i2_desc}</p>
          </div>
          <div className="ingredient-card">
            <span className="ing-badge">{t.ingredients.i3_badge}</span>
            <h3>{t.ingredients.i3_title}</h3>
            <p>{t.ingredients.i3_desc}</p>
          </div>
          <div className="ingredient-card">
            <span className="ing-badge">{t.ingredients.i4_badge}</span>
            <h3>{t.ingredients.i4_title}</h3>
            <p>{t.ingredients.i4_desc}</p>
          </div>
        </div>
      </section>

      {/* SECTION 8: SKINCARE COLLECTION SPOTLIGHT */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="story-grid">
          <div className="story-copy">
            <div className="eyebrow">{t.skincare.eyebrow}</div>
            <h2>{t.skincare.title}</h2>
            <p>{t.skincare.p1}</p>
            <p>{t.skincare.p2}</p>
            <div style={{ marginTop: 24 }}>
              <Link href="/category/soins-du-visage" className="button">
                {t.skincare.cta}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
          <div className="story-photo">
            <StorefrontImage
              src="/assets/site-content/home-skincare.jpg"
              alt={t.skincare.title}
              fill
              sizes="(max-width:760px) 100vw, 50vw"
            />
          </div>
        </div>
        {skincareProducts.length > 0 && (
          <div className="product-grid" style={{ marginTop: 40 }}>
            {skincareProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 9: HAMMAM & HAIRCARE RITUAL SPOTLIGHT */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="story-grid">
          <div className="story-photo">
            <StorefrontImage
              src="/assets/site-content/home-haircare.jpg"
              alt={t.hammam.title}
              fill
              sizes="(max-width:760px) 100vw, 50vw"
            />
          </div>
          <div className="story-copy">
            <div className="eyebrow">{t.hammam.eyebrow}</div>
            <h2>{t.hammam.title}</h2>
            <p>{t.hammam.p1}</p>
            <p>{t.hammam.p2}</p>
            <div style={{ marginTop: 24 }}>
              <Link href="/category/masques-et-soins" className="button">
                {t.hammam.cta}
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
        {hammamProducts.length > 0 && (
          <div className="product-grid" style={{ marginTop: 40 }}>
            {hammamProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 10: FEATURED PRODUCTS HIGHLIGHT */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.featured.eyebrow}</div>
            <h2>{t.featured.title}</h2>
          </div>
          <Link className="text-link" href="/shop">
            {t.featured.view_all}
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="product-grid">
          {catalog.products
            .filter(p =>
              ['huile-de-bronzage', 'argile-verte-naturelle', 'deodorant-musc', 'creme-royale-oud'].includes(p.slug)
            )
            .map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>

      {/* SECTION 11: SIGNATURE GIFT SET (PACK TIMOMOUCHIN) */}
      {packTimomouchin && (
        <section className="section container" style={{ paddingTop: 0 }}>
          <div
            className="story-grid"
            style={{
              background: '#f5f0e6',
              border: '1px solid var(--line)',
              padding: 'clamp(20px, 4vw, 50px)'
            }}
          >
            <div className="story-photo" style={{ height: 420 }}>
              <StorefrontImage
                src="/assets/site-content/home-gift.jpg"
                alt="Pack Timomouchin Sweet Argan"
                fill
                sizes="(max-width:760px) 100vw, 50vw"
              />
            </div>
            <div className="story-copy">
              <div className="eyebrow">{t.gift_set.eyebrow}</div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>{t.gift_set.title}</h2>
              <p>{t.gift_set.desc}</p>
              <div
                style={{
                  fontSize: 24,
                  fontFamily: 'Georgia, serif',
                  color: 'var(--olive)',
                  marginBottom: 20
                }}
              >
                {money(packTimomouchin.price)}{' '}
                {packTimomouchin.compare_at_price && (
                  <del style={{ fontSize: 16, color: 'var(--muted)', marginLeft: 10 }}>
                    {money(packTimomouchin.compare_at_price)}
                  </del>
                )}
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href={'/product/' + packTimomouchin.slug} className="button">
                  {t.gift_set.order_cta}
                  <ArrowRight size={15} />
                </Link>
                <Link href="/checkout" className="button secondary">
                  {t.gift_set.quick_buy}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 12: REAL TESTIMONIALS */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.testimonials.eyebrow}</div>
            <h2>{t.testimonials.title}</h2>
          </div>
        </div>
        <div className="category-grid">
          {t.testimonials.list.map(item => (
            <blockquote
              className="panel"
              key={item.name}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <p style={{ fontSize: 15, fontStyle: 'italic', lineHeight: 1.8 }}>« {item.quote} »</p>
              <cite
                style={{
                  display: 'block',
                  marginTop: 20,
                  fontWeight: 700,
                  fontStyle: 'normal',
                  color: 'var(--gold)',
                  fontSize: 13
                }}
              >
                — {item.name}
              </cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* SECTION 13: SOCIAL & INSTAGRAM GALLERY */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.social.eyebrow}</div>
            <h2>{t.social.title}</h2>
          </div>
          <a className="text-link" href={content.instagram} target="_blank" rel="noopener noreferrer">
            @sweet_argan
            <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="social-grid">
          {[
            { img: 'creams', label: 'Crèmes de soin' },
            { img: 'collection', label: 'Collection complète' },
            { img: 'charcoal-soap', label: 'Savons artisanaux' },
            { img: 'deodorant', label: 'Déodorants naturels' }
          ].map(item => (
            <a
              className="social-photo"
              href={content.instagram}
              key={item.img}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Découvrir sur Instagram @sweet_argan`}
            >
              <StorefrontImage
                src={`/assets/brand/${item.img}.jpg`}
                alt={`Sweet Argan - ${item.label}`}
                fill
                sizes="(max-width:760px) 50vw, 25vw"
              />
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 14: MOROCCAN COD ORDER PROCESS */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t.order_steps.eyebrow}</div>
            <h2>{t.order_steps.title}</h2>
          </div>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3>{t.order_steps.s1_title}</h3>
            <p>{t.order_steps.s1_desc}</p>
          </div>
          <div className="step-card">
            <span className="step-number">02</span>
            <h3>{t.order_steps.s2_title}</h3>
            <p>{t.order_steps.s2_desc}</p>
          </div>
          <div className="step-card">
            <span className="step-number">03</span>
            <h3>{t.order_steps.s3_title}</h3>
            <p>{t.order_steps.s3_desc}</p>
          </div>
          <div className="step-card">
            <span className="step-number">04</span>
            <h3>{t.order_steps.s4_title}</h3>
            <p>{t.order_steps.s4_desc}</p>
          </div>
        </div>
      </section>

      {/* SECTION 15: DELIVERY REASSURANCE STRIP */}
      <div className="container" style={{ marginBottom: 80 }}>
        <div className="delivery-strip">
          <div className="eyebrow" style={{ marginBottom: 0 }}>
            {t.delivery_strip.eyebrow}
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', maxWidth: 750, margin: 0 }}>
            {t.delivery_strip.title}
          </h2>
          <div className="delivery-badges">
            <div className="delivery-badge">{t.delivery_strip.b1}</div>
            <div className="delivery-badge">{t.delivery_strip.b2}</div>
            <div className="delivery-badge">{t.delivery_strip.b3}</div>
            <div className="delivery-badge">{t.delivery_strip.b4}</div>
          </div>
        </div>
      </div>

      {/* SECTION 16: FAQ */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading" style={{ textAlign: 'center', display: 'block', marginBottom: 40 }}>
          <div className="eyebrow">{t.faq.eyebrow}</div>
          <h2>{t.faq.title}</h2>
        </div>
        <div className="faq-list">
          <details className="faq-item" open>
            <summary>{t.faq.q1}</summary>
            <p>{t.faq.a1}</p>
          </details>
          <details className="faq-item">
            <summary>{t.faq.q2}</summary>
            <p>{t.faq.a2}</p>
          </details>
          <details className="faq-item">
            <summary>{t.faq.q3}</summary>
            <p>{t.faq.a3}</p>
          </details>
          <details className="faq-item">
            <summary>{t.faq.q4}</summary>
            <p>{t.faq.a4}</p>
          </details>
        </div>
      </section>

      {/* FINAL QUOTE BANNER */}
      <section className="quote-section">
        <div className="eyebrow">{t.quote.eyebrow}</div>
        <h2 style={{ whiteSpace: 'pre-line' }}>{t.quote.title}</h2>
        <p>{t.quote.sub}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 30, flexWrap: 'wrap' }}>
          <Link className="button" style={{ borderColor: '#b3b79f' }} href="/shop">
            {t.quote.cta}
            <ArrowRight size={16} />
          </Link>
          <a
            className="button secondary"
            style={{ color: '#fff', borderColor: '#b3b79f' }}
            href={content.whatsapp ? `https://wa.me/${content.whatsapp.replace(/\D/g, '')}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.quote.whatsapp_cta}
          </a>
        </div>
      </section>
    </div>
  );
}
