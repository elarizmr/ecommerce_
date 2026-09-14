import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 relative overflow-hidden">
      {/* Böyük dekorativ OLAF yazısı */}
      <div className="px-4 sm:px-8 mb-16">
        <h2 className="text-[15vw] leading-none font-bold tracking-tight select-none">
          OLAF
        </h2>
      </div>

      <div className="px-4 sm:px-8 pb-12 flex flex-col md:flex-row justify-between gap-12">
        {/* Sol: Newsletter */}
        <div className="max-w-sm">
          <h3 className="text-xl font-bold mb-4">STAY IN THE LOOP</h3>
          <p className="text-sm text-gray-300 mb-6">
            I say it almost every time, but once again, we&apos;ve created
            something we&apos;re proud of. Don&apos;t miss it and subscribe
            now to be notified.
          </p>
          <form className="flex items-center gap-4">
            <input
              type="email"
              placeholder="Email address"
              className="bg-transparent border-b border-gray-500 text-sm py-2 flex-1 outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-white text-black text-xs font-semibold px-6 py-3 whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>

        {/* Sağ: Link sütunları */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 text-sm">
          <div>
            <h4 className="font-bold mb-3">BRAND</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/loyalty">Loyalty</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">INFO</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/returns">Returns</Link></li>
              <li><Link href="/shipping">Shipping</Link></li>
              <li><Link href="/payments">Payments</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">POLICIES</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
              <li><Link href="/warranty">Warranty</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">SOCIALS</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-3">HI FRIEND</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/account">Account</Link></li>
              <li><Link href="/cart">Cart [0]</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Alt elan zolağı */}
      <div className="border-t border-gray-700 px-4 sm:px-8 py-4 flex items-center justify-center relative">
        <p className="text-xs text-gray-300 text-center">
          For a limited time only, you will receive a free cap with every order over €120.
        </p>
        <button
          aria-label="Close"
          className="absolute right-4 sm:right-8 text-gray-300 hover:text-white"
        >
          ✕
        </button>
      </div>
    </footer>
  );
}