import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

export const metadata = { title: 'Add Product – ProductsHub' };

export default async function AddProductPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

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
            <li className="breadcrumb-item active">Add Product</li>
          </ol>
        </nav>

        <h2 className="fw-bold mb-4">➕ Add New Product</h2>

        <div className="card shadow-sm border-0 p-4">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
