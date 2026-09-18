import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email tələb olunur" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    // Əgər user tapıldısa exists: true, yoxdursa false qaytarırıq
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
  }
}