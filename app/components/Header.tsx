'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CATEGORIES, Section, slugify } from '@/app/lib/categories';
import { useWishlist } from '@/app/lib/useWishlist';
import { useCart } from '@/app/lib/useCart';
import CartDrawer from '@/app/components/CartDrawer';

const SCROLL_RANGE = 600;

// Axtarış ayarları
const SEARCH_MIN_LENGTH = 2; // ən azı neçə hərfdən sonra axtarılsın
const SEARCH_DEBOUNCE_MS = 300; // yazmağı dayandırandan sonra gözləmə
const SEARCH_LIMIT = 12; // panelde maksimum neçə məhsul göstərilsin

// Məhsul səhifəsinin ünvanı. Layihənizdəki real route-a uyğun dəyişin.
const productHref = (id: string) => `/products/${id}`;

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

// Axtarışda kateqoriya təklifinin altındakı yazı: "All Jackets", "Womens Jackets"
const SECTION_PREFIX: Record<Section, string> = {
  men: 'All',
  women: 'Womens',
  accessories: 'Accessories',
};

type SearchProduct = {
  _id: string;
  name: string;
  price: number;
  section: string;
  subcategory: string;
  image?: string[] | string;
  colors?: { name: string; images: string[] }[];
};

const formatPrice = (price: number) => `m.${Number(price).toFixed(2)}`;

const getProductImage = (p: SearchProduct): string | null => {
  if (Array.isArray(p.image) && p.image[0]) return p.image[0];
  if (typeof p.image === 'string' && p.image) return p.image;
  return p.colors?.find((c) => c.images?.[0])?.images[0] ?? null;
};

