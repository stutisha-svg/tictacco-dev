/**
 * Crown — hand-drawn crayon crown placed above the winner's avatar.
 *
 * Purpose: celebratory marker rendered after the win badge minimizes.
 * State: none; animation runs once on mount (pathLength 0→1).
 * Deps: motion/react + crayon SVG filter.
 */
import { motion } from "motion/react";

interface CrownProps {
  color: string;
  size?: number;
}

export function Crown({ color, size = 44 }: CrownProps) {
  const w = size;
  const h = size * 0.75;
  // Crown outline: base line, three peaks (left, mid tallest, right), back down to base.
  const baseY = h * 0.85;
  const peakYSide = h * 0.15;
  const peakYMid = h * 0.05;
  const valleyY = h * 0.55;
  const d = [
    `M ${w * 0.08} ${baseY}`,
    `L ${w * 0.14} ${peakYSide}`,
    `L ${w * 0.32} ${valleyY}`,
    `L ${w * 0.5} ${peakYMid}`,
    `L ${w * 0.68} ${valleyY}`,
    `L ${w * 0.86} ${peakYSide}`,
    `L ${w * 0.92} ${baseY}`,
    `L ${w * 0.08} ${baseY}`,
  ].join(" ");

  // small gems on the three peaks
  const gems = [
    { cx: w * 0.14, cy: peakYSide, r: size * 0.05 },
    { cx: w * 0.5, cy: peakYMid, r: size * 0.06 },
    { cx: w * 0.86, cy: peakYSide, r: size * 0.05 },
  ];

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible", pointerEvents: "none" }}
      aria-hidden
    >
      <defs>
        <filter id="crown-rough" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="21" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
        </filter>
      </defs>
      <g filter="url(#crown-rough)">
        <motion.path
          d={d}
          stroke={color}
          strokeWidth={Math.max(2.4, size * 0.07)}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0.15] }}
          transition={{
            duration: 2.4,
            times: [0, 0.55, 0.85, 1],
            repeat: Infinity,
            repeatDelay: 0.4,
            ease: "easeInOut",
          }}
        />
        {gems.map((g, i) => (
          <motion.circle
            key={i}
            cx={g.cx}
            cy={g.cy}
            r={g.r}
            fill={color}
            stroke="var(--ink)"
            strokeWidth={1}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 2.4,
              times: [0, 0.6 + i * 0.03, 0.85, 1],
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: `${g.cx}px ${g.cy}px` }}
          />
        ))}
      </g>

    </svg>
  );
}
