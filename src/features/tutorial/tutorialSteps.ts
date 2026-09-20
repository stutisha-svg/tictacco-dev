/**
 * Tutorial step definitions — ordered copy + frame ids for the static walkthrough.
 * Not playable. Advance via anywhere-tap / 10s (except emoji / start-game steps).
 */
import { emptyBoard } from "@/game/rules";
import type { GameState } from "@/game/useGameEngine";
import type { TutorialFrameId } from "./tutorialFrames";
import {
  TUTORIAL_COLLISION_DEMO_TILE,
  TUTORIAL_OPP_DEMO_TILE,
  TUTORIAL_PRACTICE_TILE,
  TUTORIAL_SCRIBBLE_DEMO_TILE,
  TUTORIAL_WIN_DEMO_SLOT,
} from "./tutorialPresets";

export type TutorialAdvance = "tap-or-10s" | "emoji-react" | "start-game";

export type TutorialOverlayMode = "none" | "except-rules";

/** Optional inline chip shown with the rules copy (same text size — no banners). */
export type TutorialChip = "collision" | "scribble" | null;

export interface TutorialStep {
  id: string;
  text: string;
  advance: TutorialAdvance;
  overlay: TutorialOverlayMode;
  frame: TutorialFrameId;
  waitForRulesEntrance?: boolean;
  showRulesContainer?: boolean;
  showGridTapCue?: boolean;
  /** Soft ring on a tile (reduced motion). */
  blinkTile?: number | null;
  /** Dim overlay with a hole on this tile. */
  spotlightTile?: number | null;
  showTimer?: boolean;
  /** Timer bar is filling (same pause/resume semantics as live game). */
  timerRunning?: boolean;
  /** Timer filled — blink “time’s up” treatment. */
  timerExpired?: boolean;
  showConfetti?: boolean;
  chip?: TutorialChip;
}

export const TUTORIAL_AUTO_ADVANCE_MS = 10_000;

