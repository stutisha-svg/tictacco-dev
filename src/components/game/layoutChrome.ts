/**
 * Board + reaction wheel sizing.
 * See LAYOUT.md and .cursor/rules/game-chrome-layout.mdc.
 *
 * Peek height is locked to the board. Diameter is solved so the *visible*
 * arc chord under the grid spans WHEEL_CHORD_FRAC of the grid — a shallow
 * peek of a larger circle. Setting diameter = 0.95×board looks unchanged
 * because only a thin slice shows.
 */
import { SIZE } from "@/game/rules";

export const MIN_CELL_PX = 44;
export const MIN_BOARD_PX = SIZE * MIN_CELL_PX; // 352
/** Cap to the locked 390px mobile shell so the board never overflows the frame. */
export const MAX_BOARD_PX = 390;

/**
 * Visible arc width as a fraction of grid width (what you actually see).
 * This is not the full circle diameter — diameter is derived from this + peek.
 */
export const WHEEL_CHORD_FRAC = 0.88;

/**
 * Peek height as a fraction of board — locked so the arc does not grow taller.
 * (Same as the old 0.3 × 0.75 diameter peek.)
 */
export const WHEEL_PEEK_OF_BOARD = 0.3 * 0.75; // 0.225

/**
 * Must match ReactionWheel: drawn radius = (diameter - BTN) / 2 + 10
 * → r = diameter/2 - DRAW_R_INSET
 */
const WHEEL_BTN = 44;
const WHEEL_STROKE_PAD = 10;
const DRAW_R_INSET = WHEEL_BTN / 2 - WHEEL_STROKE_PAD; // 12

/** @deprecated Use WHEEL_CHORD_FRAC — kept so old imports don't break. */
export const WHEEL_GRID_FRAC = WHEEL_CHORD_FRAC;

/** @deprecated Peek is board-based, not diameter-based. */
export const WHEEL_VISIBLE_FRAC = WHEEL_PEEK_OF_BOARD / WHEEL_CHORD_FRAC;

/** Height of the visible peek strip under the board (independent of diameter). */
export function wheelPeekHeightForBoard(boardPx: number): number {
  return Math.round(boardPx * WHEEL_PEEK_OF_BOARD);
}

/**
 * Full circle diameter so the clipped bottom arc spans `WHEEL_CHORD_FRAC`
 * of the grid at the top of the peek strip.
 *
 * halfChord² = (H − inset)(D − H − inset)
 * ⇒ D = halfChord² / (H − inset) + H + inset
 */
export function wheelDiameterForBoard(boardPx: number): number {
  const H = wheelPeekHeightForBoard(boardPx);
  const halfChord = (boardPx * WHEEL_CHORD_FRAC) / 2;
  const denom = Math.max(1, H - DRAW_R_INSET);
  const D = (halfChord * halfChord) / denom + H + DRAW_R_INSET;
  // Diameter is larger than the board (shallow peek of a big circle); that's intended.
  return Math.max(boardPx, Math.round(D));
}

/** @deprecated Prefer wheelPeekHeightForBoard(boardPx). */
export function wheelPeekHeight(boardPx: number): number {
  return wheelPeekHeightForBoard(boardPx);
}

/** @deprecated Use wheelPeekHeightForBoard. */
export function wheelPeekWidth(diameter: number): number {
  return wheelPeekHeight(diameter);
}

/** Board size for the centered column — wheel must not affect this. */
export function boardSizeForViewport(viewportW: number, heightBudget: number): number {
  // Prefer the phone-frame width (390) over the full desktop window.
  const frameW = Math.min(MAX_BOARD_PX, Math.floor(viewportW));
  const capped = Math.min(MAX_BOARD_PX, frameW, Math.floor(heightBudget));
  return Math.max(MIN_BOARD_PX, capped);
}
