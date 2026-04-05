import type { Metadata } from "next";
import { Bona_Nova, Poly } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      <body className={`${bonaNova.variable} ${poly.variable}`}>
        {children}
      </body>
    </html>
  );
}
