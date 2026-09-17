"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * "Our Life As Friends" bölməsi
 * ----------------------------------------------------
 * Struktur:
 *  - Sol tərəf: bir böyük hero şəkil. Bu şəkil öz sütununun
 *    daxilində `position: sticky` ilə davranır — yəni sağ
 *    tərəfdəki grid daha uzun olduğu üçün scroll zamanı
 *    sol şəkil ekranda "yapışıb qalır", sağ tərəf isə öz
 *    hündürlüyü bitənə qədər sürüşür. Sağ tərəf bitəndə
 *    sol şəkil də onunla birlikdə yuxarı qalxmağa davam edir
 *    (çünki sticky elementin "sərhədi" valideyn konteynerin
 *    hündürlüyüdür).
 *  - Sağ tərəf: 2 sütun x 3 sətir (6 kart) grid, hər kartda
 *    şəkil + ad + qısa təsvir. Gridin altında tam enində
 *    "READ MORE" düyməsi.
 *
 * Necə işləyir (texniki qeyd):
 *  - Valideyn (`.friendsSection`) `items-start` ilə grid/flex-dir.
 *  - Sol sütuna `sticky top-[var(--nav-h)]` verilir.
 *  - Sağ sütun təbii hündürlüyündə qalır (heç bir sticky yoxdur),
 *    beləliklə onun ümumi hündürlüyü sol sütunun "sticky sərhəddini"
 *    təyin edir.
 */

type Friend = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const FRIENDS: Friend[] = [
  {
    id: "calvin-stengs",
    name: "Calvin Stengs",
    description:
      "Calvin Stengs has built his career on creativity, instinct and staying true to himself. From…",
    image: "/images/friends2.jpg",
  },
  {
    id: "tays",
    name: "Tays",
    description:
      "Tays is a Dutch musician whose work blends introspective lyricism with atmospheric production, creating songs…",
    image: "/images/friends3.jpg",
  },
  {
    id: "yuri-leal",
    name: "Yuri Leal",
    description:
      "Yuri Leal is a Brazilian artist based in Amsterdam whose work explores the relationship between…",
    image: "/images/friends4.jpg",
  },
  {
    id: "chelo",
    name: "Chelo",
    description:
      "Rooted in a childhood steeped in music and culture, Chelo has grown from a teenage…",
    image: "/images/friends5.jpg",
  },
  {
    id: "davey-donovan",
    name: "Davey Donovan",
    description:
      "Davey Donovan is an Amsterdam-based music producer known for his versatile and emotionally-driven beats in…",
    image: "/images/friends6.jpg",
  },
  {
    id: "edith-beurskens",
    name: "Edith Beurskens",
    description:
      "Edith Beurskens is a multidisciplinary artist and designer known for her sculptural works that explore…",
    image: "/images/friends7.jpg",
  },
];

const HERO_IMAGE = {
  src: "/images/frends.jpg",
  alt: "OLAF şapkası və kostyum geyinmiş model",
};

export default function OurLifeAsFriends() {
  const [visibleCount, setVisibleCount] = useState(6);
  const visibleFriends = FRIENDS.slice(0, visibleCount);
  // Qeyd: "Read More" düyməsi dizaynda həmişə görünür (hətta bütün
  // friend-lər ekranda olsa belə) — real layihədə bu düymə basılanda
  // adətən /friends səhifəsinə keçid olur və ya API-dən yeni məlumat
  // çəkilir. Ona görə göstərilməsini `hasMore`-a bağlamırıq.
  const hasMore = visibleCount < FRIENDS.length;

  return (
    <section className="w-full bg-white text-black">
      {/* Başlıq */}
      <div className="px-4 pt-8 pb-6 sm:px-6 sm:pt-10 sm:pb-8 md:px-8 md:pt-14 md:pb-10">
        <h1 className="font-sans font-bold uppercase leading-[0.85] tracking-tight text-[clamp(2.25rem,10vw,7rem)]">
          Our Life As Friends
        </h1>
      </div>

      {/* Əsas iki sütunlu blok */}
      <div className="friendsSection mx-auto grid max-w-[1800px] grid-cols-1 gap-6 px-4 pb-10 sm:px-6 sm:pb-12 md:grid-cols-2 md:items-start md:gap-8 md:px-8 md:pb-16">
        {/* SOL: hero şəkil — sticky effekti YALNIZ md+ ekranlarda aktivdir,
            çünki mobil düzülüşdə (grid-cols-1) sütunlar yanaşı deyil,
            üst-üstə düzülüb, ona görə sticky-nin orada mənası yoxdur. */}
        <div className="static md:sticky md:top-24 md:self-start">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 sm:aspect-[4/5]">
            <Image
              src={HERO_IMAGE.src}
              alt={HERO_IMAGE.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* SAĞ: 2x3 kart grid + Read More */}
        <div className="flex flex-col gap-0">
          <div className="grid grid-cols-2 gap-px bg-neutral-200">
            {visibleFriends.map((friend) => (
              <FriendCard key={friend.id} friend={friend} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (hasMore) {
                setVisibleCount((c) => c + 4);
              } else {
                // Hamısı artıq göstərilib — real layihədə burada
                // /friends kimi tam siyahı səhifəsinə keçid olunur.
                window.location.href = "/friends";
              }
            }}
            className="mt-4 w-full border border-black py-3 text-xs font-medium uppercase tracking-wide transition-colors hover:bg-black hover:text-white sm:mt-6 sm:py-4 sm:text-sm"
          >
            Read more
          </button>
        </div>
      </div>
    </section>
  );
}

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <article className="flex flex-col bg-white">
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <Image
          src={friend.image}
          alt={friend.name}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="px-2 py-2 sm:px-3 sm:py-3 md:px-4 md:py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide sm:text-sm md:text-base">
          {friend.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] text-neutral-600 sm:line-clamp-3 sm:text-xs md:text-sm">
          {friend.description}
        </p>
      </div>
    </article>
  );
}