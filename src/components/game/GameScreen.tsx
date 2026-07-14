import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useGameEngine } from "@/game/useGameEngine";
import { PlayerCards } from "./PlayerCards";
import { RoundTimer } from "./RoundTimer";
import { Board } from "./Board";

export function GameScreen() {
  const { state, tap, reset, roundMs } = useGameEngine();
  const [boardPx, setBoardPx] = useState(360);

  useEffect(() => {
    const compute = () => {
      const w = Math.min(window.innerWidth, 460) - 24;
      const h = window.innerHeight - 260;
      setBoardPx(Math.max(260, Math.min(w, h)));
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

  const tentativeColor = state.myTentative
    ? "var(--player-you)"
    : "var(--ink-soft)";

  const shake = state.phase === "won";

  return (
    <motion.div
      className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col items-center gap-3 py-4"
      animate={shake ? { x: [0, -6, 6, -4, 4, 0], y: [0, 4, -4, 3, -3, 0] } : {}}
      transition={{ duration: 0.6 }}
    >
      <PlayerCards
        progressYou={state.progressYou}
        progressOpp={state.progressOpp}
        leader={leader}
        round={state.round}
      />
      <RoundTimer
        running={state.phase === "placing"}
        duration={roundMs}
        color={tentativeColor}
        keyId={state.round}
      />

      <div className="mt-2 flex-1 flex items-start justify-center">
        <Board state={state} onTap={tap} boardPx={boardPx} />
      </div>

      <Footer state={state} onReset={reset} />
    </motion.div>
  );
}

function Footer({
  state,
  onReset,
}: {
  state: ReturnType<typeof useGameEngine>["state"];
  onReset: () => void;
}) {
  const label = (() => {
    if (state.phase === "won")
      return state.winner?.owner === "you" ? "you win!" : "rival wins";
    if (state.phase === "revealing") {
      if (state.lastReveal?.collision) return "collision — tile wasted";
      if (state.lastReveal?.opp && state.lastReveal.mine)
        return "revealing…";
      return "revealing rival's move";
    }
    if (state.myTentative)
      return `tap again to change · ${state.myTentative.shape}`;
    return "tap a tile — again for O, again to clear";
  })();

  return (
    <div className="flex w-full flex-col items-center gap-2 pb-4">
      <div
        className="text-base"
        style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
      >
        {label}
      </div>
      {state.phase === "won" && (
        <button
          onClick={onReset}
          className="rounded-full border-2 px-4 py-1 text-lg"
          style={{
            fontFamily: "var(--font-display)",
            borderColor: "var(--ink)",
            color: "var(--ink)",
            background: "var(--paper)",
          }}
        >
          play again
        </button>
      )}
    </div>
  );
}
