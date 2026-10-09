import { z } from 'zod';

export function normalizePhone(value: string) {
  let phone = value.replace(/[\s().-]/g, '').replace(/^00212/, '+212');
  if (/^212[67]\d{8}$/.test(phone)) phone = '+' + phone;
  if (/^0[67]\d{8}$/.test(phone)) phone = '+212' + phone.slice(1);
  if (/^[67]\d{8}$/.test(phone)) phone = '+212' + phone;
  return phone;
}

export const phoneSchema = z
  .string()
  .transform(normalizePhone)
  .pipe(
    z
      .string()
      .regex(
        /^\+212[67]\d{8}$/,
        'Veuillez saisir un numéro de téléphone mobile marocain valide (ex: 06 61 98 33 29).'
      )
  );

const text = (min: number, max: number, label = 'Ce champ') =>
  z
    .string()
    .trim()
    .min(min, `${label} doit contenir au moins ${min} caractère${min > 1 ? 's' : ''}.`)
    .max(max, `${label} ne peut dépasser ${max} caractères.`)
    .refine(v => !/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v), 'Caractères non valides.');

export const customerSchema = z.object({
  full_name: text(2, 100, 'Le nom complet'),
  phone: phoneSchema,
  city: text(2, 100, 'La ville'),
  address: text(3, 500, "L'adresse"),
  email: z.union([z.string().email('Adresse e-mail invalide'), z.literal('')]).default(''),
  notes: text(0, 1000, 'Les remarques').default('')
});

export const cartItemSchema = z
  .object({
    product_id: z.string().uuid(),
    variant_id: z.string().uuid().nullable().default(null),
    quantity: z.number().int().min(1).max(20)
  })
  .strict();

export const checkoutSchema = z
  .object({
    customer: customerSchema,
    items: z.array(cartItemSchema).min(1).max(30),
    idempotency_key: z.string().uuid()
  })
  .strict();

export const orderCodeSchema = z.string().regex(/^SA-\d{4}-\d{6,12}$/);

export const confirmationSchema = z
  .object({
    code: orderCodeSchema,
    action: z.enum(['confirm', 'reject', 'modify', 'message']),
    message: text(0, 1000).default('')
  })
  .strict();

export type CustomerInput = z.input<typeof customerSchema>;
export type Customer = z.output<typeof customerSchema>;
