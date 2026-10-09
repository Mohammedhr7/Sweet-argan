'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminTranslations, AdminLocale, AdminDictionary } from './translations';

interface AdminLanguageContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: AdminDictionary;
  dir: 'rtl' | 'ltr';
}

const AdminLanguageContext = createContext<AdminLanguageContextType>({
  locale: 'ar',
  setLocale: () => {},
  t: adminTranslations.ar,
  dir: 'rtl',
});

const STORAGE_KEY = 'sweetargan_admin_locale';

export function AdminLanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>('ar');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AdminLocale | null;
      if (saved && (saved === 'ar' || saved === 'fr' || saved === 'en')) {
        setLocaleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // ignore
    }
    const dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale]);

  const t = adminTranslations[locale] || adminTranslations.ar;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <AdminLanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </AdminLanguageContext.Provider>
  );
}

export function useAdminLanguage() {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    return {
      locale: 'ar' as AdminLocale,
      setLocale: () => {},
      t: adminTranslations.ar,
      dir: 'rtl' as const,
    };
  }
  return context;
}

export function AdminLanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useAdminLanguage();

  const options: { code: AdminLocale; label: string; short: string }[] = [
    { code: 'ar', label: 'العربية (المغرب)', short: 'العربية' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'en', label: 'English', short: 'EN' },
  ];

  return (
    <div className={`inline-flex items-center rounded-lg border border-brand-sand bg-white p-0.5 shadow-xs ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.code}
          type="button"
          onClick={() => setLocale(opt.code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            locale === opt.code
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-brand-charcoal hover:bg-brand-bone/50 hover:text-brand-primary'
          }`}
          title={opt.label}
        >
          {opt.short}
        </button>
      ))}
    </div>
  );
}
