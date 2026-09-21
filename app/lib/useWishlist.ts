"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useMe } from "@/app/admin/login/useAuth";

export type WishlistProduct = {
  _id: string;
  name: string;
  price: number;
  image: string[] | string;
  sizes: string[];
  section?: string;
  subcategory?: string;
};

type WishlistData = {
  products: WishlistProduct[];
  ids: string[];
};

const EMPTY: WishlistData = { products: [], ids: [] };

async function fetchWishlist(): Promise<WishlistData> {
  const res = await fetch("/api/user/wishlist", { cache: "no-store" });
  if (!res.ok) throw new Error("Wishlist yüklənmədi");
  return res.json();
}

export function useWishlist() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: me, isLoading: meLoading } = useMe();
  const meUser = me?.user as { _id?: string; id?: string } | undefined;
  const userId: string | undefined = meUser?._id ?? meUser?.id;
  const isLoggedIn = Boolean(me?.user);

  // İstifadəçi ID-si key-də olduğu üçün hesab dəyişəndə köhnə siyahı görünmür
  const queryKey = ["wishlist", userId];

  const query = useQuery<WishlistData>({
    queryKey,
    queryFn: fetchWishlist,
    enabled: isLoggedIn,
  });

  // Çıxış edibsə, keşdə qalmış köhnə data göstərilməsin
  const data = isLoggedIn ? query.data ?? EMPTY : EMPTY;

  const mutation = useMutation({
    mutationFn: async ({ productId, add }: { productId: string; add: boolean }) => {
      const res = add
        ? await fetch("/api/user/wishlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
          })
        : await fetch(`/api/user/wishlist?productId=${productId}`, {
            method: "DELETE",
          });
      if (!res.ok) throw new Error("Əməliyyat uğursuz oldu");
      return res.json();
    },

    // Düyməyə basan kimi UI dərhal yenilənir, server cavabını gözləmir
    onMutate: async ({ productId, add }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<WishlistData>(queryKey);

      queryClient.setQueryData<WishlistData>(queryKey, (old = EMPTY) => ({
        ids: add
          ? old.ids.includes(productId)
            ? old.ids
            : [...old.ids, productId]
          : old.ids.filter((id) => id !== productId),
        products: add
          ? old.products
          : old.products.filter((p) => p._id !== productId),
      }));

      return { previous };
    },

    // Xəta olarsa əvvəlki vəziyyətə qayıt
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },

    // Sonda serverdəki real siyahı ilə sinxronlaşdır
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const isInWishlist = (productId: string) => data.ids.includes(productId);

  // Basanda: girişsizdirsə /login-ə göndər, deyilsə əlavə et / çıxar
  const toggle = (productId: string) => {
    if (meLoading) return;

    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }

    mutation.mutate({ productId, add: !isInWishlist(productId) });
  };

  return {
    products: data.products,
    ids: data.ids,
    count: data.ids.length,
    isLoggedIn,
    isLoading: meLoading || (isLoggedIn && query.isLoading),
    isInWishlist,
    toggle,
  };
}