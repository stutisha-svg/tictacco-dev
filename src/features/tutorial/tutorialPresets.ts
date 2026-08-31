/**
 * Preset board layouts for scripted tutorial steps.
 * Uses the same `Board` type as the live game engine.
 */
import {
  type Board,
  type Owner,
  type ShapeKind,
  emptyBoard,
  idx,
} from "@/game/rules";

export const TUTORIAL_CENTER_TILE = idx(4, 4);

export function tileWith(
  owner: Owner,
  shape: ShapeKind,
): { placements: { owner: Owner; shape: ShapeKind }[]; dead: boolean } {
  return { placements: [{ owner, shape }], dead: false };
}

export function deadCollisionTile(
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
 * Opponent X — · — X on row 4; user completes with O at center to win.
 * Figma demo: "place an O between the two X of theirs".
 */
export function boardWinDemo(): Board {
  const board = emptyBoard();
  board[idx(4, 3)] = tileWith("opp", "X");
  board[idx(4, 5)] = tileWith("opp", "X");
  return board;
}

export const WIN_DEMO_SLOT = idx(4, 4);

/** Both sides one move from simultaneous XOX — collision lesson. */
export function boardCollisionDemo(): Board {
  const board = emptyBoard();
  // You: X-O-· on row 3
  board[idx(3, 0)] = tileWith("you", "X");
  board[idx(3, 1)] = tileWith("you", "O");
  // Opp: X-O-· on row 5
  board[idx(5, 0)] = tileWith("opp", "X");
  board[idx(5, 1)] = tileWith("opp", "O");
  return board;
}

export const COLLISION_DEMO_TILE = idx(3, 2);

/** Sparse board for scribble-draw lesson — user collides on one tile. */
export function boardScribbleDemo(): Board {
  const board = emptyBoard();
  board[idx(2, 2)] = tileWith("you", "X");
  board[idx(2, 6)] = tileWith("opp", "O");
  board[idx(6, 3)] = tileWith("opp", "X");
  return board;
}

export const SCRIBBLE_DEMO_TILE = idx(4, 4);