// "jackets" -> "jacket" (tək/cəm fərqi olmasın)
const singular = (t: string) =>
  t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t;

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
  // Hansı nav linkinin üzərindəyik (altından xətt çəkmək üçün)
  const [activeLink, setActiveLink] = useState<string | null>(null);

  // Axtarış
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Səbət paneli
  const [cartOpen, setCartOpen] = useState(false);

  const pathname = usePathname();

  // Wishlist-dəki məhsul sayı (login olmayanda 0)
  const { count: wishlistCount } = useWishlist();

  // Səbətdəki ümumi miqdar + panelı açan funksiya (login yoxdursa /login-ə göndərir)
  const { count: cartCount, openCart } = useCart();

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

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    setQuery('');
    setResults([]);
    setSearching(false);
  }, []);

  // Səhifə dəyişəndə axtarış bağlansın
  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  // Səhifə dəyişəndə səbət paneli bağlansın
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  // Esc ilə səbəti bağla
  useEffect(() => {
    if (!cartOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cartOpen, closeCart]);

  // Esc ilə bağlanma
  useEffect(() => {
    if (!searchOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, closeSearch]);

  // Panel açılanda input-a fokus
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  // Mobil menyudakı SEARCH bəndi window.dispatchEvent(new Event('open-search'))
  // çağıranda axtarış paneli açılır
  useEffect(() => {
    const onOpenSearch = () => {
      setActiveSections(null);
      setActiveLink(null);
      setCartOpen(false);
      setSearchOpen(true);
    };

    window.addEventListener('open-search', onOpenSearch);
    return () => window.removeEventListener('open-search', onOpenSearch);
  }, []);

  // Header-dəki CART, mobil menyudakı CART və məhsul səhifəsindəki ADD TO CART
  // window.dispatchEvent(new Event('open-cart')) çağıranda səbət paneli açılır
  useEffect(() => {
    const onOpenCart = () => {
      setActiveSections(null);
      setActiveLink(null);
      closeSearch();
      setCartOpen(true);
    };

    window.addEventListener('open-cart', onOpenCart);
    return () => window.removeEventListener('open-cart', onOpenCart);
  }, [closeSearch]);

  // Mobildə axtarış və ya səbət açıqkən arxadakı səhifə sürüşməsin
  useEffect(() => {
    if (!searchOpen && !cartOpen) return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [searchOpen, cartOpen]);

  // Yazdıqca (debounce ilə) məhsulları gətir
  useEffect(() => {
    const q = query.trim();

    if (!searchOpen || q.length < SEARCH_MIN_LENGTH) {
      setResults([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    setSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(q)}&limit=${SEARCH_LIMIT}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('Search failed');

        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        setSearching(false);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        setResults([]);
        setSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, searchOpen]);

  // Uyğun kateqoriyalar: "jackets" -> Men Jackets + Women Jackets
  const suggestions = useMemo(() => {
    const q = singular(query.trim().toLowerCase());
    if (q.length < SEARCH_MIN_LENGTH) return [];

    const found: { section: Section; subcategory: string }[] = [];

    for (const section of Object.keys(CATEGORIES) as Section[]) {
      for (const subcategory of CATEGORIES[section]) {
        if (subcategory.toLowerCase().includes(q)) {
          found.push({ section, subcategory });
        }
      }
    }

    return found;
  }, [query]);

  const hasQuery = query.trim().length >= SEARCH_MIN_LENGTH;
  const noResults =
    hasQuery && !searching && results.length === 0 && suggestions.length === 0;

  // --------------------------------------------------
  // MENU STATE
  // --------------------------------------------------

  const megaOpen = activeSections !== null;

  // Mega menu və ya axtarış açıqdırsa nav ağ olur
  const open = megaOpen || searchOpen || cartOpen;
  const solid = !isHome || scrolled || open;

  const navLinks = [
    'MEN',
    'WOMEN',
    'ACCESSORIES',
    'LAST CHANCE',
    'FRIENDS',
    'LOYALTY',
  ];

  const closeMenu = () => {
    setActiveSections(null);
    setActiveLink(null);
  };

  const toggleSearch = () => {
    closeMenu();
    setCartOpen(false);
    if (searchOpen) {
      closeSearch();
    } else {
      setSearchOpen(true);
    }
  };

  // CART: açıqdırsa bağla, bağlıdırsa aç (giriş etməyibsə login səhifəsinə gedir)
  const toggleCart = () => {
    if (cartOpen) {
      closeCart();
      return;
    }
    closeMenu();
    closeSearch();
    openCart();
  };

  // --------------------------------------------------
  // SECTION TITLE
  // --------------------------------------------------

  const getSectionTitle = (section: Section) => {
    if (section === 'men') return 'Men';
    if (section === 'women') return 'Women';
    return 'Accessories';
  };

  // --------------------------------------------------
  // NAV ITEM STYLE
  // Aktiv (hover) olan linkin altından nazik xətt çəkilir
  // --------------------------------------------------

  const itemClass = (active: boolean) => `
    text-[13px]
    font-semibold
    tracking-wide
    whitespace-nowrap
    transition-colors
    duration-200
    ${solid ? 'text-black' : 'text-white'}
    ${active ? 'underline decoration-1 underline-offset-[3px]' : ''}
  `;

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
        md:pt-[2px]
        transition-colors
        duration-300
        ${solid && !open ? 'bg-white' : 'bg-white md:bg-transparent'}
      `}
      onMouseLeave={closeMenu}
    >
      {/* ==================================================
          TOP ROW
          Desktop: solda 25% (logo), sağda 75% (nav)
      ================================================== */}

      <div
        className="
          relative
          flex
          items-center
          justify-between
          md:justify-start
          h-10
          md:h-[26px]
          px-6
          md:px-0
        "
      >
        {/* --------------------------------------------------
            LOGO
        -------------------------------------------------- */}

        <div
          className="flex items-center min-w-[120px] md:w-1/4 md:px-2.5"
          onMouseEnter={closeMenu}
        >
          {(!isHome || searchOpen) && (
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
                ${isHome ? 'md:hidden' : ''}
              `}
            >
              OLAF
            </Link>
          )}
        </div>

        {/* ==================================================
            DESKTOP NAVIGATION
            Sağda 75% enində, elementlər bərabər yayılır
            (space-between), açılanda ağ qutu olur.
        ================================================== */}

        <nav
          className={`
            hidden
            md:flex
            md:w-3/4
            h-full
            items-center
            justify-between
            px-2.5
            transition-colors
            duration-200
            ${open ? 'bg-white' : ''}
          `}
        >
          {navLinks.map((link) => {
            const hasMegaMenu = MEGA_MENU_MAP[link] !== undefined;

            return (
              <Link
                key={link}
                href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                onMouseEnter={() => {
                  // Axtarış və ya səbət açıqkən mega menu hover ilə açılmasın
                  if (searchOpen || cartOpen) return;

                  if (hasMegaMenu) {
                    setActiveSections(MEGA_MENU_MAP[link]);
                    setActiveLink(link);
                  } else {
                    closeMenu();
                  }
                }}
                className={itemClass(activeLink === link)}
              >
                {link}
              </Link>
            );
          })}

          {/* SEARCH: link deyil, paneli açıb-bağlayan düymədir */}

          <button
            type="button"
            onMouseEnter={closeMenu}
            onClick={toggleSearch}
            aria-expanded={searchOpen}
            className={itemClass(searchOpen)}
          >
            SEARCH
          </button>

          {/* ACCOUNT */}

          <Link
            href={userData ? '/account' : '/login'}
            onMouseEnter={closeMenu}
            className={`${itemClass(false)} max-w-[140px] truncate`}
          >
            {userData ? userData.email : 'ACCOUNT'}
          </Link>

          {/* WISHLIST */}

          <Link
            href="/wishlist"
            onMouseEnter={closeMenu}
            className={itemClass(false)}
          >
            WISHLIST [{wishlistCount}]
          </Link>

          {/* CART: link deyil, səbət panelini açıb-bağlayan düymədir */}

          <button
            type="button"
            onMouseEnter={closeMenu}
            onClick={toggleCart}
            aria-expanded={cartOpen}
            className={itemClass(cartOpen)}
          >
            CART [{cartCount}]
          </button>
        </nav>

        {/* ==================================================
            MOBILE
        ================================================== */}

        <div className="flex md:hidden items-center gap-4">
          {/* Axtarış açıqdırsa hamburger əvəzinə bağlama (X) düyməsi.
              Axtarışı mobil menyudakı SEARCH bəndi açır. */}

          {searchOpen || cartOpen ? (
            <button
              type="button"
              onClick={() => {
                closeSearch();
                closeCart();
              }}
              aria-label="Close panel"
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
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          ) : (
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
          )}

          {/* Cart */}

          <button
            type="button"
            onClick={toggleCart}
            aria-label="Cart"
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

            <span className="text-xs">[{cartCount}]</span>
          </button>
        </div>
      </div>

      {/* ==================================================
          MEGA MENU
      ================================================== */}

      {activeSections && activeSections.length > 0 && (
        <>
          {/* --------------------------------------------------
              DARK OVERLAY
              Bütün səhifə (nav-ın arxası və solda qalan 25%)
              yüngülcə qaralır. Üzərinə keçəndə menyu bağlanır.
          -------------------------------------------------- */}

          <div
            className="
              fixed
              inset-0
              hidden
              md:block
              bg-black/30
              -z-10
            "
            onMouseEnter={closeMenu}
            aria-hidden="true"
          />

          {/* --------------------------------------------------
              MEGA MENU WRAPPER
              Nav ilə panel arasındakı 4px boşluq (pt-1) bu
              wrapper-in içindədir, ona görə siçan keçəndə
              menyu bağlanmır.
          -------------------------------------------------- */}

          <div
            className="
              absolute
              top-full
              right-0
              w-3/4
              hidden
              md:block
              pt-1
            "
          >
            {/* Ağ panel: kölgəsiz, künc yuvarlaqlığı yoxdur */}

            <div className="bg-white px-2.5 pt-1.5 pb-[11px]">
              {/* --------------------------------------------------
                  COLUMNS
                  5 bərabər sütun, hər sütun bir bölmədir
              -------------------------------------------------- */}

              <div className="grid grid-cols-5">
                {activeSections.map((section) => (
                  <div key={section} className="min-w-0">
                    {/* SECTION TITLE */}

                    <h3
                      className="
                        text-[14px]
                        leading-[18.5px]
                        font-medium
                        text-black
                        mb-1
                      "
                    >
                      {getSectionTitle(section)}
                    </h3>

                    {/* CATEGORY LIST */}

                    <ul>
                      {/* View all */}

                      <li>
                        <Link
                          href={`/${section}`}
                          className="
                            block
                            pl-0.5
                            text-[14px]
                            leading-[18.5px]
                            text-[#6b6b6b]
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
                              block
                              pl-0.5
                              text-[14px]
                              leading-[18.5px]
                              text-[#6b6b6b]
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
                  BOTTOM DIVIDER
                  Panelin içində, hər iki tərəfdən 10px içəridə
              -------------------------------------------------- */}

              <div className="mt-3 border-t border-neutral-300" />
            </div>
          </div>
        </>
      )}

      {/* ==================================================
          SEARCH PANEL
          Desktop: sağda 75% (mega menu ilə eyni yerdə)
          Mobil: header-in altında tam ekran
      ================================================== */}

      {searchOpen && (
        <>
          {/* Overlay (yalnız desktop): üzərinə klik edəndə axtarış bağlanır.
              Qaralma istəmirsinizsə bg-black/30 -> bg-transparent */}

          <div
            className="
              fixed
              inset-0
              hidden
              md:block
              bg-black/30
              -z-10
            "
            onClick={closeSearch}
            aria-hidden="true"
          />

          <div
            className="
              fixed
              inset-x-0
              top-10
              bottom-0
              md:absolute
              md:left-auto
              md:right-0
              md:top-full
              md:bottom-auto
              md:w-3/4
              md:pt-1
            "
            role="search"
          >
            <div
              className="
                h-full
                md:h-auto
                md:max-h-[85vh]
                overflow-y-auto
                bg-white
                px-6
                pb-10
                md:px-2.5
                md:pb-6
              "
            >
              {/* INPUT (mobildə sağda X düyməsi ilə) */}

              <div className="flex items-end gap-4 pt-2 md:pt-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="SEARCH"
                  aria-label="Search products"
                  autoComplete="off"
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    border-b
                    border-neutral-300
                    pt-4
                    pb-3
                    text-[16px]
                    md:text-[14px]
                    uppercase
                    text-black
                    placeholder:text-[#6b6b6b]
                    outline-none
                  "
                />

                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="md:hidden pb-2 text-black"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                </button>
              </div>

              <div aria-live="polite">
                {/* CATEGORY SUGGESTIONS */}

                {suggestions.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-neutral-300 py-4">
                    {suggestions.map(({ section, subcategory }) => (
                      <Link
                        key={`${section}-${subcategory}`}
                        href={`/${section}/${slugify(subcategory)}`}
                        onClick={closeSearch}
                        className="block text-[14px] leading-[18.5px]"
                      >
                        <span className="block font-medium uppercase text-black">
                          {subcategory}
                        </span>
                        <span className="block text-[#6b6b6b]">
                          {SECTION_PREFIX[section]}{' '}
                          <span className="font-medium text-black">
                            {subcategory}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* PRODUCTS */}

                {results.length > 0 && (
                  <>
                    <ul className="grid grid-cols-3 gap-x-3 gap-y-6 pt-5 md:gap-x-[13px] md:gap-y-8">
                      {results.map((p) => {
                        const img = getProductImage(p);

                        return (
                          <li key={p._id}>
                            <Link
                              href={productHref(p._id)}
                              onClick={closeSearch}
                              className="block text-center"
                            >
                              <div className="aspect-[9/10] w-full overflow-hidden bg-[#e8e8e8]">
                                {img && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={img}
                                    alt={p.name}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>

                              <p className="mt-2 text-[13px] font-medium leading-tight text-black">
                                {p.name}
                              </p>
                              <p className="text-[13px] text-black">
                                {formatPrice(p.price)}
                              </p>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Mobildə nəticələrin sonunda xətt */}
                    <div className="mt-6 border-t border-neutral-300 md:hidden" />
                  </>
                )}

                {/* STATUS */}

                {searching && results.length === 0 && (
                  <p className="pt-4 text-[13px] text-[#6b6b6b]">
                    Axtarılır...
                  </p>
                )}

                {noResults && (
                  <p className="pt-4 text-[13px] text-[#6b6b6b]">
                    Nəticə tapılmadı
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==================================================
          CART PANEL
          Sağdan sürüşərək açılır (animasiya CartDrawer-dədir)
      ================================================== */}

      <CartDrawer open={cartOpen} onClose={closeCart} />
    </header>
  );
}