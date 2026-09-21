"use client";

import { useRef, useState } from "react";
import Link from "next/link";

export interface CardProduct {
  _id: string;
  name: string;
  price: number;
  image: string[] | string;
  sizes: string[];
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="11"
      viewBox="0 0 26 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={direction === "left" ? "rotate-180" : ""}
    >
      <path d="M0 8h24M17 1l7 7-7 7" />
    </svg>
  );
}

// Kateqoriya səhifəsindəki və "You might also like" bölməsindəki kartla eyni dizayn.
// onRemove verilsə, adın altında kiçik "Remove" düyməsi görünür (wishlist səhifəsi üçün).
export default function WishlistCard({
  product,
  onRemove,
}: {
  product: CardProduct;
  onRemove?: () => void;
}) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(0);

  const images: string[] = Array.isArray(product.image)
    ? product.image
    : product.image
    ? [product.image]
    : [];
  const hasSizes = product.sizes && product.sizes.length > 0;
  const multiple = images.length > 1;

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el || !el.clientWidth) return;
    setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (e: React.MouseEvent, direction: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    const el = sliderRef.current;
    if (!el || images.length < 2) return;
    const now = Math.round(el.scrollLeft / el.clientWidth);
    const next = (now + direction + images.length) % images.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[1.8/3] md:aspect-[3/4] bg-[#E1E1E1] overflow-hidden">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex h-full w-full overflow-x-auto snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.length > 0 ? (
            images.map((src, i) => (
              <Link
                key={i}
                href={`/products/${product._id}`}
                className="relative h-full w-full shrink-0 snap-center block"
              >
                <img
                  src={src}
                  alt={`${product.name} ${i + 1}`}
                  draggable={false}
                  className="w-full h-full object-cover object-center select-none"
                />
              </Link>
            ))
          ) : (
            <Link href={`/products/${product._id}`} className="h-full w-full shrink-0 block" />
          )}
        </div>

        {/* Oxlar: yalnız kompüterdə, hover zamanı */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={(e) => goTo(e, -1)}
          className="hidden md:block absolute top-1/2 left-[14%] -translate-x-1/2 -translate-y-1/2 z-10 p-2 text-black opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          onClick={(e) => goTo(e, 1)}
          className="hidden md:block absolute top-1/2 left-[86%] -translate-x-1/2 -translate-y-1/2 z-10 p-2 text-black opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowIcon direction="right" />
        </button>

        {/* SELECT SIZE: yalnız kompüterdə, hover zamanı */}
        {hasSizes && (
          <div className="hidden md:block absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="block bg-[#BDBDBD]/80 text-[#6B6B6B] text-[13px] uppercase px-2 py-0.5">
              Select Size
            </span>
          </div>
        )}

        {/* Nöqtələr: yalnız mobildə */}
        {multiple && (
          <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full bg-white transition-all ${
                  i === current ? "h-1 w-1 opacity-100" : "h-[3px] w-[3px] opacity-60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-2 md:px-0 pt-4 pb-6 flex flex-col items-center text-center text-black">
        <Link
          href={`/products/${product._id}`}
          className="text-[11px] md:text-[13px] font-medium uppercase leading-tight"
        >
          {product.name}
        </Link>

        {/* Qiymət və ölçülər eyni sətirdə üst-üstədir */}
        <div className="relative h-4 md:h-5 w-full text-[11px] md:text-[13px]">
          <span
            className={`absolute inset-0 flex justify-center items-center transition-opacity ${
              hasSizes ? "md:group-hover:opacity-0" : ""
            }`}
          >
            M.{Number(product.price).toFixed(2)}
          </span>

          {hasSizes && (
            <div className="hidden md:flex absolute inset-0 justify-center items-center gap-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
              {product.sizes.map((size) => (
                <Link
                  key={size}
                  href={`/products/${product._id}`}
                  className="uppercase hover:text-gray-400 transition-colors"
                >
                  {size}
                </Link>
              ))}
            </div>
          )}
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-2 text-[11px] md:text-[12px] uppercase text-gray-500 underline underline-offset-2 hover:text-black transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}