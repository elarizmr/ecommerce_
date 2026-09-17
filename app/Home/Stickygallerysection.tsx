import Image from "next/image";

const PINNED_IMAGE = {
  src: "/images/galeri.jpg",
  alt: "Model wearing the featured knit sweater",
};

const SCROLL_IMAGES = [
  { id: "shot-01", src: "/images/galeri2.jpg", alt: "Detail shot 1" },
  { id: "shot-02", src: "/images/galeri3.jpg", alt: "Detail shot 2" },
  { id: "shot-03", src: "/images/galeri4.jpg", alt: "Detail shot 3" },
  { id: "shot-04", src: "/images/galeri5.jpg", alt: "Detail shot 4" },
];

export default function StickyGallerySection() {
  return (
    <>
      {/* 1. Bölmə: Sol və Sağ Şəkillər (Sticky qalereya hissəsi) */}
      <section className="grid w-full grid-cols-1 md:grid-cols-2">
        {/* Sol tərəf: Sabit (sticky) qalan böyük şəkil */}
        <div className="relative">
          <div className="relative h-[70vh] w-full overflow-hidden bg-neutral-100 md:sticky md:top-0 md:h-screen">
            <Image
              src={PINNED_IMAGE.src}
              alt={PINNED_IMAGE.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </div>

        {/* Sağ tərəf: 4 ədəd uzun skrol olunan şəkil grid-i */}
        <div className="flex flex-col bg-white">
          <div className="grid grid-cols-2">
            {SCROLL_IMAGES.map((img) => (
              <div
                key={img.id}
                className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 sm:aspect-square md:aspect-[3/4]"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 25vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Bölmə: Yazı və Düymə TAMAMİLƏ AYRI bir div/section içində, ağ fonda */}
      <section className="w-full bg-white px-6 py-20 md:px-16">
        <div className="max-w-xl">
          <p className="text-lg leading-relaxed text-neutral-900 md:text-xl">
            Drawn to the space between ruggedness and refinement, we
            explore a new kind of strength. Fall Winter 26, Porcelain
            Cowboy unfolds through contrasts, where resilience and
            vulnerability exist as one.
          </p>

          <a
            href="/collections/fall-winter-26"
            className="mt-8 inline-block border border-neutral-900 px-8 py-4 text-sm font-semibold tracking-wide transition-colors hover:bg-neutral-900 hover:text-white"
          >
            SHOP COLLECTION
          </a>
        </div>
      </section>
    </>
  );
}