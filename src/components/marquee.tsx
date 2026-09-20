import { stackTicker } from "@/lib/site-data";

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden ? "true" : undefined}
    >
      {stackTicker.map((item) => (
        <li
          key={item}
          className="flex items-center gap-8 pr-8 font-display text-3xl italic text-muted sm:text-4xl"
        >
          {item}
          <span className="not-italic text-accent" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <div
      className="marquee overflow-hidden border-y border-line py-5"
      role="region"
      aria-label="Technologies I work with"
    >
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
