import type { Metadata } from "next";
import "./globals.css";

import ConditionalChrome, { ConditionalFooter } from "./components/ConditionalChrome";

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
        <ConditionalChrome />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}