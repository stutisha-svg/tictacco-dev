/**
 * Figma specs — single source of truth for home CTAs.
 *
 * File: Tic-Tac-Co (Copy) · Oxryme6NyB8vGGhuFfcRjE
 *
 * Each export drives one button end-to-end:
 *   frame      → HomeCtaShell width/height
 *   paper      → HomeCtaPaper variant + placement
 *   content    → HomeCtaContentRow variant + box/inset
 *   icon       → exported SVG from Figma (28px or 48px)
 *   labelSpec  → Crayon Libre size/line-height (never truncate secondary labels)
 *
 * Paper nudge values (invite, achievements) tune kraft alignment only —
 * they do not move the icon/label row.
 */
import type { ContentLayout, LabelSpec } from "./HomeCtaContentRow";
import type { PaperLayout } from "./HomeCtaPaper";
import { SECONDARY_FRAME, SECONDARY_LABEL } from "./constants";

const HOMESCREEN = "/homescreen";

/** Component 2 — primary CTA, 279×86, 48px play icon. */
export const NEW_GAME = {
  figma: "14:935",
  id: "new-game",
  label: "NEW GAME",
  to: "/game" as const,
  frame: { width: 279, height: 86, maxWidthClass: "max-w-[92%]" },
  paper: {
    variant: "primary-strip",
    aspectWidth: 279,
    aspectHeight: 82,
  } satisfies PaperLayout,
  content: {
    variant: "inset-percent",
    inset: { top: "26.74%", right: "8.24%", bottom: "17.44%", left: "4.66%" },
    gap: 13.339,
  } satisfies ContentLayout,
  icon: { src: `${HOMESCREEN}/icon-play.svg`, size: 48 as const },
  labelSpec: {
    text: "NEW GAME",
    fontSize: 40,
    lineHeight: "26px",
    height: 34,
    width: 280,
    nowrap: true,
  } satisfies LabelSpec,
};

/** Component 3 — no route yet; paper flipped on X with manual nudge. */
export const INVITE_FRIEND = {
  figma: "14:936",
  contentFigma: "14:938",
  id: "invite-friend",
  label: "INVITE FRIEND",
  frame: SECONDARY_FRAME,
  paper: {
    variant: "invite-flipped",
    nudge: { x: -5, y: -5 },
  } satisfies PaperLayout,
  content: {
    variant: "fixed-row",
    width: 198,
    height: 35,
    gap: 12,
  } satisfies ContentLayout,
  icon: { src: `${HOMESCREEN}/icon-users.svg`, size: 28 as const },
  labelSpec: {
    text: "INVITE FRIEND",
    fontSize: SECONDARY_LABEL.fontSize,
    lineHeight: SECONDARY_LABEL.lineHeight,
    height: 25,
    width: 158,
    nowrap: true,
  } satisfies LabelSpec,
};

/** Component 4 — paper anchored to bottom edge, flipped on Y. */
export const TUTORIAL = {
  figma: "14:941",
  contentFigma: "14:943",
  paperFigma: "14:942",
  id: "tutorial",
  label: "TUTORIAL",
  to: "/tutorial" as const,
  frame: SECONDARY_FRAME,
  paper: {
    variant: "tutorial-bottom-flip-y",
    frameHeight: SECONDARY_FRAME.height,
    stripWidth: 199,
    stripHeight: 58.487,
  } satisfies PaperLayout,
  content: {
    variant: "absolute-box",
    box: { left: 9.272, top: 16.405, width: 173.323, height: 34.237 },
    gap: 12,
  } satisfies ContentLayout,
  icon: { src: `${HOMESCREEN}/icon-lightbulb.svg`, size: 28 as const },
  labelSpec: {
    text: "TUTORIAL",
    fontSize: SECONDARY_LABEL.fontSize,
    lineHeight: SECONDARY_LABEL.lineHeight,
    height: 24.251,
    nowrap: true,
  } satisfies LabelSpec,
};

/** Component 5 — wider paper (242px), flipped X+Y; content centered on paper. */
export const ACHIEVEMENTS = {
  figma: "14:946",
  contentFigma: "14:948",
  paperFigma: "14:947",
  id: "achievements",
  label: "ACHIEVEMENTS",
  to: "/achievements" as const,
  frame: SECONDARY_FRAME,
  paper: {
    variant: "achievements-centered-flip-xy",
    stripWidth: 242,
    stripHeight: 71,
    nudgeX: 0,
  } satisfies PaperLayout,
  content: {
    variant: "centered-row",
    height: 35,
    maxWidth: 220,
    gap: 12,
    paddingX: 12,
  } satisfies ContentLayout,
  icon: { src: `${HOMESCREEN}/icon-trophy.svg`, size: 28 as const },
  labelSpec: {
    text: "ACHIEVEMENTS",
    fontSize: SECONDARY_LABEL.fontSize,
    lineHeight: SECONDARY_LABEL.lineHeight,
    height: 25,
    nowrap: true,
  } satisfies LabelSpec,
};
