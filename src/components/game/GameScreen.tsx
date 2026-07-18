/**
 * GameScreen — top-level game container.
 *
 * Handles layout, the reveal-focus spotlight overlay, the win/lose badge
 * lifecycle (full → minimized floating card), the player-driven timer +
 * blank-turn warning, and the post-win crown.
 */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameEngine } from "@/game/useGameEngine";
import { PlayerCards } from "./PlayerCards";
import { RoundTimer } from "./RoundTimer";
import { Board } from "./Board";
import { WinBadge, MiniBadge, type BadgeKind } from "./WinBadge";
import { Confetti } from "./Confetti";

const BADGE_HOLD_MS = 1600;

export function GameScreen() {
  const { state, tap, reset, roundMs } = useGameEngine();
  const [boardPx, setBoardPx] = useState(320);
  const [badgeMinimized, setBadgeMinimized] = useState(false);

  useEffect(() => {
    const compute = () => {
      const w = Math.min(window.innerWidth, 460) - 24;
      const h = window.innerHeight - 340;
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
  const isLoss = badgeKind === "lose";

  useEffect(() => {
    if (!badgeKind) {
      setBadgeMinimized(false);
      return;
    }
    const t = setTimeout(() => setBadgeMinimized(true), BADGE_HOLD_MS);
    return () => clearTimeout(t);
  }, [badgeKind]);

  const crownedWinner =
    badgeMinimized && badgeKind === "win" ? state.winner?.owner ?? null : null;

  // When the player has lost, drain the world of colour (except the "play
  // again" card, which stays vivid to invite recovery).
  const greyscale = isLoss;

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
      style={{
        filter: greyscale ? "grayscale(1) brightness(0.85)" : "none",
        transition: "filter 0.6s ease",
      }}
    >
      <PlayerCards
        progressYou={state.progressYou}
        progressOpp={state.progressOpp}
        leader={leader}
        crownedWinner={crownedWinner}
        match={state.match}
        matchTarget={state.matchTarget}
      />

      <div className="mt-2 flex items-start justify-center">
        <Board state={state} onTap={tap} boardPx={boardPx} />
      </div>

      {/* When a game is won, swap the bottom controls for the minimized
          result card so it fits neatly between the board and the timer slot. */}
      <div className="mt-3 flex w-full flex-col items-center gap-3 px-4 pb-4">
        {badgeKind && badgeMinimized ? (
          <MinimizedResultCard kind={badgeKind} onReset={reset} matchOver={state.matchOver} />
        ) : (
          <BottomBar
            state={state}
            roundMs={roundMs}
            tentativeColor={tentativeColor}
          />
        )}
      </div>

      {/* Simultaneous XOX — "It's a tie" badge; scribbles hold back until it exits. */}
      <AnimatePresence>
        {state.tieRound && (
          <motion.div
            key="tie-overlay"
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-6 px-6">
              <div className="relative h-[200px] w-full">
                <WinBadge kind="tie" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            {shouldCelebrate && <Confetti kind="win" />}
            {isLoss && <Confetti kind="lose" />}
            <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-6 px-6">
              <div className="relative h-[200px] w-full">
                <WinBadge kind={badgeKind} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* After the loss badge minimizes, keep the sad-face rain going gently */}
      {isLoss && badgeMinimized && <Confetti kind="lose" count={22} />}
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
  const revealing = state.phase === "revealing";
  const collision = !!state.lastReveal?.collision;
  const tie = !!state.tieRound;

  const status = useMemo(() => {
    if (revealing && tie) return { text: "both sides scored — those tiles are toast", tone: "warn" as const };
    if (revealing && collision) return { text: "collision — tile wasted", tone: "warn" as const };
    if (revealing) return { text: "revealing rival's move…", tone: "info" as const };
    if (idleWarn) return { text: "your move — rival is waiting", tone: "warn" as const };
    if (state.myTentative) return { text: `tap again to change · ${state.myTentative.shape}`, tone: "info" as const };
    return { text: "tap a tile — again for O, again to clear", tone: "info" as const };
  }, [revealing, collision, tie, idleWarn, state.myTentative]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <StatusCard text={status.text} tone={status.tone} />
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

/** StatusCard — jazzy hand-drawn card for the unified round status line. */
function StatusCard({ text, tone }: { text: string; tone: "info" | "warn" }) {
  const accent = tone === "warn" ? "var(--player-you)" : "var(--ink)";
  return (
    <div className="relative w-full max-w-[320px]">
      <svg
        width="100%"
        height={44}
        viewBox="0 0 320 44"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <filter id="status-rough" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="6" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        <g filter="url(#status-rough)">
          {/* card shape — slightly imperfect corners */}
          <path
            d="M 8 36 Q 4 8 22 6 L 300 4 Q 316 8 314 34 Q 312 42 296 40 L 22 42 Q 6 42 8 36 Z"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          {/* left accent dot */}
          <circle cx={16} cy={22} r={4} fill={accent} />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.span
            key={text}
            className="text-body-md text-center"
            style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * MinimizedResultCard — persistent card containing the mini ribbon badge and
 * the "play again" (or "new match") button. Slots into the space between the
 * board and where the timer used to be.
 */
function MinimizedResultCard({
  kind,
  onReset,
  matchOver,
}: {
  kind: BadgeKind;
  onReset: () => void;
  matchOver: boolean;
}) {
  return (
    <motion.div
      key="mini-card"
      className="flex w-full max-w-[360px] flex-col items-center"
      initial={{ y: 30, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{ filter: "none" }}
    >
      <div
        className="relative flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3"
        style={{
          borderColor: "var(--ink)",
          background: "var(--paper)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          // Keep the card vivid even when the rest of the screen is greyscale
          filter: "none",
        }}
      >
        <MiniBadge kind={kind} />
        <button
          onClick={onReset}
          className="rounded-full border-2 px-4 py-2 text-body-md transition-all duration-200 ease-in-out hover:scale-[1.04] active:scale-[0.96]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "normal",
            borderColor: "var(--ink)",
            color: "var(--paper)",
            background: "var(--ink)",
          }}
        >
          {matchOver ? "new match" : "play again"}
        </button>
      </div>
    </motion.div>
  );
}
