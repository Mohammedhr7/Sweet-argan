import 'server-only';
export interface ConfirmationReminder { orderId: string; recipientPhone: string; secureUrl: string; }
export interface WhatsAppProvider { sendApprovedTemplate(input: ConfirmationReminder): Promise<{ messageId: string }>; }
// Implement only through the official Meta Cloud API with recipient consent,
// approved templates, verified webhooks and idempotent delivery in a future release.
