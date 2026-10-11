import type { AdminLocale } from '@/features/i18n/translations';

interface CategoryTranslation {
  name: { ar: string; fr: string; en: string };
  description: { ar: string; fr: string; en: string };
}

export const CATEGORY_MAP: Record<string, CategoryTranslation> = {
  'soins-du-visage': {
    name: {
      ar: 'العناية بالوجه',
      fr: 'Soins du visage',
      en: 'Face Care'
    },
    description: {
      ar: "كريمات ثمينة وتركيبات نباتية بزيت الأركان النقي والتين الشوكي لإشراقة ونضارة بشرتكِ.",
      fr: "Crèmes précieuses et formules botaniques à base d'huile d'argan et de figue de barbarie pour sublimer l'éclat de votre peau.",
      en: "Precious creams and botanical formulas with pure argan oil and prickly pear to enhance skin radiance."
    }
  },
  'soins du visage': {
    name: {
      ar: 'العناية بالوجه',
      fr: 'Soins du visage',
      en: 'Face Care'
    },
    description: {
      ar: "كريمات ثمينة وتركيبات نباتية بزيت الأركان النقي والتين الشوكي لإشراقة ونضارة بشرتكِ.",
      fr: "Crèmes précieuses et formules botaniques à base d'huile d'argan et de figue de barbarie pour sublimer l'éclat de votre peau.",
      en: "Precious creams and botanical formulas with pure argan oil and prickly pear to enhance skin radiance."
    }
  },
  'soins-du-corps': {
    name: {
      ar: 'العناية بالجسم',
      fr: 'Soins du corps',
      en: 'Body Care'
    },
    description: {
      ar: 'مزيلات عرق طبيعية بدون كحول، طقوس حمام وعناية يومية بالجسم لانتعاش وحماية دائمة.',
      fr: 'Déodorants solides naturels sans alcool, délices de hammam et soins corporels quotidiens pour une fraîcheur protectrice.',
      en: 'Natural solid deodorants without alcohol, hammam delights and daily body care for protective freshness.'
    }
  },
  'soins du corps': {
    name: {
      ar: 'العناية بالجسم',
      fr: 'Soins du corps',
      en: 'Body Care'
    },
    description: {
      ar: 'مزيلات عرق طبيعية بدون كحول، طقوس حمام وعناية يومية بالجسم لانتعاش وحماية دائمة.',
      fr: 'Déodorants solides naturels sans alcool, délices de hammam et soins corporels quotidiens pour une fraîcheur protectrice.',
      en: 'Natural solid deodorants without alcohol, hammam delights and daily body care for protective freshness.'
    }
  },
  'savons': {
    name: {
      ar: 'الصابون الطبيعي والصلصال',
      fr: 'Savons',
      en: 'Natural Soaps'
    },
    description: {
      ar: 'صابون تقليدي طبيعي 100% للتنظيف والتنقية مع الحفاظ على التوازن الطبيعي للبشرة.',
      fr: "Savons artisanaux 100% naturels pour nettoyer, détoxifier et respecter l'équilibre naturel de votre épiderme.",
      en: '100% natural handcrafted soaps to cleanse, detoxify, and respect the natural balance of your skin.'
    }
  },
  'masques-et-soins': {
    name: {
      ar: 'الأقنعة والصلصال',
      fr: 'Masques & Argiles',
      en: 'Masks & Clays'
    },
    description: {
      ar: 'صلصال طبيعي مغربي نقي وأقنعة تقليدية لطقوس عناية تليق بأرقى المنتجعات الصحية.',
      fr: 'Argiles naturelles pures et masques traditionnels marocains pour un rituel de soin digne des plus grands spas.',
      en: 'Pure natural clays and traditional Moroccan masks for a skincare ritual worthy of the finest spas.'
    }
  },
  'masques & argiles': {
    name: {
      ar: 'الأقنعة والصلصال',
      fr: 'Masques & Argiles',
      en: 'Masks & Clays'
    },
    description: {
      ar: 'صلصال طبيعي مغربي نقي وأقنعة تقليدية لطقوس عناية تليق بأرقى المنتجعات الصحية.',
      fr: 'Argiles naturelles pures et masques traditionnels marocains pour un rituel de soin digne des plus grands spas.',
      en: 'Pure natural clays and traditional Moroccan masks for a skincare ritual worthy of the finest spas.'
    }
  },
  'huiles-et-solaires': {
    name: {
      ar: 'الزيوت ومستحضرات التسمير',
      fr: 'Huiles & Solaires',
      en: 'Oils & Sun Care'
    },
    description: {
      ar: 'زيوت طبيعية ثمينة وتركيبات تسمير حريرية بزيت الأركان البيولوجي للحصول على لون برونزي ذهبي ومشرق.',
      fr: "Huiles précieuses et formules solaires satinées à l'argan biologique pour un bronzage doré lumineux et durable.",
      en: 'Precious oils and silky sun formulas with organic argan for a luminous and lasting golden tan.'
    }
  },
  'huiles & solaires': {
    name: {
      ar: 'الزيوت ومستحضرات التسمير',
      fr: 'Huiles & Solaires',
      en: 'Oils & Sun Care'
    },
    description: {
      ar: 'زيوت طبيعية ثمينة وتركيبات تسمير حريرية بزيت الأركان البيولوجي للحصول على لون برونزي ذهبي ومشرق.',
      fr: "Huiles précieuses et formules solaires satinées à l'argan biologique pour un bronzage doré lumineux et durable.",
      en: 'Precious oils and silky sun formulas with organic argan for a luminous and lasting golden tan.'
    }
  },
  'terroir-marocain': {
    name: {
      ar: 'المنتجات المجالية المغربية',
      fr: 'Terroir marocain',
      en: 'Moroccan Terroir'
    },
    description: {
      ar: 'أصالة المائدة المغربية الفاخرة: زيت أركان محمص للأكل وأملو تقليدي بلدي باللوز والعسل الحر.',
      fr: "L'authenticité gastronomique marocaine : huile d'argan alimentaire torréfiée et Amlou artisanal aux amandes et miel pur.",
      en: 'Authentic Moroccan gourmet heritage: toasted culinary argan oil and artisanal Amlou with almonds and pure honey.'
    }
  },
  'terroir marocain': {
    name: {
      ar: 'المنتجات المجالية المغربية',
      fr: 'Terroir marocain',
      en: 'Moroccan Terroir'
    },
    description: {
      ar: 'أصالة المائدة المغربية الفاخرة: زيت أركان محمص للأكل وأملو تقليدي بلدي باللوز والعسل الحر.',
      fr: "L'authenticité gastronomique marocaine : huile d'argan alimentaire torréfiée et Amlou artisanal aux amandes et miel pur.",
      en: 'Authentic Moroccan gourmet heritage: toasted culinary argan oil and artisanal Amlou with almonds and pure honey.'
    }
  },
  'coffrets': {
    name: {
      ar: 'المجموعات والهدايا',
      fr: 'Coffrets',
      en: 'Gift Sets'
    },
    description: {
      ar: 'تشكيلات كاملة ومجموعات هدايا تجمع بين أرقى مستحضرات العناية وكنوز سويت أركان الطبيعية.',
      fr: 'Compositions complètes et coffrets rituels associant soins cosmétiques et délices du terroir Sweet Argan.',
      en: 'Complete sets and ritual boxes combining cosmetic treatments with Sweet Argan terroir delights.'
    }
  }
};

export function getLocalizedCategoryName(
  nameOrSlug: string | null | undefined,
  locale: AdminLocale = 'ar'
): string {
  if (!nameOrSlug) return '—';
  const key = nameOrSlug.toLowerCase().trim();
  const entry = CATEGORY_MAP[key];
  if (entry) return entry.name[locale] || entry.name.fr;
  return nameOrSlug;
}

export function getLocalizedCategoryDescription(
  nameOrSlug: string | null | undefined,
  locale: AdminLocale = 'ar',
  fallback: string = ''
): string {
  if (!nameOrSlug) return fallback;
  const key = nameOrSlug.toLowerCase().trim();
  const entry = CATEGORY_MAP[key];
  if (entry) return entry.description[locale] || entry.description.fr;
  return fallback;
}
