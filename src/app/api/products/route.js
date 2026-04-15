import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const productData = {
      title: typeof body.title === "string" ? body.title.trim() : "",
      price: Number(body.price),
      thumbnail: typeof body.thumbnail === "string" ? body.thumbnail.trim() : "",
    };

    if (!productData.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (!Number.isFinite(productData.price) || productData.price < 0) {
      return NextResponse.json(
        { error: "Price must be a valid non-negative number" },
        { status: 400 }
      );
    }

    const product = await Product.create(productData);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    if (error.name === "CastError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
