/**
 * SmokeScribble — looping crayon spiral that marks a collided (wasted) tile.
 *
 * Purpose: drawn on top of the two overlapping X/O shapes after a collision
 *          to visually cancel that tile. Feels like a puff of smoke rather
 *          than a jagged strike-through.
 * State: none.
 * Deps: motion/react + `crayon-rough` filter from CrayonDefs.
 */
import { motion } from "motion/react";

interface Props {
  size: number;
  seed?: number;
}

/** Build a spiraling smoke-like path via bezier curves. */
function buildSmokePath(size: number, seed: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size * 0.36;
  const turns = 2.4;
  const steps = 42;
  const jitter = (n: number) =>
    ((Math.sin(seed * 91.7 + n * 33.1) * 43758.5) % 1) * size * 0.02;

  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // spiral: radius shrinks from rMax → 0 as t goes 0→1
    const r = rMax * (1 - t * 0.85);
    const angle = t * Math.PI * 2 * turns + seed;
    const x = cx + Math.cos(angle) * r + jitter(i);
    const y = cy + Math.sin(angle) * r + jitter(i + 100);
    if (i === 0) {
      d = `M ${x} ${y}`;
    } else {
      // smooth curves with implied control points for a puffy look
      const prevAngle = ((i - 1) / steps) * Math.PI * 2 * turns + seed;
      const prevR = rMax * (1 - ((i - 1) / steps) * 0.85);
      const px = cx + Math.cos(prevAngle) * prevR;
      const py = cy + Math.sin(prevAngle) * prevR;
      const midX = (px + x) / 2 + jitter(i + 200);
      const midY = (py + y) / 2 + jitter(i + 300);
      d += ` Q ${midX} ${midY} ${x} ${y}`;
    }
  }
  return d;
}

export function SmokeScribble({ size, seed = 0 }: Props) {
  const d = buildSmokePath(size, seed);
  const sw = Math.max(2, size * 0.075);
  return (
    <g filter="url(#crayon-rough)" style={{ pointerEvents: "none" }}>
      <motion.path
        d={d}
        stroke="var(--ink-soft)"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      />
    </g>
  );
}
