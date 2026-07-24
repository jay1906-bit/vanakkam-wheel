export type ChallengeCategory = {
  id: string;
  label: string;
  color: string;      // segment fill (green shade)
  textColor: string;  // segment label color
  questions: Challenge[];
};

export type Challenge = {
  title: string;
  description: string;
  instructions: string[];
};

// Challenge content is authored per category. Each category can hold many
// questions; one is chosen at random per spin. Content will be filled in
// later — placeholders below keep the experience runnable end-to-end.
export const CATEGORIES: ChallengeCategory[] = [
  makeCategory("ai-or-human", "AI or Human?", "#16a34a", "#ffffff"),
  makeCategory("logo-quest", "Logo Quest", "#15803d", "#ffffff"),
  makeCategory("myth-or-fact", "Myth or Fact?", "#22c55e", "#052e16"),
  makeCategory("emoji-decode", "Emoji Decode", "#166534", "#ffffff"),
  makeCategory("expand-it", "Expand It!", "#4ade80", "#052e16"),
  makeCategory("lucky-treat", "Lucky Treat", "#065f46", "#ecfdf5"),
  makeCategory("pitch-it", "Pitch It!", "#14532d", "#ecfdf5"),
  makeCategory("tech-in-tamil", "Tech in Tamil", "#22c55e", "#052e16"),
  makeCategory("network-quest", "Network Quest", "#15803d", "#ffffff"),
  makeCategory("five-second-rush", "5-Second Rush", "#4ade80", "#052e16"),
];

function makeCategory(
  id: string,
  label: string,
  color: string,
  textColor: string,
): ChallengeCategory {
  return {
    id,
    label,
    color,
    textColor,
    questions: [
      {
        title: label,
        description:
          "Booth host will read out the challenge for this category. Content coming soon.",
        instructions: [
          "Listen to the challenge from the booth host.",
          "Take your best shot.",
          "Have fun!",
        ],
      },
    ],
  };
}

export function pickQuestion(category: ChallengeCategory): Challenge {
  const idx = Math.floor(Math.random() * category.questions.length);
  return category.questions[idx];
}