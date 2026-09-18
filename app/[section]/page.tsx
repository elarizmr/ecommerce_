'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

interface Product {
  _id: string;
  name: string;      // title əvəzinə name
  price: number;
  image: string[];   // massiv şəklində (string[])
  subcategory: string; // category əvəzinə subcategory
  section: string;
  sizes: string[];
}

// Fetch funksiyası düzəldildi (backend birbaşa massiv qaytarır)
async function fetchProducts(section: string) {
  const res = await fetch(`/api/products?section=${section}`);
  if (!res.ok) throw new Error('Məhsulları çəkərkən xəta baş verdi');
  const data = await res.json();
  return Array.isArray(data) ? data : data.products || [];
}

export default function SectionPage() {
  const params = useParams();
  const section = params.section as string; // men, women, accessories
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // TanStack Query ilə məhsulların çəkilməsi
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', section],
    queryFn: () => fetchProducts(section),
    enabled: !!section,
  });

  const formattedSectionName = section ? section.charAt(0).toUpperCase() + section.slice(1) : '';

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="text-xs tracking-wider text-gray-500 uppercase mb-8">
        OLAF / {formattedSectionName} All Products
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-sm text-gray-400">
          Loading...
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-sm text-gray-500">
          No products found in this section.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => {
            // Şəklin massiv və ya string olmasını yoxlayırıq
            const imageUrl = Array.isArray(product.image) 
              ? product.image[0] 
              : product.image;

            return (
              <div
                key={product._id}
                className="group relative flex flex-col cursor-pointer"
                onMouseEnter={() => setHoveredProductId(product._id)}
                onMouseLeave={() => setHoveredProductId(null)}
              >
                <Link href={`/products/${product._id}`} className="relative bg-[#E5E5E5] aspect-[3/4] overflow-hidden flex items-center justify-center">
                  <img
                    src={imageUrl || ''}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  {hoveredProductId === product._id && product.sizes && product.sizes.length > 0 && (
                    <div className="absolute bottom-4 left-0 w-full px-4 flex flex-col items-center transition-all duration-300">
                      <div className="bg-white/90 backdrop-blur-sm text-black text-[11px] font-bold tracking-wider py-1.5 px-4 mb-2 shadow-sm uppercase">
                        Select Size
                      </div>
                      <div className="flex gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 shadow-sm">
                        {product.sizes.map((size) => (
                          <span
                            key={size}
                            onClick={(e) => {
                              e.preventDefault();
                              alert(`Selected size: ${size}`);
                            }}
                            className="text-xs font-medium text-black hover:text-gray-500 px-1 transition-colors"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>

                <div className="mt-3 flex justify-between items-start text-black">
                  <Link href={`/products/${product._id}`} className="text-[13px] font-bold uppercase tracking-tight hover:underline">
                    {product.name}
                  </Link>
                  <span className="text-[13px] font-medium">
                    M.{product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}