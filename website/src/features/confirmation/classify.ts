export function normalizeConfirmation(message: string) { return message.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase(); }
const accepted = new Set(['oui','yes','ok','confirmer','confirme','confirmation']);
export function classifyConfirmation(message: string): 'confirmed' | 'needs_review' {
 const normalized=normalizeConfirmation(message);
 return accepted.has(normalized) || message.trim()==='تأكيد' || message.trim()==='نعم' ? 'confirmed' : 'needs_review';
}
