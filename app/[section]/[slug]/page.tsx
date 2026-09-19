'use client';

import { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[] | string;
  subcategory: string;
  section: string;
  sizes: string[];
}

async function fetchSlugProducts(section: string, slug: string) {
  const res = await fetch(`/api/products?section=${section}&subcategory=${slug}`);
  if (!res.ok) throw new Error('Məhsulları çəkərkən xəta baş verdi');
  const data = await res.json();
  return Array.isArray(data) ? data : data.products || [];
}

const SECTION_LABELS: Record<string, string> = {
  men: 'Mens',
  women: 'Womens',
  accessories: 'Accessories',
};

function toTitleCase(text: string) {
  return text.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      width="18"
      height="11"
      viewBox="0 0 26 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className={direction === 'left' ? 'rotate-180' : ''}
    >
      <path d="M0 8h24M17 1l7 7-7 7" />
    </svg>
  );
}

export default function SlugPage() {
  const params = useParams();

  const section = typeof params.section === 'string' ? params.section : '';
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const sliderRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [activeIndex, setActiveIndex] = useState<Record<string, number>>({});

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', section, slug],
    queryFn: () => fetchSlugProducts(section, slug),
    enabled: Boolean(section && slug),
  });

  const sectionLabel = SECTION_LABELS[section] ?? toTitleCase(section);
  const categoryLabel = toTitleCase(slug);

  const handleScroll = (productId: string) => {
    const el = sliderRefs.current[productId];
    if (!el || !el.clientWidth) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIndex((prev) => (prev[productId] === idx ? prev : { ...prev, [productId]: idx }));
  };

  const goTo = (
    e: React.MouseEvent,
    productId: string,
    total: number,
    direction: 1 | -1
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const el = sliderRefs.current[productId];
    if (!el || total < 2) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    const next = (current + direction + total) % total;
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-white pt-20 pb-16 px-0 md:px-2">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-[13px] md:text-[14px] text-gray-500 mb-4 px-3 md:px-0">
        <Link href="/" className="hover:text-black transition-colors">
          OLAF
        </Link>
        <span>/</span>
        <span>
          {sectionLabel} {categoryLabel}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-sm text-gray-400">
          Loading...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-sm text-red-500">
          Xəta baş verdi: {(error as Error).message}
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-sm text-gray-500">
          No products found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[3px] md:gap-x-3.5 gap-y-0 md:gap-y-2">
          {products.map((product) => {
            const images: string[] = Array.isArray(product.image)
              ? product.image
              : product.image
              ? [product.image]
              : [];
            const current = activeIndex[product._id] ?? 0;
            const hasSizes = product.sizes && product.sizes.length > 0;
            const multiple = images.length > 1;

            return (
              <div key={product._id} className="group flex flex-col">
                {/* Şəkil hissəsi (zoom yoxdur) */}
                <div className="relative aspect-[1.8/3] md:aspect-[3/4] bg-[#E1E1E1] overflow-hidden">
                  <div
                    ref={(el) => {
                      sliderRefs.current[product._id] = el;
                    }}
                    onScroll={() => handleScroll(product._id)}
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
                      <Link
                        href={`/products/${product._id}`}
                        className="h-full w-full shrink-0 block"
                      />
                    )}
                  </div>

                  {/* Oxlar: yalnız kompüterdə, hover zamanı */}
                  <button
                    type="button"
                    aria-label="Previous image"
                    onClick={(e) => goTo(e, product._id, images.length, -1)}
                    className="hidden md:block absolute top-1/2 left-[14%] -translate-x-1/2 -translate-y-1/2 z-10 p-2 text-black opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ArrowIcon direction="left" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next image"
                    onClick={(e) => goTo(e, product._id, images.length, 1)}
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
                            i === current ? 'h-1 w-1 opacity-100' : 'h-[3px] w-[3px] opacity-60'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Ad + qiymət / ölçülər */}
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
                        hasSizes ? 'md:group-hover:opacity-0' : ''
                      }`}
                    >
                      M.{Number(product.price).toFixed(2)}
                    </span>

                    {hasSizes && (
                      <div className="hidden md:flex absolute inset-0 justify-center items-center gap-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => alert(`Selected size: ${size}`)}
                            className="uppercase hover:text-gray-400 transition-colors"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}