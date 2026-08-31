/**
 * Tap cue for the tutorial grid — icon + hint without the idle skeleton shimmer.
 */
import { motion } from "motion/react";

type TutorialGridTapCueProps = {
  hint?: string;
};

export function TutorialGridTapCue({
  hint = "tap the grid to start",
}: TutorialGridTapCueProps) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
      aria-hidden
    >
      <motion.div
        className="flex max-w-[85%] flex-col items-center gap-2 px-3 text-center"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0], scale: [1, 0.94, 1] }}
          transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="/game/tap-icon.svg"
            alt=""
            draggable={false}
            width={44}
            height={44}
            className="block size-11 drop-shadow-sm"
          />
        </motion.div>
        <p
          className="text-[clamp(1.05rem,4.2vw,1.35rem)] leading-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hint}
        </p>
      </motion.div>
    </div>
  );
}
