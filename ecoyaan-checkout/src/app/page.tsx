import CartView from '@/components/CartView';
import { getCartData } from '@/services/cartService';

// Ensure this page is dynamically rendered to fetch latest data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getCartData();

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <CartView initialCart={data.cartItems} initialShippingFee={data.shipping_fee} />
    </main>
  );
}
