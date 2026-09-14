// components/CollectionShowcase.tsx
import Link from 'next/link';

export default function CollectionShowcase() {
  const categories = [
    {
      name: 'Menswear',
      href: '/collections/all-mens',
      image: '/images/men.jpg',
    },
    {
      name: 'Womenswear',
      href: '/collections/all-womens',
      image: '/images/women.jpg',
    },
    {
      name: 'Accessories',
      href: '/collections/accessories',
      image: '/images/gay.jpg',
    },
  ];

  return (
    <section className="w-full bg-white">
      {/* Mətn hissəsi */}
      <div className="max-w-3xl mx-auto text-center px-6 py-16 sm:py-24">
        <span className="text-xs tracking-widest text-gray-500 block mb-4">
          FW26
        </span>
        <p className="text-2xl sm:text-4xl leading-snug sm:leading-tight text-black">
          Discover Fall Winter &apos;26 through the idea of the Porcelain
          Cowboy: strength held in the same hand as sensitivity. These pieces
          are made to sit at the intersection of labour and love, built to
          become part of your everyday rotation.
        </p>
      </div>

     {/* Kateqoriya kartları */}
<div className="grid grid-cols-1 sm:grid-cols-3">
  {categories.map((cat) => (
    <Link
      key={cat.name}
      href={cat.href}
      className="relative group aspect-[3/4] sm:aspect-[2/3] overflow-hidden"
    >
      <img
        src={cat.image}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-5 py-5 text-white">
        <span className="text-base sm:text-lg font-medium">
          {cat.name}
        </span>
        <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  ))}
</div>
    </section>
  );
}