"use client";

import { type ComponentType, useState } from "react";
import Image from "next/image";
import ItineraryContent from "./itinerary-content";
import AccommodationsContent from "./accommodations-content";
import AttireContent from "./attire-content";
import FaqContent from "./faq-content";

const TABS = [
  { id: "itinerary", label: "Itinerary" },
  { id: "accommodations", label: "Accommodations" },
  { id: "attire", label: "Attire" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_COMPONENTS: Record<TabId, ComponentType> = {
  itinerary: ItineraryContent,
  accommodations: AccommodationsContent,
  attire: AttireContent,
  faq: FaqContent,
};

function Title() {
  return (
    <h2
      className="text-[2.5rem] md:text-[4rem] leading-none text-center"
      style={{ color: "var(--background)" }}
    >
      <span style={{ fontFamily: "Amoresa" }}>T</span>
      <span style={{ fontFamily: "Perandory" }}>he </span>
      <span style={{ fontFamily: "Amoresa" }}>D</span>
      <span style={{ fontFamily: "Perandory" }}>etails</span>
    </h2>
  );
}

export default function Details() {
  const [activeTab, setActiveTab] = useState<TabId>("itinerary");
  const ActiveTabContent = TAB_COMPONENTS[activeTab];

  return (
    <section
      className="relative overflow-hidden bg-no-repeat bg-contain bg-bottom md:bg-cover md:bg-position-[center_bottom_-100px] 2xl:bg-position-[center_bottom_-250px] pt-16 pb-50 md:pb-100 px-4"
      style={{
        backgroundColor: "#183C4C",
        backgroundImage: "url('/images/details-greenhouse-bg.png')",
      }}
    >
      {/* All content sits above the background image */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Title />

        {/* Tab navigation */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-24 mt-8 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="uppercase tracking-widest text-xs md:text-sm cursor-pointer bg-transparent border-0 p-0 flex flex-col items-center"
              style={{
                color:
                  activeTab === tab.id
                    ? "var(--background)"
                    : "rgba(242, 232, 223, 0.55)",
                fontWeight: activeTab === tab.id ? 700 : 400,
              }}
            >
              {/* Hidden bold copy reserves the bold width so switching tabs doesn't shift layout */}
              <span
                className="invisible h-0 overflow-hidden font-bold"
                aria-hidden="true"
              >
                {tab.label}
              </span>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div
          className="max-w-10/12 mx-auto p-2"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.6)",
          }}
        >
          <div
            className="p-4 md:p-10 md:min-h-128 flex justify-center"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.6)",
              background: "transparent",
              color: "var(--background)",
            }}
          >
            <ActiveTabContent />
          </div>
        </div>
      </div>
      {/* the "footer" */}
      <footer className="absolute bottom-0 w-full text-white flex items-left md:justify-center my-4">
        <a
          href="https://github.com/15ajohnson/collin-alivia-wedding"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          className="hover:text-foreground transition-colors"
        >
          <Image
            src="/images/GitHub_Invertocat_White.svg"
            alt="GitHub"
            width={24}
            height={24}
          />
        </a>
      </footer>
    </section>
  );
}
