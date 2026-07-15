import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import type { GameState } from "@/game/useGameEngine";
import { SIZE } from "@/game/rules";
import { CrayonDefs } from "./CrayonDefs";
import { Shape } from "./Shape";
import { DeadScribble } from "./DeadScribble";

interface Props {
  state: GameState;
  onTap: (tile: number) => void;
  boardPx: number;
}

/** deterministic jitter */
function jit(seed: number) {
  return ((Math.sin(seed * 12.9898) * 43758.5453) % 1) * 2 - 1;
}

export function Board({ state, onTap, boardPx }: Props) {
  const cell = boardPx / SIZE;
  const revealing = state.phase === "revealing";
  const won = state.phase === "won";

  const gridPaths = useMemo(() => {
    const paths: { d: string; key: string }[] = [];
    // horizontals (SIZE+1 lines)
    for (let r = 0; r <= SIZE; r++) {
      const y = r * cell;
      let d = `M 0 ${y + jit(r * 3) * 1.5}`;
      const segs = 10;
      for (let s = 1; s <= segs; s++) {
        const x = (boardPx * s) / segs;
        d += ` L ${x} ${y + jit(r * 3 + s) * 1.8}`;
      }
      paths.push({ d, key: `h${r}` });
    }
    for (let c = 0; c <= SIZE; c++) {
      const x = c * cell;
      let d = `M ${x + jit(c * 7) * 1.5} 0`;
      const segs = 10;
      for (let s = 1; s <= segs; s++) {
        const y = (boardPx * s) / segs;
        d += ` L ${x + jit(c * 7 + s) * 1.8} ${y}`;
      }
      paths.push({ d, key: `v${c}` });
    }
    return paths;
  }, [cell, boardPx]);

  const winSet = new Set(state.winner?.line ?? []);

  return (
    <svg
      width={boardPx}
      height={boardPx}
      viewBox={`0 0 ${boardPx} ${boardPx}`}
      className="block touch-none select-none"
      style={{ overflow: "visible" }}
    >
      <CrayonDefs />

      {/* invisible tap surface per tile */}
      {Array.from({ length: SIZE * SIZE }).map((_, i) => {
        const r = Math.floor(i / SIZE);
        const c = i % SIZE;
        return (
          <rect
            key={`hit-${i}`}
            x={c * cell}
            y={r * cell}
            width={cell}
            height={cell}
            fill="transparent"
            onPointerDown={() => onTap(i)}
            style={{ cursor: "pointer" }}
          />
        );
      })}

      {/* grid strokes (drawn above hit surface visually, but pointer-events off) */}
      <g filter="url(#crayon-soft)" style={{ pointerEvents: "none" }}>
        {gridPaths.map((p, i) => (
          <motion.path
            key={p.key}
            d={p.d}
            stroke="var(--ink)"
            strokeOpacity={0.55}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.55 }}
            transition={{ duration: 0.6, delay: i * 0.02 }}
          />
        ))}
      </g>

      {/* skeletal reveal pulse over grid */}
      <AnimatePresence>
        {revealing && (
          <g style={{ pointerEvents: "none" }} filter="url(#crayon-rough)">
            {gridPaths.map((p, i) => (
              <motion.path
                key={`sk-${p.key}`}
                d={p.d}
                stroke="var(--ink)"
                strokeWidth={3.2}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, delay: (i % 9) * 0.04, ease: "easeOut" }}
              />
            ))}
          </g>
        )}
      </AnimatePresence>

      {/* tiles content */}
      {state.board.map((tile, i) => {
        const r = Math.floor(i / SIZE);
        const c = i % SIZE;
        const x = c * cell;
        const y = r * cell;
        const tent = state.myTentative && state.myTentative.tile === i ? state.myTentative : null;
        const isOppReveal = state.oppMove?.tile === i && revealing;
        const inWin = winSet.has(i);

        return (
          <g key={i} transform={`translate(${x}, ${y})`} style={{ pointerEvents: "none" }}>
            {inWin && (
              <motion.rect
                width={cell}
                height={cell}
                fill="var(--player-you)"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: state.winner?.owner === "you" ? 0.22 : 0,
                }}
                style={{
                  fill: state.winner?.owner === "you" ? "var(--player-you)" : "var(--player-opp)",
                }}
              />
            )}

            {/* committed placements */}
            {tile.placements.map((p, k) => (
              <Shape
                key={`p-${k}`}
                shape={p.shape}
                owner={p.owner}
                size={cell}
                seed={i * 7 + k}
                draw={isOppReveal && p.owner === "opp"}
                delay={isOppReveal && p.owner === "opp" ? 0.7 : 0}
              />
            ))}

            {/* dead scribble */}
            {tile.dead && <DeadScribble size={cell} seed={i} />}

            {/* my tentative preview */}
            {tent && !tile.dead && tile.placements.length === 0 && (
              <motion.g
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                style={{ transformOrigin: `${cell / 2}px ${cell / 2}px` }}
              >
                <Shape
                  shape={tent.shape}
                  owner="you"
                  size={cell}
                  tentative
                  draw={false}
                  seed={i}
                />
              </motion.g>
            )}
          </g>
        );
      })}

    </svg>
  );
}
