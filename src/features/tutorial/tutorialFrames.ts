/**
 * tutorialFrames — builds static GameState snapshots for each TutorialFrameId.
 * Boards are display-only; TutorialScreen never calls engine tap/reveal.
 */
import { emptyBoard, idx } from "@/game/rules";
import type { GameState } from "@/game/useGameEngine";
import {
  emptyTutorialBoard,
  tutorialBoardCollisionDemo,
  tutorialBoardScribbleDemo,
  tutorialBoardWinDemo,
  tutorialDeadCollisionTile,
  tutorialTileWith,
  TUTORIAL_COLLISION_DEMO_TILE,
  TUTORIAL_PRACTICE_TILE,
  TUTORIAL_SCRIBBLE_DEMO_TILE,
  TUTORIAL_WIN_DEMO_SLOT,
} from "./tutorialPresets";

export type TutorialFrameId =
  | "empty"
  | "tap-cue"
  | "shape-x"
  | "shape-o-timer"
  | "shape-cleared"
  | "win-setup"
  | "win-opp-spotlight"
  | "win-your-x"
  | "win-place-o"
  | "win-complete"
  | "collision-setup"
  | "collision-done"
  | "scribble-setup"
  | "scribble-done"
  | "best-of";

function tutorialBaseFrameState(): GameState {
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

export function buildTutorialFrame(frame: TutorialFrameId): GameState {
  const base = tutorialBaseFrameState();

  switch (frame) {
    case "empty":
    case "tap-cue":
      return { ...base, board: emptyTutorialBoard() };

    case "shape-x":
      return {
        ...base,
        board: emptyTutorialBoard(),
        myTentative: { tile: TUTORIAL_PRACTICE_TILE, shape: "X" },
        roundStarted: true,
      };

    case "shape-o-timer":
      return {
        ...base,
        board: emptyTutorialBoard(),
        myTentative: { tile: TUTORIAL_PRACTICE_TILE, shape: "O" },
        roundStarted: true,
        timerStart: Date.now(),
      };

    case "shape-cleared":
      return {
        ...base,
        board: emptyTutorialBoard(),
        myTentative: null,
        roundStarted: true,
      };

    case "win-setup":
    case "win-opp-spotlight":
    case "win-your-x":
      return {
        ...base,
        board: tutorialBoardWinDemo(),
        progressYou: 2,
        progressOpp: 1,
        roundStarted: true,
      };

    case "win-place-o":
      return {
        ...base,
        board: tutorialBoardWinDemo(),
        myTentative: { tile: TUTORIAL_WIN_DEMO_SLOT, shape: "O" },
        progressYou: 2,
        progressOpp: 1,
        roundStarted: true,
      };

    case "win-complete": {
      const board = tutorialBoardWinDemo();
      board[TUTORIAL_WIN_DEMO_SLOT] = tutorialTileWith("you", "O");
      return {
        ...base,
        board,
        phase: "won",
        winner: {
          owner: "you",
          line: [idx(4, 3), TUTORIAL_WIN_DEMO_SLOT, idx(4, 5)],
        },
        progressYou: 3,
        progressOpp: 1,
      };
    }

    case "collision-setup":
      return {
        ...base,
        board: tutorialBoardCollisionDemo(),
        myTentative: { tile: TUTORIAL_COLLISION_DEMO_TILE, shape: "X" },
        roundStarted: true,
      };

    case "collision-done": {
      const board = tutorialBoardCollisionDemo();
      board[TUTORIAL_COLLISION_DEMO_TILE] = tutorialTileWith("you", "X");
      board[idx(5, 2)] = tutorialTileWith("opp", "X");
      // Tie-dead scribbles only render when dead=true (same as post-badge game state).
      const tieTiles = [
        idx(3, 0),
        idx(3, 1),
        TUTORIAL_COLLISION_DEMO_TILE,
        idx(5, 0),
        idx(5, 1),
        idx(5, 2),
      ];
      for (const t of tieTiles) {
        const cell = board[t];
        if (cell) board[t] = { ...cell, dead: true };
      }
      return {
        ...base,
        board,
        phase: "revealing",
        progressYou: 3,
        progressOpp: 3,
        tieRound: {
          tiles: tieTiles,
          lines: [
            [idx(3, 0), idx(3, 1), TUTORIAL_COLLISION_DEMO_TILE],
            [idx(5, 0), idx(5, 1), idx(5, 2)],
          ],
        },
      };
    }

    case "scribble-setup":
      return {
        ...base,
        board: tutorialBoardScribbleDemo(),
        myTentative: { tile: TUTORIAL_SCRIBBLE_DEMO_TILE, shape: "O" },
        roundStarted: true,
      };

    case "scribble-done": {
      const board = tutorialBoardScribbleDemo();
      board[TUTORIAL_SCRIBBLE_DEMO_TILE] = tutorialDeadCollisionTile("O", "X");
      return {
        ...base,
        board,
        phase: "revealing",
        oppMove: { tile: TUTORIAL_SCRIBBLE_DEMO_TILE, shape: "X" },
        lastReveal: {
          mine: { tile: TUTORIAL_SCRIBBLE_DEMO_TILE, shape: "O" },
          opp: { tile: TUTORIAL_SCRIBBLE_DEMO_TILE, shape: "X" },
          collision: true,
        },
      };
    }

    case "best-of":
      return {
        ...base,
        board: emptyTutorialBoard(),
        match: { you: 1, opp: 0, history: ["you"] },
        matchTarget: 3,
      };

    default:
      return base;
  }
}
