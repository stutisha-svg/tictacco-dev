/**
 * Figma layout for RulesContainer — tutorial screen (407×874 frame).
 *
 * Container origin = Paper 07 top-left (Figma y=666). Frame border top is local y=56;
 * the Paper 07 fill crop positions the torn kraft edge on that same line.
 *
 * Layers (bottom → top):
 *   2233:707  Paper 07       — pink torn kraft background
 *   2233:712  Vector 22      — hand-drawn content frame border
 *   2233:714  Vector 23      — top-left corner bracket
 *   2233:715  Vector 24      — left side bracket
 *   2233:754  Star (left)    — flanks "RULES" title
 *   2233:730  RULES label
 *   2233:750  Star (right)
 */
export const RULES_DESIGN_W = 407;

/** Paper 07 height in Figma px — width scales with the 407px design frame. */
export const RULES_CONTAINER_H = 220;

/** Paint order for composited layers inside the panel. */
export const RULES_LAYER_Z = {
  paper: 0,
  frame: 1,
  header: 1,
  brackets: 2,
  content: 2,
} as const;

export type RulesBoxSpec = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type RulesImageSpec = RulesBoxSpec & {
  /** Figma export inset on the SVG/PNG canvas (top right bottom left). */
  imgInset: string;
};

/** Paper 07 node — Figma 2233:707 (x=-14 y=666 w=431 h=220 in the 407×874 frame). */
export const PAPER_07: RulesBoxSpec = {
  left: -14,
  top: 0,
  width: 431,
  height: 220,
};

/** Image fill crop inside Paper 07 — exact Figma export; do not replace with object-cover. */
export const PAPER_07_CROP = {
  height: "261.7%",
  width: "131.09%",
  left: "-18.79%",
  top: "-0.17%",
} as const;

export const RULES_ASSETS = {
  paper: "/tutorial/rules/paper-07.png",
  frameBorder: "/tutorial/rules/frame-border.svg",
  cornerBracket: "/tutorial/rules/corner-bracket.svg",
  sideBracket: "/tutorial/rules/side-bracket.svg",
  star: "/tutorial/rules/star.svg",
} as const;

/** Content frame border — Vector 22; spans full 407px design width. */
export const FRAME_BORDER: RulesBoxSpec = {
  left: 0,
  top: 56,
  width: RULES_DESIGN_W,
  height: 152,
};

/** Figma export inset on the frame-border SVG canvas. */
export const FRAME_BORDER_INSET = "-1.73% -0.69% -1.7% -0.7%";

/**
 * Top-left corner bracket — Vector 23 (Figma x≈0.91 y≈722.5).
 * Nudged +15px right from Figma to meet the side bracket join.
 */
export const CORNER_BRACKET: RulesImageSpec = {
  left: 15.91,
  top: 56.48,
  width: 106.51,
  height: 136.67,
  imgInset: "-1.83% -1.95% -1.66% -2.38%",
};

/** Left side bracket — Vector 24 (Figma x≈0 y≈729 local). */
export const SIDE_BRACKET: RulesImageSpec = {
  left: 0,
  top: 63,
  width: 36.18,
  height: 123.24,
  imgInset: "-1.84% -5.96% -1.71% -5.15%",
};

/** "RULES" title row — stars + label sit above the content slot. */
export const RULES_HEADER = {
  starLeft: { left: 120, top: 68, size: 36 },
  starRight: { left: 248, top: 74, size: 36 },
  /** Figma 2233:730 — Crayon Libre with ink outline + slight tilt. */
  label: {
    left: 160.5,
    top: 72,
    width: 128,
    height: 32,
    fontSize: 32,
    color: "rgba(0, 0, 0, 0.31)",
    rotation: 3.58,
    stroke: "var(--ink)",
    strokeWidth: 3,
  },
  starImgInset: "8.29% 8.27% 8.39% 8.41%",
} as const;

/** Inner padding below the RULES header for `{children}`. */
export const CONTENT_INSET = {
  top: 104,
  left: 12,
  right: 12,
  bottom: 12,
} as const;

/** Scale a Figma X coordinate to a percentage of design width. */
export function rulesPctX(px: number): string {
  return `${(px / RULES_DESIGN_W) * 100}%`;
}

/** Scale a Figma dimension to a percentage of design width. */
export function rulesPctW(px: number): string {
  return `${(px / RULES_DESIGN_W) * 100}%`;
}

/** Scale a Figma Y coordinate to a percentage of container height. */
export function rulesPctY(px: number): string {
  return `${(px / RULES_CONTAINER_H) * 100}%`;
}

/** Scale a Figma height to a percentage of container height. */
export function rulesPctH(px: number): string {
  return `${(px / RULES_CONTAINER_H) * 100}%`;
}

/** Map a Figma box spec to absolute percentage positioning. */
export function rulesBoxStyle(spec: RulesBoxSpec): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  return {
    left: rulesPctX(spec.left),
    top: rulesPctY(spec.top),
    width: rulesPctW(spec.width),
    height: rulesPctH(spec.height),
  };
}

/** Parse a four-value CSS inset string into an object for inline styles. */
export function parseInset(inset: string): {
  top: string;
  right: string;
  bottom: string;
  left: string;
} {
  const [top, right, bottom, left] = inset.split(" ");
  return { top, right, bottom, left };
}
