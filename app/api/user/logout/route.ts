import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Token cookie-sini silirik
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Keçmiş tarix verərək cookie-ni ləğv edirik
  });
  return res;
}