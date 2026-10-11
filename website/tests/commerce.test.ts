import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkoutSchema, normalizePhone, phoneSchema } from '../src/features/checkout/validation';
import { classifyConfirmation } from '../src/features/confirmation/classify';
import {
  canCustomerModifyOrder,
  canCustomerCancelOrder,
  canCustomerConfirmOrder,
  formatRemainingTime,
} from '../src/lib/order-rules';

const valid = {
  customer: {
    full_name: 'Test Client',
    phone: '0612345678',
    city: 'Agadir',
    address: 'Adresse de test 123',
    email: '',
    notes: '',
  },
  items: [
    {
      product_id: '20000000-0000-4000-8000-000000000001',
      quantity: 2,
      variant_id: null,
    },
  ],
  idempotency_key: '30000000-0000-4000-8000-000000000001',
};

test('checkout accepts valid guest details and normalizes Moroccan mobile phone', () => {
  const result = checkoutSchema.parse(valid);
  assert.equal(result.customer.phone, '+212612345678');
  assert.equal(normalizePhone('00212 7 12 34 56 78'), '+212712345678');
});

test('invalid phone, empty cart and invalid quantity are rejected', () => {
  for (const phone of ['1234', '+33612345678', '0512345678', '+2126123456789']) {
    assert.equal(phoneSchema.safeParse(phone).success, false);
  }
  assert.equal(checkoutSchema.safeParse({ ...valid, items: [] }).success, false);
  for (const quantity of [0, -1, 1.5, 21]) {
    assert.equal(
      checkoutSchema.safeParse({ ...valid, items: [{ ...valid.items[0], quantity }] }).success,
      false
    );
  }
});

test('client cannot submit price or total fields', () => {
  assert.equal(checkoutSchema.safeParse({ ...valid, total: 1 }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...valid, items: [{ ...valid.items[0], price: 0 }] }).success, false);
});

test('only exact normalized confirmation words are accepted', () => {
  for (const text of ['oui', 'OK', 'تأكيد', 'نعم', '  confirmé  ', 'CONFIRMER']) {
    assert.equal(classifyConfirmation(text), 'confirmed', text);
  }
  for (const text of ['oui mais changer adresse', 'ok?', 'random text', '', 'oui non', 'no', 'yes please change']) {
    assert.equal(classifyConfirmation(text), 'needs_review', text);
  }
});

test('centralized domain rules: customer order editability and lifecycle', () => {
  const baseNow = Date.now();
  const future = new Date(baseNow + 24 * 60 * 60 * 1000).toISOString();
  const past = new Date(baseNow - 1000).toISOString();

  // Pending order within reservation is editable and confirmable
  const pending = {
    fulfillment_status: 'new',
    confirmation_status: 'pending',
    reservation_expires_at: future,
  };
  assert.equal(canCustomerModifyOrder(pending, baseNow), true);
  assert.equal(canCustomerCancelOrder(pending, baseNow), true);
  assert.equal(canCustomerConfirmOrder(pending, baseNow), true);

  // Confirmed order within 24h editable_until is editable & cancellable, but not re-confirmable
  const confirmed = {
    fulfillment_status: 'new',
    confirmation_status: 'confirmed',
    editable_until: future,
  };
  assert.equal(canCustomerModifyOrder(confirmed, baseNow), true);
  assert.equal(canCustomerCancelOrder(confirmed, baseNow), true);
  assert.equal(canCustomerConfirmOrder(confirmed, baseNow), false);

  // Expired 24-hour window locks both modification and cancellation
  const expiredConfirmed = {
    fulfillment_status: 'new',
    confirmation_status: 'confirmed',
    editable_until: past,
  };
  assert.equal(canCustomerModifyOrder(expiredConfirmed, baseNow), false);
  assert.equal(canCustomerCancelOrder(expiredConfirmed, baseNow), false);

  // Historical confirmed order with null editable_until is safely locked
  const historicalConfirmed = {
    fulfillment_status: 'new',
    confirmation_status: 'confirmed',
    editable_until: null,
  };
  assert.equal(canCustomerModifyOrder(historicalConfirmed, baseNow), false);
  assert.equal(canCustomerCancelOrder(historicalConfirmed, baseNow), false);

  // Admin processing immediately locks customer modification and cancellation
  for (const state of ['processing', 'ready', 'shipped', 'delivered', 'cancelled', 'returned']) {
    const lockedByAdmin = {
      fulfillment_status: state,
      confirmation_status: 'confirmed',
      editable_until: future,
    };
    assert.equal(canCustomerModifyOrder(lockedByAdmin, baseNow), false);
    assert.equal(canCustomerCancelOrder(lockedByAdmin, baseNow), false);
  }

  // Stock released orders are locked
  const stockReleased = {
    fulfillment_status: 'new',
    confirmation_status: 'confirmed',
    editable_until: future,
    stock_released: true,
  };
  assert.equal(canCustomerModifyOrder(stockReleased, baseNow), false);

  // Remaining time formatter
  assert.equal(formatRemainingTime(0), '0 min');
  assert.equal(formatRemainingTime(60), '1 min');
  assert.equal(formatRemainingTime(3600), '1 h 0 min');
  assert.equal(formatRemainingTime(18 * 3600 + 42 * 60), '18 h 42 min');
});
