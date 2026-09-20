/**
 * useScoringMatchOverHandoff — GameScreen → ScoringScreen bridge.
 *
 * When a series ends (`matchOver` + result badge):
 *   1. Signals `keepFullBadge` so the full YOU WIN / YOU LOST banner stays up
 *   2. After the confetti beat, navigates to `/score` with ScoringMatchResult
 *
 * All timing / payload / XP logic lives in this scoring feature — GameScreen
 * only calls the hook.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  estimateGroopXp,
  type ScoringMatchResult,
} from "./scoringMatchResult";

/** Confetti / dead-face beat before ScoringScreen. */
export const SCORING_MATCH_OVER_TO_SCORE_MS = 3000;

type ScoringBadgeKind = "win" | "lose" | "tie";

type UseScoringMatchOverHandoffArgs = {
  matchOver: boolean;
  badgeKind: ScoringBadgeKind | null;
  youWins: number;
  oppWins: number;
  matchTarget: number;
};

/**
 * @returns `keepFullBadge` — when true, GameScreen must not minimize the
 * result banner or show the round-over “play again” mini card.
 */
export function useScoringMatchOverHandoff({
  matchOver,
  badgeKind,
  youWins,
  oppWins,
  matchTarget,
}: UseScoringMatchOverHandoffArgs): { keepFullBadge: boolean } {
  const navigate = useNavigate();
  const keepFullBadge = matchOver && badgeKind != null;

  useEffect(() => {
    if (!badgeKind || !matchOver) return;

    const matchWinner =
      youWins > oppWins
        ? ("you" as const)
        : oppWins > youWins
          ? ("opp" as const)
          : null;

    const payload: ScoringMatchResult = {
      youWins,
      oppWins,
      matchTarget,
      matchWinner,
      lastResult: badgeKind,
      xpEarned: estimateGroopXp(youWins, oppWins, matchWinner),
    };

    const t = window.setTimeout(() => {
      navigate("/score", { replace: true, state: payload });
    }, SCORING_MATCH_OVER_TO_SCORE_MS);

    return () => window.clearTimeout(t);
  }, [badgeKind, matchOver, youWins, oppWins, matchTarget, navigate]);

  return { keepFullBadge };
}
