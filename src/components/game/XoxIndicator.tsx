/**
 * XoxIndicator — thermometer-style progress rig.
 *
 * A hand-drawn rectangle fills from both sides during play. On a win, the
 * whole tube floods with the winner’s colour and the XOX glyphs turn white.
 * After the result badge collapses, the fill gently pulses in and out.
 */
import { motion } from "motion/react";
import { CrayonDefs } from "./CrayonDefs";
import { Shape } from "./Shape";
import type { Owner } from "@/game/rules";
import type { MatchScore } from "@/game/useGameEngine";

interface Props {
  progressYou: number; // 0..3
  progressOpp: number; // 0..3
  leader: Owner | null;
  match: MatchScore;
  matchTarget: number;
  /** When set, replaces the "best of N" tab (e.g. tutorial screen). */
  tabLabel?: string;
  /** Winning player — tube fills solid with their colour; glyphs go white. */
  winner?: Owner | null;
  /** After the big result badge shrinks — keep pulsing the full fill. */
  celebrate?: boolean;
}

const SEQ = ["X", "O", "X"] as const;

const TUBE_W = 220;
const TUBE_H = 56;

/** Wobbly-quad path for the thermometer body — opposite long sides are NOT parallel. */
const TUBE_PATH = (() => {
  const tl = [4, 6];
  const tr = [TUBE_W - 5, 3];
  const br = [TUBE_W - 3, TUBE_H - 5];
  const bl = [6, TUBE_H - 3];
  return (
    `M ${tl[0]} ${tl[1]} ` +
    `Q ${TUBE_W / 2} ${tl[1] - 3} ${tr[0]} ${tr[1]} ` +
    `Q ${tr[0] + 4} ${TUBE_H / 2} ${br[0]} ${br[1]} ` +
    `Q ${TUBE_W / 2} ${TUBE_H - 2} ${bl[0]} ${bl[1]} ` +
    `Q ${bl[0] - 5} ${TUBE_H / 2} ${tl[0]} ${tl[1]} Z`
  );
})();

