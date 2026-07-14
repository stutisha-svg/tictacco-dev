import { motion } from "motion/react";

interface Props {
  size: number;
  seed?: number;
}

/** Black crayon scribble marking a wasted tile. */
export function DeadScribble({ size, seed = 0 }: Props) {
  const pad = size * 0.15;
  const rows = 5;
  const j = (n: number) => (Math.sin(seed * 91.234 + n * 45.13) * 43758.5) % 1;
  let d = "";
  for (let i = 0; i <= rows; i++) {
    const y = pad + ((size - 2 * pad) * i) / rows + j(i) * 3;
    const x1 = pad + j(i + 10) * 4;
    const x2 = size - pad + j(i + 20) * 4;
    if (i === 0) d += `M ${x1} ${y}`;
    else {
      // zig-zag scribble
      d += ` L ${i % 2 === 0 ? x1 : x2} ${y}`;
    }
    d += ` L ${i % 2 === 0 ? x2 : x1} ${y}`;
  }
  const sw = Math.max(2.5, size * 0.08);
  return (
    <g filter="url(#crayon-rough)">
      <motion.path
        d={d}
        stroke="var(--dead)"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0.9 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeInOut" }}
      />
    </g>
  );
}
