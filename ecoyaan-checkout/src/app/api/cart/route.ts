import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { mockCartData } from '@/lib/mockData';

export async function GET() {
    try {
        const db = await connectToDatabase();

        // If DB connection fails, fallback to local mock data
        if (!db) {
            return NextResponse.json(mockCartData);
        }

        // Check if products exist in DB
        const count = await Product.countDocuments();

        // Seed DB if empty
        if (count === 0) {
            console.log('Seeding database with mock products...');
            await Product.insertMany(mockCartData.cartItems);
        }

        // Fetch products
        const products = await Product.find({}).lean();

        // Return structured data like the mock, but from DB
        return NextResponse.json({
            cartItems: products,
            shipping_fee: 50, // Static for now as per requirements
            discount_applied: 0,
        });
    } catch (error) {
        console.error('API Error:', error);
        // Ultimate fallback if any DB operation crashes surprisingly
        return NextResponse.json(mockCartData);
    }
}
