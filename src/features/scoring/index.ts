/**
 * `@/features/scoring` — post-series results after matchOver.
 *
 * Module map (all Scoring*-prefixed for glanceable ownership):
 *   ScoringScreen                 — route `/score`
 *   ScoringAvatar                 — profile + crown + win count-up
 *   ScoringSeriesChrome           — best-of, pip duel, groop XP card
 *   scoringMatchResult            — router payload + estimateGroopXp
 *   useScoringMatchOverHandoff    — GameScreen bridge → /score
 */
export { ScoringScreen } from "./ScoringScreen";
export { ScoringAvatar } from "./ScoringAvatar";
export {
  ScoringBestOfBadge,
  ScoringScoreDuel,
  ScoringGroopXpCard,
} from "./ScoringSeriesChrome";
export { useScoringMatchOverHandoff } from "./useScoringMatchOverHandoff";
export {
  isScoringMatchResult,
  estimateGroopXp,
} from "./scoringMatchResult";
export type {
  ScoringMatchResult,
  ScoringMatchOwner,
  MatchResultPayload,
} from "./scoringMatchResult";
