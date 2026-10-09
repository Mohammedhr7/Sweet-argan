import { CheckoutForm } from '@/features/checkout/checkout-form';
import { getShipping } from '@/services/catalog';

export const metadata = {
  title: 'تأكيد الطلب · Sweet Argan',
  robots: { index: false, follow: false }
};

export default async function Checkout() {
  const shipping = await getShipping();
  return (
    <div className="container section">
      <CheckoutForm shipping={shipping} />
    </div>
  );
}
