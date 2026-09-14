// app/layout.tsx
'use client';

import { useState } from 'react';
import Header from './components/Header';
import MorphingLogo from './components/MorphingLogo';
import MobileMenu from './components/MobileMenu';
import './globals.css';
import Footer from './components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body>
        <Header onMenuClick={() => setMenuOpen(true)} />
        <MorphingLogo />
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        {children}
        <Footer />
      </body>
    </html>
  );
}