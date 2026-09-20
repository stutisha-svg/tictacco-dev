/**
 * AchievementsTracker — sketchy ink progress bar (0..1).
 */
import { useId } from "react";

type AchievementsTrackerProps = {
  progress: number;
  /** Unlocked = full ink fill treatment. */
  unlocked?: boolean;
};

export function AchievementsTracker({
  progress,
  unlocked = false,
}: AchievementsTrackerProps) {
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);
  const uid = useId().replace(/:/g, "");
  const filterId = `ach-track-rough-${uid}`;

  return (
    <div className="w-full" data-achievements-tracker aria-hidden>
      <svg
        className="block h-3.5 w-full overflow-visible"
        viewBox="0 0 220 14"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id={filterId} x="-8%" y="-40%" width="116%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed={3} />
            <feDisplacementMap in="SourceGraphic" scale="1.4" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <path
            d="M 2 4 Q 1 1 6 2 L 214 2 Q 218 3 217 7 L 216 11 Q 215 13 210 12 L 6 13 Q 2 12 2 8 Z"
            fill="rgba(255,255,255,0.55)"
            stroke="var(--ink)"
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          {pct > 0 && (
            <path
              d={`M 3 5 Q 2 3 7 3.5 L ${4 + (pct / 100) * 208} 3.5 Q ${8 + (pct / 100) * 208} 4.5 ${7 + (pct / 100) * 208} 7.5 L ${6 + (pct / 100) * 208} 10.5 Q ${5 + (pct / 100) * 208} 12 10 11.5 L 7 11.5 Q 3 11 3 8 Z`}
              fill={unlocked ? "var(--accent-purple)" : "var(--ink)"}
              opacity={unlocked ? 0.85 : 0.55}
            />
          )}
        </g>
      </svg>
    </div>
  );
}
