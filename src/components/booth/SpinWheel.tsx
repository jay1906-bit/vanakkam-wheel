import { useMemo } from "react";

import type { ChallengeCategory } from "@/data/challenges";

type Props = {
  categories: ChallengeCategory[];
  rotation: number;
  spinning: boolean;
  size?: number;
  onSegmentClick?: (index: number) => void;
};

// SVG wheel. Segments computed from category count; rotation applied to <g>.
export function SpinWheel({ categories, rotation, spinning, size = 520, onSegmentClick }: Props) {
  const r = size / 2;
  const cx = r;
  const cy = r;
  const inner = r * 0.14;
  const segAngle = 360 / categories.length;

  const paths = useMemo(() => {
    return categories.map((c, i) => {
      const start = (i * segAngle - 90) * (Math.PI / 180);
      const end = ((i + 1) * segAngle - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const large = segAngle > 180 ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      const mid = ((i + 0.5) * segAngle - 90) * (Math.PI / 180);
      const lx = cx + r * 0.66 * Math.cos(mid);
      const ly = cy + r * 0.66 * Math.sin(mid);
      // Align label along the slice's radial centerline (reading outward).
      // Flip 180° on the left half so text stays right-side-up.
      const radialDeg = (i + 0.5) * segAngle - 90;
      const flip = radialDeg > 90 && radialDeg < 270 ? 180 : 0;
      const labelRotation = radialDeg + flip;
      return { d, category: c, lx, ly, labelRotation };
    });
  }, [categories, cx, cy, r, segAngle]);

  return (
    <div
      className="relative cs-wheel-glow"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #4ade80, #052e16, #22c55e, #052e16, #4ade80)",
          padding: 8,
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        <div className="h-full w-full rounded-full bg-black" />
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        style={{ padding: 14 }}
      >
        <defs>
          {categories.map((c, i) => (
            <radialGradient id={`seg-${i}`} key={c.id} cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor={lighten(c.color, 0.15)} />
              <stop offset="100%" stopColor={c.color} />
            </radialGradient>
          ))}
        </defs>
        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${rotation}deg)`,
            willChange: "transform",
          }}
        >
          {paths.map((p, i) => (
            <g 
              key={p.category.id} 
              onClick={() => onSegmentClick?.(i)}
              style={{ cursor: onSegmentClick ? 'pointer' : 'default' }}
            >
              <path
                d={p.d}
                fill={`url(#seg-${i})`}
                stroke="rgba(255,255,255,0.14)"
                strokeWidth={1.5}
              />
              <g
                transform={`translate(${p.lx} ${p.ly}) rotate(${p.labelRotation})`}
              >
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={p.category.textColor}
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: 13,
                    letterSpacing: "0.04em",
                  }}
                >
                  {p.category.label}
                </text>
              </g>
            </g>
          ))}
          <circle cx={cx} cy={cy} r={inner + 26} fill="#000" />
          <circle
            cx={cx}
            cy={cy}
            r={inner + 24}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
          />
          <text
            x={cx}
            y={cy + 6}
            textAnchor="middle"
            fill="#4ade80"
            style={{
              fontFamily: "Bowlby One, sans-serif",
              fontSize: 20,
              letterSpacing: "0.08em",
            }}
          >
            CS
          </text>
        </g>

        <g>
          {new Array(categories.length * 2).fill(0).map((_, i) => {
            const a =
              ((i / (categories.length * 2)) * 360 - 90) * (Math.PI / 180);
            const rr = r - 22;
            return (
              <circle
                key={i}
                cx={cx + rr * Math.cos(a)}
                cy={cy + rr * Math.sin(a)}
                r={3}
                fill={i % 2 === 0 ? "#4ade80" : "#ffffff"}
                opacity={0.85}
              />
            );
          })}
        </g>
      </svg>

      <div
        className={`absolute left-1/2 top-[-6px] z-10 ${spinning ? "" : "cs-pointer-idle"}`}
        style={{ transform: "translate(-50%, 0) rotate(180deg)" }}
      >
        <svg width="46" height="58" viewBox="0 0 46 58">
          <defs>
            <linearGradient id="pointer-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          <path
            d="M23 2 L44 30 Q23 58 23 58 Q23 58 2 30 Z"
            fill="url(#pointer-g)"
            stroke="#052e16"
            strokeWidth={2}
          />
          <circle cx="23" cy="24" r="5" fill="#052e16" />
        </svg>
      </div>
    </div>
  );
}

function lighten(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number) => Math.min(255, Math.round(c + (255 - c) * amt));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}