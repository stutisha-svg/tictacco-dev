/** Blinking ring on the active tutorial tile. */
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
      className="pointer-events-none absolute z-20 rounded-[4px] border-[3px] border-[var(--ink)]"
      style={{
        left: c * cell + 2,
        top: r * cell + 2,
        width: cell - 4,
        height: cell - 4,
      }}
      animate={{ opacity: [1, 0.25, 1], scale: [1, 1.03, 1] }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}
