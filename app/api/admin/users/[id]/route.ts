import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import User from "@/app/lib/models/User";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Promise əlavə olunur
) {
  await dbConnect();
  const { id } = await params; // <-- Await olunur
  const body = await req.json();

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });

  return NextResponse.json(updatedUser);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> } // <-- Promise əlavə olunur
) {
  await dbConnect();
  const { id } = await params; // <-- Await olunur

  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}