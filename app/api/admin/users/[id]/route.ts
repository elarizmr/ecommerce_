import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";
import { requireAdmin } from "@/app/lib/models/requireAdmin";

// Schema-na uyğunlaşdır: admin yalnız bu sahələri dəyişə bilsin
const ALLOWED_FIELDS = ["name", "email", "role"];

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

    const updatedUser = await User.findByIdAndUpdate(id, update, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password"); // sahənin adı fərqlidirsə (passwordHash və s.) dəyiş

    if (!updatedUser) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Yanlış ID formatı" }, { status: 400 });
    }
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PUT /admin/users/[id] error:", error);
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
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
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Yanlış ID formatı" }, { status: 400 });
    }
    console.error("DELETE /admin/users/[id] error:", error);
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
  }
}