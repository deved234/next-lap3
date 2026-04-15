import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    thumbnail: { type: String, default: '' },
  },
  {
    timestamps: true,
    collection: 'products',
  },
);

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
