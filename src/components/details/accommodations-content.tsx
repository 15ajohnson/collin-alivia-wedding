export default function AccommodationsContent() {
  return (
    <div className="flex flex-col justify-around text-sm md:text-xl tracking-wider w-full text-center font-(family-name:--font-playfair-display)">
      <p>We have reserved a block at:</p>
      <br />
      <p>
        <em>The Hampton Inn Mount Vernon</em>
      </p>
      <p>1560 Venture Dr. Mt. Vernon, OH 43050</p>
      <br />
      <p>Rooms available September 11th - 13th, 2026</p>
      <p>
        Please use this{" "}
        <a
          className="underline font-semibold"
          href="https://group.hamptoninn.com/5ljef3"
        >
          Booking Link
        </a>{" "}
        to reserve a room within the block.
      </p>
      <p>
        <strong className="font-semibold">
          Cutoff date for the room block is August 12, 2026*
        </strong>
      </p>
      <br />
      <div className="text-xs md:text-base italic">
        <p>
          * You may continue to book outside of the block after this date but
        </p>
        <p>price and availability cannot be guaranteed.</p>
      </div>
    </div>
  );
}
