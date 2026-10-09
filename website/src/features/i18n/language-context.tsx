'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Locale, type Dictionary, translations } from './translations';
import { Globe } from 'lucide-react';

interface LanguageContextType {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: Dictionary;
  setLocale: (l: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'ar',
  dir: 'rtl',
  t: translations.ar,
  setLocale: () => {}
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    // Read preference from localStorage or cookie, default to 'ar'
    const saved = localStorage.getItem('sweet_argan_lang') as Locale | null;
    if (saved && ['ar', 'fr', 'en'].includes(saved)) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = translations[saved].dir;
    } else {
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('sweet_argan_lang', newLocale);
    document.cookie = `sweet_argan_lang=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLocale;
    document.documentElement.dir = translations[newLocale].dir;
  };

  const t = translations[locale] || translations.ar;
  const dir = t.dir;

  return (
    <LanguageContext.Provider value={{ locale, dir, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="lang-switcher" aria-label="Choisir la langue / اختر اللغة">
      <Globe size={16} className="lang-icon" />
      <button
        type="button"
        className={`lang-btn ${locale === 'ar' ? 'active' : ''}`}
        onClick={() => setLocale('ar')}
        aria-pressed={locale === 'ar'}
      >
        العربية
      </button>
      <span className="lang-sep">|</span>
      <button
        type="button"
        className={`lang-btn ${locale === 'fr' ? 'active' : ''}`}
        onClick={() => setLocale('fr')}
        aria-pressed={locale === 'fr'}
      >
        FR
      </button>
      <span className="lang-sep">|</span>
      <button
        type="button"
        className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        EN
      </button>
    </div>
  );
}
