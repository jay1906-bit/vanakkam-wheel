import { useEffect } from "react";

import type { Challenge, ChallengeCategory } from "@/data/challenges";

type Props = {
  open: boolean;
  category: ChallengeCategory | null;
  challenge: Challenge | null;
  onStart: () => void;
  onNext: () => void;
};

export function ChallengeModal({ open, category, challenge, onStart, onNext }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onNext]);

  if (!open || !category || !challenge) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-title"
      className="cs-fade-in fixed inset-0 z-40 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onNext}
      />
      <div
        className="cs-glass cs-modal-in relative w-full max-w-xl rounded-3xl p-8 md:p-10"
        style={{
          boxShadow:
            "0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(34,197,94,0.25)",
        }}
      >
        <div className="mb-5 flex items-center gap-3">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-widest"
            style={{ background: category.color, color: category.textColor }}
          >
            {category.label}
          </span>
          <span className="text-xs uppercase tracking-[0.3em] text-emerald-300/70">
            Challenge selected
          </span>
        </div>

        <h2
          id="challenge-title"
          className="font-display text-4xl leading-none md:text-5xl"
          style={{ color: "#4ade80" }}
        >
          {challenge.title}
        </h2>

        <p className="mt-4 text-base leading-relaxed text-white/85 md:text-lg">
          {challenge.description}
        </p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400">
            How it works
          </div>
          <ol className="space-y-2 text-sm text-white/85 md:text-base">
            {challenge.instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "#22c55e", color: "#052e16" }}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button className="cs-btn cs-btn-ghost" onClick={onNext}>
            Next player
          </button>
          <button className="cs-btn" onClick={onStart}>
            Start challenge
          </button>
        </div>
      </div>
    </div>
  );
}