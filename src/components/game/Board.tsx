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
            strokeOpacity={0.65}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.65 }}
            transition={{ duration: 0.5, delay: i * 0.015 }}
          />
        ))}
      </g>

      {/* Focused reveal spotlight — only around the opponent's tile so the
          rest of the board stays readable and not visually distracting. */}
      <AnimatePresence>
        {revealing && state.oppMove && (() => {
          const oi = state.oppMove.tile;
          const or = Math.floor(oi / SIZE);
          const oc = oi % SIZE;
          const cx = oc * cell + cell / 2;
          const cy = or * cell + cell / 2;
          const rInner = cell * 0.7;
          const rOuter = cell * 1.4;
          return (
            <motion.g
              key="opp-spot"
              style={{ pointerEvents: "none" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <defs>
                <radialGradient id="opp-spot-grad" cx={cx} cy={cy} r={rOuter} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                  <stop offset={`${(rInner / rOuter) * 100}%`} stopColor="rgba(0,0,0,0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
                </radialGradient>
              </defs>
              <rect x={0} y={0} width={boardPx} height={boardPx} fill="url(#opp-spot-grad)" />
              {/* subtle warm ring around the target tile */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={rInner}
                fill="none"
                stroke="rgba(255,220,150,0.7)"
                strokeWidth={2}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            </motion.g>
          );
        })()}
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

        // Tie-round: this tile is one of the "both won" tiles. Owner
        // determined by which placement is on the tile.
        const tieIdx = state.tieRound?.tiles.indexOf(i) ?? -1;
        const isTieTile = tieIdx >= 0;
        const tieOwner: "you" | "opp" | null = isTieTile
          ? tile.placements[0]?.owner ?? null
          : null;

        return (
          <g key={i} transform={`translate(${x}, ${y})`} style={{ pointerEvents: "none" }}>
            {inWin && (
              <motion.rect
                width={cell}
                height={cell}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fill:
                    state.winner?.owner === "you"
                      ? "var(--player-you)"
                      : "var(--player-opp)",
                }}
              />
            )}

            {/* Tie-round shading — one tile at a time, then scribble on top. */}
            {isTieTile && (
              <motion.rect
                width={cell}
                height={cell}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.32 }}
                transition={{ duration: 0.25, delay: 0.2 + tieIdx * 0.12 }}
                style={{
                  fill:
                    tieOwner === "you"
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
                delay={isOppReveal && p.owner === "opp" ? 0.5 : 0}
              />
            ))}

            {/* collision → smoke scribble on top */}
            {tile.dead && <SmokeScribble size={cell} seed={i} />}

            {/* tie-round scribble — sequentially, AFTER shading */}
            {isTieTile && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + tieIdx * 0.14, duration: 0.1 }}
              >
                <SmokeScribble size={cell} seed={i + 100} />
              </motion.g>
            )}

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

