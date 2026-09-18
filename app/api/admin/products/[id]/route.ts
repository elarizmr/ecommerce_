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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await dbConnect();
  const { id } = await params;

  try {
    const body = await req.json();
    const update = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_FIELDS.includes(key))
    );

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Məhsul tapılmadı" }, { status: 404 });
    }

    // Son vəziyyəti yoxla: göndərilməyən sahə köhnə məhsuldan götürülür
    const section = String(update.section ?? existing.section);
    const subcategory = String(update.subcategory ?? existing.subcategory);

    if (!Object.prototype.hasOwnProperty.call(CATEGORIES, section)) {
      return NextResponse.json(
        { error: `Yanlış section. Mövcud olanlar: ${Object.keys(CATEGORIES).join(", ")}` },
        { status: 400 }
      );
    }

    const validSubcategories: readonly string[] = CATEGORIES[section as Section];
    if (!validSubcategories.includes(subcategory)) {
      return NextResponse.json(
        { error: `Yanlış subcategory. "${section}" üçün mövcud olanlar: ${validSubcategories.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /admin/products/[id] error:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Yanlış ID formatı" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Məhsul yenilənərkən xəta baş verdi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  await dbConnect();
  const { id } = await params;

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Məhsul tapılmadı" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE /admin/products/[id] error:", error);

    if (error.name === "CastError") {
      return NextResponse.json({ error: "Yanlış ID formatı" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Məhsul silinərkən xəta baş verdi" },
      { status: 500 }
    );
  }
}