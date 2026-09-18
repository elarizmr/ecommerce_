"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMe, useCheckEmail, useLogin, useRegister } from "../admin/login/useAuth";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "login" | "register">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const { data: meData } = useMe();
  const checkEmail = useCheckEmail();
  const login = useLogin();
  const register = useRegister();

  // Əgər istifadəçi artıq login olubsa, birbaşa /account-a at
  useEffect(() => {
    if (meData?.user) {
      router.push("/account");
    }
  }, [meData, router]);

  const error =
    checkEmail.error?.message || login.error?.message || register.error?.message || "";

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await checkEmail.mutateAsync(email);
      setStep(data.exists ? "login" : "register");
    } catch {
      // xəta artıq error-da göstərilir
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ email, password });
      router.push("/account");
      router.refresh();
    } catch {
      // xəta artıq error-da göstərilir
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync({ email, password });
      await login.mutateAsync({ email, password });
      router.push("/account");
      router.refresh();
    } catch {
      // xəta artıq error-da göstərilir
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-white">
      {/* Loqo */}
      <div className="py-8">
        <h1 className="text-2xl font-black tracking-widest text-black">O L A F</h1>
      </div>

      {/* Mərkəzi Forma */}
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-black">Sign in</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in or create an account</p>
        </div>

        {error && <div className="p-3 text-xs text-red-600 bg-red-50 rounded-lg">{error}</div>}

        {/* Addım 1: Email daxiletmə */}
        {step === "email" && (
          <form onSubmit={handleEmailCheck} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm text-black"
              />
              <button
                type="submit"
                disabled={checkEmail.isPending}
                className="absolute right-3 top-3.5 text-gray-600 hover:text-black"
              >
                →
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 pt-2">
              <input type="checkbox" defaultChecked className="accent-black w-4 h-4" />
              <span>Email me with news and offers</span>
            </div>
          </form>
        )}

        {/* Addım 2: Login (Şifrə tələbi) */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
              <span className="text-gray-700">{email}</span>
              <button type="button" onClick={() => setStep("email")} className="text-xs text-emerald-600 underline">
                Change
              </button>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm text-black"
            />
            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm disabled:opacity-50"
            >
              {login.isPending ? "Daxil olunur..." : "Sign In"}
            </button>
          </form>
        )}

        {/* Addım 3: Register (Yeni şifrə təyini) */}
        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm">
              <span className="text-gray-700">{email}</span>
              <button type="button" onClick={() => setStep("email")} className="text-xs text-emerald-600 underline">
                Change
              </button>
            </div>
            <p className="text-xs text-gray-500">New here? Create a password to sign up.</p>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-sm text-black"
            />
            <button
              type="submit"
              disabled={register.isPending}
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition text-sm disabled:opacity-50"
            >
              {register.isPending ? "..." : "Create & Sign In"}
            </button>
          </form>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms of service</span>
        </p>
      </div>

      {/* Footer */}
      <div className="py-4">
        <a href="#" className="text-xs text-emerald-600 hover:underline">
          Privacy policy
        </a>
      </div>
    </div>
  );
}