/**
 * scoringMatchResult — router-state payload for `/score` (ScoringScreen).
 *
 * Built by useScoringMatchOverHandoff when a series ends; consumed by ScoringScreen.
 * groop XP is estimated until real economy weights ship.
 */
export type ScoringMatchOwner = "you" | "opp";

export type ScoringMatchResult = {
  youWins: number;
  oppWins: number;
  matchTarget: number;
  /** Who won the series (higher wins). Null on a split. */
  matchWinner: ScoringMatchOwner | null;
  /** Last game result badge that closed the series. */
  lastResult: "win" | "lose" | "tie";
  /** groop XP for this series (estimated until real metrics). */
  xpEarned: number;
};

/** @deprecated Prefer ScoringMatchResult — kept for brief call-site clarity in docs. */
export type MatchResultPayload = ScoringMatchResult;

export function isScoringMatchResult(v: unknown): v is ScoringMatchResult {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.youWins === "number" &&
    typeof o.oppWins === "number" &&
    typeof o.matchTarget === "number" &&
    typeof o.xpEarned === "number" &&
    (o.matchWinner === "you" ||
      o.matchWinner === "opp" ||
      o.matchWinner === null) &&
    (o.lastResult === "win" || o.lastResult === "lose" || o.lastResult === "tie")
  );
}

/**
 * Estimate groop XP for a finished series.
 * Placeholder formula — swap for real per-win weights when ready.
 */
export function estimateGroopXp(
  youWins: number,
  oppWins: number,
  matchWinner: ScoringMatchOwner | null,
): number {
  const base = 80 + Math.floor(Math.random() * 40);
  const perWin = 45 + Math.floor(Math.random() * 25);
  const seriesBonus =
    matchWinner === "you" ? 75 : matchWinner === "opp" ? 20 : 40;
  return base + youWins * perWin + Math.max(0, oppWins) * 12 + seriesBonus;
}
