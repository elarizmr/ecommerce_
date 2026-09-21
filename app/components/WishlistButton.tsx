"use client";

import { useWishlist } from "@/app/lib/useWishlist";

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M7 1v12M1 7h12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1.5 7.5l3.7 3.7L12.5 3.3" />
    </svg>
  );
}

// Məhsul səhifəsində ad və qiymətin altında görünən kiçik WISHLIST düyməsi.
// Əlavə olunmayıb: açıq boz fon + "+" ikonu
// Əlavə olunub: tünd boz fon + ağ "✓" ikonu (basanda siyahıdan çıxarır)
export default function WishlistButton({ productId }: { productId: string }) {
  const { isInWishlist, toggle } = useWishlist();
  const active = isInWishlist(productId);

  return (
    <button
      type="button"
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`mt-3 inline-flex items-center gap-2 px-3 py-2 text-[13px] font-medium uppercase leading-none transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-black ${
        active
          ? "bg-[#666666] text-white hover:bg-[#555555]"
          : "bg-[#F2F2F2] text-[#3a3a3a] hover:bg-[#E6E6E6]"
      }`}
    >
      {active ? <CheckIcon /> : <PlusIcon />}
      Wishlist
    </button>
  );
}