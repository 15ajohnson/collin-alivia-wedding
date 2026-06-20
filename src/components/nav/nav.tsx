"use client";

import Link from "next/link";

const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

interface HeaderLink {
  label: string;
  href: string;
  bold?: boolean;
}

const HEADERS: HeaderLink[] = comingSoon
  ? []
  : [
      { label: "DETAILS", href: "#details" },
      { label: "OUR STORY", href: "#ourstory" },
      { label: "RSVP", href: "#rsvp", bold: true },
      { label: "REGISTRY", href: "#registry" },
      { label: "GALLERY", href: "#gallery" },
    ];

export default function Nav() {
  return (
    <nav className="relative z-10 flex flex-wrap justify-center items-center gap-4 md:gap-16 pt-8 pb-4 md:pt-10 md:pb-6 px-4">
      {HEADERS.map(({ label, href, bold }) =>
        label === "RSVP" ? (
          <button
            key={label}
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-rsvp-dialog"))}
            className={`text-white tracking-[0.2em] text-xs md:text-base hover:opacity-70 transition-opacity ${bold ? "font-bold md:text-xl" : "font-light"}`}
            style={{ fontFamily: "var(--font-bona-nova)" }}
          >
            {label}
          </button>
        ) : (
          <Link
            key={label}
            href={href}
            className={`text-white tracking-[0.2em] text-xs md:text-base hover:opacity-70 transition-opacity ${bold ? "font-bold md:text-xl" : "font-light"}`}
            style={{ fontFamily: "var(--font-bona-nova)" }}
          >
            {label}
          </Link>
        ),
      )}
    </nav>
  );
}
