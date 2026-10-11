import { z } from 'zod';
import { cartItemSchema, orderCodeSchema } from '@/features/checkout/validation';
import { serviceDb } from '@/lib/supabase/public';
import { checkOrigin, rateLimit, readJson, apiError, readToken, saveToken, hash } from '@/lib/security';

const schema = z
  .object({
    code: orderCodeSchema,
    action: z.enum(['confirm', 'modify', 'cancel']),
    revision: z.number().int().positive(),
    items: z.array(cartItemSchema).min(1).max(30).optional(),
    shipping: z
      .object({
        city: z.string().trim().min(2).max(100),
        address: z.string().trim().min(2).max(500),
        notes: z.string().max(1000).default('')
      })
      .strict()
      .optional(),
    reason: z.string().max(500).optional(),
    token: z.string().optional()
  })
  .strict();

export async function POST(req: Request) {
  try {
    checkOrigin(req);
    await rateLimit(req, 'order-management', 30);

    const parsed = schema.safeParse(await readJson(req));
    if (!parsed.success) {
      return Response.json(
        { error: 'Vérifiez les produits sélectionnés et les détails de livraison.' },
        { status: 400 }
      );
    }

    const p = parsed.data;
    const token = (await readToken(p.code)) || p.token || req.headers.get('x-order-token');
    if (!token) {
      return Response.json(
        { error: 'Accès expiré. Retrouvez votre commande avec votre téléphone.' },
        { status: 403 }
      );
    }

    const db = serviceDb();
    const tokenHash = hash(token);

    // 1. Fetch order
    const { data: order, error: orderErr } = await db
      .from('orders')
      .select('*')
      .eq('public_order_code', p.code)
      .eq('access_token_hash', tokenHash)
      .maybeSingle();

    if (orderErr || !order || new Date(order.access_expires_at).getTime() <= Date.now()) {
      return Response.json(
        { error: 'Accès expiré. Retrouvez votre commande avec votre téléphone.' },
        { status: 403 }
      );
    }

    // 2. Concurrency check
    if (p.revision !== order.revision) {
      return Response.json(
        { error: 'Cette commande a changé. Actualisez la page avant de réessayer.' },
        { status: 409 }
      );
    }

    const now = Date.now();
    const editableDeadline = order.editable_until
      ? new Date(order.editable_until).getTime()
      : new Date(order.reservation_expires_at).getTime();

    const isEditable =
      order.fulfillment_status === 'new' &&
      !order.stock_released &&
      ['pending', 'needs_review', 'confirmed'].includes(order.confirmation_status) &&
      now < editableDeadline;

    // --- ACTION: CANCEL ---
    if (p.action === 'cancel') {
      if (order.fulfillment_status === 'cancelled') {
        const { data: view } = await db.rpc('customer_order_view', {
          p_code: p.code,
          p_token_hash: tokenHash
        });
        return Response.json(view, { headers: { 'Cache-Control': 'no-store' } });
      }

      if (!isEditable) {
        return Response.json(
          { error: 'Cette commande ne peut plus être modifiée ou annulée en ligne.' },
          { status: 409 }
        );
      }

      // Release reserved inventory
      const { data: items } = await db.from('order_items').select('*').eq('order_id', order.id);
      if (items && !order.stock_released) {
        for (const item of items) {
          if (item.inventory_reserved) {
            if (item.variant_id) {
              const { data: vr } = await db
                .from('product_variants')
                .select('stock_quantity')
                .eq('id', item.variant_id)
                .single();
              if (vr) {
                await db
                  .from('product_variants')
                  .update({ stock_quantity: vr.stock_quantity + item.quantity })
                  .eq('id', item.variant_id);
              }
            } else if (item.product_id) {
              const { data: pr } = await db
                .from('products')
                .select('stock_quantity')
                .eq('id', item.product_id)
                .single();
              if (pr) {
                await db
                  .from('products')
                  .update({ stock_quantity: pr.stock_quantity + item.quantity })
                  .eq('id', item.product_id);
              }
            }
          }
        }
      }

      await db
        .from('orders')
        .update({
          fulfillment_status: 'cancelled',
          cancellation_reason: p.reason?.trim() || null,
          cancelled_at: new Date().toISOString(),
          stock_released: true
        })
        .eq('id', order.id);

      await db.from('order_status_history').insert({
        order_id: order.id,
        status_type: 'fulfillment',
        old_status: order.fulfillment_status,
        new_status: 'cancelled'
      });

      await db.from('order_change_events').insert({
        order_id: order.id,
        change_type: 'order_cancelled',
        before_data: { status: order.fulfillment_status },
        after_data: { status: 'cancelled' }
      });

      const { data: view } = await db.rpc('customer_order_view', {
        p_code: p.code,
        p_token_hash: tokenHash
      });
      return Response.json(view, { headers: { 'Cache-Control': 'no-store' } });
    }

    // --- ACTION: CONFIRM ---
    if (p.action === 'confirm') {
      if (order.confirmation_status === 'confirmed' && order.fulfillment_status !== 'cancelled') {
        const { data: view } = await db.rpc('customer_order_view', {
          p_code: p.code,
          p_token_hash: tokenHash
        });
        return Response.json(view, { headers: { 'Cache-Control': 'no-store' } });
      }

      if (!isEditable && order.confirmation_status !== 'pending' && order.confirmation_status !== 'needs_review') {
        return Response.json(
          { error: 'Cette commande ne peut plus être confirmée en ligne.' },
          { status: 409 }
        );
      }

      const { data: currentItems } = await db
        .from('order_items')
        .select('product_id')
        .eq('order_id', order.id);

      if (!currentItems || currentItems.length === 0) {
        return Response.json(
          { error: 'Votre commande doit contenir au moins un produit.' },
          { status: 409 }
        );
      }

      const confirmedAt = new Date().toISOString();
      const editableUntil = new Date(now + 24 * 3600 * 1000).toISOString();

      await db
        .from('orders')
        .update({
          confirmation_status: 'confirmed',
          confirmation_method: 'website_button',
          confirmed_at: confirmedAt,
          editable_until: editableUntil,
          reservation_expires_at: editableUntil
        })
        .eq('id', order.id);

      await db.from('order_confirmation_events').insert({
        order_id: order.id,
        event_type: 'customer_confirmed',
        method: 'website_button'
      });

      await db.from('order_status_history').insert({
        order_id: order.id,
        status_type: 'confirmation',
        old_status: order.confirmation_status,
        new_status: 'confirmed'
      });

      if (order.last_modified_at) {
        await db.from('order_change_events').insert({
          order_id: order.id,
          change_type: 'order_reconfirmed'
        });
      }

      if (p.token && !(await readToken(p.code))) {
        try {
          await saveToken(p.code, p.token);
        } catch {}
      }

      const { data: view } = await db.rpc('customer_order_view', {
        p_code: p.code,
        p_token_hash: tokenHash
      });
      return Response.json(view, { headers: { 'Cache-Control': 'no-store' } });
    }

    // --- ACTION: MODIFY ---
    if (p.action === 'modify') {
      if (!isEditable) {
        return Response.json(
          { error: 'Cette commande ne peut plus être modifiée ou annulée en ligne.' },
          { status: 409 }
        );
      }

      if (!p.items || p.items.length === 0) {
        return Response.json(
          { error: 'Votre commande doit contenir au moins un produit.' },
          { status: 400 }
        );
      }

      if (!p.shipping || !p.shipping.city || !p.shipping.address) {
        return Response.json(
          { error: 'Vérifiez la ville et l’adresse de livraison.' },
          { status: 400 }
        );
      }

      // Read shipping settings
      const { data: shipSetting } = await db
        .from('settings')
        .select('value')
        .eq('key', 'shipping')
        .maybeSingle();

      const shipCfg = (shipSetting?.value as { amount?: number; free_threshold?: number; enabled?: boolean } | null) || {
        amount: 35,
        free_threshold: 300,
        enabled: true
      };
      const baseShippingAmount = Number(shipCfg.amount ?? 35);

      // Fetch existing items for stock release and change tracking
      const { data: oldItems } = await db.from('order_items').select('*').eq('order_id', order.id);

      // Release previously reserved stock
      if (oldItems && !order.stock_released) {
        for (const item of oldItems) {
          if (item.inventory_reserved) {
            if (item.variant_id) {
              const { data: vr } = await db
                .from('product_variants')
                .select('stock_quantity')
                .eq('id', item.variant_id)
                .single();
              if (vr) {
                await db
                  .from('product_variants')
                  .update({ stock_quantity: vr.stock_quantity + item.quantity })
                  .eq('id', item.variant_id);
              }
            } else if (item.product_id) {
              const { data: pr } = await db
                .from('products')
                .select('stock_quantity')
                .eq('id', item.product_id)
                .single();
              if (pr) {
                await db
                  .from('products')
                  .update({ stock_quantity: pr.stock_quantity + item.quantity })
                  .eq('id', item.product_id);
              }
            }
          }
        }
      }

      // Fetch active catalog products and variants for new items
      const productIds = Array.from(new Set(p.items.map((i) => i.product_id)));
      const { data: dbProducts } = await db
        .from('products')
        .select('id, name, sku, price, stock_quantity, track_inventory, is_active, status, product_variants(*)')
        .in('id', productIds)
        .eq('is_active', true)
        .eq('status', 'active');

      let validationError = '';
      for (const item of p.items) {
        const pr = dbProducts?.find((prod) => prod.id === item.product_id);
        if (!pr) {
          validationError = 'Un produit n’est plus disponible. Modifiez votre sélection.';
          break;
        }

        if (item.variant_id) {
          const vr = pr.product_variants?.find(
            (v: { id: string; is_active: boolean; stock_quantity: number }) =>
              v.id === item.variant_id && v.is_active
          );
          if (!vr) {
            validationError = 'Une variante choisie n’est plus disponible.';
            break;
          }
          if (pr.track_inventory && vr.stock_quantity < item.quantity) {
            validationError = 'Le stock a changé. Réduisez la quantité ou retirez le produit.';
            break;
          }
        } else {
          if (pr.product_variants?.some((v: { is_active: boolean }) => v.is_active)) {
            validationError = 'Choisissez une variante pour ce produit.';
            break;
          }
          if (pr.track_inventory && pr.stock_quantity < item.quantity) {
            validationError = 'Le stock a changé. Réduisez la quantité ou retirez le produit.';
            break;
          }
        }
      }

      if (validationError) {
        // Rollback: re-reserve old items stock
        if (oldItems && !order.stock_released) {
          for (const item of oldItems) {
            if (item.inventory_reserved) {
              if (item.variant_id) {
                const { data: vr } = await db
                  .from('product_variants')
                  .select('stock_quantity')
                  .eq('id', item.variant_id)
                  .single();
                if (vr) {
                  await db
                    .from('product_variants')
                    .update({ stock_quantity: Math.max(0, vr.stock_quantity - item.quantity) })
                    .eq('id', item.variant_id);
                }
              } else if (item.product_id) {
                const { data: pr } = await db
                  .from('products')
                  .select('stock_quantity')
                  .eq('id', item.product_id)
                  .single();
                if (pr) {
                  await db
                    .from('products')
                    .update({ stock_quantity: Math.max(0, pr.stock_quantity - item.quantity) })
                    .eq('id', item.product_id);
                }
              }
            }
          }
        }
        return Response.json({ error: validationError }, { status: 409 });
      }

      // Deduct inventory for new items
      for (const item of p.items) {
        const pr = dbProducts!.find((prod) => prod.id === item.product_id)!;
        if (pr.track_inventory) {
          if (item.variant_id) {
            const vr = pr.product_variants.find(
              (v: { id: string }) => v.id === item.variant_id
            )!;
            await db
              .from('product_variants')
              .update({ stock_quantity: vr.stock_quantity - item.quantity })
              .eq('id', item.variant_id);
          } else {
            await db
              .from('products')
              .update({ stock_quantity: pr.stock_quantity - item.quantity })
              .eq('id', pr.id);
          }
        }
      }

      // Fetch images for snapshot
      const { data: images } = await db
        .from('product_images')
        .select('product_id, image_url, sort_order')
        .in('product_id', productIds)
        .order('sort_order');

      let subtotal = 0;
      const newRowsToInsert = p.items.map((item) => {
        const pr = dbProducts!.find((prod) => prod.id === item.product_id)!;
        const vr = item.variant_id
          ? pr.product_variants.find((v: { id: string; name: string; sku: string; price: number }) => v.id === item.variant_id)
          : null;
        const unit_price = Number(vr ? vr.price : pr.price);
        const line_total = unit_price * item.quantity;
        subtotal += line_total;
        const image_url = images?.find((im) => im.product_id === pr.id)?.image_url || '';

        return {
          order_id: order.id,
          product_id: pr.id,
          variant_id: vr ? vr.id : null,
          product_name: vr ? `${pr.name} — ${vr.name}` : pr.name,
          product_sku: vr ? vr.sku : pr.sku,
          product_image_url: image_url,
          quantity: item.quantity,
          unit_price,
          line_total,
          inventory_reserved: pr.track_inventory
        };
      });

      const shipping_amount =
        shipCfg.free_threshold && subtotal >= Number(shipCfg.free_threshold)
          ? 0
          : baseShippingAmount;
      const discount_amount = Math.min(Number(order.discount_amount || 0), subtotal);
      const total = subtotal + shipping_amount - discount_amount;

      // Replace items
      await db.from('order_items').delete().eq('order_id', order.id);
      await db.from('order_items').insert(newRowsToInsert);

      const prevCity = order.shipping_city;
      const prevAddr = order.shipping_address;
      const prevNotes = order.shipping_notes;

      // Update order
      await db
        .from('orders')
        .update({
          subtotal,
          shipping_amount,
          discount_amount,
          total,
          shipping_city: p.shipping.city.trim(),
          shipping_address: p.shipping.address.trim(),
          shipping_notes: p.shipping.notes?.trim() || null,
          last_modified_at: new Date().toISOString(),
          confirmation_status: 'pending',
          confirmed_at: null,
          confirmation_method: null,
          confirmed_by: null,
          stock_released: false
        })
        .eq('id', order.id);

      // Audit logs
      await db.from('order_change_events').insert({
        order_id: order.id,
        change_type: 'items_updated',
        before_data: { items: oldItems, total: order.total },
        after_data: { items: newRowsToInsert, total }
      });

      if (
        prevCity !== p.shipping.city.trim() ||
        prevAddr !== p.shipping.address.trim() ||
        prevNotes !== (p.shipping.notes?.trim() || null)
      ) {
        await db.from('order_change_events').insert({
          order_id: order.id,
          change_type: 'address_updated'
        });
      }

      await db.from('order_status_history').insert({
        order_id: order.id,
        status_type: 'confirmation',
        old_status: order.confirmation_status,
        new_status: 'pending'
      });

      await db.from('order_confirmation_events').insert({
        order_id: order.id,
        event_type: 'confirmation_requested',
        method: 'customer_edit'
      });

      if (p.token && !(await readToken(p.code))) {
        try {
          await saveToken(p.code, p.token);
        } catch {}
      }

      const { data: view } = await db.rpc('customer_order_view', {
        p_code: p.code,
        p_token_hash: tokenHash
      });

      return Response.json(view, { headers: { 'Cache-Control': 'no-store' } });
    }

    return Response.json({ error: 'Action non reconnue.' }, { status: 400 });
  } catch (error) {
    return apiError(error);
  }
}
