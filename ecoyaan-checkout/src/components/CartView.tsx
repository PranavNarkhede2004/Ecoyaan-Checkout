'use client';

import { useEffect, useState } from 'react';
import { useCheckoutStore, CartItem } from '@/store/useCheckoutStore';
import { Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface CartViewProps {
  initialCart: CartItem[];
  initialShippingFee: number;
}

export default function CartView({ initialCart, initialShippingFee }: CartViewProps) {
  const router = useRouter();
  const { cartItems, shippingFee, setCartData, updateQuantity } = useCheckoutStore();
  
  // Hydration fix for Zustand + Next.js SSR
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if store is empty, if so populate from SSR
    if (useCheckoutStore.getState().cartItems.length === 0) {
      setCartData(initialCart, initialShippingFee, 0);
    }
    setIsHydrated(true);
  }, [initialCart, initialShippingFee, setCartData]);

  if (!isHydrated) {
    return <div className="p-8 text-center text-gray-500">Loading cart...</div>;
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.product_price * item.quantity, 0);
  const total = subtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm mt-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <motion.ul 
            className="divide-y divide-gray-100"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.li 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={item.product_id} 
                  className="py-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:bg-gray-50 transition-colors -mx-6 px-6"
                >
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <Image 
                    src={item.image} 
                    alt={item.product_name} 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                </div>
                
                <div className="flex-1 w-full flex flex-col sm:flex-row justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-gray-900">{item.product_name}</h3>
                    <p className="text-emerald-600 font-medium">₹{item.product_price.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-2 text-gray-500 hover:bg-gray-50 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-96 bg-gray-50 rounded-2xl p-6 lg:p-8 h-fit sticky top-8 border border-gray-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6 font-display">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Standard Shipping</span>
              <span className="font-medium text-gray-900">₹{shippingFee.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-emerald-600">₹{total.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Including all taxes</p>
          </div>
          
          <button 
            onClick={() => router.push('/shipping')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
