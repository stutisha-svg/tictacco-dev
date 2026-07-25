/**
 * AchievementRail — compact badges stacked on the LEFT of the grid.
 * Sized to fit the left gutter; labels wrap instead of overflowing.
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

/** Narrow column so it fits beside the board without growing the page. */
export const ACHIEVEMENT_COL_W = 52;
const SIZE = 32;

function Glyph({ kind }: { kind: Achievement["glyph"] }) {
  const s = SIZE;
  const color = "var(--accent-purple)";
  const stroke = {
    stroke: color,
    strokeWidth: 1.6,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "trophy") {
    return (
      <g {...stroke}>
        <path
          d={`M ${s * 0.32} ${s * 0.28} L ${s * 0.68} ${s * 0.28} L ${s * 0.62} ${s * 0.56} L ${s * 0.38} ${s * 0.56} Z`}
        />
        <path
          d={`M ${s * 0.32} ${s * 0.32} L ${s * 0.22} ${s * 0.36} L ${s * 0.24} ${s * 0.46} L ${s * 0.34} ${s * 0.48}`}
        />
        <path
          d={`M ${s * 0.68} ${s * 0.32} L ${s * 0.78} ${s * 0.36} L ${s * 0.76} ${s * 0.46} L ${s * 0.66} ${s * 0.48}`}
        />
        <path d={`M ${s * 0.5} ${s * 0.56} L ${s * 0.5} ${s * 0.68}`} />
        <path d={`M ${s * 0.36} ${s * 0.74} L ${s * 0.64} ${s * 0.74}`} />
      </g>
    );
  }
  if (kind === "spark") {
    return (
      <g {...stroke}>
        <path
          d={`M ${s * 0.5} ${s * 0.22} L ${s * 0.56} ${s * 0.44} L ${s * 0.78} ${s * 0.5} L ${s * 0.56} ${s * 0.56} L ${s * 0.5} ${s * 0.78} L ${s * 0.44} ${s * 0.56} L ${s * 0.22} ${s * 0.5} L ${s * 0.44} ${s * 0.44} Z`}
        />
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
    <div
      className="pointer-events-none flex flex-col items-center gap-1.5"
      style={{ width: ACHIEVEMENT_COL_W }}
      aria-label="achievements"
    >
      <AnimatePresence>
        {achievements.map((a) => {
          const fillH = SIZE * a.progress;
          const clipId = `a-clip-${a.id}`;
          return (
            <motion.div
              key={a.id}
              className="pointer-events-auto relative flex w-full flex-col items-center"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <svg
                width={SIZE + 4}
                height={SIZE + 4}
                viewBox={`0 0 ${SIZE + 4} ${SIZE + 4}`}
                className="overflow-visible"
                aria-hidden
              >
                <defs>
                  <clipPath id={clipId}>
                    <circle cx={SIZE / 2 + 2} cy={SIZE / 2 + 2} r={SIZE / 2} />
                  </clipPath>
                </defs>
                <circle
                  cx={SIZE / 2 + 2}
                  cy={SIZE / 2 + 2}
                  r={SIZE / 2}
                  fill="white"
                  stroke="var(--accent-purple)"
                  strokeWidth={1.8}
                />
                <g clipPath={`url(#${clipId})`}>
                  <motion.rect
                    x={0}
                    width={SIZE + 4}
                    initial={{ y: SIZE + 4, height: 0 }}
                    animate={{ y: SIZE + 4 - fillH, height: fillH }}
                    transition={{ type: "spring", stiffness: 60, damping: 14, mass: 1.4 }}
                    fill="var(--accent-purple-soft)"
                    opacity={0.55}
                  />
                </g>
                <g transform="translate(2, 2)">
                  <Glyph kind={a.glyph} />
                </g>
              </svg>
              <div
                className="mt-0.5 w-full text-center text-[11px] font-semibold leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--accent-purple)",
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  maxWidth: ACHIEVEMENT_COL_W,
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
