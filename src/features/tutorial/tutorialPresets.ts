/**
 * tutorialPresets — static board layouts for tutorial frames only.
 * Uses the same Board cell shape as the live engine, but these helpers
 * must not be imported from GameScreen / useGameEngine.
 */
import {
  type Board,
  type Owner,
  type ShapeKind,
  emptyBoard,
  idx,
} from "@/game/rules";

export const TUTORIAL_CENTER_TILE = idx(4, 4);

/** Practice tile for early placement frames (row 3, col 4). */
export const TUTORIAL_PRACTICE_TILE = idx(3, 4);

/** Single committed placement on a live tile. */
export function tutorialTileWith(
  owner: Owner,
  shape: ShapeKind,
): { placements: { owner: Owner; shape: ShapeKind }[]; dead: boolean } {
  return { placements: [{ owner, shape }], dead: false };
}

/** Same-square collision — two placements + dead (scribble-draw lesson). */
export function tutorialDeadCollisionTile(
  youShape: ShapeKind,
  oppShape: ShapeKind,
): { placements: { owner: Owner; shape: ShapeKind }[]; dead: boolean } {
  return {
    placements: [
      { owner: "you", shape: youShape },
      { owner: "opp", shape: oppShape },
    ],
    dead: true,
  };
}

/** Empty board for the opening placement walkthrough. */
export function emptyTutorialBoard(): Board {
  return emptyBoard();
}

/**
 * Opponent piece elsewhere + your incomplete X · X on row 4.
 * Win by placing YOUR O in the middle (same-color XOX).
 */
export function tutorialBoardWinDemo(): Board {
  const board = emptyBoard();
  board[idx(4, 3)] = tutorialTileWith("you", "X");
  board[idx(4, 5)] = tutorialTileWith("you", "X");
  board[idx(2, 2)] = tutorialTileWith("opp", "O");
  return board;
}

export const TUTORIAL_WIN_DEMO_SLOT = idx(4, 4);
/** Opponent tile used for “their move / color” spotlights. */
export const TUTORIAL_OPP_DEMO_TILE = idx(2, 2);

/** Both sides one move from simultaneous XOX — collision lesson. */
export function tutorialBoardCollisionDemo(): Board {
  const board = emptyBoard();
  board[idx(3, 0)] = tutorialTileWith("you", "X");
  board[idx(3, 1)] = tutorialTileWith("you", "O");
  board[idx(5, 0)] = tutorialTileWith("opp", "X");
  board[idx(5, 1)] = tutorialTileWith("opp", "O");
  return board;
}

export const TUTORIAL_COLLISION_DEMO_TILE = idx(3, 2);

/** Sparse board for scribble-draw lesson — user collides on one tile. */
export function tutorialBoardScribbleDemo(): Board {
  const board = emptyBoard();
  board[idx(2, 2)] = tutorialTileWith("you", "X");
  board[idx(2, 6)] = tutorialTileWith("opp", "O");
  board[idx(6, 3)] = tutorialTileWith("opp", "X");
  return board;
}

export const TUTORIAL_SCRIBBLE_DEMO_TILE = idx(4, 4);
