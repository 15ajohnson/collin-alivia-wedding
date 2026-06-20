import Link from "next/link";

const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

const HEADERS = comingSoon
  ? []
  : [
      ["DETAILS", "#details"],
      ["OUR STORY", "#ourstory"],
      ["RSVP", "#rsvp"],
      ["REGISTRY", "#registry"],
      ["GALLERY", "#gallery"],
    ];

export default function Nav() {
  return (
    <nav className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-16 pt-8 pb-4 md:pt-10 md:pb-6 px-4">
      {HEADERS.map(([label, href]) => (
        <Link
          key={label}
          href={href}
          className="text-white tracking-[0.2em] text-xs md:text-base font-light hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-bona-nova)" }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
