import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    await connectDB();
    const total = await Product.countDocuments();
    const categories = await Product.distinct('category');
    return { total, categories: categories.length };
  } catch {
    return { total: 0, categories: 0 };
  }
}

export default async function Home() {
  const stats = await getStats();

  return (
    <div>
      {/* Hero */}
      <div className="py-5 text-center">
        <h1 className="display-4 fw-bold mb-3">
          Welcome to <span className="text-primary">Electronia</span>
        </h1>
        <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: 600 }}>
          A full-stack Next.js application with MongoDB, CRUD operations, and
          secure authentication powered by NextAuth.
        </p>
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <Link href="/products" className="btn btn-primary btn-lg px-4">
            Browse Products
          </Link>
          <Link
            href="/products/add"
            className="btn btn-outline-primary btn-lg px-4"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-5 justify-content-center">
        <div className="col-sm-5 col-md-4">
          <div className="card border-0 shadow-sm text-center py-4">
            <div className="display-5 fw-bold text-primary">{stats.total}</div>
            <div className="text-muted mt-1">Total Products</div>
          </div>
        </div>
      </div>
      {stats.total === 0 && (
        <div className="alert alert-warning">
          <strong>📦 Database is empty!</strong> Visit{' '}
          <a href="/api/seed" className="alert-link">
            /api/seed
          </a>{' '}
          to import 194 products from dummyjson.com into your MongoDB.
        </div>
      )}
    </div>
  );
}
