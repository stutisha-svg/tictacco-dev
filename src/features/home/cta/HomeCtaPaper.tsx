/**
 * Paper 17 kraft strip — bottom layer of every home CTA.
 *
 * Each Figma component uses the same texture with different placement/flip.
 * Paper is pointer-events-none; it never affects tap targets.
 */
import { BTN_PAPER, PAPER_CROP } from "./constants";

/** Discriminated union — one variant per Figma paper instance. */
export type PaperLayout =
  | {
      /** NEW GAME — full-width strip, 279×82 aspect, 4px from top. */
      variant: "primary-strip";
      aspectWidth: number;
      aspectHeight: number;
    }
  | {
      /** INVITE — extends past frame edges (-5.03% / -8.54%), mirror on X. */
      variant: "invite-flipped";
      /** Pixel nudge applied after placement; does not move label row. */
      nudge: { x: number; y: number };
    }
  | {
      /**
       * TUTORIAL — strip sits at bottom of frame (top = frameHeight),
       * then scaleY(-1) reveals the torn edge upward.
       */
      variant: "tutorial-bottom-flip-y";
      frameHeight: number;
      stripWidth: number;
      stripHeight: number;
    }
  | {
      /** ACHIEVEMENTS — 242×71 centered in frame, mirror on X and Y. */
      variant: "achievements-centered-flip-xy";
      stripWidth: number;
      stripHeight: number;
      /** Optional horizontal nudge after centering (paper only). */
      nudgeX?: number;
    };

/** Shared Paper 17 fill — same crop for every variant. */
function PaperTexture() {
  return (
    <img
      src={BTN_PAPER}
      alt=""
      draggable={false}
      className="absolute max-w-none"
      style={PAPER_CROP}
    />
  );
}

export function HomeCtaPaper({ layout }: { layout: PaperLayout }) {
  switch (layout.variant) {
    case "primary-strip":
      return (
        <div
          className="pointer-events-none absolute inset-x-0 top-1 overflow-hidden"
          style={{ aspectRatio: `${layout.aspectWidth} / ${layout.aspectHeight}` }}
          aria-hidden
        >
          <PaperTexture />
        </div>
      );

    case "invite-flipped":
      return (
        <div
          className="pointer-events-none absolute -top-px flex aspect-[279/82] items-center justify-center overflow-hidden"
          style={{
            left: "-5.03%",
            right: "-8.54%",
            transform: `translate(${layout.nudge.x}px, ${layout.nudge.y}px)`,
          }}
          aria-hidden
        >
          <div className="size-full -scale-x-100">
            <div className="relative size-full">
              <PaperTexture />
            </div>
          </div>
        </div>
      );

    case "tutorial-bottom-flip-y":
      return (
        <div
          className="pointer-events-none absolute left-0 origin-top overflow-hidden"
          style={{
            top: layout.frameHeight,
            width: layout.stripWidth,
            height: layout.stripHeight,
            transform: "scaleY(-1)",
          }}
          aria-hidden
        >
          <PaperTexture />
        </div>
      );

    case "achievements-centered-flip-xy": {
      const nudgeX = layout.nudgeX ?? 0;
      return (
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 overflow-hidden"
          style={{
            width: layout.stripWidth,
            height: layout.stripHeight,
            transform: `translate(calc(-50% + ${nudgeX}px), -50%) scale(-1, -1)`,
          }}
          aria-hidden
        >
          <PaperTexture />
        </div>
      );
    }
  }
}
