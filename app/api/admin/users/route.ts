import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";

export async function GET() {
  await dbConnect();
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return NextResponse.json(users);
}