/**
 * Tutorial step definitions — preset screens, not live gameplay.
 *
 * Each step drives overlay chrome, rules copy, and when the user may advance.
 * Tap-to-advance steps also auto-cycle after 10 seconds.
 */
import { emptyBoard, type Board } from "@/game/rules";
import type { GameState } from "@/game/useGameEngine";

export type TutorialAdvance =
  | "tap-or-10s"
  | "tap-grid"
  | "tap-spotlight"
  | "tap-spotlight-win"
  | "tap-spotlight-collision"
  | "tap-spotlight-scribble"
  | "emoji-react"
  | "start-game";

export type TutorialOverlayMode =
  | "none"
  /** Dim everything except the rules container (rules sits above overlay). */
  | "except-rules"
  /** Dim top chrome only — grid + rules stay clear. */
  | "except-grid-rules"
  /** Dim all chrome including the grid — only rules stays clear. */
  | "except-rules-only"
  /** Full-screen dim with a spotlight hole on the active tile. */
  | "spotlight-tile";

export interface TutorialStep {
  id: string;
  text: string;
  advance: TutorialAdvance;
  overlay: TutorialOverlayMode;
  /** Wait for RulesContainer scrapbook entrance before showing overlay / auto-advance. */
  waitForRulesEntrance?: boolean;
  showRulesContainer?: boolean;
  showGridTapCue?: boolean;
  blinkTile?: boolean;
  showTimer?: boolean;
  timerFadeIn?: boolean;
  showConfetti?: boolean;
  showCollisionBadge?: boolean;
  /** Apply this board when the step becomes active. */
  applyBoard?: (board: Board) => Board;
  /** Optional spotlight tile — filled at runtime for grid-tap steps. */
  spotlightTile?: number | null;
}

export const TUTORIAL_AUTO_ADVANCE_MS = 10_000;

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "intro",
    text: "Let's learn how to play tic tac co",
    advance: "tap-or-10s",
    overlay: "except-rules",
    waitForRulesEntrance: true,
    showRulesContainer: true,
  },
  {
    id: "tap-place",
    text: "Tap on the grid to start placing your shape.",
    advance: "tap-grid",
    overlay: "none",
    showRulesContainer: true,
    showGridTapCue: true,
  },
  {
    id: "tap-change",
    text: "Tap another time to change your shape.",
    advance: "tap-spotlight",
    overlay: "spotlight-tile",
    showRulesContainer: true,
    blinkTile: true,
  },
  {
    id: "timer-active",
    text: "Once you place a shape your move timer is activated.",
    advance: "tap-or-10s",
    overlay: "none",
    showRulesContainer: true,
    showTimer: true,
    timerFadeIn: true,
  },
  {
    id: "tap-erase",
    text: "Tap once more to erase your shape (and your timer pauses.)",
    advance: "tap-spotlight",
    overlay: "spotlight-tile",
    showRulesContainer: true,
    blinkTile: true,
  },
  {
    id: "how-to-win",
    text: "Let's understand how to win a round.",
    advance: "tap-or-10s",
    overlay: "except-rules-only",
    showRulesContainer: true,
  },
  {
    id: "ongoing-intro",
    text: "Let's take a look at this ongoing game. Place an x here. Place o here.",
    advance: "tap-or-10s",
    overlay: "except-rules-only",
    showRulesContainer: true,
  },
  {
    id: "ongoing-opp-move",
    text: "This is your opponent's move.",
    advance: "tap-or-10s",
    overlay: "spotlight-tile",
    showRulesContainer: true,
    spotlightTile: null,
  },
  {
    id: "ongoing-shape-color",
    text: "This is their shape color.",
    advance: "tap-or-10s",
    overlay: "spotlight-tile",
    showRulesContainer: true,
    spotlightTile: null,
  },
  {
    id: "ongoing-reveal",
    text: "Shapes reveal after both players lock in a move.",
    advance: "tap-or-10s",
    overlay: "except-grid-rules",
    showRulesContainer: true,
  },
  {
    id: "ongoing-place-o",
    text: "Place an O between the two X marks to win.",
    advance: "tap-spotlight-win",
    overlay: "spotlight-tile",
    showRulesContainer: true,
    blinkTile: true,
    spotlightTile: null,
  },
  {
    id: "you-win",
    text: "Since you formed an XOX before the opponent, you win.",
    advance: "tap-or-10s",
    overlay: "except-rules",
    showRulesContainer: true,
    showConfetti: true,
  },
  {
    id: "other-rules",
    text: "Here's some other fun rules because it's not so easy.",
    advance: "tap-or-10s",
    overlay: "except-rules",
    showRulesContainer: true,
  },
  {
    id: "place-x-collision",
    text: "Place an x here.",
    advance: "tap-spotlight-collision",
    overlay: "spotlight-tile",
    showRulesContainer: true,
    blinkTile: true,
    spotlightTile: null,
  },
  {
    id: "double-collision",
    text: "Since both players made an xox - it is a double collision.",
    advance: "tap-or-10s",
    overlay: "except-rules-only",
    showRulesContainer: true,
    showCollisionBadge: true,
  },
  {
    id: "place-o-scribble",
    text: "Place an O here.",
    advance: "tap-spotlight-scribble",
    overlay: "spotlight-tile",
    showRulesContainer: true,
    blinkTile: true,
    spotlightTile: null,
  },
  {
    id: "scribble-draw",
    text: "If both players chose the same square - it is a scribble draw. A dead tile.",
    advance: "tap-or-10s",
    overlay: "except-grid-rules",
    showRulesContainer: true,
  },
  {
    id: "best-of",
    text: "You need to win majority rounds in best of three or five to win a game.",
    advance: "tap-or-10s",
    overlay: "except-rules",
    showRulesContainer: true,
  },
  {
    id: "emoji-wheel",
    text: "Spin and tap on emojis to send emoji reactions in the game to interact with your opponents.",
    advance: "emoji-react",
    overlay: "none",
    showRulesContainer: false,
  },
  {
    id: "good-luck",
    text: "Remember first one to XOX wins. Good luck!",
    advance: "start-game",
    overlay: "none",
    showRulesContainer: false,
  },
];

/** Minimal game-state defaults for tutorial rendering — never arms idle waiting. */
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
