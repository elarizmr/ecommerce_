// app/api/user/me/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";
import { cookies } from "next/headers";

// Giriş etməyən istifadəçi xəta deyil, normal haldır:
// həmişə 200 və { user: null } qaytarırıq.
const guest = () => NextResponse.json({ user: null });

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Token yoxdursa bazaya qoşulmağa ehtiyac yoxdur (sürətli cavab)
    if (!token) {
      return guest();
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await dbConnect();
    const user = await User.findById(decoded.id).select("name email role");

    if (!user) {
      // Token var, amma istifadəçi bazada yoxdur: köhnə cookie-ni təmizlə
      const res = guest();
      res.cookies.set("token", "", { path: "/", maxAge: 0 });
      return res;
    }

    return NextResponse.json({ user });
  } catch {
    // Token etibarsızdır və ya vaxtı bitib
    const res = guest();
    res.cookies.set("token", "", { path: "/", maxAge: 0 });
    return res;
  }
}