import type { Metadata } from "next";
import { Bona_Nova, Poly } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
    <html lang="en" className={cn("font-serif", bonaNova.variable)}>
      <body className={`${bonaNova.variable} ${poly.variable}`}>
        {children}
        <footer className="flex items-center justify-center gap-3 py-4 text-sm text-muted-foreground bg-background border-t">
          <span>Made by Collin &amp; Alivia</span>
          <a
            href="https://github.com/15ajohnson/collin-alivia-wedding"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="hover:text-foreground transition-colors"
          >
            <Image
              src="/images/GitHub_Invertocat_Black.svg"
              alt="GitHub"
              width={24}
              height={24}
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
