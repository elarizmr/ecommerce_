'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

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

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error('Məhsul tapılmadı');
  return res.json();
}

export default function ProductPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>('information');

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: Boolean(id),
  });

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
        threshold: 0.6, // şəkilin ən azı 60%-i görünəndə "aktiv" say
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
    <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
      <div className="text-xs tracking-wider text-gray-500 uppercase mb-8">
        OLAF / {product.section} / {product.subcategory} / {product.name}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[64px_minmax(0,1.6fr)_minmax(0,1fr)] gap-4 lg:gap-8">
        {/* Thumbnail sütunu: yalnız kompüterdə, sticky, scroll ilə aktiv şəkil highlight olunur */}
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

          {/* Mobil üçün sayğac */}
          <div className="md:hidden mt-2 text-[10px] tracking-wider text-gray-500">
            {String(activeImage + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </div>

        {/* Məlumat: sticky yalnız kompüterdə */}
        <div className="text-black md:max-w-md md:sticky md:top-24 md:self-start h-fit">
          <h1 className="text-lg font-bold uppercase tracking-tight">{product.name}</h1>
          <p className="text-sm font-medium mt-1">M.{Number(product.price).toFixed(2)}</p>
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
            disabled={!selectedSize || product.stock <= 0}
            onClick={() => alert(`Cart: ${product.name} / ${selectedSize}`)}
            className="mt-6 w-full bg-black text-white text-xs font-semibold tracking-wider py-4 disabled:opacity-40"
          >
            {product.stock <= 0
              ? 'SOLD OUT'
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
  );
}