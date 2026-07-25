/**
 * Reaction catalog — visual-first stickers for the wheel + thought clouds.
 *
 * Interim visuals are crayon-tone kaomoji marks (not Unicode emoji / English
 * words). Drop hand-drawn assets in later via `assetSrc` without changing
 * call sites — ReactionSticker prefers the asset when present.
 */

export type ReactionId =
  | "happy"
  | "tongue"
  | "cry"
  | "smirk"
  | "dead"
  | "wink"
  | "shock"
  | "cool";

export interface Reaction {
  id: ReactionId;
  /** Accessible name — not shown as primary UI copy. */
  label: string;
  /** Interim hand-lettered mark until custom assets ship. */
  mark: string;
  /** Optional future PNG/SVG path under /public. */
  assetSrc?: string;
}

export const REACTIONS: Reaction[] = [
  { id: "happy", label: "happy", mark: "^_^" },
  { id: "tongue", label: "tongue out", mark: ":P" },
  { id: "cry", label: "tears", mark: "T_T" },
  { id: "smirk", label: "smirk", mark: "¬_¬" },
  { id: "dead", label: "knocked out", mark: "x_x" },
  { id: "wink", label: "wink", mark: ";)" },
  { id: "shock", label: "shock", mark: "O_O" },
  { id: "cool", label: "cool", mark: "B-)" },
];

export const REACTION_BY_ID: Record<ReactionId, Reaction> = Object.fromEntries(
  REACTIONS.map((r) => [r.id, r]),
) as Record<ReactionId, Reaction>;

export function pickReaction(pool: Reaction[] = REACTIONS): Reaction {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export const COLLISION_REACTIONS: Reaction[] = [
  REACTION_BY_ID.cry,
  REACTION_BY_ID.dead,
  REACTION_BY_ID.shock,
];

export const OPP_WIN_REACTIONS: Reaction[] = [
  REACTION_BY_ID.cool,
  REACTION_BY_ID.happy,
  REACTION_BY_ID.smirk,
];
