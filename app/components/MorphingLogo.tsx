// components/MorphingLogo.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const SCROLL_RANGE = 600;

// Header ölçüləri (Header.tsx ilə uyğun olmalıdır)
// Desktop: pt-[2px] + h-[26px] -> nav zolağının mərkəzi y = 15px
// Mobil:   h-10 -> mərkəz y = 20px
const DESKTOP_BAR_CENTER = 15;
const DESKTOP_LEFT = 10; // nav-ın px-2.5 ilə eyni xətt

export default function MorphingLogo() {
  const [progress, setProgress] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setProgress(Math.min(window.scrollY / SCROLL_RANGE, 1));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const startFontSize = windowSize.width * (isMobile ? 0.22 : 0.18);
  const startTop = windowSize.height - (isMobile ? 30 : 40) - startFontSize * 0.85;

  const endFontSize = isMobile ? 15 : 16;

  // Desktop: leading-none olduğu üçün loqonun qutusu font ölçüsü qədərdir,
  // yəni top = zolağın mərkəzi - fontSize / 2 (15 - 8 = 7px)
  const endTop = isMobile ? 15 : DESKTOP_BAR_CENTER - endFontSize / 2;
  const left = isMobile ? 16 : DESKTOP_LEFT;

  const fontSize = startFontSize + (endFontSize - startFontSize) * progress;
  const top = startTop + (endTop - startTop) * progress;

  // Həm mobil, həm desktop: hero-da ağ, header-ə çatanda qara
  const color = progress > 0.6 ? '#000' : '#fff';

  return (
    <Link
      href="/collections/new-arrivals"
      className="fixed z-[60] font-bold leading-none tracking-tight select-none"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        fontSize: `${fontSize}px`,
        color,
        transition: 'top 0.08s linear, font-size 0.08s linear, color 0.2s ease',
      }}
    >
      OLAF
    </Link>
  );
}