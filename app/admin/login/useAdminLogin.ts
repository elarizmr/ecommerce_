import { useMutation } from "@tanstack/react-query";

type LoginPayload = { email: string; password: string };

async function loginAdmin(payload: LoginPayload) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Giriş uğursuz oldu");
  }

  return res.json();
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: loginAdmin,
  });
}