"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "./useAdminLogin";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const adminLogin = useAdminLogin();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await adminLogin.mutateAsync({ email, password });
      router.push("/admin");
      router.refresh();
    } catch {
      // xəta artıq adminLogin.error-da mövcuddur
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Giriş</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <input
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          {adminLogin.isError && (
            <p className="text-red-600 text-sm">{adminLogin.error.message}</p>
          )}
          <button
            type="submit"
            disabled={adminLogin.isPending}
            className="bg-neutral-900 text-white rounded-lg py-2 text-sm hover:opacity-85 disabled:opacity-50"
          >
            {adminLogin.isPending ? "Daxil olunur..." : "Daxil ol"}
          </button>
        </form>
      </div>
    </div>
  );
}