/**
 * AchievementsFabFrame — sketch outline for the floating back-home control.
 * Same wobble path language as New Game / Settings primary buttons.
 */
import { useId } from "react";

const PATH =
  "M 6 9 Q 4 2 14 3 L 266 2 Q 276 4 275 12 L 277 36 Q 276 46 264 45 L 12 47 Q 3 45 4 36 Z";

export function AchievementsFabFrame() {
  const filterId = `ach-fab-rough-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 280 48"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={9} />
          <feDisplacementMap in="SourceGraphic" scale="1.8" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <path
          d={PATH}
          fill="var(--ink)"
          stroke="var(--ink)"
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
