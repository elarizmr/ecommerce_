'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CATEGORIES, Section, slugify } from '@/app/lib/categories';

const SCROLL_RANGE = 600;

// Mega menu məntiqi dəyişmir:
// MEN -> yalnız men
// WOMEN -> yalnız women
// ACCESSORIES -> yalnız accessories
// LAST CHANCE -> hamısı
const MEGA_MENU_MAP: Record<string, Section[]> = {
  MEN: ['men'],
  WOMEN: ['women'],
  ACCESSORIES: ['accessories'],
  'LAST CHANCE': ['men', 'women', 'accessories'],
};

export default function Header({
  onMenuClick,
  isHome = false,
}: {
  onMenuClick: () => void;
  isHome?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeSections, setActiveSections] = useState<Section[] | null>(
    null
  );

  const pathname = usePathname();

  // --------------------------------------------------
  // USER
  // --------------------------------------------------

  useEffect(() => {
    fetch('/api/user/me', {
      credentials: 'include',
      cache: 'no-store',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserData(data.user);
        } else {
          setUserData(null);
        }
      })
      .catch(() => setUserData(null));
  }, [pathname]);

  // --------------------------------------------------
  // SCROLL
  // --------------------------------------------------

  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_RANGE * 0.6);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHome]);

  // Mega menu açıqdırsa header ağ olur
  const solid = !isHome || scrolled || activeSections !== null;

  const navLinks = [
    'MEN',
    'WOMEN',
    'ACCESSORIES',
    'LAST CHANCE',
    'FRIENDS',
    'LOYALTY',
  ];

  // --------------------------------------------------
  // SECTION TITLE
  // --------------------------------------------------

  const getSectionTitle = (section: Section) => {
    if (section === 'men') return 'Men';
    if (section === 'women') return 'Women';
    return 'Accessories';
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        transition-colors
        duration-300
        ${solid ? 'bg-white' : 'bg-white md:bg-transparent'}
      `}
      onMouseLeave={() => setActiveSections(null)}
    >
      {/* ==================================================
          TOP HEADER
      ================================================== */}

      <div className="relative flex items-center justify-between h-10 px-6">
        {/* --------------------------------------------------
            LOGO
        -------------------------------------------------- */}

        <div className="flex items-center min-w-[120px]">
          {!isHome && (
            <Link
              href="/"
              className={`
                text-xl
                font-extrabold
                tracking-[0.2em]
                leading-none
                transition-colors
                duration-300
                ${solid ? 'text-black' : 'text-white'}
              `}
            >
              OLAF
            </Link>
          )}
        </div>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const hasMegaMenu = MEGA_MENU_MAP[link] !== undefined;

            return (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                onMouseEnter={() => {
                  if (hasMegaMenu) {
                    setActiveSections(MEGA_MENU_MAP[link]);
                  } else {
                    setActiveSections(null);
                  }
                }}
                className={`
                  text-[13px]
                  font-semibold
                  tracking-wide
                  whitespace-nowrap
                  transition-colors
                  duration-200
                  ${solid ? 'text-black' : 'text-white'}
                  ${
                    link === 'LAST CHANCE'
                      ? 'underline underline-offset-4'
                      : ''
                  }
                `}
              >
                {link}
              </Link>
            );
          })}

          {/* --------------------------------------------------
              SEARCH
          -------------------------------------------------- */}

          <Link
            href="/search"
            onMouseEnter={() => setActiveSections(null)}
            className={`
              text-[13px]
              font-semibold
              tracking-wide
              whitespace-nowrap
              transition-colors
              duration-200
              ${solid ? 'text-black' : 'text-white'}
            `}
          >
            SEARCH
          </Link>

          {/* --------------------------------------------------
              ACCOUNT
          -------------------------------------------------- */}

          <Link
            href={userData ? '/account' : '/login'}
            onMouseEnter={() => setActiveSections(null)}
            className={`
              text-[13px]
              font-semibold
              tracking-wide
              whitespace-nowrap
              transition-colors
              duration-200
              ${solid ? 'text-black' : 'text-white'}
            `}
          >
            {userData ? userData.email : 'ACCOUNT'}
          </Link>

          {/* --------------------------------------------------
              WISHLIST
          -------------------------------------------------- */}

          <Link
            href="/wishlist"
            onMouseEnter={() => setActiveSections(null)}
            className={`
              text-[13px]
              font-semibold
              tracking-wide
              whitespace-nowrap
              transition-colors
              duration-200
              ${solid ? 'text-black' : 'text-white'}
            `}
          >
            WISHLIST [0]
          </Link>

          {/* --------------------------------------------------
              CART
          -------------------------------------------------- */}

          <Link
            href="/cart"
            onMouseEnter={() => setActiveSections(null)}
            className={`
              text-[13px]
              font-semibold
              tracking-wide
              whitespace-nowrap
              transition-colors
              duration-200
              ${solid ? 'text-black' : 'text-white'}
            `}
          >
            CART [0]
          </Link>
        </nav>

        {/* ==================================================
            MOBILE
        ================================================== */}

        <div className="flex md:hidden items-center gap-4">
          {/* Hamburger */}

          <button
            onClick={onMenuClick}
            aria-label="Menu"
            className="text-black"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Cart */}

          <Link
            href="/cart"
            className="flex items-center gap-1 text-black"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>

            <span className="text-xs">[0]</span>
          </Link>
        </div>
      </div>

      {/* ==================================================
          MEGA MENU
      ================================================== */}

      {activeSections && activeSections.length > 0 && (
        <>
          {/* --------------------------------------------------
              DARK OVERLAY

              Mega menu açıldıqda səhifənin sol tərəfi
              şəkildəki kimi qaralır.
          -------------------------------------------------- */}

          <div
            className="
              fixed
              left-0
              right-0
              top-14
              bottom-0
              bg-black/30
              hidden
              md:block
              -z-10
            "
            aria-hidden="true"
          />

          {/* --------------------------------------------------
              MEGA MENU CONTAINER

              Sağ tərəfdə ekranın 75%-i.
          -------------------------------------------------- */}

          <div
            className="
              absolute
              top-full
              right-0
              w-[75%]
              hidden
              md:block
              bg-white
              border-t
              border-gray-200
              shadow-sm
            "
            onMouseEnter={() => {
              // Mega menu üzərinə keçəndə açıq qalır
            }}
          >
            {/* --------------------------------------------------
                MENU CONTENT
            -------------------------------------------------- */}

            <div
              className="
                grid
                grid-cols-3
                gap-0
                px-4
                pt-4
                pb-6
              "
            >
              {activeSections.map((section) => (
                <div
                  key={section}
                  className="
                    min-w-0
                    px-0
                  "
                >
                  {/* --------------------------------------------------
                      SECTION TITLE
                  -------------------------------------------------- */}

                  <h3
                    className="
                      text-[15px]
                      leading-5
                      font-bold
                      text-black
                      mb-3
                    "
                  >
                    {getSectionTitle(section)}
                  </h3>

                  {/* --------------------------------------------------
                      CATEGORY LIST
                  -------------------------------------------------- */}

                  <ul className="space-y-[7px]">
                    {/* View all */}

                    <li>
                      <Link
                        href={`/${section}`}
                        className="
                          text-[14px]
                          leading-5
                          text-gray-700
                          hover:text-black
                          transition-colors
                          duration-150
                        "
                      >
                        View all
                      </Link>
                    </li>

                    {/* Subcategories */}

                    {CATEGORIES[section].map((subcategory) => (
                      <li key={subcategory}>
                        <Link
                          href={`/${section}/${slugify(subcategory)}`}
                          className="
                            text-[14px]
                            leading-5
                            text-gray-700
                            hover:text-black
                            transition-colors
                            duration-150
                          "
                        >
                          {subcategory}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* --------------------------------------------------
                BOTTOM BORDER
            -------------------------------------------------- */}

            <div className="border-t border-gray-200" />
          </div>
        </>
      )}
    </header>
  );
}