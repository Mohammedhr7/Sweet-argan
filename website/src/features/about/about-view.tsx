'use client';

import Link from 'next/link';
import { ArrowRight, Leaf, HeartHandshake, Sparkles, ShieldCheck } from 'lucide-react';
import { StorefrontImage } from '@/components/storefront-image';
import { useLanguage } from '@/features/i18n/language-context';

export function AboutView({ instagram }: { instagram: string }) {
  const { t, locale, dir } = useLanguage();

  const isAr = locale === 'ar';
  const isEn = locale === 'en';

  return (
    <div dir={dir}>
      {/* HERO / INTRO */}
      <section className="container section story-grid">
        <div className="story-copy">
          <div className="eyebrow">
            {isAr
              ? 'تعاونية فلاحية نسوية · أكادير، سوس ماسة، المغرب'
              : isEn
              ? 'WOMEN’S AGRICULTURAL COOPERATIVE · AGADIR, MOROCCO'
              : 'COOPÉRATIVE AGRICOLE FÉMININE · AGADIR, MAROC'}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.2 }}>
            {isAr
              ? 'ذهب المغرب الخالص، تصوغه أنامل صانعات سوس الأصيلات.'
              : isEn
              ? 'The gold of Morocco, crafted by the women of the Souss.'
              : 'L\'or du Maroc, façonné par les mains des femmes du Souss.'}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8 }}>
            {isAr
              ? 'تأسست تعاونية سويت أركان في سهل سوس الخصيب على مشارف الأطلس الصغير، انطلاقاً من رغبة أصيلة: صون التراث المغربي المتوارث في شجرة الأركان، مع تمكين نساء منطقتنا القروية من استقلالية اقتصادية كريمة ومستدامة.'
              : isEn
              ? 'Rooted in the fertile Souss-Massa plains in Agadir, Sweet Argan was founded with a profound mission: preserving the ancestral Moroccan heritage of wild argan trees while fostering fair economic empowerment for rural women artisans.'
              : 'Implantée dans la plaine fertile du Souss, aux portes de l\'Anti-Atlas, Sweet Argan est née d\'une volonté profonde : préserver et célébrer le savoir-faire ancestral marocain de l\'arganier, tout en offrant aux femmes de notre région une autonomie économique digne et durable.'}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8 }}>
            {isAr
              ? 'هنا، كل موسم جني هو تكريم لكرم الأرض وبركتها. ننتقي كل نواة أركان بعناية فائقة قبل عصرها ميكانيكياً على البارد دون أي حرارة أو مواد كيميائية، مما يضمن نقاءً كاملاً وتركيزاً مثالياً لمضادات الأكسدة وفيتامين E الطبيعي.'
              : isEn
              ? 'Every harvest is a celebration of nature. Each kernel is meticulously inspected and mechanically cold-pressed without heat or solvents, guaranteeing absolute botanical purity and maximum antioxidant potency.'
              : 'Ici, chaque récolte est un hommage à la nature. Chaque amandon est méticuleusement sélectionné avant d\'être pressé mécaniquement à froid, garantissant une pureté absolue et une concentration optimale en précieux antioxydants.'}
          </p>
          <div style={{ marginTop: 30, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link className="button" href="/shop">
              {t.categories_section.view_all}
              <ArrowRight size={16} />
            </Link>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="button secondary"
            >
              {t.social.follow} ↗
            </a>
          </div>
        </div>
        <div className="story-photo">
          <StorefrontImage
            src="/assets/site-content/about-story.jpg"
            alt={isAr ? 'عصر الأركان التقليدي بأيدي نساء التعاونية' : 'Fabrication artisanale Sweet Argan'}
            fill
            priority
            sizes="(max-width:760px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* VALUES */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              {isAr ? 'مبادئنا وميثاق الشرف' : isEn ? 'OUR CORE PRINCIPLES' : 'NOS VALEURS FONDATRICES'}
            </div>
            <h2>
              {isAr
                ? 'التزام راسخ بمستحضرات طبيعية نقية وأخلاقية.'
                : isEn
                ? 'Uncompromising commitment to pure and ethical cosmetics.'
                : 'L\'exigence d\'une cosmétique éthique et pure.'}
            </h2>
          </div>
        </div>
        <div className="pillars-grid">
          <div className="pillar-card">
            <Leaf size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{isAr ? 'حماية المحمية الحيوية' : isEn ? 'Preserved Biosphere' : 'Terroir Préservé'}</h3>
            <p>
              {isAr
                ? 'تنمو أشجار الأركان البرية في محمية المحيط الحيوي للأركان المصنفة من اليونسكو، مع احترام دورات الإزهار الطبيعي.'
                : isEn
                ? 'Our wild argan trees flourish within the UNESCO biosphere reserve under sustainable harvesting guidelines.'
                : 'Nos arganiers sauvages s\'épanouissent dans la réserve de biosphère de l\'UNESCO en respectant les cycles naturels.'}
            </p>
          </div>
          <div className="pillar-card">
            <HeartHandshake size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{isAr ? 'أثر تضامني حقيقي' : isEn ? 'Social Solidarity' : 'Impact Solidaire'}</h3>
            <p>
              {isAr
                ? 'تضمن سويت أركان دخلاً عادلاً ومستمراً لجميع الصانعات، مساهمةً في تعليم أبنائهن ورفاه أسرهن في القرى.'
                : isEn
                ? 'Direct fair compensation for every woman artisan, supporting education and economic independence.'
                : 'Sweet Argan garantit une rémunération équitable à toutes nos artisanes, contribuant à l\'éducation de leurs familles.'}
            </p>
          </div>
          <div className="pillar-card">
            <Sparkles size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{isAr ? 'عصر ميكانيكي على البارد' : isEn ? 'Cold-Pressed Extraction' : 'Extraction à Froid'}</h3>
            <p>
              {isAr
                ? 'بدون تسخين أو معالجة كيماوية. يحتفظ زيتنا بلونه الذهبي الصافي وأحماضه الدهنية النادرة وفيتاميناته الفعالة.'
                : isEn
                ? 'Never heated or refined. Retains virgin golden shade, essential omega fatty acids, and natural vitamin E.'
                : 'Jamais chauffée, jamais raffinée. Notre huile conserve sa teinte dorée, ses acides gras nobles et sa vitamine E native.'}
            </p>
          </div>
          <div className="pillar-card">
            <ShieldCheck size={28} color="#927b4f" strokeWidth={1.5} />
            <h3>{isAr ? 'نقاء وشفافية كاملة' : isEn ? 'Total Transparency' : 'Transparence Totale'}</h3>
            <p>
              {isAr
                ? 'مكونات واضحة وصادقة. خالية تماماً من البارابين، السلفات والمشتقات البترولية المضرة بصحة البشرة.'
                : isEn
                ? 'Short, clean formulas. 100% free from parabens, phthalates, and petrochemical derivatives.'
                : 'Aucun ingrédient masqué. Des formulations courtes, lisibles, sans parabènes ni dérivés pétrochimiques.'}
            </p>
          </div>
        </div>
      </section>

      {/* TERROIR TO RITUAL */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div
          className="story-grid"
          style={{
            background: '#f5f0e6',
            border: '1px solid var(--line)',
            padding: 'clamp(24px, 5vw, 60px)'
          }}
        >
          <div className="story-photo" style={{ height: 440 }}>
            <StorefrontImage
              src="/assets/site-content/home-terroir.jpg"
              alt={isAr ? 'خيرات الأرض والمائدة المغربية' : 'Le terroir marocain'}
              fill
              sizes="(max-width:760px) 100vw, 50vw"
            />
          </div>
          <div className="story-copy">
            <div className="eyebrow">
              {isAr ? 'من سخاء الأرض إلى روتينكِ اليومي' : isEn ? 'FROM THE SOIL TO YOUR RITUAL' : 'DE LA TERRE À VOTRE RITUEL'}
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)' }}>
              {isAr ? 'تناغم بين العناية الجمالية والمذاق الأصيل.' : isEn ? 'Harmony between beauty and authentic flavor.' : 'L\'alliance de la beauté et du goût.'}
            </h2>
            <p style={{ lineHeight: 1.8 }}>
              {isAr
                ? 'في المغرب، تغذي شجرة الأركان الجسد والروح معاً. تجمع سويت أركان بين وجهي هذه الشجرة المباركة:'
                : isEn
                ? 'In Morocco, the argan tree nourishes both skin and spirit. Sweet Argan embraces both facets:'
                : 'Au Maroc, l\'arganier nourrit autant le corps que l\'âme. Sweet Argan réunit les deux facettes :'}
            </p>
            <p style={{ lineHeight: 1.8 }}>
              • <strong>{isAr ? 'الطقوس التجميلية' : isEn ? 'Cosmetic Rituals' : 'Le rituel cosmétique'}</strong> :{' '}
              {isAr
                ? 'كريمات مغذية، زيوت تسمير ذهبية، صابون الفحم المنشط، مزيلات عرق طبيعية، وأقنعة الطين البركاني التقليدي.'
                : isEn
                ? 'Velvety creams, golden tanning oils, activated charcoal soaps, natural deodorants, and mineral clays.'
                : 'Crèmes onctueuses, huiles solaires éclatantes, savons purifiants, déodorants naturels et argiles ancestrales.'}
            </p>
            <p style={{ lineHeight: 1.8 }}>
              • <strong>{isAr ? 'نكهات التراث البلدي' : isEn ? 'Terroir Delights' : 'La gourmandise du terroir'}</strong> :{' '}
              {isAr
                ? 'أملو التعاونية المحضر باللوز البلدي المحمص، عسل النحل الحر، وزيت الأركان الغذائي وفق الطريقة العائلية الأصيلة.'
                : isEn
                ? 'Handcrafted Amlou prepared with toasted beldi almonds, pure honey, and culinary argan oil.'
                : 'Notre Amlou artisanal préparé aux amandes beldi torréfiées, miel pur d\'oranger et huile d\'argan toastée.'}
            </p>
            <div style={{ marginTop: 24 }}>
              <Link href="/shop" className="button">
                {t.categories_section.view_all}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL QUOTE */}
      <section className="quote-section">
        <div className="eyebrow">{t.quote.eyebrow}</div>
        <h2>{t.quote.title}</h2>
        <p>{t.quote.sub}</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 25, flexWrap: 'wrap' }}>
          <Link className="button" style={{ borderColor: '#b3b79f' }} href="/shop">
            {t.quote.cta}
          </Link>
          <Link className="button secondary" style={{ color: '#fff', borderColor: '#b3b79f' }} href="/contact">
            {t.nav.contact}
          </Link>
        </div>
      </section>
    </div>
  );
}