export function XoxIndicator({
  progressYou,
  progressOpp,
  leader,
  match,
  matchTarget,
  tabLabel,
  winner = null,
  celebrate = false,
}: Props) {
  const youPct = Math.min(1, progressYou / 3);
  const oppPct = Math.min(1, progressOpp / 3);
  const maxFillPct = 0.48;
  const youFillW = TUBE_W * youPct * maxFillPct;
  const oppFillW = TUBE_W * oppPct * maxFillPct;

  const won = winner === "you" || winner === "opp";
  const winColor = winner === "you" ? "var(--player-you)" : "var(--player-opp)";

  return (
    <div className="flex flex-col items-center">
      <MatchTab match={match} target={matchTarget} label={tabLabel} />
      <svg
        width={TUBE_W}
        height={TUBE_H}
        viewBox={`0 0 ${TUBE_W} ${TUBE_H}`}
        className="overflow-visible"
        style={{ marginTop: 4 }}
      >
        <CrayonDefs />
        <defs>
          <clipPath id="tube-clip">
            <path d={TUBE_PATH} />
          </clipPath>
          <filter id="tube-rough" x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="21" />
            <feDisplacementMap in="SourceGraphic" scale="1.8" />
          </filter>
          <filter id="liquid-grain" x="-10%" y="-30%" width="120%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="9" />
            <feDisplacementMap in="SourceGraphic" scale="2.1" />
          </filter>
        </defs>

        <g filter="url(#tube-rough)">
          <path
            d={TUBE_PATH}
            fill="rgba(255,255,255,0.3)"
            stroke="var(--ink-brown)"
            strokeWidth={2.8}
            strokeLinejoin="round"
          />
        </g>

        {!won && (
          <>
            <g clipPath="url(#tube-clip)" filter="url(#liquid-grain)">
              <motion.rect
                x={0}
                y={0}
                height={TUBE_H}
                initial={{ width: 0 }}
                animate={{ width: youFillW }}
                transition={{ type: "spring", stiffness: 90, damping: 16, mass: 1.1 }}
                fill="var(--player-you)"
                opacity={0.85}
              />
              <motion.rect
                x={0}
                y={TUBE_H * 0.15}
                height={TUBE_H * 0.7}
                fill="var(--player-you)"
                opacity={0.35}
                initial={{ width: 0 }}
                animate={{ width: youFillW + 4 }}
                transition={{ type: "spring", stiffness: 70, damping: 14, mass: 1.4 }}
              />
            </g>

            <g clipPath="url(#tube-clip)" filter="url(#liquid-grain)">
              <motion.rect
                x={TUBE_W}
                y={0}
                height={TUBE_H}
                initial={{ width: 0, x: TUBE_W }}
                animate={{ width: oppFillW, x: TUBE_W - oppFillW }}
                transition={{ type: "spring", stiffness: 90, damping: 16, mass: 1.1 }}
                fill="var(--player-opp)"
                opacity={0.85}
              />
              <motion.rect
                y={TUBE_H * 0.15}
                height={TUBE_H * 0.7}
                fill="var(--player-opp)"
                opacity={0.35}
                initial={{ width: 0, x: TUBE_W }}
                animate={{ width: oppFillW + 4, x: TUBE_W - oppFillW - 4 }}
                transition={{ type: "spring", stiffness: 70, damping: 14, mass: 1.4 }}
              />
            </g>
          </>
        )}

        {/* Win: full tube flood — pulses in/out after the badge collapses. */}
        {won && (
          <g clipPath="url(#tube-clip)" filter="url(#liquid-grain)">
            <motion.rect
              x={0}
              y={0}
              width={TUBE_W}
              height={TUBE_H}
              fill={winColor}
              style={{ transformOrigin: `${TUBE_W / 2}px ${TUBE_H / 2}px` }}
              initial={{ opacity: 0, scaleX: 0.35 }}
              animate={
                celebrate
                  ? { opacity: [0.5, 1, 0.5], scaleX: [0.82, 1, 0.82] }
                  : { opacity: 0.92, scaleX: 1 }
              }
              transition={
                celebrate
                  ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
                  : { type: "spring", stiffness: 70, damping: 16, mass: 1.1 }
              }
            />
            <motion.rect
              x={0}
              y={TUBE_H * 0.12}
              width={TUBE_W}
              height={TUBE_H * 0.76}
              fill={winColor}
              style={{ transformOrigin: `${TUBE_W / 2}px ${TUBE_H / 2}px` }}
              initial={{ opacity: 0 }}
              animate={
                celebrate
                  ? { opacity: [0.15, 0.4, 0.15], scaleX: [0.82, 1, 0.82] }
                  : { opacity: 0.35, scaleX: 1 }
              }
              transition={
                celebrate
                  ? { duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.06 }
                  : { duration: 0.45 }
              }
            />
          </g>
        )}

        <g>
          {SEQ.map((s, i) => {
            const slotSize = 32;
            const gap = 6;
            const totalW = slotSize * 3 + gap * 2;
            const startX = (TUBE_W - totalW) / 2;
            const x = startX + i * (slotSize + gap);
            const y = (TUBE_H - slotSize) / 2;

            if (won) {
              return (
                <g key={i} transform={`translate(${x}, ${y})`}>
                  <Shape
                    shape={s}
                    owner={winner!}
                    size={slotSize}
                    draw={true}
                    seed={i + 33}
                    color="#fff"
                  />
                </g>
              );
            }

            let owner: Owner | null = null;
            let lit = false;
            if (i === 0) {
              owner = "you";
              lit = progressYou >= 1;
            } else if (i === 2) {
              owner = "opp";
              lit = progressOpp >= 1;
            } else if (leader === "you" && progressYou >= 2) {
              owner = "you";
              lit = true;
            } else if (leader === "opp" && progressOpp >= 2) {
              owner = "opp";
              lit = true;
            }

            const color =
              owner === "you"
                ? "var(--player-you)"
                : owner === "opp"
                  ? "var(--player-opp)"
                  : "var(--ink-soft)";

            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <g style={{ opacity: lit ? 0 : 0.75 }}>
                  <Shape shape={s} owner="you" size={slotSize} draw={false} seed={i + 33} tentative />
                </g>
                {lit && owner && (
                  <Shape shape={s} owner={owner} size={slotSize} draw={true} seed={i + 33} />
                )}
                {lit && (
                  <motion.circle
                    cx={slotSize / 2}
                    cy={slotSize / 2}
                    r={slotSize * 0.55}
                    fill={color}
                    initial={{ opacity: 0.6, scale: 0.5 }}
                    animate={{ opacity: 0, scale: 1.4 }}
                    transition={{ duration: 0.9 }}
                    style={{ pointerEvents: "none" }}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

function MatchTab({
  match,
  target,
  label,
}: {
  match: MatchScore;
  target: number;
  label?: string;
}) {
  const slots: (Owner | null)[] = Array.from({ length: target }).map(
    (_, i) => match.history[i] ?? null,
  );
  const tabText = label ?? `best of ${target}`;
  return (
    <div className="relative" style={{ fontFamily: "var(--font-display)" }}>
      <svg width={196} height={30} viewBox="0 0 196 30" className="overflow-visible">
        <defs>
          <filter id="tab-rough" x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.4" />
          </filter>
        </defs>
        <g filter="url(#tab-rough)">
          <path
            d="M 6 24 Q 4 5 20 4 L 176 3 Q 192 4 190 24 Z"
            fill="var(--accent-purple)"
            fillOpacity={0.9}
          />
        </g>
        <text
          x={label ? 98 : 16}
          y={20}
          textAnchor={label ? "middle" : "start"}
          fontFamily="var(--font-display)"
          fontSize={14}
          fill="var(--paper)"
          fontWeight={700}
        >
          {tabText}
        </text>
      </svg>
      {!label && (
        <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          {slots.map((winner, i) => {
            const bg =
              winner === "you"
                ? "var(--player-you)"
                : winner === "opp"
                  ? "var(--player-opp)"
                  : "transparent";
            return (
              <span
                key={i}
                className="flex h-4 w-4 items-center justify-center rounded-full"
                style={{
                  background: bg,
                  border: "1.5px solid rgba(255,255,255,0.3)",
                  boxShadow: winner ? "0 1px 2px rgba(0,0,0,0.15)" : "none",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
