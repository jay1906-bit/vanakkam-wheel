import { useEffect, useRef } from "react";

// Dev-themed particle background: floating code glyphs + drifting green blobs.
// Canvas-based so it stays smooth even with many particles.
const GLYPHS = [
  "{ }", "</>", "()", "=>", "&&", "||", "npm", "git", "AI", "λ",
  "0x", "fn", "//", "$_", "[]", ";;", "==", "!!",
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  glyph: string;
  size: number;
  alpha: number;
  rot: number;
  vr: number;
};

export function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(48, Math.max(22, Math.floor((w * h) / 42000)));
      particles = new Array(count).fill(0).map(() => spawn(true));
    };

    const spawn = (initial: boolean): Particle => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 20,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -0.15 - Math.random() * 0.35,
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      size: 12 + Math.random() * 20,
      alpha: 0.08 + Math.random() * 0.22,
      rot: (Math.random() - 0.5) * 0.3,
      vr: (Math.random() - 0.5) * 0.002,
    });

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = "600 16px 'JetBrains Mono', ui-monospace, monospace";
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y < -30) Object.assign(p, spawn(false));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(74, 222, 128, ${p.alpha})`;
        ctx.font = `600 ${p.size}px 'JetBrains Mono', ui-monospace, monospace`;
        ctx.fillText(p.glyph, 0, 0);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, #052e16 0%, #030706 40%, #000 100%)",
        }}
      />
      {/* Drifting green blobs */}
      <div
        className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,197,94,0.35), transparent 70%)",
          animation: "cs-drift 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-40 -right-32 h-[600px] w-[600px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.28), transparent 70%)",
          animation: "cs-drift 22s ease-in-out infinite reverse",
        }}
      />
      {/* Grid overlay */}
      <div className="absolute inset-0 cs-grid opacity-40" />
      {/* Canvas glyphs */}
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
    </div>
  );
}