/**
 * ScoringAvatar — large sketch profile for ScoringScreen only.
 * Crown draw reuses GameScreen’s Crown component (shared visual, scoring-owned layout).
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown } from "@/components/game/Crown";

type ScoringAvatarProps = {
  owner: "you" | "opp";
  name: string;
  score: number;
  crowned: boolean;
  /** Stagger for enter animation. */
  delay?: number;
};

export function ScoringAvatar({
  owner,
  name,
  score,
  crowned,
  delay = 0,
}: ScoringAvatarProps) {
  const color = owner === "you" ? "var(--player-you)" : "var(--player-opp)";
  const size = 96;
  const purpleBg =
    owner === "you"
      ? "var(--accent-purple)"
      : "color-mix(in oklab, var(--accent-purple) 55%, transparent)";

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      data-scoring-avatar={owner}
      initial={{ y: 28, opacity: 0, scale: 0.85 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay }}
    >
      <div
        className="relative"
        style={{ width: size, height: size, overflow: "visible" }}
      >
        <AnimatePresence>
          {crowned && (
            <div
              key="crown-wrap"
              className="pointer-events-none absolute"
              style={{
                top: -size * 0.55,
                left: "50%",
                width: 0,
                height: 0,
              }}
            >
              <motion.div
                style={{
                  width: size * 0.9,
                  height: size * 0.7,
                  marginLeft: -(size * 0.9) / 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
                initial={{ y: 8, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.55, duration: 0.35 }}
              >
                <Crown color={color} size={size * 0.8} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.div
          animate={crowned ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={
            crowned
              ? {
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delay + 0.8,
                }
              : undefined
          }
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible"
          >
            <defs>
              <filter
                id={`score-av-${owner}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.7"
                  numOctaves="2"
                  seed={owner === "you" ? 4 : 9}
                />
                <feDisplacementMap in="SourceGraphic" scale="2.2" />
              </filter>
            </defs>
            <g filter={`url(#score-av-${owner})`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 6}
                fill="rgba(255,255,255,0.35)"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 6}
                fill="none"
                stroke={color}
                strokeWidth={4}
              />
              {owner === "you" ? (
                <ScoringBugMark size={size} color={color} />
              ) : (
                <ScoringRocketMark size={size} color={color} />
              )}
            </g>
          </svg>
        </motion.div>
      </div>

      <div
        className="text-lg font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        {name}
      </div>

      <motion.div
        className="flex min-w-[72px] items-center justify-center gap-1 rounded-full px-3 py-1"
        style={{
          background: purpleBg,
          color: "var(--paper)",
          fontFamily: "var(--font-display)",
        }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: delay + 0.35,
          type: "spring",
          stiffness: 260,
          damping: 16,
        }}
      >
        <span className="text-2xl font-bold tabular-nums leading-none">
          <ScoringCountUp to={score} delay={delay + 0.45} />
        </span>
        <span className="text-sm opacity-80">wins</span>
      </motion.div>
    </motion.div>
  );
}

/** Count from 0 → target after delay (ScoringAvatar win pill). */
function ScoringCountUp({ to, delay }: { to: number; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const startAt = performance.now() + delay * 1000;
    const dur = 900;
    const tick = (now: number) => {
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (now - startAt) / dur);
      const eased = 1 - (1 - t) * (1 - t);
      setN(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, delay]);
  return <>{n}</>;
}

function ScoringBugMark({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <g
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <ellipse
        cx={s / 2}
        cy={s * 0.52}
        rx={s * 0.18}
        ry={s * 0.22}
        fill={color}
        fillOpacity={0.15}
      />
      <line x1={s * 0.32} y1={s * 0.38} x2={s * 0.22} y2={s * 0.28} />
      <line x1={s * 0.68} y1={s * 0.38} x2={s * 0.78} y2={s * 0.28} />
      <circle cx={s * 0.42} cy={s * 0.48} r={s * 0.03} fill={color} />
      <circle cx={s * 0.58} cy={s * 0.48} r={s * 0.03} fill={color} />
    </g>
  );
}

function ScoringRocketMark({ size, color }: { size: number; color: string }) {
  const s = size;
  return (
    <g
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <path
        d={`M ${s / 2} ${s * 0.22}
            C ${s * 0.66} ${s * 0.32} ${s * 0.66} ${s * 0.55} ${s * 0.6} ${s * 0.66}
            L ${s * 0.4} ${s * 0.66}
            C ${s * 0.34} ${s * 0.55} ${s * 0.34} ${s * 0.32} ${s / 2} ${s * 0.22} Z`}
        fill={color}
        fillOpacity={0.15}
      />
      <circle cx={s / 2} cy={s * 0.42} r={s * 0.06} />
      <path d={`M ${s * 0.4} ${s * 0.6} L ${s * 0.28} ${s * 0.76} L ${s * 0.42} ${s * 0.7}`} />
      <path d={`M ${s * 0.6} ${s * 0.6} L ${s * 0.72} ${s * 0.76} L ${s * 0.58} ${s * 0.7}`} />
    </g>
  );
}
