/**
 * achievementsCatalog — static gallery entries for `/achievements`.
 * Extends in-game ACHIEVEMENT_DEFS with a few extra scoped badges.
 */
import {
  ACHIEVEMENT_DEFS,
  achievementFromDef,
  type Achievement,
  type AchievementGlyph,
  type AchievementWinner,
} from "@/components/game/achievements";

const DEMO_WINNERS: AchievementWinner[] = [
  { id: "w1", name: "Mira", country: "IN", glyph: "bug" },
  { id: "w2", name: "Leo", country: "BR", glyph: "rocket" },
  { id: "w3", name: "Aya", country: "JP", glyph: "star" },
  { id: "w4", name: "Sam", country: "CA", glyph: "bug" },
  { id: "w5", name: "Noor", country: "EG", glyph: "rocket" },
];

type CatalogSeed = {
  id: string;
  title: string;
  banner: string;
  howTo: string;
  glyph: AchievementGlyph;
  progress: number;
  status: Achievement["status"];
};

/** Extra gallery-only badges (not wired into live GameScreen tracking). */
const EXTRA_SEEDS: CatalogSeed[] = [
  {
    id: "ink-splash",
    title: "ink splash",
    banner: "survive a collision round",
    howTo: "Both marks land on the same tile and the cell gets scribbled. Keep playing through the mess.",
    glyph: "spark",
    progress: 1,
    status: "unlocked",
  },
  {
    id: "clock-whisper",
    title: "clock whisper",
    banner: "lock a mark under 2 seconds",
    howTo: "Place your shape and leave it until the round locks with more than half the timer left.",
    glyph: "target",
    progress: 0.45,
    status: "tracking",
  },
  {
    id: "polite-rival",
    title: "polite rival",
    banner: "send three reactions",
    howTo: "Spin the reaction wheel and tap three stickers in a single match.",
    glyph: "spark",
    progress: 0.66,
    status: "tracking",
  },
  {
    id: "perfect-page",
    title: "perfect page",
    banner: "sweep a best-of without a loss",
    howTo: "Win every game in the series. No draws counting against you — just clean tallies.",
    glyph: "trophy",
    progress: 0,
    status: "tracking",
  },
  {
    id: "night-owl",
    title: "night owl",
    banner: "finish a match after midnight",
    howTo: "Play through and end a series when the local clock says it's late. Static demo badge.",
    glyph: "target",
    progress: 0,
    status: "tracking",
  },
];

function fromSeed(seed: CatalogSeed): Achievement {
  return {
    id: seed.id,
    title: seed.title,
    banner: seed.banner,
    howTo: seed.howTo,
    glyph: seed.glyph,
    progress: seed.progress,
    status: seed.status,
    winners: DEMO_WINNERS,
  };
}

/** Ordered gallery list — unlocked first, then tracking by progress. */
export const ACHIEVEMENTS_GALLERY: Achievement[] = [
  achievementFromDef(ACHIEVEMENT_DEFS["first-sketch"], 1, "unlocked"),
  achievementFromDef(ACHIEVEMENT_DEFS["first-win-close"], 0.72, "tracking"),
  achievementFromDef(ACHIEVEMENT_DEFS["on-a-roll"], 0.35, "tracking"),
  ...EXTRA_SEEDS.map(fromSeed),
].sort((a, b) => {
  if (a.status !== b.status) return a.status === "unlocked" ? -1 : 1;
  return b.progress - a.progress;
});

export function achievementsSummary(list: Achievement[] = ACHIEVEMENTS_GALLERY) {
  const unlocked = list.filter((a) => a.status === "unlocked").length;
  const total = list.length;
  const avgProgress =
    list.reduce((sum, a) => sum + (a.status === "unlocked" ? 1 : a.progress), 0) /
    Math.max(1, total);
  return { unlocked, total, avgProgress };
}
