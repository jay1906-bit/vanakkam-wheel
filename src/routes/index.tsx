import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ChallengeModal } from "@/components/booth/ChallengeModal";
import { Confetti } from "@/components/booth/Confetti";
import { HeroHeading } from "@/components/booth/HeroHeading";
import { ParticleBackground } from "@/components/booth/ParticleBackground";
import { SpinWheel } from "@/components/booth/SpinWheel";
import { CATEGORIES, pickQuestion, type Challenge } from "@/data/challenges";
import { useSpinWheel } from "@/hooks/useSpinWheel";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Code Sapiens · Vanakkam Sapiens!" },
      {
        name: "description",
        content:
          "Interactive booth experience at TOSS by Code Sapiens — spin the wheel, take on a dev challenge.",
      },
      { property: "og:title", content: "Code Sapiens · Vanakkam Sapiens!" },
      {
        property: "og:description",
        content: "Spin the wheel at the Code Sapiens booth (TOSS) and take on a dev challenge.",
      },
    ],
  }),
  component: Booth,
});

function Booth() {
  const categories = CATEGORIES;
  const { rotation, state, landedIndex, spin, reset } = useSpinWheel(categories);

  const [modalOpen, setModalOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [challenge, setChallenge] = useState<Challenge | null>(null);

  // When wheel lands, pick a question and open the modal (delayed for confetti).
  const landedCategory = landedIndex != null ? categories[landedIndex] : null;
  useEffect(() => {
    if (state !== "landed" || !landedCategory) return;
    setConfettiKey((k) => k + 1);
    const q = pickQuestion(landedCategory);
    const t = window.setTimeout(() => {
      setChallenge(q);
      setModalOpen(true);
    }, 650);
    return () => window.clearTimeout(t);
  }, [state, landedCategory]);

  const handleNextPlayer = () => {
    setModalOpen(false);
    setChallenge(null);
    reset();
  };

  const spinning = state === "spinning";
  const isMobile = useIsMobile();

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white font-ui">
      <ParticleBackground />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 md:py-10">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, #22c55e, #052e16)",
                boxShadow: "0 6px 20px rgba(34,197,94,0.35)",
              }}
            >
              <span className="font-display text-lg text-black">C</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-widest text-white">
                CODE SAPIENS
              </div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-400/80">
                Explore · Evolve · Engineer
              </div>
            </div>
          </div>
          <div className="cs-glass-light hidden items-center gap-2 rounded-full px-4 py-2 sm:flex">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 10px #22c55e" }}
            />
            <span className="text-xs uppercase tracking-[0.24em] text-white/80">
              TOSS Conference · Booth Live
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-6 flex flex-col items-center text-center">
          <HeroHeading />
        </section>

        {/* Wheel + mascot */}
        <section className="relative mt-8 flex flex-1 flex-col items-center justify-center">
          <div className="cs-vignette absolute inset-0 -z-10" />
          <div className="relative flex flex-col items-center">
            <SpinWheel
              categories={categories}
              rotation={rotation}
              spinning={spinning}
              size={isMobile ? 320 : 520}
            />
            <button
              className="cs-btn mt-10"
              onClick={spin}
              disabled={spinning}
              aria-label="Spin the wheel"
            >
              {spinning ? "Spinning…" : "Spin the wheel"}
              <span aria-hidden>→</span>
            </button>

            <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-white/50">
              <span className="h-px w-8 bg-white/20" />
              {categories.length} categories · random question per spin
              <span className="h-px w-8 bg-white/20" />
            </div>
          </div>
        </section>

        <footer className="mt-8 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/40">
          <span>© Code Sapiens</span>
          <span>Vanakkam, Sapiens 🍃</span>
        </footer>
      </div>

      <Confetti trigger={confettiKey} />

      <ChallengeModal
        open={modalOpen}
        category={landedCategory}
        challenge={challenge}
        onStart={() => {
          // Placeholder for challenge start — content will be provided later.
          setModalOpen(false);
        }}
        onNext={handleNextPlayer}
      />
    </main>
  );
}
