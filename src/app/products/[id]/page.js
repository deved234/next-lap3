import { connectDB } from '@/lib/mongodb';
import { isValidMongoId } from '@/lib/mongo-helpers';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DeleteButton from '@/components/DeleteButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  if (!isValidMongoId(id)) {
    return { title: 'Product - ProductsHub' };
  }
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    return { title: `${product?.title || 'Product'} â€“ ProductsHub` };
  } catch {
    return { title: 'Product â€“ ProductsHub' };
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  if (!isValidMongoId(id)) notFound();

  await connectDB();
  const product = await Product.findById(id).lean();

  if (!product) notFound();

  const session = await auth();

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/products">Products</Link>
          </li>
          <li
            className="breadcrumb-item active text-truncate"
            style={{ maxWidth: 200 }}
          >
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-5">
          <div
            className="bg-light rounded d-flex align-items-center justify-content-center mb-3 border"
            style={{ height: 320 }}
          >
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <span className="fs-1"></span>
            )}
          </div>
        </div>

        <div className="col-md-7">
          <h1 className="fw-bold h2 mb-3">{product.title}</h1>

          <div className="my-4">
            <h2 className="text-success fw-bold mb-0">
              ${Number(product.price || 0).toFixed(2)}
            </h2>
            <p className="text-muted mt-2 mb-0">
              This product stores only the title, price, and image.
            </p>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <Link href="/products" className="btn btn-outline-secondary">
              Back to Products
            </Link>
            {session && (
              <>
                <Link
                  href={`/products/${product._id}/edit`}
                  className="btn btn-warning"
                >
                 Edit
                </Link>
                <DeleteButton productId={product._id.toString()} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
