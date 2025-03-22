import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
              <li><a href="#home">Home</a></li>
              <li><a href="#ourstory">Our Story</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#rsvp">RSVP</a></li>
              <li><a href="#travel">Travel</a></li>
              <li><a href="#whattoknow">What to Know</a></li>
              <li><a href="#registry">Registry</a></li>
              <li><a href="#games">Games</a></li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
