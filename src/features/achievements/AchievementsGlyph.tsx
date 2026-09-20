/**
 * AchievementsGlyph — crayon badge mark for gallery cards.
 */
import type { AchievementGlyph } from "@/components/game/achievements";

type AchievementsGlyphProps = {
  kind: AchievementGlyph;
  progress: number;
  unlocked?: boolean;
  size?: number;
};

export function AchievementsGlyph({
  kind,
  progress,
  unlocked = false,
  size = 52,
}: AchievementsGlyphProps) {
  const fillH = size * (unlocked ? 1 : progress);
  const clipId = `ach-glyph-clip-${kind}-${Math.round(progress * 100)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0 overflow-visible"
      aria-hidden
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} />
        </clipPath>
        <filter id={`${clipId}-rough`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={8} />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
      </defs>
      <g filter={`url(#${clipId}-rough)`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="rgba(255,255,255,0.9)"
          stroke={unlocked ? "var(--accent-purple)" : "var(--ink)"}
          strokeWidth={2.4}
        />
        <g clipPath={`url(#${clipId})`}>
          <rect
            x={0}
            y={size - fillH}
            width={size}
            height={fillH}
            fill="var(--accent-purple-soft)"
            opacity={0.7}
          />
        </g>
      </g>
      <g transform={`translate(${size * 0.2}, ${size * 0.2}) scale(${size / 52})`}>
        <MiniGlyph kind={kind} />
      </g>
    </svg>
  );
}

function MiniGlyph({ kind }: { kind: AchievementGlyph }) {
  const s = 32;
  const color = "var(--accent-purple)";
  const stroke = {
    stroke: color,
    strokeWidth: 1.8,
    fill: "none" as const,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (kind === "trophy") {
    return (
      <g {...stroke}>
        <path
          d={`M ${s * 0.32} ${s * 0.28} L ${s * 0.68} ${s * 0.28} L ${s * 0.62} ${s * 0.56} L ${s * 0.38} ${s * 0.56} Z`}
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
      <circle cx={s / 2} cy={s / 2} r={s * 0.1} fill={color} />
    </g>
  );
}
