import raw from "./challenges.json";

// ---- Raw JSON shapes (must mirror src/data/challenges.json) ----------------

type RawExternal = { id: string; title: string; type: "external"; url: string };
type RawImageQuiz = {
  id: string;
  title: string;
  type: "image-quiz";
  questions: Array<{ id: number; image: string; answer: string }>;
};
type RawTrueFalse = {
  id: string;
  title: string;
  type: "true-false";
  questions: Array<{
    id: number;
    statement: string;
    answer: "Myth" | "Fact" | string;
    explanation?: string;
  }>;
};
type RawEmoji = {
  id: string;
  title: string;
  type: "emoji";
  questions: Array<{ id: number; emoji: string; answer: string }>;
};
type RawAcronym = {
  id: string;
  title: string;
  type: "acronym";
  questions: Array<{ id: number; term: string; answer: string }>;
};
type RawCreative = {
  id: string;
  title: string;
  type: "creative";
  instruction: string;
  questions: Array<{ id: number; term: string }>;
};
type RawMCQ = {
  id: string;
  title: string;
  type: "mcq";
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    answer: number;
  }>;
};
type RawTimer = {
  id: string;
  title: string;
  type: "timer";
  timer: number;
  questions: Array<{ id: number; challenge: string }>;
};
type RawStatic = {
  id: string;
  title: string;
  type: "challenge";
  challenge: string;
};
type RawReward = {
  id: string;
  title: string;
  type: "reward";
  reward: string;
};

type RawCategory =
  | RawExternal
  | RawImageQuiz
  | RawTrueFalse
  | RawEmoji
  | RawAcronym
  | RawCreative
  | RawMCQ
  | RawTimer
  | RawStatic
  | RawReward;

type RawFile = { categories: RawCategory[] };

// ---- Resolved Challenge (what UI renders) ---------------------------------

export type Challenge =
  | { type: "external"; url: string }
  | { type: "image-quiz"; image: string; answer: string }
  | {
      type: "true-false";
      statement: string;
      answer: string;
      explanation?: string;
    }
  | { type: "emoji"; emoji: string; answer: string }
  | { type: "acronym"; term: string; answer: string }
  | { type: "creative"; instruction: string; term: string }
  | { type: "mcq"; question: string; options: string[]; answer: number }
  | { type: "timer"; timer: number; challenge: string }
  | { type: "challenge"; challenge: string }
  | { type: "reward"; reward: string };

export type ChallengeCategory = {
  id: string;
  label: string;
  color: string;
  textColor: string;
  raw: RawCategory;
};

// Green palette applied by wheel position — visuals only, not from JSON.
const PALETTE: Array<{ color: string; textColor: string }> = [
  { color: "#16a34a", textColor: "#ffffff" },
  { color: "#15803d", textColor: "#ffffff" },
  { color: "#22c55e", textColor: "#052e16" },
  { color: "#166534", textColor: "#ffffff" },
  { color: "#4ade80", textColor: "#052e16" },
  { color: "#065f46", textColor: "#ecfdf5" },
  { color: "#14532d", textColor: "#ecfdf5" },
  { color: "#22c55e", textColor: "#052e16" },
  { color: "#15803d", textColor: "#ffffff" },
  { color: "#4ade80", textColor: "#052e16" },
];

const file = raw as RawFile;

export const CATEGORIES: ChallengeCategory[] = file.categories.map(
  (c, i) => ({
    id: c.id,
    label: c.title,
    color: PALETTE[i % PALETTE.length].color,
    textColor: PALETTE[i % PALETTE.length].textColor,
    raw: c,
  }),
);

function pickFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

// Resolve a random challenge for a category. Adding new questions to
// challenges.json is enough — no code changes required.
function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Expand a category into an ordered queue of every challenge it contains,
// shuffled so each spin cycles through all questions in random order exactly
// once. Single-item categories (external/challenge/reward) return one item.
export function buildChallengeQueue(category: ChallengeCategory): Challenge[] {
  const c = category.raw;
  switch (c.type) {
    case "external":
      return [{ type: "external", url: c.url }];
    case "image-quiz":
      return shuffle(c.questions).map((q) => ({
        type: "image-quiz",
        image: q.image,
        answer: q.answer,
      }));
    case "true-false":
      return shuffle(c.questions).map((q) => ({
        type: "true-false",
        statement: q.statement,
        answer: q.answer,
        explanation: q.explanation,
      }));
    case "emoji":
      return shuffle(c.questions).map((q) => ({
        type: "emoji",
        emoji: q.emoji,
        answer: q.answer,
      }));
    case "acronym":
      return shuffle(c.questions).map((q) => ({
        type: "acronym",
        term: q.term,
        answer: q.answer,
      }));
    case "creative":
      return shuffle(c.questions).map((q) => ({
        type: "creative",
        instruction: c.instruction,
        term: q.term,
      }));
    case "mcq":
      return shuffle(c.questions).map((q) => ({
        type: "mcq",
        question: q.question,
        options: q.options,
        answer: q.answer,
      }));
    case "timer":
      return shuffle(c.questions).map((q) => ({
        type: "timer",
        timer: c.timer,
        challenge: q.challenge,
      }));
    case "challenge":
      return [{ type: "challenge", challenge: c.challenge }];
    case "reward":
      return [{ type: "reward", reward: c.reward }];
  }
}
