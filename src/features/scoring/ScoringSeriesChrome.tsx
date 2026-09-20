/**
 * ScoringSeriesChrome — scrapbook UI pieces used only on ScoringScreen:
 * best-of chip, win pips duel, groop XP card.
 */
import { motion } from "motion/react";

const SCORING_DISPLAY_FONT = "'Caveat', 'Patrick Hand', cursive";

/** Center “best of N” pill between the two ScoringAvatars. */
export function ScoringBestOfBadge({
  target,
  delay,
}: {
  target: number;
  delay: number;
}) {
  return (
    <motion.div
      data-scoring-best-of
      className="mt-8 flex flex-col items-center"
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 240, damping: 16 }}
    >
      <div
        className="rounded-full border-2 px-3 py-1 text-xs uppercase tracking-wide"
        style={{
          fontFamily: "var(--font-display)",
          borderColor: "var(--ink)",
          background: "rgba(255,255,255,0.55)",
          color: "var(--ink)",
        }}
      >
        best of {target}
      </div>
    </motion.div>
  );
}

/** Animated you-vs-rival pip row under the profiles. */
export function ScoringScoreDuel({
  you,
  opp,
  target,
}: {
  you: number;
  opp: number;
  target: number;
}) {
  const slots = Array.from({ length: target }, (_, i) => i);
  return (
    <motion.div
      className="mt-4 flex w-full max-w-[300px] flex-col items-center gap-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      data-scoring-duel
    >
      <div className="flex w-full items-center justify-center gap-3">
        <ScoringPipRow owner="you" filled={you} total={target} slots={slots} />
        <span
          className="text-xl font-bold"
          style={{ fontFamily: SCORING_DISPLAY_FONT, color: "var(--ink)" }}
        >
          vs
        </span>
        <ScoringPipRow owner="opp" filled={opp} total={target} slots={slots} />
      </div>
    </motion.div>
  );
}

function ScoringPipRow({
  owner,
  filled,
  total,
  slots,
}: {
  owner: "you" | "opp";
  filled: number;
  total: number;
  slots: number[];
}) {
  const color = owner === "you" ? "var(--player-you)" : "var(--player-opp)";
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`${owner} ${filled} of ${total}`}
      data-scoring-pips={owner}
    >
      {slots.map((i) => (
        <motion.span
          key={i}
          className="inline-block size-3 rounded-full border-2"
          style={{
            borderColor: "var(--ink)",
            background: i < filled ? color : "transparent",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.7 + i * 0.12,
            type: "spring",
            stiffness: 320,
            damping: 14,
          }}
        />
      ))}
    </div>
  );
}

/** Hand-drawn groop XP sheet — “earned this series”. */
export function ScoringGroopXpCard({
  xp,
  delay,
}: {
  xp: number;
  delay: number;
}) {
  return (
    <motion.div
      className="relative mt-6 w-full max-w-[300px]"
      initial={{ y: 16, opacity: 0, rotate: 2 }}
      animate={{ y: 0, opacity: 1, rotate: 0.5 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 18 }}
      data-scoring-groop-xp
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 300 88"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="scoring-xp-rough" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        <g filter="url(#scoring-xp-rough)">
          <path
            d="M 12 18 Q 8 8 24 6 L 280 10 Q 294 14 290 32 L 292 68 Q 288 82 268 80 L 28 84 Q 10 78 12 58 Z"
            fill="rgba(255,255,255,0.55)"
            stroke="var(--ink)"
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <path
            d="M 22 26 L 272 22 L 274 70 L 26 74 Z"
            fill="none"
            stroke="var(--accent-purple)"
            strokeWidth={1.6}
            strokeDasharray="5 4"
          />
        </g>
      </svg>
      <div className="relative flex items-center justify-between gap-3 px-6 py-5">
        <div>
          <p
            className="text-xs uppercase tracking-wide"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--accent-purple)",
            }}
          >
            groop XP
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--ink-soft)",
            }}
          >
            earned this series
          </p>
        </div>
        <motion.p
          className="text-3xl font-bold tabular-nums"
          style={{ fontFamily: SCORING_DISPLAY_FONT, color: "var(--ink)" }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: delay + 0.2,
            type: "spring",
            stiffness: 260,
            damping: 14,
          }}
        >
          +{xp}
        </motion.p>
      </div>
    </motion.div>
  );
}
