/**
 * AchievementBadge — floats in from the left when the player is close to a
 * milestone (e.g. one shape away from XOX). Docks to a small left rail on
 * the board's edge. Each badge fills up as ink is poured in — the SVG mask
 * clips a rising fill layer inside the medallion shape.
 *
 * Visual language is more vector/illustration-forward than the crayon
 * badges (thin outline, filled illustration) so it reads as a distinct
 * "achievements" surface.
 */
import { motion, AnimatePresence } from "motion/react";

interface Achievement {
  id: string;
  title: string;
  glyph: "trophy" | "spark" | "target";
  /** 0..1 fill progress — how close to unlocking. */
  progress: number;
}

interface Props {
  achievements: Achievement[];
}

const SIZE = 56;

function Glyph({ kind }: { kind: Achievement["glyph"] }) {
  const s = SIZE;
  const color = "var(--accent-purple)";
  const stroke = { stroke: color, strokeWidth: 2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "trophy") {
    return (
      <g {...stroke}>
        <path d={`M ${s * 0.32} ${s * 0.28} L ${s * 0.68} ${s * 0.28} L ${s * 0.62} ${s * 0.56} L ${s * 0.38} ${s * 0.56} Z`} />
        <path d={`M ${s * 0.32} ${s * 0.32} L ${s * 0.22} ${s * 0.36} L ${s * 0.24} ${s * 0.46} L ${s * 0.34} ${s * 0.48}`} />
        <path d={`M ${s * 0.68} ${s * 0.32} L ${s * 0.78} ${s * 0.36} L ${s * 0.76} ${s * 0.46} L ${s * 0.66} ${s * 0.48}`} />
        <path d={`M ${s * 0.5} ${s * 0.56} L ${s * 0.5} ${s * 0.68}`} />
        <path d={`M ${s * 0.36} ${s * 0.74} L ${s * 0.64} ${s * 0.74}`} />
      </g>
    );
  }
  if (kind === "spark") {
    return (
      <g {...stroke}>
        <path d={`M ${s * 0.5} ${s * 0.22} L ${s * 0.56} ${s * 0.44} L ${s * 0.78} ${s * 0.5} L ${s * 0.56} ${s * 0.56} L ${s * 0.5} ${s * 0.78} L ${s * 0.44} ${s * 0.56} L ${s * 0.22} ${s * 0.5} L ${s * 0.44} ${s * 0.44} Z`} />
      </g>
    );
  }
  return (
    <g {...stroke}>
      <circle cx={s / 2} cy={s / 2} r={s * 0.24} />
      <circle cx={s / 2} cy={s / 2} r={s * 0.14} />
      <circle cx={s / 2} cy={s / 2} r={s * 0.05} fill={color} />
    </g>
  );
}

export function AchievementRail({ achievements }: Props) {
  return (
    <div className="pointer-events-none absolute left-1 top-24 z-30 flex flex-col gap-2">
      <AnimatePresence>
        {achievements.map((a) => {
          const fillH = SIZE * a.progress;
          const clipId = `a-clip-${a.id}`;
          return (
            <motion.div
              key={a.id}
              className="pointer-events-auto relative"
              style={{ width: SIZE + 6 }}
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
              <svg
                width={SIZE + 6}
                height={SIZE + 6}
                viewBox={`0 0 ${SIZE + 6} ${SIZE + 6}`}
                className="overflow-visible"
              >
                <defs>
                  <clipPath id={clipId}>
                    <circle cx={SIZE / 2 + 3} cy={SIZE / 2 + 3} r={SIZE / 2} />
                  </clipPath>
                </defs>
                {/* backing */}
                <circle
                  cx={SIZE / 2 + 3}
                  cy={SIZE / 2 + 3}
                  r={SIZE / 2}
                  fill="white"
                  stroke="var(--accent-purple)"
                  strokeWidth={2.2}
                />
                {/* Ink pour fill rising from the bottom, clipped to circle */}
                <g clipPath={`url(#${clipId})`}>
                  <motion.rect
                    x={0}
                    width={SIZE + 6}
                    initial={{ y: SIZE + 6, height: 0 }}
                    animate={{ y: SIZE + 6 - fillH, height: fillH }}
                    transition={{ type: "spring", stiffness: 60, damping: 14, mass: 1.4 }}
                    fill="var(--accent-purple-soft)"
                    opacity={0.55}
                  />
                  {/* wobbly meniscus */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: fillH > 4 ? 1 : 0 }}
                    d={`M 0 ${SIZE + 6 - fillH} Q ${(SIZE + 6) / 4} ${SIZE + 4 - fillH} ${(SIZE + 6) / 2} ${SIZE + 6 - fillH} T ${SIZE + 6} ${SIZE + 6 - fillH}`}
                    stroke="var(--accent-purple)"
                    strokeWidth={1.5}
                    fill="none"
                  />
                </g>
                {/* Glyph on top */}
                <Glyph kind={a.glyph} />
              </svg>
              {/* micro label */}
              <div
                className="mt-0.5 rounded-md bg-white/90 px-1 text-center"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 10,
                  color: "var(--accent-purple)",
                  border: "1px solid var(--accent-purple)",
                  lineHeight: 1.1,
                }}
              >
                {a.title}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export type { Achievement };
