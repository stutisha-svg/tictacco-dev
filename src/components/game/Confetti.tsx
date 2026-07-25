/**
 * Confetti — hand-drawn crayon confetti rain for celebratory (win) or
 * mournful (loss) moments.
 *
 * Purpose: renders ~40 pieces falling + rotating from the top of the
 * viewport. For "lose", pieces are hand-drawn dead-face glyphs (X eyes,
 * flat mouth) rendered as small SVGs in muted greys for extra drama.
 */
import { useMemo } from "react";
import { motion } from "motion/react";

export type ConfettiKind = "win" | "lose";

interface ConfettiProps {
  count?: number;
  kind?: ConfettiKind;
}

interface Piece {
  id: number;
  x: number;
  hue: string;
  glyph: "x" | "o" | "~" | "face";
  size: number;
  rot: number;
  delay: number;
  drift: number;
  duration: number;
}

const WIN_HUES = [
  "var(--player-you)",
  "var(--player-opp)",
  "var(--ink)",
];
const LOSE_HUES = ["var(--ink)", "var(--ink-soft)", "#444"];

function buildPieces(count: number, kind: ConfettiKind): Piece[] {
  const pieces: Piece[] = [];
  const glyphs: Piece["glyph"][] =
    kind === "lose" ? ["face", "face", "face", "x"] : ["x", "o", "~"];
  const hues = kind === "lose" ? LOSE_HUES : WIN_HUES;
  for (let i = 0; i < count; i++) {
    const r = (n: number) =>
      Math.abs((Math.sin(i * 12.9 + n * 78.2) * 43758.5) % 1);
    pieces.push({
      id: i,
      x: r(1) * 100,
      hue: hues[Math.floor(r(2) * hues.length)],
      glyph: glyphs[Math.floor(r(3) * glyphs.length)],
      size: kind === "lose" ? 24 + r(4) * 18 : 18 + r(4) * 18,
      rot: (r(5) - 0.5) * (kind === "lose" ? 360 : 720),
      delay: r(6) * 0.9,
      drift: (r(7) - 0.5) * 80,
      duration: (kind === "lose" ? 2.6 : 1.6) + r(8) * 1.6,
    });
  }
  return pieces;
}

/** Small hand-drawn "dead" face (X eyes, flat mouth). */
function DeadFace({ size, color, id }: { size: number; color: string; id: number }) {
  const s = size;
  const filterId = `face-rough-${id}`;
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.0" numOctaves="2" seed="5" />
          <feDisplacementMap in="SourceGraphic" scale="1.2" />
        </filter>
      </defs>
      <g
        stroke={color}
        strokeWidth={Math.max(1.4, s * 0.06)}
        strokeLinecap="round"
        fill="none"
        filter={`url(#${filterId})`}
      >
        <circle cx={s / 2} cy={s / 2} r={s * 0.4} />
        {/* X eyes */}
        <path d={`M ${s * 0.3} ${s * 0.4} L ${s * 0.42} ${s * 0.52}`} />
        <path d={`M ${s * 0.42} ${s * 0.4} L ${s * 0.3} ${s * 0.52}`} />
        <path d={`M ${s * 0.58} ${s * 0.4} L ${s * 0.7} ${s * 0.52}`} />
        <path d={`M ${s * 0.7} ${s * 0.4} L ${s * 0.58} ${s * 0.52}`} />
        {/* flat sad mouth */}
        <path d={`M ${s * 0.34} ${s * 0.72} L ${s * 0.66} ${s * 0.7}`} />
      </g>
    </svg>
  );
}

export function Confetti({ count = 42, kind = "win" }: ConfettiProps) {
  const pieces = useMemo(() => buildPieces(count, kind), [count, kind]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute select-none"
          style={{
            left: `${piece.x}%`,
            top: -40,
            color: piece.hue,
            fontFamily: "var(--font-display)",
            fontSize: piece.size,
            fontWeight: 700,
            textShadow: "0 1px 0 rgba(0,0,0,0.08)",
            lineHeight: 1,
          }}
          initial={{ y: -40, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            x: piece.drift,
            rotate: piece.rot,
            opacity: [0, 1, 1, 0.9],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: 0.4,
          }}
        >
          {piece.glyph === "face" ? (
            <DeadFace id={piece.id} size={piece.size} color={piece.hue} />
          ) : (
            piece.glyph
          )}
        </motion.span>
      ))}
    </div>
  );
}
