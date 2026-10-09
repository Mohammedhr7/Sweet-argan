export const confirmationLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  needs_review: 'À vérifier',
  rejected: 'Refusée',
  expired: 'Expirée',
};

export const fulfillmentLabels: Record<string, string> = {
  new: 'Nouvelle',
  processing: 'En préparation',
  ready: 'Prête',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  returned: 'Retournée',
};

export const localizedConfirmation: Record<string, Record<string, string>> = {
  ar: {
    pending: 'قيد التأكيد',
    confirmed: 'مؤكدة',
    needs_review: 'بحاجة لمراجعة',
    rejected: 'مرفوضة',
    expired: 'منتهية',
  },
  fr: {
    pending: 'En attente',
    confirmed: 'Confirmée',
    needs_review: 'À vérifier',
    rejected: 'Refusée',
    expired: 'Expirée',
  },
  en: {
    pending: 'Pending',
    confirmed: 'Confirmed',
    needs_review: 'Needs Review',
    rejected: 'Rejected',
    expired: 'Expired',
  },
};

export const localizedFulfillment: Record<string, Record<string, string>> = {
  ar: {
    new: 'جديدة',
    processing: 'قيد التحضير',
    ready: 'جاهزة للشحن',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغاة',
    returned: 'مرتجعة',
  },
  fr: {
    new: 'Nouvelle',
    processing: 'En préparation',
    ready: 'Prête',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    returned: 'Retournée',
  },
  en: {
    new: 'New',
    processing: 'In Processing',
    ready: 'Ready',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
  },
};

export function nextStatuses(status: string) {
  return (
    ({
      new: ['processing', 'cancelled'],
      processing: ['ready', 'cancelled'],
      ready: ['shipped', 'cancelled'],
      shipped: ['delivered', 'returned'],
      delivered: ['returned'],
    } as Record<string, string[]>)[status] || []
  );
}
