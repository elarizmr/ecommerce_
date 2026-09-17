"use client";

import { usePathname } from "next/navigation";
import SiteChrome from "./SiteChrome";
import Footer from "./Footer";

export default function ConditionalChrome() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return <SiteChrome />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return null;

  return <Footer />;
}