/**
 * TutorialDimOverlay — full-frame scrim for intro (`except-rules` mode).
 * TutorialRulesContainer must paint above this (z-40+ vs z-20).
 * Feature-local — not GameScreen InkPourOverlay.
 */
import { motion } from "motion/react";
import type { TutorialOverlayMode } from "./tutorialSteps";

type TutorialDimOverlayProps = {
  mode: TutorialOverlayMode;
  /** When true, taps on the scrim advance tap-or-10s steps. */
  tappable?: boolean;
  onTap?: () => void;
};

export function TutorialDimOverlay({
  mode,
  tappable = false,
  onTap,
}: TutorialDimOverlayProps) {
  if (mode === "none") return null;

  return (
    <motion.div
      key="tutorial-dim"
      data-tutorial-dim-overlay={mode}
      className="fixed inset-0 z-20 bg-black/55"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ pointerEvents: tappable ? "auto" : "none" }}
      aria-hidden={!tappable}
      onClick={tappable ? onTap : undefined}
    />
  );
}
