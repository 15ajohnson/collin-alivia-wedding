"use client";

import { useSyncExternalStore } from "react";
import { OPEN_RSVP_DIALOG_EVENT } from "@/constants/client-events";
import RSVPForm from "./rsvp-form";
import React from "react";

const WEDDING_DATE = new Date("2026-09-12T15:30:00-04:00");

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

const ZERO_TIME = { days: 0, hours: 0, minutes: 0, seconds: 0 };

let cachedSnapshot = ZERO_TIME;

function getSnapshot() {
  const next = getTimeRemaining();
  if (
    next.days === cachedSnapshot.days &&
    next.hours === cachedSnapshot.hours &&
    next.minutes === cachedSnapshot.minutes &&
    next.seconds === cachedSnapshot.seconds
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = next;
  return cachedSnapshot;
}

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

export default function RSVP() {
  const timeLeft = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => ZERO_TIME,
  );

  const { days, hours, minutes, seconds } = timeLeft;

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
              className="text-[4.5rem] leading-tight text-background md:text-foreground text-center"
              style={{ fontFamily: "'Symphony Pro', serif" }}
            >
              Kindly Reply
            </h2>
            <p
              className="text-background md:text-foreground text-center text-base leading-snug"
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
              className="mt-2 rounded-full bg-[#521717] text-background text-xl tracking-wide flex items-center justify-center text-center leading-tight hover:bg-[#3a1010] transition-colors cursor-pointer border-2 border-background md:border-0 px-8 py-2 md:px-0 md:py-0 md:w-24 md:h-24"
            >
              <span className="md:hidden">RSVP</span>
              <span className="hidden md:inline text-2xl">RSVP</span>
            </button>
          </div>

          {/* Countdown */}
          <div className="flex flex-col items-center gap-6">
            <h3
              className="text-background text-[2rem] md:text-[3rem] leading-none"
              style={{ fontFamily: "'Amoresa', cursive" }}
            >
              The Countdown Begins
            </h3>

            {/* Countdown: stacked columns with colon separators */}
            <div className="flex items-center gap-3 md:gap-4 text-background">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Minutes" },
                { value: seconds, label: "Seconds" },
              ].map(({ value, label }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && (
                    <span
                      key={`sep-${label}`}
                      className="text-2xl md:text-4xl font-light mb-4 select-none"
                    >
                      :
                    </span>
                  )}
                  <div key={label} className="flex flex-col items-center">
                    <span
                      className="text-4xl md:text-6xl font-light tabular-nums leading-none"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      {pad(value)}
                    </span>
                    <span
                      className="text-[0.6rem] md:text-xs tracking-widest uppercase mt-1"
                      style={{ fontFamily: "'Times New Roman', Times, serif" }}
                    >
                      {label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>
      <RSVPForm />
    </>
  );
}
