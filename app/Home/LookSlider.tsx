// components/LookSlider.tsx
import Link from 'next/link';

export default function LookSlider() {
  const looks = [
    { image: '/images/slider1.jpg', alt: 'Look 1' },
    { image: '/images/slider2.jpg', alt: 'Look 2' },
    { image: '/images/slider3.jpg', alt: 'Look 3' },
    { image: '/images/slider4.jpg', alt: 'Look 4' },
    { image: '/images/slider5.jpg', alt: 'Look 5' },
  ];

  // Fasiləsiz dövr üçün siyahını iki dəfə təkrarlayırıq
  const loopedLooks = [...looks, ...looks];

  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="relative">
        <div className="flex gap-4 animate-scroll-left w-max">
          {loopedLooks.map((look, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[70vw] sm:w-[24vw] aspect-[3/4] relative"
            >
              <img
                src={look.image}
                alt={look.alt}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Discover Collection düyməsi */}
      <div className="flex justify-center mt-10">
        <Link
          href="/collections/new-arrivals"
          className="border border-black px-8 py-3 text-xs font-medium tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          DISCOVER COLLECTION
        </Link>
      </div>
    </section>
  );
}