import { connectDB } from '../../lib/mongodb';
import Product from '../../models/Product';
import ProductCard from '../../components/ProductCard';
import Link from 'next/link';
import { auth } from '../../lib/auth';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }) {
  const session = await auth();
  const sp = await searchParams;
  const page = parseInt(sp.page || '1');
  const search = sp.search || '';

  await connectDB();

  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };

  const limit = 12;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">
          Products <span className="badge bg-secondary fs-6">{total}</span>
        </h2>
        {session && (
          <Link href="/products/add" className="btn btn-primary">
            + Add Product
          </Link>
        )}
      </div>

      <form className="mb-4">
        <div className="row g-2">
          <div className="col-sm-9 col-md-10">
            <input
              type="text"
              name="search"
              className="form-control"
              placeholder="Search by title..."
              defaultValue={search}
            />
          </div>
          <div className="col-sm-3 col-md-2">
            <button className="btn btn-outline-primary w-100" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>

      {products.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div className="fs-1 mb-3">ðŸ“¦</div>
          <p className="fs-5">No products found.</p>
          {total === 0 && (
            <a href="/api/seed" className="btn btn-warning">
              Seed Database from dummyjson
            </a>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div key={p._id.toString()} className="col-sm-6 col-lg-4 col-xl-3">
              <ProductCard product={{ ...p, _id: p._id.toString() }} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-5">
          <ul className="pagination justify-content-center flex-wrap">
            <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
              <Link
                className="page-link"
                href={`/products?page=${page - 1}&search=${search}`}
              >
                â€¹ Prev
              </Link>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                <Link
                  className="page-link"
                  href={`/products?page=${p}&search=${search}`}
                >
                  {p}
                </Link>
              </li>
            ))}

            <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
              <Link
                className="page-link"
                href={`/products?page=${page + 1}&search=${search}`}
              >
                Next 
              </Link>
            </li>
          </ul>
          <p className="text-center text-muted small mt-2">
            Page {page} of {totalPages} â€” {total} products total
          </p>
        </nav>
      )}
    </div>
  );
}
