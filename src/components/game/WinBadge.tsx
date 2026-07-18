/**
 * WinBadge — arcade-style hand-drawn result badge (win / lose / tie).
 *
 * Purpose: dramatic end-of-game announcement that slides in from the right
 *          over a translucent overlay.
 * State: none — purely driven by the `kind` prop.
 * Deps: motion/react for slide + flash animations.
 */
import { motion } from "motion/react";

export type BadgeKind = "win" | "lose" | "tie";

interface WinBadgeProps {
  kind: BadgeKind;
}

interface BadgeConfig {
  title: string;
  subtitle: string;
  fillVar: string;
  tilt: number;
}

const BADGE_CONFIG: Record<BadgeKind, BadgeConfig> = {
  win: { title: "YOU WIN!", subtitle: "epic sketch", fillVar: "var(--player-you)", tilt: -6 },
  lose: { title: "YOU LOST", subtitle: "rival got it", fillVar: "var(--player-opp)", tilt: 5 },
  tie: { title: "IT'S A TIE", subtitle: "scribble draw", fillVar: "var(--ink-soft)", tilt: -3 },
};

// Use the Caveat family for badges specifically (per design direction).
const BADGE_FONT = "'Caveat', 'Patrick Hand', cursive";

export function WinBadge({ kind }: WinBadgeProps) {
  const config = BADGE_CONFIG[kind];
  const width = 320;
  const height = 180;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ x: "110%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-30%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, mass: 0.9 }}
    >
      <motion.div
        animate={{ scale: [0.9, 1.08, 1], rotate: [config.tilt - 3, config.tilt + 2, config.tilt] }}
        transition={{ duration: 0.7, times: [0, 0.6, 1], ease: "easeOut" }}
        style={{ width, height }}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible"
        >
          <defs>
            <filter id="badge-rough" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="12" />
              <feDisplacementMap in="SourceGraphic" scale="2.4" />
            </filter>
          </defs>

          {/* Flash halo behind the badge */}
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={130}
            fill={config.fillVar}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.5, 0.15], scale: [0.8, 1.4] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <g filter="url(#badge-rough)">
            {/* Ribbon shape */}
            <path
              d={`M 20 40 L ${width - 20} 32 L ${width - 30} ${height - 30} L 30 ${height - 20} Z`}
              fill="var(--paper)"
              stroke="var(--ink)"
              strokeWidth={4}
              strokeLinejoin="round"
            />
            {/* Inner accent */}
            <path
              d={`M 32 52 L ${width - 32} 44 L ${width - 42} ${height - 42} L 42 ${height - 32} Z`}
              fill="none"
              stroke={config.fillVar}
              strokeWidth={3}
              strokeDasharray="6 5"
            />
          </g>

          <text
            x={width / 2}
            y={height / 2 - 8}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-display)"
            fontWeight={700}
            fontSize={54}
            fill={config.fillVar}
            stroke="var(--ink)"
            strokeWidth={1.5}
            paintOrder="stroke"
          >
            {config.title}
          </text>
          <text
            x={width / 2}
            y={height / 2 + 40}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-display)"
            fontSize={22}
            fill="var(--ink)"
          >
            {config.subtitle}
          </text>
        </svg>
      </motion.div>
    </motion.div>
  );
}
