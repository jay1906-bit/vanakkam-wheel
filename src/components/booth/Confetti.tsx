import { useEffect, useRef } from "react";

// Lightweight canvas confetti burst. Auto-runs when `trigger` changes.
export function Confetti({ trigger }: { trigger: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = ["#22c55e", "#4ade80", "#16a34a", "#ffffff", "#a7f3d0"];
    const pieces = new Array(180).fill(0).map(() => ({
      x: w / 2 + (Math.random() - 0.5) * 60,
      y: h / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: -8 - Math.random() * 10,
      g: 0.35 + Math.random() * 0.15,
      size: 5 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const alpha = Math.max(0, 1 - t / 2200);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
      if (t < 2400) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
    />
  );
}