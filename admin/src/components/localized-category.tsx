'use client';

import { useAdminLanguage } from '@/features/i18n/language-context';
import {
  getLocalizedCategoryName,
  getLocalizedCategoryDescription
} from '@/lib/category-i18n';

export function LocalizedCategoryName({
  name
}: {
  name: string | null | undefined;
}) {
  const { locale } = useAdminLanguage();
  return <>{getLocalizedCategoryName(name, locale)}</>;
}

export function LocalizedCategoryDescription({
  name,
  fallback = ''
}: {
  name: string | null | undefined;
  fallback?: string;
}) {
  const { locale } = useAdminLanguage();
  return <>{getLocalizedCategoryDescription(name, locale, fallback)}</>;
}
