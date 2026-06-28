"use client";

import { useState } from "react";
import Image from "next/image";

const TABS = [
  { id: "itinerary", label: "Itinerary" },
  { id: "date-location", label: "Date & Location" },
  { id: "accommodations", label: "Accommodations" },
  { id: "attire", label: "Attire" },
  { id: "faq", label: "FAQ" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_CONTENT: Record<TabId, string> = {
  itinerary:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.",
  "date-location":
    "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  accommodations:
    "Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.",
  attire:
    "In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu.",
  faq: "Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Quisque faucibus ex sapien vitae pellentesque sem placerat.",
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
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8 mt-8 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="uppercase tracking-widest text-xs md:text-sm transition-all cursor-pointer bg-transparent border-0 p-0 flex flex-col items-center"
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
          className="max-w-4xl mx-auto p-8 md:p-10 md:min-h-128"
          style={{
            border: "1px solid var(--background)",
            background: "transparent",
            color: "var(--background)",
          }}
        >
          <p className="text-sm md:text-base leading-relaxed">
            {TAB_CONTENT[activeTab]}
          </p>
        </div>
      </div>
      {/* the "footer" */}
      <footer className="absolute bottom-0 w-full text-white flex items-center justify-center gap-3 py-4 text-sm">
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
