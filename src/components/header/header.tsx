
import Link from "next/link";

const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

const HEADERS = comingSoon ? [] : [
    ["OUR STORY", "#ourstory"],
    ["RSVP", "#rsvp"],
    ["HOME", "/"],
    ["DETAILS", "#details"],
    ["REGISTRY", "#registry"],
];

export default function Header() {
    return (
        <div
            className="relative w-full h-screen bg-center bg-cover bg-no-repeat flex flex-col"
            style={{ backgroundImage: "url('/splash_header.jpg')" }}
        >
            {/* Flat 20% dark overlay */}
            <div className="absolute inset-0 bg-black/20" />
            {/* Top gradient: transparent at 63% → black/57 at 84.22% */}
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,31,22,0)_63.01%,rgba(0,0,0,0.57)_84.22%)]" />

            {/* Nav */}
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

            {/* Center content */}
            <div className="relative flex-1 flex flex-col items-center pb-6 md:pb-12">
                {/* Names — centered in whatever space remains */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <h1
                        className="text-[4.5rem] md:text-[9rem] font-light leading-none text-[#f5f0e8] tracking-tighter"
                        style={{ fontFamily: "var(--font-bona-nova)" }}
                    >
                        COLLIN
                    </h1>
                    <p
                        className="text-[4.5rem] md:text-[9rem] font-light leading-none text-[#f5f0e8] -mt-6 md:-mt-16"
                        style={{ fontFamily: "'Symphony Pro', serif" }}
                    >
                        and
                    </p>
                    <h1
                        className="text-[4.5rem] md:text-[9rem] font-light leading-none text-[#f5f0e8] tracking-tighter -mt-4 md:-mt-12"
                        style={{ fontFamily: "var(--font-bona-nova)" }}
                    >
                        ALIVIA
                    </h1>
                    <p
                        className="text-[2rem] md:text-[4.5rem] mt-2 md:mt-4 text-[#f5f0e8]"
                        style={{ fontFamily: "'Symphony Pro', serif" }}
                    >
                        are getting married
                    </p>
                </div>
                {/* Date — always anchored to the bottom of the image */}
                <p
                    className="text-[1.1rem] md:text-[2rem] tracking-[0.4em] text-[#f5f0e8] font-light"
                    style={{ fontFamily: "var(--font-poly)" }}
                >
                    09.12.2026
                </p>
            </div>
        </div>
    );
}