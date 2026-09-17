import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Product from "@/app/lib/models/Product";

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params; // params-ı await edib id-ni götürürük
  const body = await req.json();

  const updated = await Product.findByIdAndUpdate(
    id, 
    body, 
    { returnDocument: 'after' } // Deprecation warning-i aradan qaldıran hissə
  );

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params; // burda da await edirik

  await Product.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}