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
          src="/our-story-frame.png"
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
        src="/our-story-frame.png"
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
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.";

const paragraph2 =
  "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

export default function OurStory() {
  return (
    <section className="px-4 py-10 md:py-16">
      {/* ── Desktop layout ── */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-12 md:items-center md:max-w-7xl md:mx-auto">
        <FramedImage src="/our-story-left.jpg" alt="Collin and Alivia" />
        <div className="text-center">
          <Title className="text-[4rem] leading-none mb-8" />
          <p
            className="mb-4 text-base leading-relaxed"
            style={{ color: "#4B5134" }}
          >
            {paragraph1}
          </p>
          <p className="text-base leading-relaxed" style={{ color: "#4B5134" }}>
            {paragraph2}
          </p>
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="md:hidden">
        <Title className="text-[2.75rem] leading-none text-center mb-6" />
        <div className="flex gap-2 mb-6">
          <div className="flex-1">
            <FramedImage
              src="/our-story-left.jpg"
              alt="Collin and Alivia"
              rotate
            />
          </div>
          <div className="flex-1">
            <FramedImage
              src="/our-story-right.jpg"
              alt="Collin and Alivia"
              rotate
            />
          </div>
        </div>
        <div className="text-center">
          <p
            className="mb-4 text-sm leading-relaxed"
            style={{ color: "#4B5134" }}
          >
            {paragraph1}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#4B5134" }}>
            {paragraph2}
          </p>
        </div>
      </div>
    </section>
  );
}
