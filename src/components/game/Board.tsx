import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import type { GameState } from "@/game/useGameEngine";
import { SIZE } from "@/game/rules";
import { CrayonDefs } from "./CrayonDefs";
import { Shape } from "./Shape";
import { SmokeScribble } from "./SmokeScribble";

interface Props {
  state: GameState;
  onTap: (tile: number) => void;
  boardPx: number;
}

export function Board({ state, onTap, boardPx }: Props) {
  const cell = boardPx / SIZE;
  const revealing = state.phase === "revealing";

  // STRAIGHT grid lines — crayon texture comes from the SVG filter, not from
  // wobbled coordinates.
  const gridPaths = useMemo(() => {
    const paths: { d: string; key: string }[] = [];
    for (let r = 0; r <= SIZE; r++) {
      const y = r * cell;
      paths.push({ d: `M 0 ${y} L ${boardPx} ${y}`, key: `h${r}` });
    }
    for (let c = 0; c <= SIZE; c++) {
      const x = c * cell;
      paths.push({ d: `M ${x} 0 L ${x} ${boardPx}`, key: `v${c}` });
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

      {/* Grid strokes: straight lines with crayon filter for grainy texture. */}
      <g filter="url(#crayon-soft)" style={{ pointerEvents: "none" }}>
        {gridPaths.map((p, i) => (
          <motion.path
            key={p.key}
            d={p.d}
            stroke="var(--ink)"
            strokeOpacity={0.6}
            strokeWidth={2.4}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.015 }}
          />
        ))}
      </g>

      {/* Skeletal reveal — thicker pulse along the same straight grid. */}
      <AnimatePresence>
        {revealing && (
          <g style={{ pointerEvents: "none" }} filter="url(#crayon-rough)">
            {gridPaths.map((p, i) => (
              <motion.path
                key={`sk-${p.key}`}
                d={p.d}
                stroke="var(--player-you)"
                strokeWidth={3.6}
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0.95 }}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fill:
                    state.winner?.owner === "you"
                      ? "var(--player-you)"
                      : "var(--player-opp)",
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

            {/* collision → smoke scribble on top */}
            {tile.dead && <SmokeScribble size={cell} seed={i} />}

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
