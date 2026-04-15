"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const INITIAL = {
  title: "",
  price: "",
  thumbnail: "",
};

export default function ProductForm({ initialData = null, productId = null }) {
  const isEdit = !!productId;
  const router = useRouter();

  const [form, setForm] = useState(
    initialData
      ? {
          title: initialData.title || "",
          price: initialData.price || "",
          thumbnail: initialData.thumbnail || "",
        }
      : INITIAL,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const title = form.title.trim();
    const thumbnail = form.thumbnail.trim();
    const price = Number(form.price);

    if (!title) {
      setError("Title is required.");
      setLoading(false);
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      setLoading(false);
      return;
    }

    const payload = {
      title,
      price,
      thumbnail,
    };

    try {
      const url = isEdit ? `/api/products/${productId}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/products");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-3">
        <div className="col-12">
          <label className="form-label fw-semibold">
            Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            placeholder="Product title"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">
            Price ($) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold">Image URL</label>
          <input
            type="url"
            name="thumbnail"
            className="form-control"
            value={form.thumbnail}
            onChange={handleChange}
            placeholder="https://..."
          />
          {form.thumbnail && (
            <img
              src={form.thumbnail}
              alt="preview"
              className="mt-2 rounded border"
              style={{ maxHeight: 120, objectFit: "contain" }}
            />
          )}
        </div>

        <div className="col-12 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {isEdit ? "Saving..." : "Adding..."}
              </>
            ) : isEdit ? (
              " Save Changes"
            ) : (
              " Add Product"
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
