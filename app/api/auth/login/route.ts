import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "İstifadəçi tapılmadı" }, { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ error: "Parol yanlışdır" }, { status: 401 });

  if (user.role !== "admin") return NextResponse.json({ error: "İcazə yoxdur" }, { status: 403 });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_token", token, { httpOnly: true, path: "/", maxAge: 86400 });
  return res;
}