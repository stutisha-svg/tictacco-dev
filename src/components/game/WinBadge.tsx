/**
 * WinBadge — arcade-style hand-drawn result badge (win / lose / tie).
 *
 * Purpose: dramatic end-of-game announcement that slides in from the right
 *          over a translucent overlay.
 * State: none — purely driven by the `kind` prop.
 * Deps: motion/react for slide + flash animations.
 */
import { motion } from "motion/react";

export type BadgeKind = "win" | "lose" | "tie" | "collision";

interface WinBadgeProps {
  kind: BadgeKind;
}

interface BadgeConfig {
  title: string;
  subtitle: string;
  fillVar: string;
  tilt: number;
  /** Title font size — longer labels need to scale down. */
  titleSize: number;
}

const BADGE_CONFIG: Record<BadgeKind, BadgeConfig> = {
  win: { title: "YOU WIN!", subtitle: "epic sketch", fillVar: "var(--player-you)", tilt: -6, titleSize: 64 },
  lose: { title: "YOU LOST", subtitle: "rival got it", fillVar: "var(--player-opp)", tilt: 5, titleSize: 64 },
  /** End of game — board full or no XOX left for either side. */
  tie: { title: "IT'S A TIE", subtitle: "nobody scored", fillVar: "var(--ink-soft)", tilt: -3, titleSize: 64 },
  /** Mid-game simultaneous XOX — play continues after tiles are scribbled. */
  collision: {
    title: "MAJOR COLLISION",
    subtitle: "keep playing",
    fillVar: "var(--player-you)",
    tilt: 4,
    titleSize: 42,
  },
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
            fontFamily={BADGE_FONT}
            fontWeight={700}
            fontSize={config.titleSize}
            fill={config.fillVar}
            stroke="var(--ink)"
            strokeWidth={1.5}
            paintOrder="stroke"
          >
            {config.title}
          </text>
          <text
            x={width / 2}
            y={height / 2 + 44}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={BADGE_FONT}
            fontSize={26}
            fill="var(--ink)"
          >
            {config.subtitle}
          </text>
        </svg>
      </motion.div>
    </motion.div>
  );
}

/**
 * MiniBadge — compact ribbon for the persistent result card.
 * Sized to sit beside “play again” without overlapping (~80% frame cards).
 */
export function MiniBadge({ kind }: WinBadgeProps) {
  const config = BADGE_CONFIG[kind];
  const width = 118;
  const height = 44;
  // Longer titles (YOU LOST / IT'S A TIE) need a slightly smaller glyph.
  const titleSize = kind === "lose" || kind === "tie" ? 16 : kind === "win" ? 18 : 14;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="max-h-11 w-auto max-w-full shrink overflow-hidden"
      aria-hidden
    >
      <defs>
        <filter id="mini-badge-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
        </filter>
      </defs>
      <g filter="url(#mini-badge-rough)">
        <path
          d={`M 6 8 L ${width - 6} 6 L ${width - 8} ${height - 6} L 8 ${height - 5} Z`}
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
        <path
          d={`M 11 12 L ${width - 11} 10 L ${width - 13} ${height - 10} L 13 ${height - 9} Z`}
          fill="none"
          stroke={config.fillVar}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />
      </g>
      <text
        x={width / 2}
        y={height / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily={BADGE_FONT}
        fontWeight={700}
        fontSize={titleSize}
        fill={config.fillVar}
        stroke="var(--ink)"
        strokeWidth={0.8}
        paintOrder="stroke"
        transform={`rotate(${config.tilt / 2} ${width / 2} ${height / 2})`}
      >
        {config.title}
      </text>
    </svg>
  );
}
