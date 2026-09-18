import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/lib/models/Product";

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const subcategory = searchParams.get("subcategory");

  const filter: Record<string, any> = {};

  if (section) {
    filter.section = section.toLowerCase(); // schema-da enum kiçik hərflidir
  }

  if (subcategory) {
    // "running-gear" → "Running Gear", "running gear", "running-gear"
    const pattern = subcategory.split("-").map(escapeRegex).join("[\\s-]");
    filter.subcategory = { $regex: new RegExp(`^${pattern}$`, "i") };
  }

  try {
    const products = await Product.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Məhsullar yüklənərkən xəta baş verdi" },
      { status: 500 }
    );
  }
}