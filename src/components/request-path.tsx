/**
 * Technical drawing of how this very site runs, grouped by the three layers
 * the portfolio is organised around. Colours come from CSS variables so it
 * follows the light/dark theme.
 */
function Node({
  x,
  y,
  w,
  h = 46,
  title,
  sub,
  accent = false,
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  title: string;
  sub?: string;
  accent?: boolean;
  dashed?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="var(--surface)"
        stroke={accent ? "var(--accent)" : "var(--line-strong)"}
        strokeWidth={accent ? 1.5 : 1}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
      <text x={x + 10} y={y + (sub ? 20 : h / 2 + 4)} fontSize="12.5" fontWeight="600" fill="var(--fg)">
        {title}
      </text>
      {sub && (
        <text x={x + 10} y={y + 35} fontSize="10" fill="var(--muted)" style={{ fontFamily: "var(--font-mono)" }}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Down({ x, y1, y2, dashed = false }: { x: number; y1: number; y2: number; dashed?: boolean }) {
  return (
    <g stroke="var(--fg)" strokeWidth="1" fill="none">
      <line x1={x} y1={y1} x2={x} y2={y2 - 4} strokeDasharray={dashed ? "3 3" : undefined} />
      <path d={`M${x - 3.5} ${y2 - 7} L${x} ${y2} L${x + 3.5} ${y2 - 7}`} />
    </g>
  );
}

function Layer({ y, label }: { y: number; label: string }) {
  return (
    <g>
      <line x1="0" y1={y} x2="300" y2={y} stroke="var(--line)" strokeDasharray="2 4" />
      <text x="0" y={y + 15} fontSize="9.5" fill="var(--muted)" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
        {label}
      </text>
    </g>
  );
}

export default function RequestPath({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 472"
      role="img"
      aria-label="How this site runs. Interface layer: the browser loads a Next.js app on Vercel. Services layer: it calls a Spring Boot API behind Nginx, which reads PostgreSQL and falls back to a self-hosted Ollama model. Delivery layer: a git push triggers GitHub Actions, which builds an image, pushes it to a registry and deploys it over SSH to EC2."
      className={className}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Interface */}
      <Layer y={0} label="INTERFACE" />
      <Node x={0} y={22} w={300} title="Browser" sub="React 19 · Tailwind 4" />
      <Down x={150} y1={68} y2={92} />
      <Node x={0} y={92} w={300} title="Next.js 15 on Vercel" sub="pages · chat UI · SSE client" accent />

      {/* Services */}
      <Layer y={156} label="SERVICES" />
      <Down x={150} y1={138} y2={180} />
      <Node x={0} y={180} w={300} title="Nginx" sub="HTTPS · Let's Encrypt" />
      <Down x={150} y1={226} y2={250} />
      <Node x={0} y={250} w={300} title="Spring Boot 4 · Java 21" sub="answer engine · JWT · Flyway" accent />
      <Down x={72} y1={296} y2={326} />
      <Down x={228} y1={296} y2={326} dashed />
      <Node x={0} y={326} w={144} title="PostgreSQL" sub="managed" />
      <Node x={156} y={326} w={144} title="Ollama" sub="fallback" dashed />

      {/* Delivery */}
      <Layer y={394} label="DELIVERY" />
      <Node x={0} y={418} w={66} h={46} title="git push" />
      <Node x={78} y={418} w={66} h={46} title="Actions" sub="build" />
      <Node x={156} y={418} w={66} h={46} title="GHCR" sub="image" />
      <Node x={234} y={418} w={66} h={46} title="EC2" sub="ssh" accent />
      <g stroke="var(--fg)" strokeWidth="1" fill="none">
        <path d="M66 441 H74 M71 437.5 L75 441 L71 444.5" />
        <path d="M144 441 H152 M149 437.5 L153 441 L149 444.5" />
        <path d="M222 441 H230 M227 437.5 L231 441 L227 444.5" />
      </g>
    </svg>
  );
}
