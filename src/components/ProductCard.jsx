"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${product.title}"?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="card h-100 shadow-sm border-0">
      <div
        className="card-img-top d-flex align-items-center justify-content-center bg-light"
        style={{ height: 200, overflow: "hidden" }}
      >
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ maxHeight: "100%", objectFit: "contain" }}
          />
        ) : (
          <span className="text-muted fs-1"></span>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="card-title fw-bold mb-3 text-truncate">{product.title}</h6>

        <div className="mb-3">
          <span className="fw-bold text-success fs-5">
            ${Number(product.price || 0).toFixed(2)}
          </span>
        </div>

        <div className="mt-auto d-flex gap-2">
          <Link
            href={`/products/${product._id}`}
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            View
          </Link>

          {session && (
            <>
              <Link
                href={`/products/${product._id}/edit`}
                className="btn btn-outline-warning btn-sm"
              >
                Edit
              </Link>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Del"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
