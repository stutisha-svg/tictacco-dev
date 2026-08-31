/**
 * TutorialDimOverlay — translucent black scrim behind the rules container.
 *
 * Visible immediately on mount (no fade-in). Dissolves only on step exit.
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
      className="fixed inset-0 z-20 bg-black/55"
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{ pointerEvents: tappable ? "auto" : "none" }}
      aria-hidden={!tappable}
      onClick={tappable ? onTap : undefined}
      data-tutorial-overlay={mode}
    />
  );
}
