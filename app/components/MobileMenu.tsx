// components/MobileMenu.tsx
'use client';

import Link from 'next/link';
import { X, ArrowRight, ShoppingBag } from 'lucide-react';

type MenuItem = {
  name: string;
  href: string;
  // 'search' olarsa səhifəyə keçmir, Header-dəki axtarış panelini açır
  action?: 'search';
};

export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const mainLinks: MenuItem[] = [
    { name: 'MEN', href: '/men' },
    { name: 'WOMEN', href: '/women' },
    { name: 'ACCESSORIES', href: '/accessories' },
    { name: 'LAST CHANCE', href: '/last-chance' },
    { name: 'FRIENDS', href: '/friends' },
    { name: 'LOYALTY', href: '/loyalty' },
    { name: 'SEARCH', href: '/search', action: 'search' },
    { name: 'ACCOUNT', href: '/account' },
    { name: 'WISHLIST [0]', href: '/wishlist' },
    { name: 'CART [0]', href: '/cart' },
  ];

  const itemClass =
    'flex w-full items-center justify-between px-5 py-4 border-t border-gray-200 text-base font-medium tracking-wide text-left last:border-b';

  // Menyunu bağla və Header-ə axtarışı aç siqnalı göndər
  const openSearch = () => {
    onClose();
    window.dispatchEvent(new Event('open-search'));
  };

  return (
    <div
      className={`fixed inset-0 z-[70] bg-white transition-transform duration-300 md:hidden overflow-y-auto ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Üst zolaq: Logo + Cart + Close */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-2xl font-bold tracking-widest">OLAF</span>
        <div className="flex items-center gap-5">
          <Link href="/cart" onClick={onClose} className="flex items-center gap-1">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="text-sm">[0]</span>
          </Link>
          <button onClick={onClose} aria-label="Close menu">
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Link siyahısı */}
      <nav className="flex flex-col">
        {mainLinks.map((link) =>
          link.action === 'search' ? (
            <button
              key={link.name}
              type="button"
              onClick={openSearch}
              className={itemClass}
            >
              {link.name}
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          ) : (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={itemClass}
            >
              {link.name}
              <ArrowRight size={18} strokeWidth={1.5} />
            </Link>
          )
        )}
      </nav>
    </div>
  );
}