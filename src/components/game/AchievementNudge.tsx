/**
 * AchievementNudge — irregular paper drawer that peeks under the top bar
 * when a badge is being tracked or was just unlocked.
 */
import { AnimatePresence, motion } from "motion/react";
import type { Achievement } from "./achievements";

interface Props {
  achievement: Achievement | null;
  onOpen: () => void;
  onDismiss?: () => void;
}

export function AchievementNudge({ achievement, onOpen }: Props) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[88%] z-[35] w-[min(92%,340px)] -translate-x-1/2"
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <button
            type="button"
            onClick={onOpen}
            className="pointer-events-auto relative block w-full min-h-[44px] text-left"
            aria-label={`achievement: ${achievement.title}`}
          >
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 340 52"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <filter id="ach-nudge-rough" x="-10%" y="-30%" width="120%" height="160%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed="5" />
                  <feDisplacementMap in="SourceGraphic" scale="1.8" />
                </filter>
              </defs>
              <g filter="url(#ach-nudge-rough)">
                <path
                  d="M 16 8 Q 8 2 24 2 L 316 1 Q 334 4 330 20 L 332 40 Q 328 50 308 48 L 28 50 Q 6 46 10 28 Z"
                  fill={
                    achievement.status === "unlocked"
                      ? "var(--accent-purple)"
                      : "rgba(255,255,255,0.92)"
                  }
                  stroke="var(--ink)"
                  strokeWidth={2.2}
                />
              </g>
            </svg>
            <div className="relative flex items-center gap-2 px-5 py-2.5">
              <span
                className="shrink-0 text-xs font-semibold uppercase"
                style={{
                  fontFamily: "var(--font-display)",
                  color:
                    achievement.status === "unlocked"
                      ? "var(--paper)"
                      : "var(--accent-purple)",
                }}
              >
                {achievement.status === "unlocked" ? "earned" : "tracking"}
              </span>
              <span
                className="min-w-0 flex-1 truncate text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  color:
                    achievement.status === "unlocked" ? "var(--paper)" : "var(--ink)",
                }}
              >
                {achievement.banner}
              </span>
              <span
                className="shrink-0 text-xs"
                style={{
                  fontFamily: "var(--font-display)",
                  color:
                    achievement.status === "unlocked"
                      ? "rgba(255,255,255,0.85)"
                      : "var(--ink-soft)",
                }}
              >
                {Math.round(achievement.progress * 100)}%
              </span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
