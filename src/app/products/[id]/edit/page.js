import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { isValidMongoId } from '@/lib/mongo-helpers';
import Product from '@/models/Product';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  if (!isValidMongoId(id)) notFound();
  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) notFound();

  // Serialize MongoDB document for client-side use
  const serialized = JSON.parse(JSON.stringify(product));

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/products">Products</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/products/${id}`}>{product.title}</Link>
            </li>
            <li className="breadcrumb-item active">Edit</li>
          </ol>
        </nav>

        <h2 className="fw-bold mb-4">✏️ Edit Product</h2>

        <div className="card shadow-sm border-0 p-4">
          <ProductForm initialData={serialized} productId={id} />
        </div>
      </div>
    </div>
  );
}
