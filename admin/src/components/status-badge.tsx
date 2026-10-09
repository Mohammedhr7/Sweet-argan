'use client';

import { useAdminLanguage } from '@/features/i18n/language-context';
import {
  confirmationLabels,
  fulfillmentLabels,
  localizedConfirmation,
  localizedFulfillment,
} from '@/constants/status';

export function StatusBadge({
  status,
  type = 'confirmation',
}: {
  status: string;
  type?: 'confirmation' | 'fulfillment';
}) {
  const { locale } = useAdminLanguage();
  const map = type === 'confirmation' ? localizedConfirmation : localizedFulfillment;
  const label =
    map[locale]?.[status] ||
    (type === 'confirmation' ? confirmationLabels : fulfillmentLabels)[status] ||
    status;

  return <span className={'badge ' + status}>{label}</span>;
}
