/**
 * Shape — renders a hand-drawn X or O glyph inside a grid cell using the
 * shared Caveat crayon font. font-style is forced to normal so glyphs never
 * render italic.
 */
import { motion } from "motion/react";
import type { ShapeKind, Owner } from "@/game/rules";

interface ShapeProps {
  shape: ShapeKind;
  owner: Owner;
  size: number;
  tentative?: boolean;
  draw?: boolean;
  delay?: number;
  seed?: number;
  /** Optional override (e.g. white glyphs on a filled win tube). */
  color?: string;
}

function colorForOwner(owner: Owner): string {
  return owner === "you" ? "var(--player-you)" : "var(--player-opp)";
}

export function Shape({
  shape,
  owner,
  size,
  tentative,
  draw = true,
  delay = 0,
  seed = 0,
  color,
}: ShapeProps) {
  const stroke = color ?? colorForOwner(owner);
  const opacity = tentative ? 0.45 : 1;
  const jitter = (n: number) =>
    (Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1;
  const rot = jitter(1) * 8;
  const dx = jitter(2) * (size * 0.03);
  const dy = jitter(3) * (size * 0.03);

  return (
    <motion.g
      style={{ opacity, transformOrigin: `${size / 2}px ${size / 2}px` }}
      initial={draw ? { scale: 0.85, opacity: 0.15 } : false}
      animate={{ scale: 1, opacity }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      filter="url(#crayon-soft)"
    >

      <text
        x={size / 2 + dx}
        y={size / 2 + dy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display)"
        fontStyle="normal"
        fontWeight={700}
        fontSize={size * 0.85}
        fill={stroke}
        stroke={stroke}
        strokeWidth={size * 0.03}
        paintOrder="stroke"
        transform={`rotate(${rot} ${size / 2} ${size / 2})`}
      >
        {shape}
      </text>
    </motion.g>
  );
}
