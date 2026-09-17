"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import MorphingLogo from "./MorphingLogo";
import MobileMenu from "./MobileMenu";

export default function SiteChrome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // yalnız ev səhifəsi
  const isHome = pathname === "/";

  return (
    <>
      <Header isHome={isHome} onMenuClick={() => setMenuOpen(true)} />

      {/* Morph effekti YALNIZ home-da */}
      {isHome && <MorphingLogo />}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}