import type { Metadata } from "next";
import { Bona_Nova, Playfair_Display, Poly } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const bonaNova = Bona_Nova({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-bona-nova",
});

const poly = Poly({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poly",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display",
});

export const metadata: Metadata = {
  title: "Collin & Alivia",
  description: "Collin and Alivia's wedding website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-serif", bonaNova.variable)}>
      <body
        className={`${bonaNova.variable} ${poly.variable} ${playfairDisplay.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
