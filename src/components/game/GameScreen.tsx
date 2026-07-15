/**
 * GameScreen — top-level game container.
 *
 * Purpose: wires the game engine to presentation components; manages layout,
 *          the win/lose overlay, and the end-of-round drama (confetti or
 *          shake).
 * State: engine state via useGameEngine + responsive `boardPx` sizing.
 * Deps: Board, PlayerCards, RoundTimer, WinBadge, Confetti.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameEngine } from "@/game/useGameEngine";
import { PlayerCards } from "./PlayerCards";
import { RoundTimer } from "./RoundTimer";
import { Board } from "./Board";
import { WinBadge, type BadgeKind } from "./WinBadge";
import { Confetti } from "./Confetti";

export function GameScreen() {
  const { state, tap, reset, roundMs } = useGameEngine();
  const [boardPx, setBoardPx] = useState(320);

  useEffect(() => {
    const compute = () => {
      const w = Math.min(window.innerWidth, 460) - 24;
      const h = window.innerHeight - 300;
      setBoardPx(Math.max(240, Math.min(w, h)));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const leader =
    state.progressYou === state.progressOpp
      ? null
      : state.progressYou > state.progressOpp
        ? ("you" as const)
        : ("opp" as const);

  const tentativeColor = state.myTentative ? "var(--player-you)" : "var(--ink-soft)";

  const badgeKind: BadgeKind | null =
    state.phase === "won"
      ? state.winner?.owner === "you"
        ? "win"
        : state.winner
          ? "lose"
          : "tie"
      : null;

  // Only shake when the player LOSES; winning gets confetti + spring instead.
  const shouldShake = badgeKind === "lose";
  const shouldCelebrate = badgeKind === "win";

  return (
    <motion.div
      className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col items-center gap-3 py-4"
      animate={
        shouldShake
          ? { x: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, 4, -4, 3, -3, 0, 0, 0] }
          : shouldCelebrate
            ? { scale: [1, 1.02, 1], y: [0, -6, 0] }
            : {}
      }
      transition={{ duration: shouldCelebrate ? 0.9 : 0.6 }}
    >
      <PlayerCards
        progressYou={state.progressYou}
        progressOpp={state.progressOpp}
        leader={leader}
      />

      <div className="mt-2 flex-1 flex items-start justify-center">
        <Board state={state} onTap={tap} boardPx={boardPx} />
      </div>

      <BottomBar
        state={state}
        onReset={reset}
        roundMs={roundMs}
        tentativeColor={tentativeColor}
      />

      {/* Result overlay: dimmed background + slide-in badge + celebration */}
      <AnimatePresence>
        {badgeKind && (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
            {shouldCelebrate && <Confetti />}
            <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-6 px-6">
              <div className="relative h-[200px] w-full">
                <WinBadge kind={badgeKind} />
              </div>
              <motion.button
                onClick={reset}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="pointer-events-auto rounded-full border-2 px-6 py-2 text-body-lg transition-all duration-200 ease-in-out hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  fontFamily: "var(--font-display)",
                  borderColor: "var(--paper)",
                  color: "var(--paper)",
                  background: "transparent",
                }}
              >
                play again
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface BottomBarProps {
  state: ReturnType<typeof useGameEngine>["state"];
  onReset: () => void;
  roundMs: number;
  tentativeColor: string;
}

function BottomBar({ state, roundMs, tentativeColor }: BottomBarProps) {
  const label = (() => {
    if (state.phase === "won") return "";
    if (state.phase === "revealing") {
      if (state.lastReveal?.collision) return "collision — tile wasted";
      if (state.lastReveal?.opp && state.lastReveal.mine) return "revealing…";
      return "revealing rival's move";
    }
    if (state.myTentative)
      return `tap again to change · ${state.myTentative.shape}`;
    return "tap a tile — again for O, again to clear";
  })();

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-4">
      <div className="text-body-md" style={{ color: "var(--ink)" }}>
        {label}
      </div>
      <RoundTimer
        running={state.phase === "placing"}
        duration={roundMs}
        color={tentativeColor}
        keyId={state.round}
      />
    </div>
  );
}
