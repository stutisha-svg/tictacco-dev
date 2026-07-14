import { motion } from "motion/react";
import type { ShapeKind, Owner } from "@/game/rules";

interface Props {
  shape: ShapeKind;
  owner: Owner;
  size: number;
  tentative?: boolean;
  draw?: boolean; // animate draw-in
  delay?: number;
  seed?: number;
}

function colorFor(owner: Owner) {
  return owner === "you" ? "var(--player-you)" : "var(--player-opp)";
}

export function Shape({ shape, owner, size, tentative, draw = true, delay = 0, seed = 0 }: Props) {
  const stroke = colorFor(owner);
  const sw = Math.max(3, size * 0.11);
  const pad = size * 0.22;
  const opacity = tentative ? 0.42 : 0.95;

  // slight jitter on endpoints for hand-drawn feel
  const j = (n: number) => (Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1;
  const wob = size * 0.04;

  if (shape === "X") {
    const p1 = `M ${pad + j(1) * wob} ${pad + j(2) * wob} Q ${size / 2 + j(3) * wob} ${
      size / 2 + j(4) * wob
    } ${size - pad + j(5) * wob} ${size - pad + j(6) * wob}`;
    const p2 = `M ${size - pad + j(7) * wob} ${pad + j(8) * wob} Q ${size / 2 + j(9) * wob} ${
      size / 2 + j(10) * wob
    } ${pad + j(11) * wob} ${size - pad + j(12) * wob}`;
    return (
      <g style={{ opacity }} filter="url(#crayon-soft)">
        <motion.path
          d={p1}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
          initial={draw ? { pathLength: 0 } : { pathLength: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay, ease: "easeOut" }}
        />
        <motion.path
          d={p2}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
          initial={draw ? { pathLength: 0 } : { pathLength: 1 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.35, delay: delay + 0.28, ease: "easeOut" }}
        />
      </g>
    );
  }

  // O — 1.05 turn spiral so it overshoots like a real hand
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - pad;
  const turns = 32;
  let d = "";
  for (let i = 0; i <= turns; i++) {
    const t = i / turns;
    const ang = -Math.PI / 2 + t * Math.PI * 2 * 1.04;
    const rr = r + j(i) * wob * 0.5;
    const x = cx + Math.cos(ang) * rr;
    const y = cy + Math.sin(ang) * rr;
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }
  return (
    <g style={{ opacity }} filter="url(#crayon-soft)">
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        fill="none"
        initial={draw ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, delay, ease: "easeOut" }}
      />
    </g>
  );
}
