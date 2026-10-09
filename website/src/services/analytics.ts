export type AnalyticsEvent = 'view_product' | 'add_to_cart' | 'begin_checkout' | 'purchase' | 'order_confirmed';
type Payload = { product_id?: string; quantity?: number; value?: number; currency?: 'MAD' };
type Provider = (event: AnalyticsEvent, payload: Payload) => void;
let provider: Provider | null = null;
export function configureAnalytics(next: Provider | null) { provider = next; }
export function track(event: AnalyticsEvent, payload: Payload = {}) { provider?.(event,payload); }
// Configure a consent-aware provider later. Never pass customer PII or access tokens.
