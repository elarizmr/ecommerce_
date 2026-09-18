import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/lib/models/Product";
import { CATEGORIES, Section } from "@/app/lib/categories";
import { requireAdmin } from "@/app/lib/models/requireAdmin";

const ALLOWED_FIELDS = [
  "name", "price", "section", "subcategory", "description",
  "image", "stock", "sizes", "colors",
  "information", "modelInfo", "materialInfo", "shippingReturns", "points",
];

function pick(body: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key))
  );
}

function isSection(value: unknown): value is Section {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(CATEGORIES, value);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  await dbConnect();

  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /admin/products error:", error);
    return NextResponse.json(
      { error: "Məhsullar yüklənərkən xəta baş verdi" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await dbConnect();

  try {
    const body = pick(await req.json());
    const { section, subcategory } = body;

    if (!isSection(section)) {
      return NextResponse.json(
        { error: `Yanlış section. Mövcud olanlar: ${Object.keys(CATEGORIES).join(", ")}` },
        { status: 400 }
      );
    }

    const validSubcategories: readonly string[] = CATEGORIES[section];
    if (typeof subcategory !== "string" || !validSubcategories.includes(subcategory)) {
      return NextResponse.json(
        { error: `Yanlış subcategory. "${section}" üçün mövcud olanlar: ${validSubcategories.join(", ")}` },
        { status: 400 }
      );
    }

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST /admin/products error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Məhsul yaradılarkən xəta baş verdi" },
      { status: 500 }
    );
  }
}