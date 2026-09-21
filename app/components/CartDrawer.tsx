"use client";

import { useEffect, useState } from "react";
import CartPanel from "@/app/components/CartPanel";

// Animasiyanın müddəti (ms). Aşağıdakı duration-[350ms] ilə eyni olmalıdır.
const DURATION = 350;

// Səbət panelini sağdan sürüşdürərək açır, bağlananda geri sürüşdürür.
// Overlay (qaralma) yumşaq şəkildə görünüb itir.
// Desktop: sağda 75%, mobil: header-in altında tam ekran.
export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // mounted: panel DOM-da var; shown: animasiyanın son vəziyyətindədir
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);

      // İki frame gözləyirik ki, brauzer əvvəlcə başlanğıc vəziyyəti (sağda, gizli)
      // çəksin, sonra animasiya başlasın
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setShown(true));
      });

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    // Bağlananda əvvəl geri sürüşür, animasiya bitəndən sonra DOM-dan silinir
    setShown(false);
    const timer = setTimeout(() => setMounted(false), DURATION);
    return () => clearTimeout(timer);
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay (yalnız desktop): yumşaq qaralır, üzərinə klik edəndə bağlanır */}

      <div
        className={`
          fixed
          inset-0
          hidden
          md:block
          bg-black/30
          -z-10
          transition-opacity
          duration-[350ms]
          ease-out
          motion-reduce:transition-none
          ${shown ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel: sağdan sürüşərək gəlir */}

      <div
        className={`
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
          transition-transform
          duration-[350ms]
          ease-[cubic-bezier(0.32,0.72,0,1)]
          motion-reduce:transition-none
          ${shown ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-label="Cart"
      >
        <div
          className="
            h-full
            md:h-auto
            md:max-h-[calc(100vh-32px)]
            overflow-y-auto
            bg-white
            px-6
            pb-10
            md:px-2.5
            md:pb-6
          "
        >
          <CartPanel onClose={onClose} />
        </div>
      </div>
    </>
  );
}