import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Cookie-dəki token-dən istifadəçi ID-sini çıxarır (/api/user/me ilə eyni üsul).
// Giriş etməyibsə və ya token etibarsızdırsa null qaytarır.
export async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded.id ?? null;
  } catch {
    return null;
  }
}