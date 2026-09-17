"use client";

import { useState } from "react";
import Image from "next/image";

interface Category {
  label: string;
  count: number;
}

const CATEGORIES: Category[] = [
  { label: "CITIZENS", count: 5 },
  { label: "MUSIC", count: 3 },
  { label: "ART", count: 3 },
  { label: "FOOD", count: 1 },
  { label: "ALL", count: 15 },
];

interface FriendsHeroProps {
  imageSrc?: string;
  imageAlt?: string;
}

export default function FriendsHero({
  imageSrc = "/images/friendshero.jpg",
  imageAlt = "Studio shelving filled with design objects, a person walking past",
}: FriendsHeroProps) {
  const [active, setActive] = useState("ALL");

  return (
    <div>
      {/* Hero şəkil + başlıq */}
      <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="select-none text-center text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Our life as friends
          </h1>
        </div>
      </div>

      {/* Kateqoriya filtri */}
      <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2 px-6 pt-12 pb-8 text-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActive(cat.label)}
            className={`relative text-3xl font-extrabold uppercase tracking-tight transition-opacity sm:text-4xl md:text-5xl ${
              active === cat.label ? "text-black" : "text-black/40"
            } hover:text-black`}
          >
            {cat.label}
            <sup className="ml-0.5 text-xs font-semibold tracking-normal sm:text-sm">
              [{cat.count}]
            </sup>
          </button>
        ))}
      </div>

      {/* Təsvir mətni */}
      <p className="mx-auto max-w-4xl px-6 pb-20 text-center text-sm font-semibold uppercase leading-relaxed tracking-wide text-black sm:text-base">
        Friends is our space where we come together with like-minded creatives
        to explore what it means to live this life with friends. From
        stories, music and recipes to inspiration and experiences, this is
        where we share everything that connects us to our fellow citizens and
        communities across the globe.
      </p>
    </div>
  );
}