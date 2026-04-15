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

    const products = await Product.find().sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "No products found in MongoDB Atlas. Please seed your database first." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Fetched ${products.length} products from MongoDB Atlas.`,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
