function Event({
  time,
  title,
  description,
}: {
  time: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col text-center max-w-64">
      <p
        className="md:border-b text-2xl md:text-5xl"
        style={{ fontFamily: "Symphony Pro" }}
      >
        {title}
      </p>
      <p>{time}</p>
      <p>{description}</p>
    </div>
  );
}

export default function ItineraryContent() {
  return (
    <div className="flex flex-col gap-16 w-full justify-around text-sm md:text-lg tracking-wider font-(family-name:--font-playfair-display)">
      <div className="flex flex-col italic items-center text-center">
        <p className="mb-2">
          All events will take place at{" "}
          <a
            className="underline"
            href="https://www.theruralsocietyatwarwickfarm.com/"
          >
            The Rural Society
          </a>{" "}
        </p>
        <p>
          <a
            className="underline"
            href="https://maps.app.goo.gl/wgVTWtfSNBcaF9Fy5"
          >
            16620 Wells Rd. Mt. Vernon, Ohio
          </a>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 justify-evenly">
        <Event
          time="3:30 PM"
          title="Ceremony"
          description="We ask that you arrive by 3:15, as the ceremony will begin promptly"
        />
        <Event
          time="4:15 PM"
          title="Cocktail Hour"
          description="Enjoy appetizers and drinks in the beautiful glass house"
        />
        <Event
          time="5:45 PM"
          title="Reception"
          description="Relax with dinner & dessert before dancing the evening away"
        />
      </div>
    </div>
  );
}
