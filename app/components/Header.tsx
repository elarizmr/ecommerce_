'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SCROLL_RANGE = 600;

export default function Header({
  onMenuClick,
  isHome = false,
}: {
  onMenuClick: () => void;
  isHome?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_RANGE * 0.6);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

  const navLinks = ['MEN', 'WOMEN', 'ACCESSORIES', 'LAST CHANCE', 'FRIENDS', 'LOYALTY'];
  const utilityLinks = ['SEARCH', 'ACCOUNT', 'WISHLIST [0]', 'CART [0]'];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-10 transition-colors duration-300 ${
        solid ? 'bg-white' : 'bg-white md:bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Home-da bu yer boşdur (MorphingLogo üstündən keçir),
            digər səhifələrdə sabit, qalın loqo */}
        <div className="flex items-center">
          {!isHome && (
            <Link
              href="/"
              className="text-lg font-extrabold tracking-[0.15em] leading-none text-black"
            >
              OLAF
            </Link>
          )}
        </div>

        {/* Desktop: nav + utility bir sırada, sıx yerləşmiş */}
        <nav className="hidden md:flex items-center gap-6">
          {[...navLinks, ...utilityLinks].map((link) => (
            <Link
              key={link}
              href={`/${link
                .split(' [')[0]
                .toLowerCase()
                .replace(' ', '-')}`}
              className={`text-[13px] font-semibold tracking-normal whitespace-nowrap transition-colors ${
                solid ? 'text-black' : 'text-white'
              }`}
            >
              {link.replace(' [', '[')}
            </Link>
          ))}
        </nav>

        {/* Mobile: hamburger + cart */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={onMenuClick} aria-label="Menu" className="text-black">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <Link href="/cart" className="flex items-center gap-1 text-black">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 8h12l-1 12H7L6 8z" />
              <path d="M9 8V6a3 3 0 016 0v2" />
            </svg>
            <span className="text-xs">[0]</span>
          </Link>
        </div>
      </div>
    </header>
  );
}