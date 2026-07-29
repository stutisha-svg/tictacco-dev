/**
 * Board + reaction wheel sizing.
 * See LAYOUT.md and .cursor/rules/game-chrome-layout.mdc.
 *
 * The stacked game column stays centered. The wheel does not resize it.
 */
import { SIZE } from "@/game/rules";

export const MIN_CELL_PX = 44;
export const MIN_BOARD_PX = SIZE * MIN_CELL_PX; // 352
/** Cap to the locked 390px mobile shell so the board never overflows the frame. */
export const MAX_BOARD_PX = 390;

/** Visible fraction of circle width from the right edge (~20–25%). Do not raise. */
export const WHEEL_VISIBLE_FRAC = 0.22;

/**
 * Diameter as a fraction of grid height.
 * 55% read as tiny; keep at 75%. Do not drop this without an explicit ask.
 */
export const WHEEL_GRID_FRAC = 0.75;

export function wheelDiameterForBoard(boardPx: number): number {
  return Math.round(boardPx * WHEEL_GRID_FRAC);
}

export function wheelPeekWidth(diameter: number): number {
  return Math.round(diameter * WHEEL_VISIBLE_FRAC);
}

/** Board size for the centered column — wheel must not affect this. */
export function boardSizeForViewport(viewportW: number, heightBudget: number): number {
  // Prefer the phone-frame width (390) over the full desktop window.
  const frameW = Math.min(MAX_BOARD_PX, Math.floor(viewportW));
  const capped = Math.min(MAX_BOARD_PX, frameW, Math.floor(heightBudget));
  return Math.max(MIN_BOARD_PX, capped);
}
