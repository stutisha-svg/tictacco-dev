/**
 * Confetti — hand-drawn crayon confetti burst for celebratory moments.
 *
 * Purpose: renders ~40 short squiggle/x/o marks that fall + rotate after a win.
 * State: none — pieces are deterministically generated once per mount.
 * Deps: motion/react.
 */
import { useMemo } from "react";
import { motion } from "motion/react";

interface ConfettiProps {
  count?: number;
}

interface Piece {
  id: number;
  x: number;
  hue: string;
  glyph: "x" | "o" | "~";
  size: number;
  rot: number;
  delay: number;
  drift: number;
  duration: number;
}

const HUES = [
  "var(--player-you)",
  "var(--player-opp)",
  "var(--ink)",
];

function buildPieces(count: number): Piece[] {
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i++) {
    const r = (n: number) =>
      Math.abs((Math.sin(i * 12.9 + n * 78.2) * 43758.5) % 1);
    const glyphs: Piece["glyph"][] = ["x", "o", "~"];
    pieces.push({
      id: i,
      x: r(1) * 100,
      hue: HUES[Math.floor(r(2) * HUES.length)],
      glyph: glyphs[Math.floor(r(3) * glyphs.length)],
      size: 18 + r(4) * 18,
      rot: (r(5) - 0.5) * 720,
      delay: r(6) * 0.6,
      drift: (r(7) - 0.5) * 80,
      duration: 1.6 + r(8) * 1.4,
    });
  }
  return pieces;
}

export function Confetti({ count = 42 }: ConfettiProps) {
  const pieces = useMemo(() => buildPieces(count), [count]);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute font-display select-none"
          style={{
            left: `${piece.x}%`,
            top: -30,
            color: piece.hue,
            fontFamily: "var(--font-display)",
            fontSize: piece.size,
            fontWeight: 700,
            textShadow: "0 1px 0 rgba(0,0,0,0.08)",
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
          }}
        >
          {piece.glyph}
        </motion.span>
      ))}
    </div>
  );
}
