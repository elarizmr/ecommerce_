import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/lib/models/Product";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Məhsul tapılmadı" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Yanlış ID formatı" }, { status: 400 });
    }
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
  }
}