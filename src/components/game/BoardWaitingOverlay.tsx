/**
 * BoardWaitingOverlay — shown while phase is placing and the round hasn't
 * started. Skeleton shimmer over the grid + tap cue; pointer-events none so
 * tile hits still reach the board underneath.
 */
import { motion } from "motion/react";
import { SIZE } from "@/game/rules";

interface Props {
  boardPx: number;
}

export function BoardWaitingOverlay({ boardPx }: Props) {
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
          tap the grid to start
        </p>
      </motion.div>
    </div>
  );
}

/** Hand-drawn tap / finger cue — not Unicode emoji. */
function TapIcon() {
  return (
    <svg
      width={56}
      height={56}
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden
      className="drop-shadow-sm"
    >
      <g filter="url(#tap-rough)">
        {/* ripple rings */}
        <circle
          cx={22}
          cy={18}
          r={10}
          stroke="var(--ink-brown)"
          strokeWidth={2.2}
          strokeOpacity={0.35}
          fill="none"
        />
        <circle
          cx={22}
          cy={18}
          r={5}
          stroke="var(--ink)"
          strokeWidth={2}
          fill="rgba(255,255,255,0.85)"
        />
        {/* finger / hand */}
        <path
          d="M26 22c1.2-3.5 4.8-5.2 8.2-3.8 2.2.9 3.6 3.1 3.5 5.5l-.4 14.2c-.1 2.8-2.4 5-5.2 5.1h-.3c-2.6.1-4.8-1.9-5.1-4.5l-1.2-9.2c-.3-1.9-2-3.2-3.9-3.1-1.6.1-2.9 1.3-3.1 2.9l-.8 7.4"
          stroke="var(--ink)"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(255,255,255,0.92)"
        />
        <path
          d="M18.5 34.5c-.4 2.8.4 5.6 2.4 7.6 2.2 2.2 5.3 3.2 8.4 2.8"
          stroke="var(--ink-brown)"
          strokeWidth={2.2}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <defs>
        <filter id="tap-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
        </filter>
      </defs>
    </svg>
  );
}
