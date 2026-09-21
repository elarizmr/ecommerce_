"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/app/lib/useCart";

// --------------------------------------------------
// AYARLAR: bunları öz biznesinə görə dəyiş
// --------------------------------------------------

// Bu məbləğdən yuxarı çatdırılma pulsuz olur (M.)
const FREE_DELIVERY_FROM = 100;

// Məhsulların altındakı boz zolaqda görünən 3 yazı
const INFO_TEXTS = [
  "Order before 22:00 for same-day shipping",
  "Free online returns for 30 days",
  "Free exchange in store for 30 days",
];

// Miqdar siyahısında maksimum neçə seçim göstərilsin
const MAX_OPTIONS = 10;

// "You might also like" bölməsində neçə məhsul olsun
const RELATED_LIMIT = 12;

const money = (n: number) => `m.${n.toFixed(2)}`;

type RelatedProduct = {
  _id: string;
  name: string;
  image: string[] | string;
};

// Məhsul səhifəsindəki "You might also like" ilə eyni key: data keşdən gəlir
async function fetchAllProducts(): Promise<RelatedProduct[]> {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Məhsulları çəkərkən xəta baş verdi");
  const data = await res.json();
  return Array.isArray(data) ? data : data.products || [];
}

const firstImage = (p: RelatedProduct): string =>
  Array.isArray(p.image) ? p.image[0] ?? "" : p.image ?? "";

function Chevron({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      className={up ? "rotate-180" : ""}
      aria-hidden="true"
    >
      <path d="M2 5l5 5 5-5" />
    </svg>
  );
}

export default function CartPanel({ onClose }: { onClose: () => void }) {
  const { items, total, isLoading, updateQuantity, removeItem } = useCart();
  const [relatedOpen, setRelatedOpen] = useState(true);

  const { data: allProducts } = useQuery<RelatedProduct[]>({
    queryKey: ["products", "all"],
    queryFn: fetchAllProducts,
  });

  // Səbətdə artıq olan məhsulları təklifdən çıxarırıq
  const related = useMemo(() => {
    const inCart = new Set(items.map((i) => i.productId));
    return (allProducts ?? [])
      .filter((p) => !inCart.has(p._id))
      .slice(0, RELATED_LIMIT);
  }, [allProducts, items]);

  const remaining = Math.max(0, FREE_DELIVERY_FROM - total);
  const progress = Math.min(100, (total / FREE_DELIVERY_FROM) * 100);

  return (
    <div className="text-black">
      {/* BAŞLIQ */}

      <h2 className="border-b border-neutral-300 pb-3 pt-3 text-[14px] font-semibold uppercase md:pt-1.5">
        Cart
      </h2>

      {isLoading ? (
        <p className="py-16 text-center text-[13px] text-[#6b6b6b]">Loading...</p>
      ) : items.length === 0 ? (
        /* BOŞ SƏBƏT */
        <div className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center">
          <p className="text-[22px] font-medium uppercase text-[#666666] md:text-[30px]">
            Your cart is empty.
          </p>
          <Link
            href="/collections/all"
            onClick={onClose}
            className="border border-black px-10 py-4 text-[13px] font-medium uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          {/* MƏHSUL SƏTİRLƏRİ */}

          <ul>
            {items.map((item) => {
              // Miqdar siyahısı: stok qədər (max 10), cari miqdardan az olmasın
              const optionCount = Math.max(
                item.quantity,
                Math.min(item.stock, MAX_OPTIONS)
              );

              return (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-neutral-300 py-6 md:gap-5 md:py-10"
                >
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={onClose}
                    className="block aspect-[4/5] w-[110px] shrink-0 overflow-hidden bg-[#E5E5E5] md:w-[140px]"
                  >
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        draggable={false}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    {/* Ad + qiymət */}
                    <div className="flex justify-between gap-4">
                      <Link
                        href={`/products/${item.productId}`}
                        onClick={onClose}
                        className="max-w-[70%] text-[13px] font-medium uppercase leading-tight"
                      >
                        {item.name}
                      </Link>
                      <span className="whitespace-nowrap text-[13px]">
                        {money(item.price)}
                      </span>
                    </div>

                    {/* Rəng + ölçü */}
                    <div className="text-[13px] leading-6">
                      {item.color && (
                        <p>
                          Color: <span className="text-[#6b6b6b]">{item.color}</span>
                        </p>
                      )}
                      {item.size && (
                        <p>
                          Size: <span className="text-[#6b6b6b]">{item.size}</span>
                        </p>
                      )}
                    </div>

                    {/* Miqdar + Remove */}
                    <div className="flex items-end justify-between">
                      <div className="relative">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, Number(e.target.value))
                          }
                          aria-label="Quantity"
                          className="appearance-none border border-neutral-400 bg-white py-2 pl-3 pr-9 text-[13px] text-black outline-none focus-visible:border-black"
                        >
                          {Array.from({ length: optionCount }, (_, i) => i + 1).map(
                            (n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            )
                          )}
                        </select>
                        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                          <Chevron />
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[13px] underline underline-offset-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* ÇATDIRILMA / QAYTARMA YAZILARI */}

          <div className="mt-5 flex flex-col gap-1 bg-[#F7F7F7] px-3 py-3 text-[13px] text-[#6b6b6b] md:flex-row md:justify-between">
            {INFO_TEXTS.map((text) => (
              <span key={text}>{text}</span>
            ))}
          </div>

          {/* PULSUZ ÇATDIRILMA */}

          <div className="mt-8">
            <p className="pb-3 text-[13px] font-semibold uppercase">
              {remaining === 0
                ? "You got free delivery!"
                : `Add ${money(remaining)} more for free delivery`}
            </p>
            <div className="h-[2px] w-full bg-neutral-300">
              <div
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* CHECK OUT */}

          <Link
            href="/checkout"
            onClick={onClose}
            className="mt-5 flex h-[52px] w-full items-center justify-center bg-black text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-85"
          >
            Check out – {money(total)}
          </Link>

          {/* YOU MIGHT ALSO LIKE */}

          {related.length > 0 && (
            <section className="mt-10">
              <button
                type="button"
                onClick={() => setRelatedOpen((v) => !v)}
                aria-expanded={relatedOpen}
                className="flex w-full items-center justify-between pb-4 text-left text-[13px] font-semibold uppercase"
              >
                You might also like
                <Chevron up={relatedOpen} />
              </button>

              {relatedOpen && (
                <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] md:gap-3 [&::-webkit-scrollbar]:hidden">
                  {related.map((p) => {
                    const img = firstImage(p);

                    return (
                      <Link
                        key={p._id}
                        href={`/products/${p._id}`}
                        onClick={onClose}
                        className="block w-[150px] shrink-0 md:w-[210px]"
                      >
                        <div className="aspect-[4/5] w-full overflow-hidden bg-[#E5E5E5]">
                          {img && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={img}
                              alt={p.name}
                              draggable={false}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <p className="mt-2 truncate text-[13px]">{p.name}</p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}