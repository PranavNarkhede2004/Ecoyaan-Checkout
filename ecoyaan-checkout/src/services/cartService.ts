import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { mockCartData } from '@/lib/mockData';

export async function getCartData() {
    try {
        const db = await connectToDatabase();

        if (!db) {
            return mockCartData;
        }

        const count = await Product.countDocuments();

        if (count === 0) {
            console.log('Seeding database with updated mock products...');
            await Product.insertMany(mockCartData.cartItems);
        }

        const products = await Product.find({}).lean();

        // Map `_id` to string if needed, but since we use `product_id` we just pass it along
        const sanitizedProducts = products.map((p: any) => ({
            product_id: p.product_id,
            product_name: p.product_name,
            product_price: p.product_price,
            quantity: p.quantity,
            image: p.image,
        }));

        return {
            cartItems: sanitizedProducts,
            shipping_fee: 50,
            discount_applied: 0,
        };
    } catch (error) {
        console.error('Service Error:', error);
        return mockCartData;
    }
}
