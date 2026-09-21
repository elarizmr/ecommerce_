"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/app/admin/login/useAuth";

export type CartItem = {
  id: string; // səbət sətrinin ID-si
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
};

type CartData = { items: CartItem[] };

type AddInput = {
  productId: string;
  size: string;
  color: string;
  quantity?: number;
};

const EMPTY: CartData = { items: [] };

// Header, mobil menyu və məhsul səhifəsi bu hadisə ilə səbət panelini açır.
// Panelin özü Header-dədir və bu hadisəni dinləyir.
export const OPEN_CART_EVENT = "open-cart";

async function fetchCart(): Promise<CartData> {
  const res = await fetch("/api/user/cart", { cache: "no-store" });
  if (!res.ok) throw new Error("Səbət yüklənmədi");
  return res.json();
}

// Serverin xəta mətnini (məs. "Bu məhsul stokda yoxdur") istifadəçiyə çatdırır
async function request(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Əməliyyat uğursuz oldu");
  return data;
}

export function useCart() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useMe();
  const meUser = me?.user as { _id?: string; id?: string } | undefined;
  const userId: string | undefined = meUser?._id ?? meUser?.id;
  const isLoggedIn = Boolean(me?.user);

  // İstifadəçi ID-si key-də olduğu üçün hesab dəyişəndə köhnə səbət görünmür
  const queryKey = ["cart", userId];

  const query = useQuery<CartData>({
    queryKey,
    queryFn: fetchCart,
    enabled: isLoggedIn,
  });

  // Çıxış edibsə, keşdə qalmış köhnə data göstərilməsin
  const data = isLoggedIn ? query.data ?? EMPTY : EMPTY;

  // --------------------------------------------------
  // ƏLAVƏ ET
  // --------------------------------------------------

  const addMutation = useMutation({
    mutationFn: (input: AddInput) =>
      request("/api/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    // Promise qaytardığı üçün mutateAsync təzə data gələnə qədər gözləyir
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // --------------------------------------------------
  // MİQDARI DƏYİŞ
  // --------------------------------------------------

  const quantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      request("/api/user/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      }),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CartData>(queryKey);

      queryClient.setQueryData<CartData>(queryKey, (old = EMPTY) => ({
        items: old.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
      }));

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  // --------------------------------------------------
  // SİL
  // --------------------------------------------------

  const removeMutation = useMutation({
    mutationFn: (itemId: string) =>
      request(`/api/user/cart?itemId=${itemId}`, { method: "DELETE" }),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CartData>(queryKey);

      queryClient.setQueryData<CartData>(queryKey, (old = EMPTY) => ({
        items: old.items.filter((i) => i.id !== itemId),
      }));

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  // --------------------------------------------------
  // GİRİŞ YOXLAMASI
  // --------------------------------------------------

  const goToLogin = () => {
    router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
  };

  // Səbət panelini aç (giriş etməyibsə login səhifəsinə göndər)
  const openCart = () => {
    if (meLoading) return;
    if (!isLoggedIn) {
      goToLogin();
      return;
    }
    window.dispatchEvent(new Event(OPEN_CART_EVENT));
  };

  // Səbətə əlavə et, sonra paneli aç. Uğurlu olubsa true qaytarır.
  const addToCart = async (input: AddInput) => {
    if (meLoading) return false;
    if (!isLoggedIn) {
      goToLogin();
      return false;
    }

    try {
      await addMutation.mutateAsync(input);
      window.dispatchEvent(new Event(OPEN_CART_EVENT));
      return true;
    } catch (err) {
      alert((err as Error).message);
      return false;
    }
  };

  const items = data.items;

  return {
    items,
    // Sayğac məhsul sayı yox, ümumi miqdardır: 1 məhsuldan 2 ədəd = 2
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    isLoggedIn,
    isLoading: meLoading || (isLoggedIn && query.isLoading),
    isAdding: addMutation.isPending,
    addToCart,
    openCart,
    updateQuantity: (itemId: string, quantity: number) =>
      quantityMutation.mutate({ itemId, quantity }),
    removeItem: (itemId: string) => removeMutation.mutate(itemId),
  };
}