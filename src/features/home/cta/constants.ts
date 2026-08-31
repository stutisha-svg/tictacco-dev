/**
 * Shared tokens for home-screen kraft CTAs.
 *
 * All buttons reuse the same Paper 17 texture (`btn-paper.png`) with an identical
 * crop rect — only placement, flip, and hit-target size differ per Figma component.
 */

/** Paper 17 torn-kraft asset (exported from Figma). */
export const BTN_PAPER = "/homescreen/btn-paper.png";

/**
 * Texture crop inside the paper container.
 * Matches Figma's Paper 17 fill — do not change unless the source asset changes.
 */
export const PAPER_CROP = {
  height: "160.2%",
  width: "108.96%",
  left: "-5.38%",
  top: "-30.71%",
} as const;

/** Hit target for INVITE / TUTORIAL / ACHIEVEMENTS (Figma Components 3–5). */
export const SECONDARY_FRAME = {
  width: 199,
  height: 61.34,
} as const;

/** Label typography shared by all 28px-icon secondary buttons. */
export const SECONDARY_LABEL = {
  fontSize: 28.53,
  lineHeight: "18.545px",
} as const;

/** Micro-interaction shared by every home CTA. */
export const CTA_INTERACTION =
  "transition-transform hover:scale-[1.02] active:scale-[0.98]";

/** Standard gap between 28px icon and label (Figma Frame 1 on all secondary CTAs). */
export const SECONDARY_ICON_LABEL_GAP = 12;
