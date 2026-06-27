"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OPEN_RSVP_DIALOG_EVENT } from "@/constants/client-events";

interface HeaderLink {
  label: string;
  href: string;
  bold?: boolean;
}

const HEADERS: HeaderLink[] = [
  { label: "DETAILS", href: "#details" },
  { label: "OUR STORY", href: "#ourstory" },
  { label: "RSVP", href: "#rsvp" },
  { label: "REGISTRY", href: "#registry" },
  { label: "GALLERY", href: "#gallery" },
];

interface NavProps {
  comingSoon?: boolean;
}

export default function Nav({ comingSoon = false }: NavProps) {
  const headers = comingSoon ? [] : HEADERS;

  const mobileDrawerLinks = headers.filter(({ label }) => label !== "RSVP");

  return (
    <nav className="relative z-10 px-4 pt-8 pb-4 md:px-4 md:pt-10 md:pb-6">
      {/* Mobile nav */}
      {!comingSoon && (
        <div className="flex items-center justify-end gap-2 md:hidden">
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event(OPEN_RSVP_DIALOG_EVENT))
            }
            className="rounded-full border border-white/45 px-3 py-1 text-white tracking-[0.2em] text-[11px] font-bold hover:bg-white/10 transition-colors"
            style={{ fontFamily: "var(--font-bona-nova)" }}
          >
            RSVP
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="border border-white/35 text-white hover:bg-white/10 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                <MenuIcon className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-56 pt-12">
              <SheetTitle></SheetTitle>
              <nav className="flex flex-col gap-1">
                {mobileDrawerLinks.map(({ label, href }) => (
                  <SheetTrigger key={label} asChild>
                    <Link
                      href={href}
                      className="rounded px-3 py-2 text-right tracking-[0.16em] text-sm font-light hover:bg-muted transition-colors"
                      style={{ fontFamily: "var(--font-bona-nova)" }}
                    >
                      {label}
                    </Link>
                  </SheetTrigger>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop nav */}
      <div className="hidden md:flex md:flex-wrap md:justify-center md:items-center md:gap-16 md:align-middle">
        {headers.map(({ label, href, bold }) =>
          label === "RSVP" ? (
            <button
              key={label}
              type="button"
              onClick={() =>
                window.dispatchEvent(new Event(OPEN_RSVP_DIALOG_EVENT))
              }
              className={`text-white tracking-[0.2em] text-2xl hover:opacity-70 transition-opacity italic ${bold ? "font-bold md:text-xl" : "font-light"}`}
              style={{ fontFamily: "var(--font-bona-nova)" }}
            >
              {label}
            </button>
          ) : (
            <Link
              key={label}
              href={href}
              className={`text-white tracking-[0.2em] text-base hover:opacity-70 transition-opacity ${bold ? "font-bold md:text-xl" : "font-light"}`}
              style={{ fontFamily: "var(--font-bona-nova)" }}
            >
              {label}
            </Link>
          ),
        )}
      </div>
    </nav>
  );
}
