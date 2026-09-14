'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SCROLL_RANGE = 600;

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > SCROLL_RANGE * 0.6);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['MEN', 'WOMEN', 'ACCESSORIES', 'LAST CHANCE', 'FRIENDS', 'LOYALTY'];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 h-12 transition-colors duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent md:bg-transparent'
      } ${scrolled ? '' : 'bg-white md:bg-transparent'}`}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Loqo yeri boş — MorphingLogo onun üstündən keçir */}
        <div className="w-20" />

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase().replace(' ', '-')}`}
              className={`text-[11px] font-medium tracking-wide transition-colors ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            >
              {link}
            </Link>
          ))}
        </nav>

        {/* Desktop right icons */}
        <div className="hidden md:flex items-center gap-5">
          {['SEARCH', 'ACCOUNT', 'WISHLIST [0]', 'CART [0]'].map((item) => (
            <button
              key={item}
              className={`text-[11px] font-medium transition-colors ${
                scrolled ? 'text-black' : 'text-white'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Mobile: hamburger + cart */}
        {/* Mobile: hamburger + cart */}
<div className="flex md:hidden items-center gap-4">
  <button onClick={onMenuClick} aria-label="Menu" className="text-black">
    {/* Hamburger ikonu */}
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>

  <Link href="/cart" className="flex items-center gap-1 text-black">
    {/* Cart ikonu */}
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