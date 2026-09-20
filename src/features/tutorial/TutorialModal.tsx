/**
 * TutorialModal — hand-drawn paper dialog for the tutorial end sequence.
 * Visual language matches AchievementModal; this copy is tutorial-only
 * and must not be imported by GameScreen.
 */
import type { ReactNode } from "react";
import { motion } from "motion/react";

type TutorialModalProps = {
  children: ReactNode;
  /** Accessible name for the dialog. */
  label: string;
  className?: string;
};

export function TutorialModal({ children, label, className }: TutorialModalProps) {
  return (
    <motion.div
      role="dialog"
      aria-modal
      aria-label={label}
      data-tutorial-modal
      className={`relative z-10 w-full max-w-[340px] ${className ?? ""}`}
      initial={{ y: 28, opacity: 0, rotate: -2 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 340 220"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="tutorial-modal-rough" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="14" />
            <feDisplacementMap in="SourceGraphic" scale="2.2" />
          </filter>
        </defs>
        <g filter="url(#tutorial-modal-rough)">
          <path
            d="M 18 24 Q 12 10 34 8 L 310 6 Q 332 12 328 32 L 334 180 Q 330 210 292 206 L 36 212 Q 8 204 12 172 Z"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path
            d="M 32 34 Q 28 22 46 20 L 298 18 Q 318 24 314 40 L 320 168 Q 316 196 282 194 L 48 200 Q 24 192 28 166 Z"
            fill="none"
            stroke="var(--accent-purple)"
            strokeWidth={2}
            strokeDasharray="7 5"
          />
        </g>
      </svg>

      <div className="relative flex flex-col items-center gap-4 px-7 py-8 text-center">
        {children}
      </div>
    </motion.div>
  );
}
