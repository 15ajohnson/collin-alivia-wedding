import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
      <body>
        <header>
          <nav>
            <ul className="flex justify-between items-center p-4 bg-white shadow-md">
              <li><Link href="/">Home</Link></li>
              <li><Link href="#ourstory">Our Story</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/rsvp">RSVP</Link></li>
              <li><Link href="#travel">Travel</Link></li>
              <li><Link href="#whattoknow">What to Know</Link></li>
              <li><Link href="#registry">Registry</Link></li>
              <li><Link href="/games">Games</Link></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
