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
  {
    id: "debug",
    label: "DEBUG IT",
    color: "#16a34a",
    textColor: "#ffffff",
    questions: [
      {
        title: "Squash the Bug",
        description:
          "A production incident just landed. Reproduce, isolate, and explain the fix out loud.",
        instructions: [
          "Read the failing snippet on the card handed to you.",
          "State the root cause in one sentence.",
          "Describe the smallest safe fix in 60 seconds.",
        ],
      },
    ],
  },
  {
    id: "algo",
    label: "ALGO SPRINT",
    color: "#15803d",
    textColor: "#ffffff",
    questions: [
      {
        title: "Whiteboard Sprint",
        description:
          "Solve a short algorithm puzzle at the booth whiteboard — brute force first, then optimize.",
        instructions: [
          "Read the prompt aloud.",
          "Explain a brute-force approach.",
          "Improve time or space complexity by one step.",
        ],
      },
    ],
  },
  {
    id: "trivia",
    label: "DEV TRIVIA",
    color: "#22c55e",
    textColor: "#052e16",
    questions: [
      {
        title: "Rapid Trivia",
        description: "Three quick-fire questions from across the stack.",
        instructions: [
          "Answer three trivia questions in a row.",
          "You have 15 seconds per answer.",
          "Two out of three wins the prize.",
        ],
      },
    ],
  },
  {
    id: "design",
    label: "SYS DESIGN",
    color: "#166534",
    textColor: "#ffffff",
    questions: [
      {
        title: "Napkin System Design",
        description:
          "Sketch a small system on a napkin — components, data flow, one trade-off.",
        instructions: [
          "Draw the boxes and arrows.",
          "Call out one bottleneck.",
          "Propose one mitigation.",
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "AI PROMPT",
    color: "#4ade80",
    textColor: "#052e16",
    questions: [
      {
        title: "Prompt Craft",
        description:
          "Write a prompt that reliably solves the given micro-task in one shot.",
        instructions: [
          "Read the task card.",
          "Draft your prompt.",
          "We run it live at the booth.",
        ],
      },
    ],
  },
  {
    id: "shell",
    label: "SHELL FU",
    color: "#065f46",
    textColor: "#ecfdf5",
    questions: [
      {
        title: "One-Liner",
        description:
          "Solve the mini text-processing task with a single shell pipeline.",
        instructions: [
          "Read the input and expected output.",
          "Write one pipeline (grep, awk, sed, cut, sort — your call).",
          "Explain each stage in one word.",
        ],
      },
    ],
  },
  {
    id: "refactor",
    label: "REFACTOR",
    color: "#14532d",
    textColor: "#ecfdf5",
    questions: [
      {
        title: "Ugly Code, Better Code",
        description:
          "Take the ugly snippet on the card and propose a cleaner shape in 60 seconds.",
        instructions: [
          "Name one code smell.",
          "Suggest the refactor.",
          "State what test would catch a regression.",
        ],
      },
    ],
  },
  {
    id: "wildcard",
    label: "WILDCARD",
    color: "#22c55e",
    textColor: "#052e16",
    questions: [
      {
        title: "Wildcard",
        description:
          "Booth host picks any challenge from the deck — surprise round.",
        instructions: [
          "Draw a card from the wildcard deck.",
          "Follow the instructions on the card.",
          "Have fun.",
        ],
      },
    ],
  },
];

export function pickQuestion(category: ChallengeCategory): Challenge {
  const idx = Math.floor(Math.random() * category.questions.length);
  return category.questions[idx];
}