/**
 * `@/features/tutorial` — static rules walkthrough for `/tutorial`.
 *
 * Self-contained feature: UI components are all `Tutorial*` prefixed and must
 * not be confused with GameScreen chrome (ReactionWheel, RoundTimer, modals).
 * Game primitives (Board, PlayerCards, TopBar) are reused for visual parity only.
 *
 * Module map
 * ----------
 * Screen / flow
 *   TutorialScreen          — route root layout
 *   useTutorialFlow         — step index, advance, emoji gate
 *   tutorialSteps           — ordered copy + frame ids + chips
 *   tutorialFrames          — GameState snapshots per frame id
 *   tutorialPresets         — board cell helpers / demo layouts
 *
 * Rules panel
 *   TutorialRulesContainer  — kraft scrapbook panel
 *   TutorialRulesText       — typewriter body copy
 *   TutorialRulesChip       — inline collision / scribble chip
 *   tutorialRulesContainerSpecs / Motion — Figma layout + entrance
 *
 * Board cues
 *   TutorialDimOverlay      — full-frame dim (except-rules)
 *   TutorialSpotlightOverlay — board-local hole on one tile
 *   TutorialTileBlink       — cream focus ring
 *   TutorialGridTapCue      — “tap the grid” hint
 *
 * End sequence
 *   TutorialEmojiStep       — modal + sticker strip
 *   TutorialModal           — hand-drawn dialog (AchievementModal look)
 *   TutorialReactionWheel   — tap-only stickers (no spin; not ReactionWheel)
 *   TutorialRoundTimer      — timer with forcePct (not RoundTimer)
 */
export { TutorialScreen } from "./TutorialScreen";
export { useTutorialFlow } from "./useTutorialFlow";
export { TUTORIAL_STEPS, TUTORIAL_TIMER_INTRO_ID } from "./tutorialSteps";
export type {
  TutorialStep,
  TutorialAdvance,
  TutorialOverlayMode,
  TutorialChip,
} from "./tutorialSteps";
export type { TutorialFrameId } from "./tutorialFrames";
export { buildTutorialFrame } from "./tutorialFrames";
