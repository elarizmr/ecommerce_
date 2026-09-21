// app/api/user/cart/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";
import Product from "@/app/lib/models/Product";
import { getUserId } from "@/app/lib/getUserId";

// Bir sətirdə maksimum miqdar (stok bundan azdırsa stok limitdir)
const MAX_QTY = 10;

const unauthorized = () =>
  NextResponse.json({ error: "Əvvəlcə daxil olmalısan" }, { status: 401 });

const fail = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });

// Seçilmiş rəngin şəkli varsa onu, yoxdursa məhsulun əsas şəklini qaytarır
function lineImage(product: any, color: string): string {
  const variant = product.colors?.find((c: any) => c.name === color);
  return variant?.images?.[0] || product.image?.[0] || "";
}

// GET → səbətdəki sətirlər (məhsul məlumatı ilə birlikdə)
// Giriş etməyən istifadəçi üçün boş səbət qaytarılır (xəta deyil)
export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ items: [] });

  try {
    await dbConnect();

    const user: any = await User.findById(userId)
      .select("cart")
      .populate({ path: "cart.product", model: Product })
      .lean();

    // Silinmiş məhsullar populate-dən sonra null olur, onları süzürük
    const items = (user?.cart ?? [])
      .filter((line: any) => line.product)
      .map((line: any) => ({
        id: String(line._id),
        productId: String(line.product._id),
        name: line.product.name,
        price: line.product.price,
        image: lineImage(line.product, line.color),
        size: line.size || "",
        color: line.color || "",
        quantity: line.quantity,
        stock: line.product.stock ?? 0,
      }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/user/cart error:", error);
    return fail("Səbət yüklənmədi", 500);
  }
}

// POST { productId, size, color, quantity } → səbətə əlavə et
// Eyni məhsul + ölçü + rəng varsa yeni sətir açılmır, miqdar artır
export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const productId = body?.productId;
  const size: string = typeof body?.size === "string" ? body.size : "";
  const color: string = typeof body?.color === "string" ? body.color : "";
  const quantity = Math.max(1, Math.floor(Number(body?.quantity) || 1));

  if (!mongoose.isValidObjectId(productId)) return fail("Yanlış məhsul ID");

  try {
    await dbConnect();

    const product: any = await Product.findById(productId)
      .select("sizes colors stock")
      .lean();
    if (!product) return fail("Məhsul tapılmadı", 404);

    if (product.sizes?.length && !product.sizes.includes(size)) {
      return fail("Ölçü seçilməlidir");
    }
    if (!product.stock || product.stock <= 0) {
      return fail("Bu məhsul stokda yoxdur");
    }

    // Yanlış rəng adı gəlsə boş saxlanılır
    const safeColor = product.colors?.some((c: any) => c.name === color)
      ? color
      : "";
    const max = Math.min(product.stock, MAX_QTY);

    const user: any = await User.findById(userId).select("cart").lean();
    const line = (user?.cart ?? []).find(
      (l: any) =>
        String(l.product) === String(productId) &&
        (l.size || "") === size &&
        (l.color || "") === safeColor
    );

    if (line) {
      const next = Math.min(line.quantity + quantity, max);
      await User.updateOne(
        { _id: userId, "cart._id": line._id },
        { $set: { "cart.$.quantity": next } }
      );
    } else {
      await User.updateOne(
        { _id: userId },
        {
          $push: {
            cart: {
              product: productId,
              size,
              color: safeColor,
              quantity: Math.min(quantity, max),
            },
          },
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/user/cart error:", error);
    return fail("Səbətə əlavə olunmadı", 500);
  }
}

// PATCH { itemId, quantity } → sətrin miqdarını dəyiş
export async function PATCH(req: Request) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const body = await req.json().catch(() => ({}));
  const itemId = body?.itemId;
  const wanted = Math.floor(Number(body?.quantity));

  if (!mongoose.isValidObjectId(itemId)) return fail("Yanlış sətir ID");
  if (!Number.isFinite(wanted) || wanted < 1) return fail("Yanlış miqdar");

  try {
    await dbConnect();

    const user: any = await User.findById(userId).select("cart").lean();
    const line = (user?.cart ?? []).find((l: any) => String(l._id) === itemId);
    if (!line) return fail("Sətir tapılmadı", 404);

    const product: any = await Product.findById(line.product)
      .select("stock")
      .lean();
    const max = Math.max(1, Math.min(product?.stock ?? 1, MAX_QTY));
    const quantity = Math.min(wanted, max);

    await User.updateOne(
      { _id: userId, "cart._id": itemId },
      { $set: { "cart.$.quantity": quantity } }
    );

    return NextResponse.json({ ok: true, quantity });
  } catch (error) {
    console.error("PATCH /api/user/cart error:", error);
    return fail("Miqdar dəyişmədi", 500);
  }
}

// DELETE /api/user/cart?itemId=... → sətri səbətdən çıxar
export async function DELETE(req: Request) {
  const userId = await getUserId();
  if (!userId) return unauthorized();

  const itemId = new URL(req.url).searchParams.get("itemId");
  if (!mongoose.isValidObjectId(itemId)) return fail("Yanlış sətir ID");

  try {
    await dbConnect();
    await User.updateOne({ _id: userId }, { $pull: { cart: { _id: itemId } } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/user/cart error:", error);
    return fail("Silinmədi", 500);
  }
}