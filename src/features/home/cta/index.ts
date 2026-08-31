/**
 * Home CTA building blocks.
 *
 * Each button is three layers inside a hit target:
 *   1. HomeCtaShell   — Link or button wrapper (fixed width × height)
 *   2. HomeCtaPaper   — torn Paper 17 kraft strip (position/flip per button)
 *   3. HomeCtaContentRow — icon + Crayon Libre label (12px gap on secondary CTAs)
 *
 * Figma dimensions and node IDs live in `specs.ts`.
 * To tweak a button, edit its spec; only add code here for new layout variants.
 */
export { NewGameCta } from "./NewGameCta";
export { InviteFriendCta } from "./InviteFriendCta";
export { TutorialCta } from "./TutorialCta";
export { AchievementsCta } from "./AchievementsCta";
