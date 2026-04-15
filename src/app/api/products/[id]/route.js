import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { isValidMongoId } from '@/lib/mongo-helpers';
import Product from '@/models/Product';

// GET /api/products/:id
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!isValidMongoId(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

// PUT /api/products/:id
export async function PUT(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!isValidMongoId(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }
    const body = await request.json();
    const productData = {
      title: typeof body.title === 'string' ? body.title.trim() : '',
      price: Number(body.price),
      thumbnail:
        typeof body.thumbnail === 'string' ? body.thumbnail.trim() : '',
    };

    if (!productData.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!Number.isFinite(productData.price) || productData.price < 0) {
      return NextResponse.json(
        { error: 'Price must be a valid non-negative number' },
        { status: 400 },
      );
    }

    const product = await Product.findByIdAndUpdate(
      id,
      productData,
      { new: true, runValidators: true },
    ).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
    }

    if (error.name === 'CastError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 },
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    if (!isValidMongoId(id)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }
    const product = await Product.findByIdAndDelete(id).lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 },
    );
  }
}
