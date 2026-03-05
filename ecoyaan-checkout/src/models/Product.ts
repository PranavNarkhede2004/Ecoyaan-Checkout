import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct {
    product_id: number;
    product_name: string;
    product_price: number;
    quantity: number;
    image: string;
}

export interface IProductDocument extends IProduct, Document { }

const ProductSchema: Schema<IProductDocument> = new Schema(
    {
        product_id: { type: Number, required: true, unique: true },
        product_name: { type: String, required: true },
        product_price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export const Product: Model<IProductDocument> =
    mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
