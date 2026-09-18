'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string[];
  subcategory: string;
  section: string;
  sizes: string[];
}

async function fetchSlugProducts(section: string, slug: string) {
  // Buraya bax: sorğunun düzgün gedib-getmədiyini görəcəyik
  console.log('Fetching products for:', section, slug);
  const res = await fetch(`/api/products?section=${section}&subcategory=${slug}`);
  if (!res.ok) throw new Error('Məhsulları çəkərkən xəta baş verdi');
  const data = await res.json();
  return Array.isArray(data) ? data : data.products || [];
}

export default function SlugPage() {
  const params = useParams();
  
  // Parametrləri təhlükəsiz şəkildə string-ə çeviririk
  const section = typeof params.section === 'string' ? params.section : '';
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Debug üçün yoxlayaq görək paramlar gəlirmi
  useEffect(() => {
    console.log('Current params -> section:', section, 'slug:', slug);
  }, [section, slug]);

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', section, slug],
    queryFn: () => fetchSlugProducts(section, slug),
    // Şərti yumşaldırıq ki, component mount olanda sorğu atsın
    enabled: Boolean(section && slug), 
  });

  const formattedCategoryName = slug ? slug.replace(/-/g, ' ').toUpperCase() : '';

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="text-xs tracking-wider text-gray-500 uppercase mb-8">
        OLAF / {section} / {formattedCategoryName}
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
          No products found in this category (Section: {section}, Subcategory: {slug}).
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => {
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