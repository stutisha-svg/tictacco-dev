/**
 * BoardWaitingOverlay — shown while phase is placing and the round hasn't
 * started. Skeleton shimmer over the grid + tap cue; pointer-events none so
 * tile hits still reach the board underneath.
 */
import { motion } from "motion/react";
import { SIZE } from "@/game/rules";

interface Props {
  boardPx: number;
  /** Secondary line under the waiting title. */
  hint?: string;
}

export function BoardWaitingOverlay({
  boardPx,
  hint = "tap the grid to start",
}: Props) {
  const cell = boardPx / SIZE;
  const pad = Math.max(3, cell * 0.08);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center overflow-hidden"
      aria-hidden
    >
      {/* Soft wash so the skeleton reads as a waiting state */}
      <div className="absolute inset-0 bg-[#F5F5F5]/55" />

      {/* Per-cell skeleton shimmer */}
      <div className="absolute inset-0">
        {Array.from({ length: SIZE * SIZE }, (_, i) => {
          const r = Math.floor(i / SIZE);
          const c = i % SIZE;
          return (
            <motion.div
              key={i}
              className="absolute rounded-[3px]"
              style={{
                left: c * cell + pad,
                top: r * cell + pad,
                width: cell - pad * 2,
                height: cell - pad * 2,
                background:
                  "linear-gradient(110deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.04) 90%)",
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition: ["100% 0%", "-100% 0%"],
                opacity: [0.55, 0.95, 0.55],
              }}
              transition={{
                backgroundPosition: {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: (r + c) * 0.04,
                },
                opacity: {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (r + c) * 0.04,
                },
              }}
            />
          );
        })}
      </div>

      {/* Tap cue */}
      <motion.div
        className="relative z-[1] flex max-w-[85%] flex-col items-center gap-2 px-3 text-center"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          animate={{ y: [0, 5, 0], scale: [1, 0.94, 1] }}
          transition={{ duration: 1.15, repeat: Infinity, ease: "easeInOut" }}
        >
          <TapIcon />
        </motion.div>
        <p
          className="text-[clamp(1.05rem,4.2vw,1.35rem)] leading-tight text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          your move — rival is waiting
        </p>
        <p
          className="text-[clamp(0.85rem,3.4vw,1.05rem)] leading-tight text-[var(--ink-soft)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {hint}
        </p>
      </motion.div>
    </div>
  );
}

/** Figma tap icon (2201:422) — white fill inside black borders. */
function TapIcon() {
  return (
    <div className="relative size-11 overflow-clip drop-shadow-sm" aria-hidden>
      <img
        src="/game/tap-icon.svg"
        alt=""
        draggable={false}
        width={44}
        height={44}
        className="block size-full max-w-none"
      />
    </div>
  );
}
