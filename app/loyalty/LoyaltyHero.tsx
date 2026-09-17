import Image from "next/image";

interface LoyaltyHeroProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function LoyaltyHero({
  imageSrc = "/images/loyalty-hero.jpg",
  imageAlt = "Guests mingling at an OLAF store event",
}: LoyaltyHeroProps) {
  return (
    <div className="relative h-[85vh] min-h-[420px] w-full overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="select-none text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl">
          Loyalty
        </h1>
      </div>
    </div>
  );
}