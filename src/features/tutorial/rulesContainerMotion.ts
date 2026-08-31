/**
 * Entrance motion for RulesContainer.
 *
 * Matches Canva's "Scrapbook" preset: the panel rises from below the fold
 * with a brief counter-clockwise tilt that settles flat — like a kraft scrap
 * landing on the page. Runs over 4s so the entrance reads clearly on open.
 */
export const RULES_SCRAPBOOK_ENTER = {
  initial: { y: "100%", opacity: 0.92, rotate: -2.5 },
  animate: {
    y: ["100%", "3%", 0],
    opacity: [0.92, 1, 1],
    rotate: [-2.5, 1.25, 0],
  },
  transition: {
    duration: 4,
    times: [0, 0.72, 1],
    ease: [0.22, 1, 0.36, 1],
  },
} as const;

/** Pivot at the bottom edge so the tilt reads as the panel lifting into place. */
export const RULES_MOTION_ORIGIN = "bottom center";
