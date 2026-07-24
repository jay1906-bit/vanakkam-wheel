import { useCallback, useRef, useState } from "react";

import type { ChallengeCategory } from "@/data/challenges";

type SpinState = "idle" | "spinning" | "landed";

// Realistic spin: random segment, 6-9 rotations, quartic ease-out.
export function useSpinWheel(categories: ChallengeCategory[]) {
  const [rotation, setRotation] = useState(0);
  const [state, setState] = useState<SpinState>("idle");
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const raf = useRef<number | null>(null);

  const spin = useCallback(() => {
    if (state === "spinning") return;
    const seg = 360 / categories.length;
    const targetIndex = Math.floor(Math.random() * categories.length);
    const segMid = targetIndex * seg + seg / 2;
    const turns = 6 + Math.floor(Math.random() * 4);
    const currentMod = ((rotation % 360) + 360) % 360;
    const finalRotation =
      rotation + turns * 360 + (360 - segMid) - currentMod;

    const duration = 5200 + Math.random() * 800;
    const start = performance.now();
    const from = rotation;

    setState("spinning");
    setLandedIndex(null);

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOut(t);
      setRotation(from + (finalRotation - from) * eased);
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setState("landed");
        setLandedIndex(targetIndex);
      }
    };
    raf.current = requestAnimationFrame(tick);
  }, [categories.length, rotation, state]);

  const reset = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    setState("idle");
    setLandedIndex(null);
  }, []);

  return { rotation, state, landedIndex, spin, reset };
}