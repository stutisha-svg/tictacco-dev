/**
 * AchievementModal — hand-drawn detail sheet for a tracked / unlocked badge.
 * Shows how to win + a cycling pill of dummy winners (icon, name, country).
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Achievement, AchievementWinner } from "./achievements";

interface Props {
  achievement: Achievement | null;
  open: boolean;
  onClose: () => void;
}

const CYCLE_MS = 2400;

export function AchievementModal({ achievement, open, onClose }: Props) {
  const [winnerIdx, setWinnerIdx] = useState(0);

  useEffect(() => {
    setWinnerIdx(0);
  }, [achievement?.id, open]);

  useEffect(() => {
    if (!open || !achievement || achievement.winners.length < 2) return;
    const t = setInterval(() => {
      setWinnerIdx((i) => (i + 1) % achievement.winners.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, [open, achievement]);

  const winner = achievement?.winners[winnerIdx] ?? null;

  return (
    <AnimatePresence>
      {open && achievement && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="close achievement"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={achievement.title}
            className="relative z-10 w-full max-w-[340px]"
            initial={{ y: 28, opacity: 0, rotate: -2 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 20, opacity: 0, rotate: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 340 320"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <filter id="ach-modal-rough" x="-8%" y="-8%" width="116%" height="116%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="14" />
                  <feDisplacementMap in="SourceGraphic" scale="2.2" />
                </filter>
              </defs>
              <g filter="url(#ach-modal-rough)">
                <path
                  d="M 18 28 Q 12 12 34 10 L 310 8 Q 332 14 328 42 L 334 270 Q 330 308 292 304 L 36 310 Q 8 300 12 262 Z"
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <path
                  d="M 32 40 Q 28 26 46 24 L 298 22 Q 318 28 314 48 L 320 256 Q 316 290 282 288 L 48 294 Q 24 286 28 252 Z"
                  fill="none"
                  stroke="var(--accent-purple)"
                  strokeWidth={2}
                  strokeDasharray="7 5"
                />
              </g>
            </svg>

            <div className="relative flex flex-col gap-4 px-7 py-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-xs uppercase tracking-wide"
                    style={{ fontFamily: "var(--font-display)", color: "var(--accent-purple)" }}
                  >
                    {achievement.status === "unlocked" ? "unlocked" : "tracking"}
                  </p>
                  <h2
                    className="text-2xl font-bold leading-tight"
                    style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                  >
                    {achievement.title}
                  </h2>
                </div>
                <BadgeGlyph kind={achievement.glyph} progress={achievement.progress} />
              </div>

              <section>
                <h3
                  className="mb-1 text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink-brown)" }}
                >
                  how to win this badge
                </h3>
                <p
                  className="text-base leading-snug"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
                >
                  {achievement.howTo}
                </p>
              </section>

              <section>
                <h3
                  className="mb-2 text-sm font-semibold"
                  style={{ fontFamily: "var(--font-display)", color: "var(--ink-brown)" }}
                >
                  who has it
                </h3>
                <WinnerPill winner={winner} progress={achievement.progress} />
              </section>

              <button
                type="button"
                onClick={onClose}
                className="mt-1 min-h-[44px] self-center rounded-full border-2 px-5 py-2 text-sm transition-transform hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  fontFamily: "var(--font-display)",
                  borderColor: "var(--ink)",
                  background: "var(--ink)",
                  color: "var(--paper)",
                }}
              >
                got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BadgeGlyph({
  kind,
  progress,
}: {
  kind: Achievement["glyph"];
  progress: number;
}) {
  const size = 56;
  const fillH = size * progress;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 overflow-visible">
      <defs>
        <clipPath id="ach-modal-clip">
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} />
        </clipPath>
      </defs>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 2}
        fill="rgba(255,255,255,0.9)"
        stroke="var(--accent-purple)"
        strokeWidth={2.4}
      />
      <g clipPath="url(#ach-modal-clip)">
        <rect
          x={0}
          y={size - fillH}
          width={size}
          height={fillH}
          fill="var(--accent-purple-soft)"
          opacity={0.65}
        />
      </g>
      <g transform={`translate(${size * 0.18}, ${size * 0.18}) scale(1.35)`}>
        <MiniGlyph kind={kind} />
      </g>
    </svg>
  );
}

function MiniGlyph({ kind }: { kind: Achievement["glyph"] }) {
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
        <path d={`M ${s * 0.32} ${s * 0.28} L ${s * 0.68} ${s * 0.28} L ${s * 0.62} ${s * 0.56} L ${s * 0.38} ${s * 0.56} Z`} />
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

function WinnerPill({
  winner,
  progress,
}: {
  winner: AchievementWinner | null;
  progress: number;
}) {
  if (!winner) {
    return (
      <p className="text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--ink-soft)" }}>
        no winners yet — be the first
      </p>
    );
  }
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 280 56"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 10 28 Q 8 8 28 6 L 252 4 Q 274 8 270 30 Q 268 50 246 48 L 30 50 Q 8 48 10 28 Z"
          fill="rgba(255,255,255,0.55)"
          stroke="var(--ink-brown)"
          strokeWidth={2}
        />
      </svg>
      <AnimatePresence mode="wait">
        <motion.div
          key={winner.id}
          className="relative flex min-h-[52px] items-center gap-3 px-4 py-2"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          <WinnerAvatar glyph={winner.glyph} />
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-base font-semibold leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              {winner.name}
            </p>
            <p
              className="text-sm leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink-soft)" }}
            >
              {winner.country}
            </p>
          </div>
          <span
            className="shrink-0 text-xs"
            style={{ fontFamily: "var(--font-display)", color: "var(--accent-purple)" }}
          >
            {Math.round(progress * 100)}%
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WinnerAvatar({ glyph }: { glyph: AchievementWinner["glyph"] }) {
  return (
    <svg width={36} height={36} viewBox="0 0 36 36" className="shrink-0 overflow-visible">
      <circle cx={18} cy={18} r={16} fill="var(--accent-purple-soft)" stroke="var(--ink)" strokeWidth={1.8} />
      {glyph === "star" ? (
        <path
          d="M18 8 L20 15 L27 15 L21.5 19 L23.5 26 L18 22 L12.5 26 L14.5 19 L9 15 L16 15 Z"
          fill="var(--accent-purple)"
          stroke="var(--ink)"
          strokeWidth={1}
        />
      ) : glyph === "rocket" ? (
        <path
          d="M18 9 L22 20 L18 18 L14 20 Z M16 22 L18 27 L20 22"
          fill="none"
          stroke="var(--ink)"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      ) : (
        <g stroke="var(--ink)" strokeWidth={1.6} fill="none" strokeLinecap="round">
          <ellipse cx={18} cy={20} rx={5} ry={6} />
          <circle cx={18} cy={13} r={2.5} />
        </g>
      )}
    </svg>
  );
}
