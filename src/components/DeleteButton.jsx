"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/products");
      router.refresh();
    } else {
      alert("Failed to delete product.");
      setLoading(false);
    }
  }

  return (
    <button
      className="btn btn-danger"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" />
          Deleting...
        </>
      ) : (
        " Delete"
      )}
    </button>
  );
}
