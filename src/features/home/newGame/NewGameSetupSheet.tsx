/**
 * NewGameSetupSheet — paper chrome.
 * Footprint locked to the larger (game-count) step so both steps share one size.
 */
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

/** Sized for game-count + start CTA — used for every step. */
const SHEET_W = 340;
const SHEET_H = 440;
/** Reserved so mode/count layout match when footer is absent. */
const FOOTER_SLOT_H = 44;

type NewGameSetupSheetProps = {
  stepKey: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
  backLabel?: string;
};

export function NewGameSetupSheet({
  stepKey,
  title,
  subtitle,
  children,
  footer,
  onBack,
  backLabel = "back",
}: NewGameSetupSheetProps) {
  return (
    <div
      role="dialog"
      aria-modal
      aria-label={title}
      data-new-game-setup-sheet
      className="relative z-10 overflow-hidden"
      style={{ width: SHEET_W, height: SHEET_H, maxWidth: "100%" }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${SHEET_W} ${SHEET_H}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="new-game-sheet-rough" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="19" />
            <feDisplacementMap in="SourceGraphic" scale="2.2" />
          </filter>
        </defs>
        <g filter="url(#new-game-sheet-rough)">
          <path
            d="M 18 28 Q 12 12 34 10 L 310 8 Q 332 14 328 42 L 334 390 Q 330 428 292 424 L 36 430 Q 8 420 12 382 Z"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <path
            d="M 32 40 Q 28 26 46 24 L 298 22 Q 318 28 314 48 L 320 376 Q 316 410 282 408 L 48 414 Q 24 406 28 372 Z"
            fill="none"
            stroke="var(--accent-purple)"
            strokeWidth={2}
            strokeDasharray="7 5"
          />
        </g>
      </svg>

      {onBack != null && (
        <button
          type="button"
          aria-label={backLabel}
          onClick={onBack}
          className="absolute left-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-105 active:scale-95"
          style={{
            borderColor: "var(--ink)",
            background: "rgba(255,255,255,0.75)",
            color: "var(--ink)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
            <path
              d="M11.5 3.5 L5.5 9 L11.5 14.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          className="relative flex h-full flex-col gap-4 px-7 pb-8 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <header className="shrink-0 text-center">
            <p
              className="text-xs uppercase tracking-wide"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--accent-purple)",
              }}
            >
              new game
            </p>
            <h2
              className="mt-1 text-2xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              {title}
            </h2>
            <p
              className="mt-1 text-sm leading-snug"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-soft)" }}
            >
              {subtitle}
            </p>
          </header>

          <div className="flex min-h-0 flex-1 flex-col justify-center">{children}</div>

          {/* Always reserve footer height so both steps keep the same footprint. */}
          <div
            className="mt-auto flex shrink-0 flex-col gap-2"
            style={{ minHeight: FOOTER_SLOT_H }}
          >
            {footer}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
