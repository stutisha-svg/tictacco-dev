import { motion } from "motion/react";
import { CrayonDefs } from "./CrayonDefs";
import { Shape } from "./Shape";
import type { Owner } from "@/game/rules";

interface Props {
  progressYou: number; // 0..3
  progressOpp: number; // 0..3
  leader: Owner | null;
}

const SEQ = ["X", "O", "X"] as const;

export function XoxIndicator({ progressYou, progressOpp, leader }: Props) {
  // Left shapes (positions 0..2 from center outward) fill for "you" based on progressYou.
  // Simplification: number of shapes lit on each side = progress value (max 3).
  const size = 34;
  return (
    <div className="flex items-center gap-1.5 px-2">
      {SEQ.map((s, i) => {
        // decide fill: your side lit if progressYou > i (using rightmost of your triple)
        // We render three central shapes total; each is X/O/X. Fill decisions:
        const youLit = progressYou > i;
        const oppLit = progressOpp > i;
        // Middle shape belongs to leader
        const isMiddle = i === 1;
        let owner: Owner | null = null;
        let lit = false;
        if (isMiddle) {
          if (leader === "you" && progressYou >= 2) {
            owner = "you";
            lit = true;
          } else if (leader === "opp" && progressOpp >= 2) {
            owner = "opp";
            lit = true;
          }
        } else if (i === 0) {
          // leftmost -> you
          owner = "you";
          lit = youLit;
        } else {
          owner = "opp";
          lit = oppLit;
        }
        return (
          <motion.div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
            animate={{ scale: lit ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.6 }}
          >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
              <CrayonDefs />
              {/* base grey */}
              <g style={{ opacity: lit ? 0 : 1 }}>
                <Shape shape={s} owner="you" size={size} draw={false} seed={i + 33} tentative />
              </g>
              {lit && owner && (
                <Shape shape={s} owner={owner} size={size} draw={true} seed={i + 33} />
              )}
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
