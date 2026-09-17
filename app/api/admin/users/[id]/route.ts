import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { role } = await req.json();
  const updated = await User.findByIdAndUpdate(params.id, { role }, { new: true }).select("-password");
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await User.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}