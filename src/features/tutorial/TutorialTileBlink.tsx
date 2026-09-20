/**
 * TutorialTileBlink — cream focus ring on one board cell (tutorial cue only).
 */
import { motion } from "motion/react";
import { SIZE } from "@/game/rules";

type TutorialTileBlinkProps = {
  tile: number;
  boardPx: number;
};

export function TutorialTileBlink({ tile, boardPx }: TutorialTileBlinkProps) {
  const cell = boardPx / SIZE;
  const r = Math.floor(tile / SIZE);
  const c = tile % SIZE;

  return (
    <motion.div
      className="pointer-events-none absolute z-20 rounded-[5px]"
      style={{
        left: c * cell + 3,
        top: r * cell + 3,
        width: cell - 6,
        height: cell - 6,
        border: "2.5px solid var(--paper)",
        boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--ink) 18%, transparent)",
        background: "color-mix(in oklab, var(--paper) 55%, transparent)",
      }}
      animate={{ opacity: [0.75, 0.4, 0.75] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}
