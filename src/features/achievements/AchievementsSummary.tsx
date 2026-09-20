/**
 * AchievementsSummary — gallery header card (cream paper, display font).
 */
import { useId } from "react";

export function AchievementsSummary() {
  const uid = useId().replace(/:/g, "");
  const filterId = `ach-sum-rough-${uid}`;

  return (
    <div className="relative w-full max-w-[340px]" data-achievements-summary>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 340 110"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="-8%" y="-10%" width="116%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={19} />
            <feDisplacementMap in="SourceGraphic" scale="2.1" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <path
            d="M 14 18 Q 8 4 28 5 L 312 4 Q 332 10 328 28 L 334 88 Q 330 106 308 104 L 28 106 Q 8 100 10 80 Z"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={2.8}
            strokeLinejoin="round"
          />
          <path
            d="M 26 28 Q 22 16 40 16 L 300 15 Q 318 20 314 34 L 320 78 Q 316 94 296 92 L 40 94 Q 22 88 24 72 Z"
            fill="none"
            stroke="var(--accent-purple)"
            strokeWidth={1.8}
            strokeDasharray="7 5"
          />
        </g>
      </svg>

      <div className="relative flex flex-col gap-1 px-6 py-6 text-center">
        <p
          className="text-xs uppercase tracking-wide"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--accent-purple)",
          }}
        >
          badge book
        </p>
        <h1
          className="text-2xl font-bold leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--ink)",
          }}
        >
          Achievements
        </h1>
        <p
          className="mt-0.5 text-sm leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink-soft)" }}
        >
          Tap a badge to see how to earn it.
        </p>
      </div>
    </div>
  );
}
