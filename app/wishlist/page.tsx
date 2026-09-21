"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/app/lib/useWishlist";
import WishlistCard from "@/app/components/WishlistCard";

export default function WishlistPage() {
  const router = useRouter();
  const { products, isLoggedIn, isLoading, toggle } = useWishlist();

  // Giriş etməyən istifadəçi login səhifəsinə yönləndirilir
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login?next=/wishlist");
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <main className="min-h-screen bg-white pt-20 pb-16 px-0 md:px-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-[13px] md:text-[14px] text-gray-500 mb-4 px-3 md:px-0">
        <Link href="/" className="hover:text-black transition-colors">
          OLAF
        </Link>
        <span>/</span>
        <span>Wishlist</span>
      </div>

      {isLoading || !isLoggedIn ? (
        <div className="flex justify-center items-center h-64 text-sm text-gray-400">
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-8 min-h-[55vh] px-4 text-center">
          <h1 className="text-[26px] md:text-[38px] font-medium uppercase text-[#666666]">
            Your wishlist is empty.
          </h1>
          <Link
            href="/collections/all"
            className="border border-black px-10 py-4 text-[13px] md:text-[14px] font-medium uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[3px] md:gap-x-3.5 gap-y-0 md:gap-y-2">
          {products.map((product) => (
            <WishlistCard
              key={product._id}
              product={product}
              onRemove={() => toggle(product._id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}