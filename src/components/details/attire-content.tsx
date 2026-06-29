function Circle({ color }: { color: string }) {
  return (
    <div
      className="w-36 h-36 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
  );
}

export default function AttireContent() {
  return (
    <div className="flex flex-col justify-around text-2xl tracking-wider w-5/6 text-center font-(family-name:--font-playfair-display)">
      <p>
        We request you dress in <em>Formal Wedding Attire</em> - for those
        wearing high heels, a thicker block heel is recommended, as the terrain
        may be soft. All events will be held primarily outdoors, weather
        permitting.
      </p>
      <br />
      <p>
        For additional inspiration, our wedding colors are listed below. Florals
        & summer hues are welcomed!
      </p>
      <p></p>
      <div className="flex justify-around">
        <Circle color="#D99F9A" />
        <Circle color="#7C92A6" />
        <Circle color="#BFB063" />
      </div>
    </div>
  );
}
