import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <div className="display-1 fw-bold text-muted">404</div>
      <h2 className="mb-3">Page not found</h2>
      <p className="text-muted mb-4">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="btn btn-primary me-2">
        Go Home
      </Link>
      <Link href="/products" className="btn btn-outline-secondary">
        Browse Products
      </Link>
    </div>
  );
}
