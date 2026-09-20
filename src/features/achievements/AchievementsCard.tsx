/**
 * AchievementsCard — sketch paper card for one gallery badge.
 */
import { useId } from "react";
import type { Achievement } from "@/components/game/achievements";
import { AchievementsGlyph } from "./AchievementsGlyph";
import { AchievementsTracker } from "./AchievementsTracker";

type AchievementsCardProps = {
  achievement: Achievement;
  onOpen: () => void;
  index?: number;
};

export function AchievementsCard({
  achievement,
  onOpen,
  index = 0,
}: AchievementsCardProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `ach-card-rough-${uid}`;
  const unlocked = achievement.status === "unlocked";
  const pct = Math.round(
    (unlocked ? 1 : achievement.progress) * 100,
  );

  return (
    <button
      type="button"
      onClick={onOpen}
      data-achievements-card={achievement.id}
      className="relative w-full bg-transparent p-0 text-left transition-transform active:scale-[0.98]"
      style={{
        // Slight alternate tilt for a stacked scrapbook feel.
        transform: index % 2 === 0 ? "rotate(-0.6deg)" : "rotate(0.7deg)",
      }}
      aria-label={`${achievement.title}, ${unlocked ? "unlocked" : `${pct}%`}`}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 340 118"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id={filterId} x="-8%" y="-12%" width="116%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={index + 4} />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          <path
            d="M 10 16 Q 6 4 22 5 L 318 4 Q 334 8 332 22 L 336 98 Q 334 114 316 112 L 22 114 Q 6 110 8 94 Z"
            fill="rgba(255,255,255,0.78)"
            stroke="var(--ink)"
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
          <path
            d="M 20 24 Q 16 14 30 14 L 308 13 Q 322 16 320 28 L 324 90 Q 322 104 306 102 L 30 104 Q 16 100 18 88 Z"
            fill="none"
            stroke="var(--accent-purple)"
            strokeWidth={1.6}
            strokeDasharray="6 5"
            opacity={0.85}
          />
        </g>
      </svg>

      <div className="relative flex items-center gap-3 px-5 py-4">
        <AchievementsGlyph
          kind={achievement.glyph}
          progress={achievement.progress}
          unlocked={unlocked}
        />
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center justify-between gap-2">
            <p
              className="text-[0.65rem] uppercase tracking-wide"
              style={{
                fontFamily: "var(--font-display)",
                color: unlocked ? "var(--accent-purple)" : "var(--ink-soft)",
              }}
            >
              {unlocked ? "unlocked" : "tracking"}
            </p>
            <span
              className="text-xs font-bold tabular-nums"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              {pct}%
            </span>
          </div>
          <h3
            className="truncate text-lg font-bold leading-tight"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          >
            {achievement.title}
          </h3>
          <p
            className="mb-2 truncate text-xs leading-snug"
            style={{ fontFamily: "var(--font-display)", color: "var(--ink-soft)" }}
          >
            {achievement.banner}
          </p>
          <AchievementsTracker
            progress={unlocked ? 1 : achievement.progress}
            unlocked={unlocked}
          />
        </div>
      </div>
    </button>
  );
}