/** First step that introduces the timer — stays mounted (idle) after this. */
export const TUTORIAL_TIMER_INTRO_ID = "timer-active";

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "intro",
    text: "Let's learn how to play tic tac co",
    advance: "tap-or-10s",
    overlay: "except-rules",
    frame: "empty",
    waitForRulesEntrance: true,
    showRulesContainer: true,
  },
  {
    id: "tap-place",
    text: "Tap on the grid to start placing your shape.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "tap-cue",
    showRulesContainer: true,
    showGridTapCue: true,
  },
  {
    id: "tap-change",
    text: "Tap another time to change your shape.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "shape-x",
    showRulesContainer: true,
    blinkTile: TUTORIAL_PRACTICE_TILE,
    spotlightTile: TUTORIAL_PRACTICE_TILE,
  },
  {
    id: "timer-active",
    text: "Once you place a shape your move timer is activated.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "shape-o-timer",
    showRulesContainer: true,
    showTimer: true,
    timerRunning: true,
  },
  {
    id: "tap-erase",
    text: "Tap once more to erase your shape (and your timer pauses.)",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "shape-cleared",
    showRulesContainer: true,
    blinkTile: TUTORIAL_PRACTICE_TILE,
    spotlightTile: TUTORIAL_PRACTICE_TILE,
    showTimer: true,
    timerRunning: false,
  },
  {
    id: "tap-resume",
    text: "Place a shape again and the timer resumes.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "shape-x",
    showRulesContainer: true,
    blinkTile: TUTORIAL_PRACTICE_TILE,
    spotlightTile: TUTORIAL_PRACTICE_TILE,
    showTimer: true,
    timerRunning: true,
  },
  {
    id: "timer-up",
    text: "When the timer fills, your move locks in.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "shape-o-timer",
    showRulesContainer: true,
    showTimer: true,
    timerRunning: false,
    timerExpired: true,
  },
  {
    id: "how-to-win",
    text: "Let's understand how to win a round. Form an XOX in your own color.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "empty",
    showRulesContainer: true,
  },
  {
    id: "ongoing-intro",
    text: "Let's take a look at this ongoing game — you already have two X marks.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "win-setup",
    showRulesContainer: true,
  },
  {
    id: "ongoing-opp-move",
    text: "This is your opponent's move.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "win-opp-spotlight",
    showRulesContainer: true,
    blinkTile: TUTORIAL_OPP_DEMO_TILE,
    spotlightTile: TUTORIAL_OPP_DEMO_TILE,
  },
  {
    id: "ongoing-shape-color",
    text: "This is their shape color.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "win-opp-spotlight",
    showRulesContainer: true,
    blinkTile: TUTORIAL_OPP_DEMO_TILE,
    spotlightTile: TUTORIAL_OPP_DEMO_TILE,
  },
  {
    id: "ongoing-reveal",
    text: "To win, complete XOX with your own shapes — not the opponent's.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "win-your-x",
    showRulesContainer: true,
    spotlightTile: TUTORIAL_WIN_DEMO_SLOT,
    blinkTile: TUTORIAL_WIN_DEMO_SLOT,
  },
  {
    id: "ongoing-place-o",
    text: "Place an O between your two X marks to win.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "win-place-o",
    showRulesContainer: true,
    blinkTile: TUTORIAL_WIN_DEMO_SLOT,
    spotlightTile: TUTORIAL_WIN_DEMO_SLOT,
  },
  {
    id: "you-win",
    text: "Since you formed an XOX in your color before the opponent, you win.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "win-complete",
    showRulesContainer: true,
    showConfetti: true,
  },
  {
    id: "other-rules",
    text: "Here's some other fun rules because it's not so easy.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "empty",
    showRulesContainer: true,
  },
  {
    id: "place-x-collision",
    text: "Place an x here.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "collision-setup",
    showRulesContainer: true,
    blinkTile: TUTORIAL_COLLISION_DEMO_TILE,
    spotlightTile: TUTORIAL_COLLISION_DEMO_TILE,
  },
  {
    id: "double-collision",
    text: "Since both players made an xox — it is a double collision.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "collision-done",
    showRulesContainer: true,
    chip: "collision",
  },
  {
    id: "place-o-scribble",
    text: "Place an O here.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "scribble-setup",
    showRulesContainer: true,
    blinkTile: TUTORIAL_SCRIBBLE_DEMO_TILE,
    spotlightTile: TUTORIAL_SCRIBBLE_DEMO_TILE,
  },
  {
    id: "scribble-draw",
    text: "If both players chose the same square — it is a scribble draw. A dead tile.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "scribble-done",
    showRulesContainer: true,
    chip: "scribble",
    spotlightTile: TUTORIAL_SCRIBBLE_DEMO_TILE,
  },
  {
    id: "best-of",
    text: "You need to win majority rounds in best of three or five to win a game.",
    advance: "tap-or-10s",
    overlay: "none",
    frame: "best-of",
    showRulesContainer: true,
  },
  {
    id: "emoji-wheel",
    text: "Tap an emoji to send a reaction — it shows up as a thought cloud on your profile.",
    advance: "emoji-react",
    overlay: "none",
    frame: "empty",
    showRulesContainer: false,
  },
  {
    id: "good-luck",
    text: "Remember first one to XOX wins. Good luck!",
    advance: "start-game",
    overlay: "none",
    frame: "empty",
    showRulesContainer: false,
  },
];

export function tutorialBaseState(): GameState {
  return {
    board: emptyBoard(),
    round: 1,
    phase: "placing",
    timerStart: null,
    duration: 5000,
    myTentative: null,
    roundStarted: false,
    idleWarning: false,
    oppMove: null,
    lastReveal: null,
    winner: null,
    tieRound: null,
    progressYou: 0,
    progressOpp: 0,
    match: { you: 0, opp: 0, history: [] },
    matchTarget: 3,
    matchOver: false,
  };
}
