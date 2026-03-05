import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    image: string;
}

export interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    pinCode: string;
    city: string;
    state: string;
}

interface CheckoutState {
    // Cart State
    cartItems: CartItem[];
    shippingFee: number;
    discountApplied: number;

    // Actions for Cart
    setCartData: (items: CartItem[], shippingFee: number, discountApplied: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;

    // Shipping State
    shippingAddress: ShippingAddress | null;

    // Actions for Shipping
    setShippingAddress: (address: ShippingAddress) => void;

    // Clear state after successful order
    clearCart: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set) => ({
            cartItems: [],
            shippingFee: 50,
            discountApplied: 0,
            shippingAddress: null,

            setCartData: (items, fee, discount) =>
                set({
                    cartItems: items,
                    shippingFee: fee,
                    discountApplied: discount,
                }),

            updateQuantity: (productId, newQuantity) =>
                set((state) => ({
                    cartItems: state.cartItems.map((item) =>
                        item.product_id === productId
                            ? { ...item, quantity: Math.max(1, newQuantity) }
                            : item
                    ),
                })),

            setShippingAddress: (address) => set({ shippingAddress: address }),

            clearCart: () =>
                set({
                    cartItems: [],
                    shippingAddress: null,
                    shippingFee: 50,
                    discountApplied: 0,
                }),
        }),
        {
            name: 'ecoyaan-checkout-storage', // saves to local storage so data persists on refresh
            version: 1, // forces cache invalidation so the user gets the new images immediately
        }
    )
);
