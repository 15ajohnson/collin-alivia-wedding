
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
  return (
    <section
      className="relative overflow-hidden py-16 px-4"
      style={{ backgroundColor: "#183C4C" }}
    >
      {/* Greenhouse image anchored to bottom; solid #183C4C fills above it */}
      <img
        src="/images/details-greenhouse-bg.png"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{ height: "auto", zIndex: 0 }}
      />

      {/* All content sits above the background image */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Title />
      </div>
    </section>
  );
}