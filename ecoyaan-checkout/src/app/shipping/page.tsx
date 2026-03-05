'use client';

import { useForm } from 'react-hook-form';
import { useCheckoutStore, ShippingAddress } from '@/store/useCheckoutStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ShippingPage() {
  const router = useRouter();
  const { cartItems, shippingAddress, setShippingAddress } = useCheckoutStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>({
    defaultValues: shippingAddress || {},
  });

  useEffect(() => {
    setIsHydrated(true);
    // Redirect to cart if empty
    if (useCheckoutStore.getState().cartItems.length === 0) {
      router.push('/');
    }
  }, [router]);

  if (!isHydrated) return null;

  const onSubmit = (data: ShippingAddress) => {
    setShippingAddress(data);
    router.push('/confirmation');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4 text-sm font-medium text-gray-500">
          <button onClick={() => router.push('/')} className="hover:text-emerald-600 transition-colors">Cart</button>
          <span>/</span>
          <span className="text-gray-900">Shipping</span>
          <span>/</span>
          <span>Payment</span>
        </div>

        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl sm:px-10 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
            <p className="mt-2 text-sm text-gray-600">Please enter your details to complete your order.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName', { required: 'Full name is required' })}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <div className="mt-1">
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Must be exactly 10 digits"
                      }
                    })}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                    placeholder="9876543210"
                  />
                  {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address line (optional for this mocked step)</label>
              <div className="mt-1">
                <input
                  id="address"
                  type="text"
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="123 Eco Street..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <div className="mt-1">
                  <input
                    id="city"
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  {errors.city && <p className="mt-2 text-sm text-red-600">{errors.city.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <div className="mt-1">
                  <input
                    id="state"
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  {errors.state && <p className="mt-2 text-sm text-red-600">{errors.state.message}</p>}
                </div>
              </div>

              <div className="sm:col-span-1">
                <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">PIN Code</label>
                <div className="mt-1">
                  <input
                    id="pinCode"
                    type="text"
                    {...register('pinCode', { 
                      required: 'PIN is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Must be 6 digits"
                      }
                     })}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                  {errors.pinCode && <p className="mt-2 text-sm text-red-600">{errors.pinCode.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98]"
              >
                Continue to Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
