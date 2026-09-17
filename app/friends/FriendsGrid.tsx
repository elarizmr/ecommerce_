import Image from "next/image";
import Link from "next/link";

interface OverlayPerson {
  name: string;
  href: string;
  image: string;
}

interface FeaturedStory {
  tag: string;
  name: string;
  description: string;
  href: string;
  image: string;
}

interface PersonCard {
  name: string;
  description: string;
  href: string;
  image: string;
  grayscale?: boolean;
}

const OVERLAY_PEOPLE: OverlayPerson[] = [
  { name: "CALVIN STENGS", href: "#", image: "/images/friends2.jpg" },
  { name: "TAYS", href: "#", image: "/images/friends3.jpg" },
  { name: "YURI LEAL", href: "#", image: "/images/friends4.jpg" },
  { name: "CHELO", href: "#", image: "/images/friends5.jpg" },
  { name: "DAVEY DONOVAN", href: "#", image: "/images/friends6.jpg" },
];

const FEATURED_STORIES: FeaturedStory[] = [
  {
    tag: "ART",
    name: "EDITH BEURSKENS",
    description:
      "Edith Beurskens is a multidisciplinary artist and designer known for her sculptural works that explore the balance between nature and technology.",
    href: "#",
    image: "/images/friends7.jpg",
  },
  {
    tag: "ART",
    name: "TOM CHUNG",
    description:
      "Tom Chung is an independent industrial designer whose career has spanned oceans, mediums, and modes of making. From early experiments in reclaimed wood to a sharply refined design language shaped by European industry, Chung's work merges industrial precision with personal...",
    href: "https://www.olafhussein.com/blogs/citizens/tom-chung",
    image: "/images/tom.jpg",
  },
  {
    tag: "CITIZENS",
    name: "ENSŌ VINTAGE",
    description:
      "Meet Andrea & Liseth, founders of ENSŌ Vintage, a brand focused on upcycling and curating vintage pieces in their physical and online locations with a mission to giving clothing a new life. The founders connected over a dream to create...",
    href: "#",
    image: "/images/enso.jpg",
  },
];

const PEOPLE: PersonCard[] = [
  {
    name: "MARY CONSOLATA",
    description:
      "Meet Mary Consolata Namagambe, founder of She for She Pads and Girls Will Be Girls. Her...",
    href: "#",
    image: "/images/mary.jpg",
  },
  {
    name: "NSIMBA VALENE",
    description:
      "Nsimba Valene is a creative non-conformist who can't be pinned down to a single role. While...",
    href: "#",
    image: "/images/nsimba.jpg",
  },
  {
    name: "FREDERIEKE BLOEM",
    description:
      "Founder of the culinary creative space, Copain. Raised on a farm close to Rotterdam, now based...",
    href: "#",
    image: "/images/bloem.jpg",
  },
  {
    name: "NATHALIE ROBBERSE",
    description:
      "Co-founder of TEN – a networking community for entrepreneurial women that started in Amsterdam and is...",
    href: "#",
    image: "/images/roberse.jpg",
  },
  {
    name: "NICOLE MCLAUGHLIN",
    description:
      "Designer, artist, and social media phenomenon, Nicole McLaughlin, has changed the way the fashion industry thinks...",
    href: "#",
    image: "/images/nicole.jpg",
  },
  {
    name: "ISMAEL SANTANA VASQUEZ",
    description:
      "Ismael Santana Vasquez is someone who stands out from the crowd. His overflowing passion, positivity, and...",
    href: "#",
    image: "/images/ismael.jpg",
    grayscale: true,
  },
  {
    name: "SANGO",
    description:
      "If you're not familiar with the name Kai Wright, you might know him better as the...",
    href: "#",
    image: "/images/sango.jpg",
  },
];

export default function FriendsGrid() {
  return (
    <section className="bg-white px-6 pb-24 md:px-10 lg:px-16">
      {/* Blok A: overlay kvadratlar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {OVERLAY_PEOPLE.map((person) => (
          <Link
            key={person.name}
            href={person.href}
            className="group relative aspect-square overflow-hidden"
          >
            <Image
              src={person.image}
              alt={person.name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute left-3 top-3 right-3 text-sm font-extrabold uppercase leading-tight tracking-tight text-white drop-shadow sm:text-base">
              {person.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Blok B: tag'lı böyük hekayə kartları */}
      <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3">
        {FEATURED_STORIES.map((story) => (
          <Link key={story.name} href={story.href} className="group block">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={story.image}
                alt={story.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {story.tag}
              </span>
              <h3 className="text-xl font-extrabold uppercase tracking-tight text-black sm:text-2xl">
                {story.name}
              </h3>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              {story.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Blok C: adi people grid */}
      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
        {PEOPLE.map((person) => (
          <Link key={person.name} href={person.href} className="group block">
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={person.image}
                alt={person.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                  person.grayscale ? "grayscale" : ""
                }`}
              />
            </div>
            <h3 className="mt-3 text-sm font-extrabold uppercase tracking-tight text-black sm:text-base">
              {person.name}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-600 sm:text-sm">
              {person.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}