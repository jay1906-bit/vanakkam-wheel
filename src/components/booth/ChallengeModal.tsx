import { useEffect, useMemo, useRef, useState } from "react";

import type { Challenge, ChallengeCategory } from "@/data/challenges";

type Props = {
  open: boolean;
  category: ChallengeCategory | null;
  challenge: Challenge | null;
  onNext: () => void;
};

export function ChallengeModal({ open, category, challenge, onNext }: Props) {
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
          className="font-display text-3xl leading-none md:text-4xl"
          style={{ color: "#4ade80" }}
        >
          {category.label}
        </h2>

        <div className="mt-6">
          <ChallengeBody challenge={challenge} />
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className="cs-btn" onClick={onNext}>
            Next player →
          </button>
        </div>
      </div>
    </div>
  );
}

function ChallengeBody({ challenge }: { challenge: Challenge }) {
  switch (challenge.type) {
    case "external":
      return (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <p className="text-white/85">
            Head to the live challenge and try to tell AI apart from a human.
          </p>
          <a
            href={challenge.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-btn mt-5 inline-flex"
          >
            Open challenge ↗
          </a>
          <p className="mt-3 break-all text-xs text-white/50">{challenge.url}</p>
        </div>
      );

    case "image-quiz":
      return (
        <RevealBlock label="Guess the logo" answer={challenge.answer}>
          <div className="flex items-center justify-center rounded-xl bg-white p-6">
            <img
              src={challenge.image}
              alt="Guess the logo"
              className="max-h-40 max-w-full object-contain"
            />
          </div>
        </RevealBlock>
      );

    case "true-false":
      return (
        <RevealBlock
          label="Myth or Fact?"
          answer={
            challenge.explanation
              ? `${challenge.answer} — ${challenge.explanation}`
              : challenge.answer
          }
        >
          <p className="text-lg leading-relaxed text-white/90 md:text-xl">
            “{challenge.statement}”
          </p>
        </RevealBlock>
      );

    case "emoji":
      return (
        <RevealBlock label="Decode the emoji" answer={challenge.answer}>
          <p className="text-center text-5xl leading-tight md:text-6xl">
            {challenge.emoji}
          </p>
        </RevealBlock>
      );

    case "acronym":
      return (
        <RevealBlock label="Expand the acronym" answer={challenge.answer}>
          <p className="text-center font-display text-5xl text-emerald-300 md:text-6xl">
            {challenge.term}
          </p>
        </RevealBlock>
      );

    case "creative":
      return (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400">
            Your turn
          </div>
          <p className="text-base text-white/85 md:text-lg">
            {challenge.instruction}
          </p>
          <p className="mt-4 text-center font-display text-4xl text-emerald-300 md:text-5xl">
            {challenge.term}
          </p>
        </div>
      );

    case "mcq":
      return <MCQBody challenge={challenge} />;

    case "timer":
      return <TimerBody challenge={challenge} />;

    case "challenge":
      return (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
          <p className="text-base leading-relaxed text-white/90 md:text-lg">
            {challenge.challenge}
          </p>
        </div>
      );

    case "reward":
      return (
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-6 text-center">
          <p className="text-lg leading-relaxed text-emerald-100 md:text-xl">
            {challenge.reward}
          </p>
        </div>
      );
  }
}

function RevealBlock({
  label,
  answer,
  children,
}: {
  label: string;
  answer: string;
  children: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400">
        {label}
      </div>
      {children}
      <div className="mt-5 flex flex-col items-start gap-3">
        {revealed ? (
          <p className="text-base text-emerald-200 md:text-lg">
            <span className="font-semibold text-emerald-300">Answer: </span>
            {answer}
          </p>
        ) : (
          <button
            className="cs-btn cs-btn-ghost"
            onClick={() => setRevealed(true)}
          >
            Reveal answer
          </button>
        )}
      </div>
    </div>
  );
}

function MCQBody({
  challenge,
}: {
  challenge: Extract<Challenge, { type: "mcq" }>;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400">
        Multiple choice
      </div>
      <p className="text-lg text-white/90 md:text-xl">{challenge.question}</p>
      <ul className="mt-5 grid gap-2">
        {challenge.options.map((opt, i) => {
          const isCorrect = revealed && i === challenge.answer;
          const isWrongPick = revealed && i === picked && i !== challenge.answer;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => !revealed && setPicked(i)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  isCorrect
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                    : isWrongPick
                      ? "border-red-400/60 bg-red-500/10 text-red-100"
                      : picked === i
                        ? "border-emerald-400/60 bg-white/5 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/85 hover:bg-white/[0.06]"
                }`}
              >
                <span className="mr-3 text-emerald-300">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-5">
        {revealed ? (
          <p className="text-sm text-emerald-200">
            Correct answer:{" "}
            <span className="font-semibold">
              {challenge.options[challenge.answer]}
            </span>
          </p>
        ) : (
          <button
            className="cs-btn cs-btn-ghost"
            onClick={() => setRevealed(true)}
          >
            Reveal answer
          </button>
        )}
      </div>
    </div>
  );
}

function TimerBody({
  challenge,
}: {
  challenge: Extract<Challenge, { type: "timer" }>;
}) {
  const [remaining, setRemaining] = useState(challenge.timer);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<number | null>(null);
  const total = challenge.timer;

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const start = () => {
    if (running || done) return;
    setRunning(true);
    setRemaining(total);
    timerRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setRunning(false);
          setDone(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  const reset = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setRunning(false);
    setDone(false);
    setRemaining(total);
  };

  const pct = useMemo(
    () => Math.max(0, Math.min(1, remaining / total)),
    [remaining, total],
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400">
        {total}-second rush
      </div>
      <p className="text-lg text-white/90 md:text-xl">{challenge.challenge}</p>
      <div className="mt-5 flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 font-display text-2xl"
          style={{
            borderColor: done ? "#f87171" : "#4ade80",
            color: done ? "#fecaca" : "#ecfdf5",
          }}
        >
          {remaining}
        </div>
        <div className="flex-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full transition-[width] duration-1000 ease-linear"
              style={{
                width: `${pct * 100}%`,
                background: done ? "#f87171" : "#22c55e",
              }}
            />
          </div>
          <div className="mt-3 flex gap-2">
            {!running && !done && (
              <button className="cs-btn" onClick={start}>
                Start timer
              </button>
            )}
            {(running || done) && (
              <button className="cs-btn cs-btn-ghost" onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
      {done && (
        <p className="mt-4 text-sm text-red-200">Time's up! Count the answers.</p>
      )}
    </div>
  );
}
