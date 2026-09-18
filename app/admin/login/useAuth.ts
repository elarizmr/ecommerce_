import { useQuery, useMutation } from "@tanstack/react-query";

type MeResponse = { user: { id: string; email: string } | null };

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/user/me", { credentials: "include" });
  return res.json();
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });
}

async function checkEmail(email: string): Promise<{ exists: boolean }> {
  const res = await fetch("/api/user/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Xəta baş verdi, yenidən cəhd edin.");
  return res.json();
}

export function useCheckEmail() {
  return useMutation({ mutationFn: checkEmail });
}

type LoginPayload = { email: string; password: string };

async function loginUser(payload: LoginPayload) {
  const res = await fetch("/api/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Şifrə yalnışdır");
  return data;
}

export function useLogin() {
  return useMutation({ mutationFn: loginUser });
}

async function registerUser(payload: LoginPayload) {
  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Qeydiyyat xətası");
  return data;
}

export function useRegister() {
  return useMutation({ mutationFn: registerUser });
}