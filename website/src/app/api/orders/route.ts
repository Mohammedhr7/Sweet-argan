import { checkoutSchema } from '@/features/checkout/validation';
import { serviceDb } from '@/lib/supabase/public';
import { checkOrigin, rateLimit, readJson, apiError, newToken, hash, saveToken } from '@/lib/security';

export async function POST(req: Request) {
  try {
    checkOrigin(req);
    await rateLimit(req, 'checkout', 15);
    const parsed = checkoutSchema.safeParse(await readJson(req));
    if (!parsed.success) {
      return Response.json(
        { error: 'Vérifiez votre panier et vos coordonnées.' },
        { status: 400 }
      );
    }
    const { customer, items, idempotency_key } = parsed.data;
    const token = newToken();
    const { data, error } = await serviceDb().rpc('create_guest_order', {
      p_customer: customer,
      p_items: items,
      p_idempotency_key: idempotency_key,
      p_fingerprint: hash(JSON.stringify({ customer, items })),
      p_token_hash: hash(token)
    });

    if (error) {
      console.error('Create guest order RPC error:', error);
      const messages: Record<string, string> = {
        OUT_OF_STOCK: 'Stock insuffisant. Modifiez votre panier.',
        UNAVAILABLE_PRODUCT: 'Un produit n’est plus disponible.',
        VARIANT_REQUIRED: 'Choisissez une variante.',
        CHECKOUT_DISABLED: 'Les commandes sont temporairement fermées.',
        IDEMPOTENCY_CONFLICT: 'Le panier a changé. Actualisez avant de réessayer.'
      };
      const key = Object.keys(messages).find(k => error.message?.includes(k));
      return Response.json(
        { error: key ? messages[key] : 'Commande non enregistrée. Réessayez.' },
        { status: 409 }
      );
    }

    await saveToken(data.code, token);
    return Response.json({ code: data.code, total: data.total }, { status: 201 });
  } catch (error) {
    console.error('Order API error:', error);
    return apiError(error);
  }
}

