// app/collections/all/page.tsx
'use client';

import { useEffect, useState } from 'react';

import ProductCard, { Product } from '@/app/components/ProductCard';

type Status = 'loading' | 'error' | 'ready';

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    let cancelled = false;

    fetch('/api/products', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Request failed');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProducts(Array.isArray(data) ? data : data.products ?? []);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="w-full bg-white min-h-screen pt-16 md:pt-14 pb-16">
      {/* Başlıq */}
      <div className="flex items-baseline justify-between px-2.5 pb-6">
        <h1 className="text-[14px] font-medium text-black">All products</h1>
        {status === 'ready' && (
          <span className="text-[13px] text-[#6b6b6b]">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* Yüklənir */}
      {status === 'loading' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-8 px-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] bg-[#efefec] animate-pulse" />
              <div className="mt-2.5 h-3 w-2/3 bg-[#efefec] animate-pulse" />
              <div className="mt-1.5 h-3 w-1/3 bg-[#efefec] animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Xəta */}
      {status === 'error' && (
        <p className="px-2.5 text-[13px] text-[#6b6b6b]">
          Products could not be loaded. Please refresh the page.
        </p>
      )}

      {/* Boş */}
      {status === 'ready' && products.length === 0 && (
        <p className="px-2.5 text-[13px] text-[#6b6b6b]">
          No products yet.
        </p>
      )}

      {/* Məhsullar: mobil 2 sütun, planşet 3, desktop 4 */}
      {status === 'ready' && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 gap-y-8 md:gap-y-10 px-2.5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}