import InViewFade from "@/components/ui/in-view-fade";

// Frame PNG natural dimensions: 1415 × 1599 (portrait)
// After rotating 90°:           1599 × 1415 (landscape)

// Frame inner window insets (from pixel analysis of 1415×1599 PNG):
const CLIP_PORTRAIT = "inset(7.1% 10.8% 7.4% 11.5%)";
const CLIP_LANDSCAPE = "inset(9.7% 5.4% 8.8% 5.4%)";

function FramedImage({
  src,
  alt,
  rotate = false,
}: {
  src: string;
  alt: string;
  rotate?: boolean;
}) {
  if (!rotate) {
    return (
      <div className="relative" style={{ aspectRatio: "1415/1599" }}>
        {/* Frame behind */}
        <img
          src="/images/our-story-frame.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            objectFit: "fill",
            transform: "rotate(-0.3deg) scale(1.05)",
          }}
        />
        {/* Photo on top, clipped to inner window */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ clipPath: CLIP_PORTRAIT }}
        />
      </div>
    );
  }

  // Landscape container (rotated frame).
  // The frame PNG is rendered at width=100% (W), height=auto (W×1599/1415).
  // After rotate(90deg) scale(1415/1599) it fills the W × W×(1415/1599) container exactly.
  const scale = (1415 / 1599) * 1.1;
  return (
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: "1599/1415" }}
    >
      {/* Frame behind */}
      <img
        src="/images/our-story-frame.png"
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          width: "100%",
          height: "auto",
          transform: `translate(-50%, -50%) rotate(89.3deg) scale(${scale})`,
        }}
      />
      {/* Photo on top, clipped to inner window */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ clipPath: CLIP_LANDSCAPE }}
      />
    </div>
  );
}

function Title({ className }: { className?: string }) {
  return (
    <h2 className={className} style={{ color: "#4B5134" }}>
      <span style={{ fontFamily: "Amoresa" }}>O</span>
      <span style={{ fontFamily: "Perandory" }}>ur </span>
      <span style={{ fontFamily: "Amoresa" }}>S</span>
      <span style={{ fontFamily: "Perandory" }}>tory</span>
    </h2>
  );
}

const paragraph1 =
  "We first met on a video call; Collin's first day on the job in the summer of 2020. Alivia was living in downtown Columbus and Collin was finishing school at Miami University. Over the next year of Covid-induced virtual work, we got to know each other over Skype calls, emails and chat messages. We shared our love for technology and discovered our common upbringing in Wakeman and Milan.";

const paragraph2 =
  "In 2021, we became closer friends when we lived neighboring buildings at the Arena District of Columbus. Over the next year we bonded over shared lunches and happy hours and got into the office early every Monday on the chance we'd see each other.";

const paragraph3 =
  "Pretty soon, we went on our first date for breakfast at Katalina's. Shortly after, we upgraded to a local steakhouse, which kicked off our tradition of monthly fine dining. We began taking trips with each other, a couple times to party in Key West, and even more times at secluded cabins in Hocking Hills. It was there, on a warm spring evening in front of a fireplace at an off-the-grid cottage that Collin proposed to Alivia.";

function StoryContent() {
  return (
    <div className="text-sm md:text-base leading-relaxed">
      <p className="mb-4 ">{paragraph1}</p>
      <p className="mb-4 ">{paragraph2}</p>
      <p className="mb-4 ">{paragraph3}</p>
      <p>We are excited to celebrate our love and commitment with you!</p>
      <p>Love, Collin & Alivia</p>
    </div>
  );
}

export default function OurStory() {
  return (
    <section className="px-4 py-10 md:py-16">
      {/* ── Desktop layout ── */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-12 md:items-center md:max-w-7xl md:mx-auto">
        <FramedImage src="/images/our-story-left.gif" alt="Collin and Alivia" />
        <div className="text-center">
          <InViewFade>
            <Title className="text-[4rem] leading-none mb-8" />
          </InViewFade>
          <StoryContent />
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="md:hidden">
        <InViewFade>
          <Title className="text-[2.75rem] leading-none text-center mb-6" />
        </InViewFade>
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <FramedImage
              src="/images/our-story-left.gif"
              alt="Collin and Alivia"
              rotate
            />
          </div>
          <div className="flex-1">
            <FramedImage
              src="/images/our-story-right.gif"
              alt="Collin and Alivia"
              rotate
            />
          </div>
        </div>
        <div className="text-center">
          <StoryContent />
        </div>
      </div>
    </section>
  );
}
