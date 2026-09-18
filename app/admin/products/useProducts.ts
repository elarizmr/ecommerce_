import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type ColorVariant = {
  name: string;
  images: string[];
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  section: "men" | "women" | "accessories"; // YENİ
  subcategory: string;                       // YENİ
  description?: string;
  image?: string[];
  stock: number;
  sizes: string[];
  colors: ColorVariant[];
  information?: string;
  modelInfo?: string;
  materialInfo?: string;
  shippingReturns?: string;
  points?: number;
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/admin/products", { cache: "no-store" });
  if (!res.ok) throw new Error("Məhsullar yüklənmədi");
  return res.json();
}

export function useProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Məhsul əlavə olunmadı");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Məhsul yenilənmədi");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Məhsul silinmədi");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });
}