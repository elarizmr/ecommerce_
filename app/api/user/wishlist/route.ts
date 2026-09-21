// app/api/user/wishlist/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";
import Product from "@/app/lib/models/Product";

// Cookie-dəki token-dən istifadəçi ID-sini çıxarır (/api/user/me ilə eyni üsul)
async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id ?? null;
  } catch {
    return null;
  }
}

const unauthorized = () =>
  NextResponse.json({ error: "Əvvəlcə daxil olmalısan" }, { status: 401 });

const badId = () =>
  NextResponse.json({ error: "Yanlış məhsul ID" }, { status: 400 });

// GET → bəyənilən məhsulların siyahısı (ən son əlavə olunan birinci)
// Giriş etməyən istifadəçi üçün boş siyahı qaytarılır (xəta deyil)
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ products: [], ids: [] });

  try {
    await dbConnect();

    const user: any = await User.findById(userId)
      .select("wishlist")
      .populate({ path: "wishlist", model: Product })
      .lean();

    // Silinmiş məhsullar populate-dən sonra null olur, onları süzürük
    const products = [...(user?.wishlist ?? [])].filter(Boolean).reverse();
    const ids = products.map((p: any) => String(p._id));

    return NextResponse.json({ products, ids });
  } catch (error) {
    console.error("GET /api/user/wishlist error:", error);
    return NextResponse.json({ error: "Siyahı yüklənmədi" }, { status: 500 });
  }
}

// POST { productId } → siyahıya əlavə et
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const productId = body?.productId;
  if (!mongoose.isValidObjectId(productId)) return badId();

  try {
    await dbConnect();

    const exists = await Product.exists({ _id: productId });
    if (!exists) {
      return NextResponse.json({ error: "Məhsul tapılmadı" }, { status: 404 });
    }

    // $addToSet eyni məhsulun iki dəfə əlavə olunmasının qarşısını alır
    await User.updateOne({ _id: userId }, { $addToSet: { wishlist: productId } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/user/wishlist error:", error);
    return NextResponse.json({ error: "Əlavə olunmadı" }, { status: 500 });
  }
}

// DELETE /api/user/wishlist?productId=... → siyahıdan çıxar
export async function DELETE(req: Request) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const productId = new URL(req.url).searchParams.get("productId");
  if (!mongoose.isValidObjectId(productId)) return badId();

  try {
    await dbConnect();
    await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/user/wishlist error:", error);
    return NextResponse.json({ error: "Silinmədi" }, { status: 500 });
  }
}