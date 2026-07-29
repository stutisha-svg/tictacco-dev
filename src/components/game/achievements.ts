/**
 * Achievement catalog — tracked badges shown in the status bar + top nudge.
 * Winners are demo profiles for the detail modal carousel.
 */

export type AchievementGlyph = "trophy" | "spark" | "target";

export interface AchievementWinner {
  id: string;
  name: string;
  country: string;
  /** Simple avatar cue — matches crayon glyph language. */
  glyph: "bug" | "rocket" | "star";
}

export interface AchievementDef {
  id: string;
  title: string;
  /** Short status-bar / nudge line. */
  banner: string;
  /** How to unlock — shown in the detail modal. */
  howTo: string;
  glyph: AchievementGlyph;
  winners: AchievementWinner[];
}

/** Live instance while playing. */
export interface Achievement {
  id: string;
  title: string;
  banner: string;
  howTo: string;
  glyph: AchievementGlyph;
  /** 0..1 fill toward unlock. */
  progress: number;
  /** tracking = in progress; unlocked = just earned / complete. */
  status: "tracking" | "unlocked";
  winners: AchievementWinner[];
}

const DEMO_WINNERS: AchievementWinner[] = [
  { id: "w1", name: "Mira", country: "IN", glyph: "bug" },
  { id: "w2", name: "Leo", country: "BR", glyph: "rocket" },
  { id: "w3", name: "Aya", country: "JP", glyph: "star" },
  { id: "w4", name: "Sam", country: "CA", glyph: "bug" },
  { id: "w5", name: "Noor", country: "EG", glyph: "rocket" },
];

export const ACHIEVEMENT_DEFS: Record<string, AchievementDef> = {
  "first-win-close": {
    id: "first-win-close",
    title: "one to go",
    banner: "badge hunt — one mark from X-O-X",
    howTo: "Get two of the three X-O-X slots filled on your turn. Land the last mark before the rival does.",
    glyph: "target",
    winners: DEMO_WINNERS,
  },
  "on-a-roll": {
    id: "on-a-roll",
    title: "on a roll",
    banner: "on a roll — win another game",
    howTo: "Win two games in the same match. Keep the best-of tally tipping your way.",
    glyph: "spark",
    winners: [...DEMO_WINNERS].reverse(),
  },
  "first-sketch": {
    id: "first-sketch",
    title: "first sketch",
    banner: "first sketch unlocked!",
    howTo: "Win your first game of the match. Complete any live X-O-X on the grid.",
    glyph: "trophy",
    winners: DEMO_WINNERS.slice(0, 4),
  },
};

export function achievementFromDef(
  def: AchievementDef,
  progress: number,
  status: Achievement["status"],
): Achievement {
  return {
    id: def.id,
    title: def.title,
    banner: def.banner,
    howTo: def.howTo,
    glyph: def.glyph,
    progress: Math.max(0, Math.min(1, progress)),
    status,
    winners: def.winners,
  };
}
