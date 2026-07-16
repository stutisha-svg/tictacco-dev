import { AnimatePresence, motion } from "motion/react";
import { CrayonDefs } from "./CrayonDefs";
import { Shape } from "./Shape";
import type { Owner } from "@/game/rules";

interface Props {
  progressYou: number; // 0..3
  progressOpp: number; // 0..3
  leader: Owner | null;
}

const SEQ = ["X", "O", "X"] as const;

/** Tiny crayon burst that fires when a slot lights up. */
function SlotBurst({ color, size }: { color: string; size: number }) {
  const glyphs = ["x", "o", "~", "x", "o", "~"];
  return (
    <>
      {glyphs.map((g, i) => {
        const angle = (i / glyphs.length) * Math.PI * 2;
        const dist = size * 0.9;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        return (
          <motion.span
            key={i}
            className="pointer-events-none absolute left-1/2 top-1/2 select-none"
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6, rotate: 0 }}
            animate={{
              x: dx,
              y: dy,
              opacity: [1, 1, 0],
              scale: [0.6, 1.1, 0.9],
              rotate: (i % 2 === 0 ? 1 : -1) * 180,
            }}
            transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.02 }}
            style={{
              color,
              fontFamily: "var(--font-display)",
              fontStyle: "normal",
              fontWeight: 700,
              fontSize: size * 0.45,
              lineHeight: 1,
              transform: "translate(-50%, -50%)",
            }}
          >
            {g}
          </motion.span>
        );
      })}
    </>
  );
}

export function XoxIndicator({ progressYou, progressOpp, leader }: Props) {
  const size = 46;
  return (
    <div className="flex items-center gap-2 px-2">
      {SEQ.map((s, i) => {
        const youLit = progressYou > i;
        const oppLit = progressOpp > i;
        const isMiddle = i === 1;
        let owner: Owner | null = null;
        let lit = false;
        if (isMiddle) {
          if (leader === "you" && progressYou >= 2) {
            owner = "you";
            lit = true;
          } else if (leader === "opp" && progressOpp >= 2) {
            owner = "opp";
            lit = true;
          }
        } else if (i === 0) {
          owner = "you";
          lit = youLit;
        } else {
          owner = "opp";
          lit = oppLit;
        }
        const color =
          owner === "you"
            ? "var(--player-you)"
            : owner === "opp"
              ? "var(--player-opp)"
              : "var(--ink-soft)";
        // subtle "breathing" on the next-to-fill leader slot to draw the eye
        const isNextForLeader =
          !lit &&
          ((leader === "you" && i === 0 && progressYou === 0) ||
            (leader === "you" && isMiddle && progressYou === 2) ||
            (leader === "opp" && i === 2 && progressOpp === 0) ||
            (leader === "opp" && isMiddle && progressOpp === 2));

        return (
          <motion.div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
            animate={
              lit
                ? { scale: [1, 1.28, 1] }
                : isNextForLeader
                  ? { scale: [1, 1.06, 1] }
                  : { scale: 1 }
            }
            transition={
              lit
                ? { duration: 0.55, ease: "easeOut" }
                : { duration: 1.6, repeat: isNextForLeader ? Infinity : 0 }
            }
          >
            {/* radial flash halo behind the shape when it just lit up */}
            <AnimatePresence>
              {lit && (
                <motion.span
                  key={`halo-${i}-${owner}`}
                  className="pointer-events-none absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
                  }}
                  initial={{ opacity: 0.9, scale: 0.4 }}
                  animate={{ opacity: 0, scale: 1.8 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>

            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              style={{ overflow: "visible", position: "relative" }}
            >
              <CrayonDefs />
              {/* base grey shape (dimmed when lit) */}
              <g style={{ opacity: lit ? 0 : 0.85 }}>
                <Shape shape={s} owner="you" size={size} draw={false} seed={i + 33} tentative />
              </g>
              {lit && owner && (
                <Shape shape={s} owner={owner} size={size} draw={true} seed={i + 33} />
              )}
            </svg>

            {/* Mini confetti burst emitted with the light-up */}
            <AnimatePresence>
              {lit && (
                <div key={`burst-${i}-${owner}`} className="absolute inset-0">
                  <SlotBurst color={color} size={size} />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
