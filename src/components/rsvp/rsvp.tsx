"use client";

import { useEffect, useState } from "react";
import { OPEN_RSVP_DIALOG_EVENT } from "@/constants/client-events";
import RSVPForm from "./rsvp-form";

const WEDDING_DATE = new Date("2026-09-21T15:30:00-04:00");

function getTimeRemaining() {
  const total = WEDDING_DATE.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function RSVP() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeRemaining());
    const id = setInterval(() => setTimeLeft(getTimeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, minutes, seconds } = timeLeft ?? {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  return (
    <>
      <section className="relative overflow-hidden py-20 px-4">
        {/* Base background color */}
        <div className="absolute inset-0 bg-[#4B5134]" />
        {/* Floral overlay: 10% opacity, luminosity blend */}
        <div
          className="absolute inset-0 bg-[url('/images/rsvp-floral-bg.png')] bg-cover bg-center opacity-10"
          style={{ mixBlendMode: "luminosity" }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Envelope card */}
          <div className="w-full md:max-w-125 md:bg-[url('/images/rsvp-letter-bg.png')] bg-cover bg-center flex flex-col items-center gap-4 px-6 pt-8 pb-10 md:px-10 md:pt-10 md:pb-14 md:aspect-500/420">
            <h2
              className="text-[3.5rem] leading-tight text-white md:text-[#2E2A22] text-center"
              style={{ fontFamily: "'Symphony Pro', serif" }}
            >
              Kindly Reply
            </h2>
            <p
              className="text-white md:text-[#2E2A22] text-center text-base leading-snug"
              style={{ fontFamily: "var(--font-bona-nova), serif" }}
            >
              Please let us know by
              <br />
              August 1st, 2026
              <br />
              if you&apos;ll be joining us
            </p>
            {/* Mobile: pill button — Desktop: circle button */}
            <button
              onClick={() =>
                window.dispatchEvent(new Event(OPEN_RSVP_DIALOG_EVENT))
              }
              className="mt-2 rounded-full bg-[#6B2737] text-white text-sm font-semibold tracking-wide flex items-center justify-center text-center leading-tight hover:bg-[#5a2030] transition-colors cursor-pointer px-8 py-3 md:px-0 md:py-0 md:w-24 md:h-24"
            >
              <span className="md:hidden">RSVP Here</span>
              <span className="hidden md:inline">
                RSVP
                <br />
                Here
              </span>
            </button>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-center gap-6">
            <h3
              className="text-white text-[2rem] md:text-[3rem] leading-none"
              style={{ fontFamily: "'Amoresa', cursive" }}
            >
              The Countdown Begins
            </h3>

            {/* Mobile countdown: numbers row + labels row */}
            <div className="flex flex-col items-center gap-1 text-white md:hidden">
              <div className="flex items-baseline gap-3 text-6xl font-light tabular-nums">
                <span>{pad(days)}</span>
                <span className="text-2xl select-none">.</span>
                <span>{pad(hours)}</span>
                <span className="text-2xl select-none">.</span>
                <span>{pad(minutes)}</span>
                <span className="text-2xl select-none">.</span>
                <span>{pad(seconds)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs tracking-widest uppercase">
                <span>Days</span>
                <span className="select-none">•</span>
                <span>Hours</span>
                <span className="select-none">•</span>
                <span>Minutes</span>
                <span className="select-none">•</span>
                <span>Seconds</span>
              </div>
            </div>

            {/* Desktop countdown: stacked columns with colon separators */}
            <div className="hidden md:flex items-center gap-4 text-white">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Minutes" },
                { value: seconds, label: "Seconds" },
              ].map(({ value, label }, i) => (
                <>
                  {i > 0 && (
                    <span
                      key={`sep-${label}`}
                      className="text-4xl font-light mb-4 select-none"
                    >
                      :
                    </span>
                  )}
                  <div key={label} className="flex flex-col items-center">
                    <span className="text-6xl font-light tabular-nums leading-none">
                      {pad(value)}
                    </span>
                    <span className="text-xs tracking-widest uppercase mt-1">
                      {label}
                    </span>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </section>
      <RSVPForm />
    </>
  );
}
