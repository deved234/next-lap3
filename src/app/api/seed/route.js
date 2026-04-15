import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const existing = await Product.countDocuments();
    if (existing > 0) {
      return NextResponse.json({
        message: `Database already has ${existing} products. To re-seed, drop the collection first in MongoDB Compass.`,
        count: existing,
      });
    }

    const res = await fetch("https://dummyjson.com/products?limit=194");
    const data = await res.json();

    if (!data.products || data.products.length === 0) {
      return NextResponse.json(
        { error: "No products returned from dummyjson" },
        { status: 500 }
      );
    }

    const cleaned = data.products.map((product) => ({
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail || product.images?.[0] || "",
    }));

    const inserted = await Product.insertMany(cleaned, { ordered: false });

    return NextResponse.json({
      message: `âœ… Successfully seeded ${inserted.length} products into MongoDB!`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
