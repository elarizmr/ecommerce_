import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Bütün xanaları doldurun" }, { status: 400 });
    }

    // Əvvəlcədən bu email ilə user olub-olmadığını yoxlayaq
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Bu email artıq qeydiyyatdan keçib" }, { status: 400 });
    }

    // Şifrəni hash-ləyirik
    const hashedPassword = await bcrypt.hash(password, 10);

    // Email-in əvvəlini ad kimi götürürük
    const defaultName = email.split("@")[0];

    // Yeni user yaradırıq
    const newUser = await User.create({
      name: defaultName, // <-- Burada artıq təyin olunub
      email,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json({ success: true, userId: newUser._id });
  } catch (error: any) {
    console.error("QEYDİYYAT XƏTASI:", error);
    return NextResponse.json({ error: error.message || "Qeydiyyat zamanı xəta baş verdi" }, { status: 500 });
  }
}