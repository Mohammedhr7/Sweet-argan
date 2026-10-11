/**
 * Centralized domain rules for customer order lifecycle & editability.
 * Authoritative business rules for confirmation, modification, and cancellation.
 */

export interface OrderEditabilityContext {
  fulfillment_status: string;
  confirmation_status: string;
  stock_released?: boolean;
  editable_until?: string | null;
  reservation_expires_at?: string | null;
}

/**
 * A customer can modify an order ONLY when:
 * 1. fulfillment_status is 'new' (once admin sets to 'processing', 'ready', 'shipped', 'delivered', 'cancelled', 'returned' modification is locked immediately).
 * 2. stock has not been released.
 * 3. confirmation_status is in ('pending', 'needs_review', 'confirmed').
 * 4. Time limit:
 *    - If confirmed: current_time < editable_until (24h default from confirmed_at). Historical confirmed orders with null editable_until are not editable.
 *    - If pending / needs_review: current_time < reservation_expires_at.
 */
export function canCustomerModifyOrder(
  order: OrderEditabilityContext | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!order) return false;

  // Strict fulfillment check - modification locks as soon as fulfillment moves past 'new'
  if (order.fulfillment_status !== 'new') return false;

  // Stock must not be released
  if (order.stock_released) return false;

  // Confirmation state must be valid
  if (!['pending', 'needs_review', 'confirmed'].includes(order.confirmation_status)) {
    return false;
  }

  // Time window validation
  if (order.confirmation_status === 'confirmed') {
    if (!order.editable_until) return false; // historical orders have no window
    return new Date(order.editable_until).getTime() > nowMs;
  }

  // Pending / needs review uses reservation window
  if (order.reservation_expires_at) {
    return new Date(order.reservation_expires_at).getTime() > nowMs;
  }

  return true;
}

/**
 * A customer can cancel an order under the exact same conditions as modification:
 * within the allowed time window, and only before fulfillment processing has started.
 */
export function canCustomerCancelOrder(
  order: OrderEditabilityContext | null | undefined,
  nowMs: number = Date.now()
): boolean {
  return canCustomerModifyOrder(order, nowMs);
}

/**
 * A customer can confirm an order when it is pending / needs_review and still within the reservation window.
 */
export function canCustomerConfirmOrder(
  order: OrderEditabilityContext | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!order) return false;
  if (!['pending', 'needs_review'].includes(order.confirmation_status)) return false;
  return canCustomerModifyOrder(order, nowMs);
}

/**
 * Format remaining seconds into a clear human-readable string (e.g., "18 h 42 min")
 */
export function formatRemainingTime(seconds: number, locale: string = 'fr'): string {
  if (seconds <= 0) return locale === 'ar' ? '0 دقيقة' : '0 min';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (locale === 'ar') {
    if (hours > 0) {
      return `${hours} ساعة و ${minutes} دقيقة`;
    }
    return `${minutes} دقيقة`;
  }

  if (hours > 0) {
    return `${hours} h ${minutes} min`;
  }
  return `${minutes} min`;
}

