/**
 * TutorialEmojiStep — emoji wheel lesson with modal + blinking halo.
 * Replaces the rules container for the final interactive steps.
 */
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ReactionWheel } from "@/components/game/ReactionWheel";
import type { Reaction } from "@/components/game/reactions";
import {
  wheelDiameterForBoard,
  wheelPeekHeightForBoard,
} from "@/components/game/layoutChrome";

type TutorialEmojiStepProps = {
  boardPx: number;
  modalText: string;
  showStartButton: boolean;
  onReact: (reaction: Reaction) => void;
};

export function TutorialEmojiStep({
  boardPx,
  modalText,
  showStartButton,
  onReact,
}: TutorialEmojiStepProps) {
  const peekH = wheelPeekHeightForBoard(boardPx);
  const wheelDiameter = wheelDiameterForBoard(boardPx);

  return (
    <>
      <div className="fixed inset-0 z-[52] bg-black/55" aria-hidden />

      <motion.div
        className="fixed inset-x-0 bottom-0 z-[54] mx-auto flex w-full max-w-[390px] flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          className="relative mx-4 mb-3 w-[min(92%,340px)] rounded-2xl border-2 px-4 py-4 text-center shadow-lg"
          style={{
            borderColor: "var(--ink)",
            background: "var(--paper)",
            fontFamily: "var(--font-display)",
          }}
        >
          <p className="text-[clamp(0.95rem,3.8vw,1.1rem)] leading-snug text-[var(--ink)]">
            {modalText}
          </p>
          {showStartButton && (
            <Link
              to="/game"
              className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-full border-2 px-6 py-2 text-sm transition-transform active:scale-[0.97]"
              style={{
                borderColor: "var(--ink)",
                background: "var(--ink)",
                color: "var(--paper)",
                fontFamily: "var(--font-display)",
              }}
            >
              start game
            </Link>
          )}
        </div>

        <div
          className="relative mx-auto w-full shrink-0 overflow-hidden"
          style={{ height: peekH, width: boardPx }}
        >
          <motion.div
            className="absolute rounded-full"
            animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.04, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              boxShadow: "0 0 0 3px rgba(255,255,200,0.65), 0 0 18px rgba(255,230,120,0.45)",
              pointerEvents: "none",
              top: "55%",
              left: "50%",
              width: "88%",
              height: peekH * 1.6,
              transform: "translate(-50%, -20%)",
            }}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
            className="relative size-full"
          >
            <ReactionWheel
              onReact={onReact}
              interactive
              diameter={wheelDiameter}
              peekHeight={peekH}
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
