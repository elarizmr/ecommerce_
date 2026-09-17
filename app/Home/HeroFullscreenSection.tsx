import Image from "next/image";

export default function HeroFullscreenSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-neutral-900">
      {/* Şəkil ekrana sığmır, object-cover ilə böyüdülüb və mərkəzlənib */}
      <Image
        src="/images/hero1.jpg"
        alt="Porcelain Cowboy Collection"
        fill
        className="object-cover object-center scale-110" 
        priority
      />

      {/* Şəklin üzərində sol aşağı küncdə qalan mətnlər (şəkildəki kimi) */}
      <div className="absolute bottom-12 left-8 md:left-12 z-10 flex flex-col space-y-1 text-white/90 select-none pointer-events-none">
        <span className="text-xs uppercase tracking-widest text-neutral-400">
          Collection Concept
        </span>
        <span className="text-sm font-medium tracking-wide uppercase">
          Fall / Winter 26
        </span>
        <span className="text-sm font-light tracking-wide uppercase text-neutral-300">
          Porcelain Cowboy
        </span>
      </div>
    </section>
  );
}