/**
 * GameScreen — top-level game container.
 *
 * Handles layout, the reveal-focus spotlight overlay, the win/lose badge
 * lifecycle (full → minimized floating card), the player-driven timer +
 * blank-turn warning, and the post-win crown.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameEngine } from "@/game/useGameEngine";
import { PlayerCards } from "./PlayerCards";
import { RoundTimer } from "./RoundTimer";
import { Board } from "./Board";
import { WinBadge, type BadgeKind } from "./WinBadge";
import { Confetti } from "./Confetti";

const BADGE_HOLD_MS = 1600;

export function GameScreen() {
  const { state, tap, reset, roundMs } = useGameEngine();
  const [boardPx, setBoardPx] = useState(320);
  const [badgeMinimized, setBadgeMinimized] = useState(false);

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

  const tentativeColor = "var(--ink)";

  const badgeKind: BadgeKind | null =
    state.phase === "won"
      ? state.winner?.owner === "you"
        ? "win"
        : state.winner
          ? "lose"
          : "tie"
      : null;

  // Only shake when the player LOSES; winning gets confetti + spring instead.
  const shouldShake = badgeKind === "lose" && !badgeMinimized;
  const shouldCelebrate = badgeKind === "win" && !badgeMinimized;

  // After the big badge holds for a moment, shrink it to a floating card
  // so the player can see the final grid state + the crown.
  useEffect(() => {
    if (!badgeKind) {
      setBadgeMinimized(false);
      return;
    }
    const t = setTimeout(() => setBadgeMinimized(true), BADGE_HOLD_MS);
    return () => clearTimeout(t);
  }, [badgeKind]);

  const crownedWinner = badgeMinimized ? state.winner?.owner ?? null : null;

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
        crownedWinner={crownedWinner}
      />

      <div className="mt-2 flex-1 flex items-start justify-center">
        <Board state={state} onTap={tap} boardPx={boardPx} />
      </div>

      <BottomBar
        state={state}
        roundMs={roundMs}
        tentativeColor={tentativeColor}
      />

      {/* Reveal focus overlay: dim + spotlight sweep + enlarged banner */}
      <RevealFocus
        active={state.phase === "revealing"}
        collision={!!state.lastReveal?.collision}
      />

      {/* Full-size result badge (shown briefly, then minimized) */}
      <AnimatePresence>
        {badgeKind && !badgeMinimized && (
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized floating card with the mini badge + play again */}
      <AnimatePresence>
        {badgeKind && badgeMinimized && (
          <MinimizedResultCard kind={badgeKind} onReset={reset} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface BottomBarProps {
  state: ReturnType<typeof useGameEngine>["state"];
  roundMs: number;
  tentativeColor: string;
}

function BottomBar({ state, roundMs, tentativeColor }: BottomBarProps) {
  const idleWarn = state.idleWarning && state.phase === "placing";
  const label = (() => {
    if (state.phase === "won") return "";
    if (state.phase === "revealing") return ""; // banner handles it
    if (idleWarn) return "your move — rival is waiting";
    if (state.myTentative)
      return `tap again to change · ${state.myTentative.shape}`;
    return "tap a tile — again for O, again to clear";
  })();

  return (
    <div className="flex w-full flex-col items-center gap-2 px-4 pb-4">
      <div className="flex items-center gap-2 text-body-md" style={{ color: "var(--ink)" }}>
        <AnimatePresence>
          {idleWarn && (
            <motion.span
              key="warn-dot"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "#d93a3a", boxShadow: "0 0 0 rgba(217,58,58,0.6)" }}
              initial={{ scale: 0 }}
              animate={{
                scale: [1, 1.35, 1],
                boxShadow: [
                  "0 0 0 rgba(217,58,58,0.6)",
                  "0 0 0 6px rgba(217,58,58,0)",
                  "0 0 0 rgba(217,58,58,0)",
                ],
              }}
              exit={{ scale: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </AnimatePresence>
        <span>{label}</span>
      </div>
      <RoundTimer
        running={state.phase === "placing" && state.roundStarted}
        duration={roundMs}
        color={tentativeColor}
        keyId={state.round}
        idleWarning={idleWarn}
      />
    </div>
  );
}

function RevealFocus({ active, collision }: { active: boolean; collision: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {/* dim + radial spotlight over the board */}
          <motion.div
            key="reveal-dim"
            className="pointer-events-none fixed inset-0 z-20"
            style={{
              background:
                "radial-gradient(ellipse 55% 40% at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 90%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          {/* sweeping warm shine across the board */}
          <motion.div
            key="reveal-sweep"
            className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute top-1/4 h-1/2 w-1/3"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255, 220, 150, 0.55) 50%, transparent 100%)",
                mixBlendMode: "screen",
                filter: "blur(24px)",
              }}
              initial={{ x: "-60%" }}
              animate={{ x: "160%" }}
              transition={{ duration: 0.9, ease: "easeInOut", repeat: 1 }}
            />
          </motion.div>
          {/* enlarged banner */}
          <motion.div
            key="reveal-banner"
            className="pointer-events-none fixed left-0 right-0 top-[18%] z-30 flex justify-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="rounded-2xl px-6 py-2 text-heading"
              style={{
                color: "var(--paper)",
                fontFamily: "var(--font-display)",
                fontStyle: "normal",
                background: "rgba(0,0,0,0.55)",
                textShadow: "0 2px 8px rgba(0,0,0,0.5)",
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            >
              {collision ? "collision — tile wasted" : "revealing…"}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MinimizedResultCard({
  kind,
  onReset,
}: {
  kind: BadgeKind;
  onReset: () => void;
}) {
  const label =
    kind === "win" ? "YOU WIN!" : kind === "lose" ? "RIVAL WINS" : "STALEMATE";
  const accent =
    kind === "win"
      ? "var(--player-you)"
      : kind === "lose"
        ? "var(--player-opp)"
        : "var(--ink-soft)";
  return (
    <motion.div
      key="mini-card"
      className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
      initial={{ y: 40, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
    >
      <div
        className="flex items-center gap-4 rounded-2xl border-2 px-4 py-2.5"
        style={{
          borderColor: "var(--ink)",
          background: "var(--paper)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 rounded-full"
            style={{ background: accent }}
          />
          <span
            className="text-body-lg"
            style={{
              color: "var(--ink)",
              fontFamily: "var(--font-display)",
              fontStyle: "normal",
              fontWeight: 700,
            }}
          >
            {label}
          </span>
        </div>
        <button
          onClick={onReset}
          className="rounded-full border-2 px-4 py-1.5 text-body-md transition-all duration-200 ease-in-out hover:scale-[1.04] active:scale-[0.96]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "normal",
            borderColor: "var(--ink)",
            color: "var(--ink)",
            background: "transparent",
          }}
        >
          play again
        </button>
      </div>
    </motion.div>
  );
}
