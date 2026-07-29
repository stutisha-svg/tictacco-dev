import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import type { GameState } from "@/game/useGameEngine";
import { SIZE } from "@/game/rules";
import { CrayonDefs } from "./CrayonDefs";
import { Shape } from "./Shape";
import { SmokeScribble } from "./SmokeScribble";
import { BoardWaitingOverlay } from "./BoardWaitingOverlay";

interface Props {
  state: GameState;
  onTap: (tile: number) => void;
  boardPx: number;
}

export function Board({ state, onTap, boardPx }: Props) {
  const cell = boardPx / SIZE;
  const revealing = state.phase === "revealing";
  const waiting = state.phase === "placing" && state.idleWarning;

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
    <div className="relative" style={{ width: boardPx, height: boardPx }}>
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

      {/* Focused reveal spotlight — soft radial darkening around the
          opponent's tile only. No ring drawn on the tile itself. */}
      <AnimatePresence>
        {revealing && state.oppMove && (() => {
          const oi = state.oppMove.tile;
          const or = Math.floor(oi / SIZE);
          const oc = oi % SIZE;
          const cx = oc * cell + cell / 2;
          const cy = or * cell + cell / 2;
          const rInner = cell * 0.75;
          const rOuter = cell * 1.6;
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

        // Tie-round shading persists after tiles are marked dead. A
        // "tie-dead" tile has exactly one placement + dead=true. A collision-
        // dead tile has two placements.
        const tieIdx = state.tieRound?.tiles.indexOf(i) ?? -1;
        const isTieActive = tieIdx >= 0;
        const isTieDead = tile.dead && tile.placements.length === 1;
        const isTieTile = isTieActive || isTieDead;
        const tieOwner: "you" | "opp" | null = isTieTile
          ? tile.placements[0]?.owner ?? null
          : null;
        const isCollision = tile.dead && tile.placements.length >= 2;

        return (
          <g key={i} transform={`translate(${x}, ${y})`} style={{ pointerEvents: "none" }}>
            {inWin && (
              <motion.rect
                width={cell}
                height={cell}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fill:
                    state.winner?.owner === "you"
                      ? "var(--player-you)"
                      : "var(--player-opp)",
                }}
              />
            )}

            {/* Tie-tile base shading — sequential during the tie reveal, then
                persists at the lighter shade after tiles are locked. */}
            {isTieTile && (
              <motion.rect
                width={cell}
                height={cell}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{
                  duration: 0.35,
                  delay: isTieActive ? 0.15 + Math.max(0, tieIdx) * 0.1 : 0,
                }}
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

            {/* collision → smoke scribble on top (immediate) */}
            {isCollision && <SmokeScribble size={cell} seed={i} />}

            {/* tie-dead → scribble draws AFTER the tie badge exits (i.e.
                only once the tile becomes dead in the next round). */}
            {isTieDead && <SmokeScribble size={cell} seed={i + 100} />}



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

      <AnimatePresence>
        {waiting && (
          <motion.div
            key="board-waiting"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <BoardWaitingOverlay boardPx={boardPx} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

