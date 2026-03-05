'use client';

import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ConfirmationPage() {
  const router = useRouter();
  const { cartItems, shippingFee, shippingAddress, clearCart } = useCheckoutStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    // Redirect if no shipping address or cart
    if (useCheckoutStore.getState().cartItems.length === 0 && !paymentSuccess) {
      router.push('/');
    } else if (!useCheckoutStore.getState().shippingAddress && !paymentSuccess) {
      router.push('/shipping');
    }
  }, [router, paymentSuccess]);

  if (!isHydrated) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product_price * item.quantity, 0);
  const total = subtotal + shippingFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, shippingAddress, total }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrderId(data.orderId);
        setPaymentSuccess(true);
        clearCart(); // Empties the store
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100"
        >
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-emerald-100 mb-8">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-display">Order Successful!</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Thank you for shopping with Ecoyaan. Your order <strong className="text-gray-900">{orderId}</strong> is confirmed.
          </p>
          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md active:scale-[0.98]"
          >
            Return to Shop
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <button onClick={() => router.push('/')} className="hover:text-emerald-600 transition-colors">Cart</button>
            <span>/</span>
            <button onClick={() => router.push('/shipping')} className="hover:text-emerald-600 transition-colors">Shipping</button>
            <span>/</span>
            <span className="text-gray-900">Payment</span>
            </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Review Your Order</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Shipping Details</h3>
                <button onClick={() => router.push('/shipping')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Edit</button>
              </div>
              <div className="text-gray-600 space-y-1">
                <p className="font-medium text-gray-900">{shippingAddress?.fullName}</p>
                <p>{shippingAddress?.email} • {shippingAddress?.phone}</p>
                <p>{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.pinCode}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900">Items ({cartItems.length})</h3>
                 <button onClick={() => router.push('/')} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Edit</button>
              </div>
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li key={item.product_id} className="py-4 flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                       <Image src={item.image} alt={item.product_name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{item.product_name}</h4>
                      <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right font-medium text-gray-900">
                      ₹{(item.product_price * item.quantity).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Summary Box */}
          <div className="bg-white rounded-2xl p-6 h-fit shadow-md border border-gray-100 sticky top-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fees</span>
                <span className="font-medium text-gray-900">₹{shippingFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-end">
                <span className="font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-bold text-emerald-600">₹{total.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                'Pay Securely'
              )}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Encrypted and secure checkout
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
