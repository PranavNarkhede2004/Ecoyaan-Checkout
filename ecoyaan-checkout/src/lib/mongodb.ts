import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecoyaan-checkout';

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose;

if (!cached) {
    // @ts-ignore
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        try {
            cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                console.log('Successfully connected to MongoDB.');
                return mongoose;
            });
        } catch (e) {
            console.warn('Failed to connect to MongoDB. Falling back to mock data...');
            return null;
        }
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.warn('Failed to connect to MongoDB. App will use mock data fallback.', e);
        return null;
    }

    return cached.conn;
}

export default connectToDatabase;
