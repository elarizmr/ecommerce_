'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import WishlistButton from '@/app/components/WishlistButton';
import { useCart } from '@/app/lib/useCart';

interface ColorVariant {
  name: string;
  images: string[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image: string[];
  stock: number;
  sizes: string[];
  colors: ColorVariant[];
  information?: string;
  modelInfo?: string;
  materialInfo?: string;
  shippingReturns?: string;
  points?: number;
  section: string;
  subcategory: string;
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  image: string[] | string;
  sizes: string[];
}

const RELATED_STEP = 4;

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error('Məhsul tapılmadı');
  return res.json();
}

async function fetchAllProducts(): Promise<RelatedProduct[]> {
  const res = await fetch('/api/products');
  if (!res.ok) throw new Error('Məhsulları çəkərkən xəta baş verdi');
  const data = await res.json();
  return Array.isArray(data) ? data : data.products || [];
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

function RelatedCard({ product }: { product: RelatedProduct }) {
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
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[1.8/3] md:aspect-[3/4] bg-[#EBEBEB] overflow-hidden">
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
                  i === current ? 'h-1 w-1 opacity-100' : 'h-[3px] w-[3px] opacity-60'
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
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>('information');
  const [visibleCount, setVisibleCount] = useState(RELATED_STEP);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Səbətə əlavə et (giriş etməyibsə login səhifəsinə göndərir, uğurlu olsa paneli açır)
  const { addToCart, isAdding } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });

  // "You might also like" üçün bütün məhsullar
  const { data: allProducts } = useQuery<RelatedProduct[]>({
    queryKey: ['products', 'all'],
    queryFn: fetchAllProducts,
  });

  // Cari məhsulu çıxarıb qalanları qarışdırırıq (məhsul dəyişəndə yenidən qarışır)
  const related = useMemo(() => {
    const list = (allProducts ?? []).filter((p) => p._id !== id);
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [allProducts, id]);

  // Başqa məhsula keçəndə seçimləri sıfırlayırıq
  useEffect(() => {
    setActiveImage(0);
    setSelectedSize(null);
    setSelectedColor(0);
    setOpenSection('information');
    setVisibleCount(RELATED_STEP);
  }, [id]);

  const images = product?.image?.length ? product.image : [];

  // Hansı şəkilin görünən olduğunu izləyirik (sayğac + thumbnail highlight üçün)
  useEffect(() => {
    if (!images.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = imageRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setActiveImage(idx);
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );

    imageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [images.length]);

  const scrollToImage = (i: number) => {
    imageRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 flex justify-center text-sm text-gray-400">
        Loading...
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen pt-24 flex justify-center text-sm text-red-500">
        {(error as Error)?.message || 'Məhsul tapılmadı'}
      </main>
    );
  }

  const sections = [
    { key: 'information', title: 'INFORMATION', text: product.information },
    { key: 'modelInfo', title: 'MODEL INFO', text: product.modelInfo },
    { key: 'materialInfo', title: 'MATERIAL INFO', text: product.materialInfo },
    { key: 'shippingReturns', title: 'SHIPPING & RETURNS', text: product.shippingReturns },
  ].filter((s) => s.text);

  return (
    <>
      <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
        <div className="text-xs tracking-wider text-gray-500 uppercase mb-8">
          OLAF / {product.section} / {product.subcategory} / {product.name}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[64px_minmax(0,1.6fr)_minmax(0,1fr)] gap-4 lg:gap-8">
          {/* Thumbnail sütunu: yalnız kompüterdə */}
          <div className="hidden md:flex flex-col gap-2 sticky top-24 self-start h-fit">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => scrollToImage(i)}
                className={`aspect-[3/4] overflow-hidden bg-[#E5E5E5] border transition-colors ${
                  i === activeImage ? 'border-black' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            <div className="text-[10px] tracking-wider text-gray-500 pt-1">
              {String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </div>

          {/* Şəkillər: mobildə sağa-sola sürüşür, kompüterdə alt-alta düzülür */}
          <div className="min-w-0">
            <div className="-mx-4 md:mx-0 flex md:flex-col gap-1 md:gap-3 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {images.map((img, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="w-full shrink-0 snap-center bg-[#E5E5E5] aspect-[3/4] overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    draggable={false}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              ))}
            </div>

            <div className="md:hidden mt-2 text-[10px] tracking-wider text-gray-500">
              {String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </div>

          {/* Məlumat: sticky yalnız kompüterdə */}
          <div className="text-black md:max-w-md md:sticky md:top-24 md:self-start h-fit">
            <h1 className="text-lg font-bold uppercase tracking-tight">{product.name}</h1>
            <p className="text-sm font-medium mt-1">M.{Number(product.price).toFixed(2)}</p>

            {/* Wishlist düyməsi */}
            <WishlistButton productId={product._id} />

            {product.description && (
              <p className="text-xs text-gray-500 mt-2">{product.description}</p>
            )}

            {/* Rənglər */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase mb-2">
                  Color: {product.colors[selectedColor]?.name}
                </p>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      className={`w-14 aspect-[3/4] bg-[#E5E5E5] overflow-hidden border ${
                        i === selectedColor ? 'border-black' : 'border-transparent'
                      }`}
                    >
                      {c.images?.[0] && (
                        <img src={c.images[0]} alt={c.name} className="w-full h-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ölçülər */}
            {product.sizes?.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase mb-2">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs border ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!selectedSize || product.stock <= 0 || isAdding}
              onClick={() => {
                if (!selectedSize) return;
                addToCart({
                  productId: product._id,
                  size: selectedSize,
                  color: product.colors?.[selectedColor]?.name ?? '',
                  quantity: 1,
                });
              }}
              className="mt-6 w-full bg-black text-white text-xs font-semibold tracking-wider py-4 disabled:opacity-40"
            >
              {product.stock <= 0
                ? 'SOLD OUT'
                : isAdding
                ? 'ADDING...'
                : selectedSize
                ? 'ADD TO CART'
                : 'SELECT A SIZE'}
            </button>

            {!!product.points && (
              <p className="text-xs text-gray-500 mt-3">
                Earn {product.points} points when you buy this item.
              </p>
            )}

            {/* Akkordeon */}
            <div className="mt-8 border-t border-gray-200">
              {sections.map((s) => (
                <div key={s.key} className="border-b border-gray-200">
                  <button
                    onClick={() => setOpenSection(openSection === s.key ? null : s.key)}
                    className="w-full flex justify-between items-center py-4 text-xs font-semibold tracking-wider"
                  >
                    {s.title}
                    <span>{openSection === s.key ? '−' : '+'}</span>
                  </button>
                  {openSection === s.key && (
                    <p className="pb-4 text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                      {s.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* YOU MIGHT ALSO LIKE */}
      {related.length > 0 && (
        <section className="bg-[#E1E1E1] pt-14 pb-16 px-4 md:px-2 text-black">
          <h2 className="text-center text-[22px] md:text-[28px] font-medium uppercase mb-8 md:mb-10">
            You might also like
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[3px] md:gap-x-3.5 gap-y-0 md:gap-y-4">
            {related.slice(0, visibleCount).map((p) => (
              <RelatedCard key={p._id} product={p} />
            ))}
          </div>

          {visibleCount < related.length && (
            <div className="flex justify-center mt-10 md:mt-12">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + RELATED_STEP)}
                className="border border-black px-10 py-4 text-[14px] md:text-[15px] font-medium uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                See more
              </button>
            </div>
          )}
        </section>
      )}
    </>
  );
}