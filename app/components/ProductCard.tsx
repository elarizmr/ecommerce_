// components/ProductCard.tsx
import Link from 'next/link';

import { Section } from '@/app/lib/categories';

// Product modelinə uyğundur (app/lib/models/Product)
export type Product = {
  _id: string;
  name: string;
  price: number;
  section: Section;
  subcategory: string;
  image: string[];
};

// Valyutanı burdan dəyiş
const CURRENCY = 'AZN';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

export default function ProductCard({ product }: { product: Product }) {
  const [first, second] = product.image ?? [];

  return (
    <Link
      // Məhsul detal səhifəsinin yolu
      href={`/products/${product._id}`}
      className="group block"
    >
      {/* Şəkil: ikinci şəkil varsa hover-də ona keçir */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#efefec]">
        {first && (
          <img
            src={first}
            alt={product.name}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {second && (
          <img
            src={second}
            alt=""
            aria-hidden="true"
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
      </div>

      {/* Ad və qiymət */}
      <div className="pt-2.5">
        <p className="text-[13px] leading-[18px] font-medium text-black">
          {product.name}
        </p>
        <p className="text-[13px] leading-[18px] text-[#6b6b6b]">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}