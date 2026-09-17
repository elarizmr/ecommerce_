// app/layout.tsx
// DİQQƏT: burada 'use client' YOXDUR — bu fayl server komponentdir,
// ona görə `metadata` export etmək tamamilə qanunidir.

import type { Metadata } from "next";
import "./globals.css";

import SiteChrome from "./components/SiteChrome";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "OLAF",
  description: "OLAF Hussein",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
       
        {/* Header + MorphingLogo + MobileMenu və onların state-i
            SiteChrome-un (client component) içindədir. */}
        <SiteChrome />
        {children}
        <Footer />
      </body>
    </html>
  );
}