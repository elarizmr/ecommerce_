import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";
import { requireAdmin } from "@/app/lib/models/requireAdmin";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  await dbConnect();

  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (error) {
    console.error("GET /admin/users error:", error);
    return NextResponse.json({ error: "Xəta baş verdi" }, { status: 500 });
  }
}