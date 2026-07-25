/**
 * GameScreen — top-level game container.
 *
 * Handles layout, the reveal-focus spotlight overlay, the win/lose badge
 * lifecycle (full → minimized floating card), the player-driven timer +
 * blank-turn warning, the post-win crown, the fluid ink-pour greyscale on
 * loss, reactions between players, and the achievements rail.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useGameEngine } from "@/game/useGameEngine";
import { PlayerCards } from "./PlayerCards";
import { RoundTimer } from "./RoundTimer";
import { Board } from "./Board";
import { WinBadge, MiniBadge, type BadgeKind } from "./WinBadge";
import { Confetti } from "./Confetti";
import { ReactionWheel } from "./ReactionWheel";
import {
  REACTIONS,
  COLLISION_REACTIONS,
  OPP_WIN_REACTIONS,
  pickReaction,
  type Reaction,
} from "./reactions";
import { AchievementRail, ACHIEVEMENT_COL_W, type Achievement } from "./AchievementRail";
import { InkPourOverlay } from "./InkPourOverlay";
import {
  boardSizeForViewport,
  MIN_BOARD_PX,
  wheelDiameterForBoard,
  wheelPeekWidth,
} from "./layoutChrome";

const BADGE_HOLD_MS = 1600;
const REACTION_TTL_MS = 2600;

export function GameScreen() {
  const { state, tap, reset, roundMs } = useGameEngine();
  const [boardPx, setBoardPx] = useState(MIN_BOARD_PX);
  const [badgeMinimized, setBadgeMinimized] = useState(false);
  const [youReaction, setYouReaction] = useState<Reaction | null>(null);
  const [oppReaction, setOppReaction] = useState<Reaction | null>(null);
  const [youReactionKey, setYouReactionKey] = useState(0);
  const oppTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const youTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardWrapRef = useRef<HTMLDivElement>(null);
  const [wheelTop, setWheelTop] = useState(160);

  const wheelDiameter = wheelDiameterForBoard(boardPx);
  const peekW = wheelPeekWidth(wheelDiameter);

  useEffect(() => {
    const compute = () => {
      // Centered column sizing only — wheel must not change this.
      setBoardPx(boardSizeForViewport(window.innerWidth, window.innerHeight - 420));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const place = () => {
      const el = boardWrapRef.current;
      if (!el) return;
      const br = el.getBoundingClientRect();
      setWheelTop(br.top + br.height / 2 - wheelDiameter / 2);
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [boardPx, wheelDiameter]);

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

  const shouldShake = badgeKind === "lose" && !badgeMinimized;
  const shouldCelebrate = badgeKind === "win" && !badgeMinimized;
  const isLoss = badgeKind === "lose";
  const isWin = badgeKind === "win";

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

  // ---------- Reactions ----------
  const handleReact = useCallback((reaction: Reaction) => {
    setYouReaction(reaction);
    setYouReactionKey((k) => k + 1);
    if (youTimer.current) clearTimeout(youTimer.current);
    youTimer.current = setTimeout(() => setYouReaction(null), REACTION_TTL_MS);
  }, []);

  // Scripted rival reactions on key beats: reveal, collision, and every ~14s.
  useEffect(() => {
    if (state.phase !== "revealing" || !state.lastReveal) return;
    const pool = state.lastReveal.collision
      ? COLLISION_REACTIONS
      : state.winner?.owner === "opp"
        ? OPP_WIN_REACTIONS
        : REACTIONS;
    const pick = pickReaction(pool);
    if (oppTimer.current) clearTimeout(oppTimer.current);
    setOppReaction(pick);
    oppTimer.current = setTimeout(() => setOppReaction(null), REACTION_TTL_MS);
  }, [state.phase, state.lastReveal, state.winner]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (state.phase !== "placing") return;
      setOppReaction((prev) => prev ?? pickReaction(REACTIONS));
      if (oppTimer.current) clearTimeout(oppTimer.current);
      oppTimer.current = setTimeout(() => setOppReaction(null), REACTION_TTL_MS);
    }, 14000);
    return () => clearInterval(iv);
  }, [state.phase]);

  // ---------- Achievements (demo: one-away from XOX) ----------
  const achievements = useMemo<Achievement[]>(() => {
    const list: Achievement[] = [];
    if (state.progressYou >= 2 && state.phase !== "won") {
      list.push({
        id: "first-win-close",
        title: "one to go",
        glyph: "target",
        progress: state.progressYou / 3,
      });
    }
    if (state.match.you >= 1 && state.phase !== "won") {
      list.push({
        id: "on-a-roll",
        title: "on a roll",
        glyph: "spark",
        progress: Math.min(1, state.match.you / 2),
      });
    }
    return list;
  }, [state.progressYou, state.match.you, state.phase]);

  return (
    <div
      data-game-shell
      className="relative mx-auto flex min-h-screen w-full max-w-[460px] flex-col items-center overflow-x-hidden py-4"
    >
      <motion.div
        className="relative z-30 flex w-full flex-col items-center gap-3 overflow-visible pt-8"
        animate={
          shouldShake
            ? { x: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, 4, -4, 3, -3, 0, 0, 0] }
            : shouldCelebrate
              ? { scale: [1, 1.02, 1], y: [0, -6, 0] }
              : {}
        }
        transition={{ duration: shouldCelebrate ? 0.9 : 0.6 }}
      >
        <ColoredIsland>
          <PlayerCards
            progressYou={state.progressYou}
            progressOpp={state.progressOpp}
            leader={leader}
            crownedWinner={crownedWinner}
            match={state.match}
            matchTarget={state.matchTarget}
            youReaction={youReaction}
            youReactionKey={youReactionKey}
            oppReaction={oppReaction}
          />
        </ColoredIsland>

        <div ref={boardWrapRef} className="relative mt-2 flex w-full items-start justify-center">
          <div className="relative">
            {achievements.length > 0 && (
              <div
                className="absolute top-0 z-30"
                style={{
                  right: "100%",
                  marginRight: 6,
                  maxWidth: ACHIEVEMENT_COL_W,
                }}
              >
                <AchievementRail achievements={achievements} />
              </div>
            )}
            <ColoredIsland>
              <Board state={state} onTap={tap} boardPx={boardPx} />
            </ColoredIsland>
          </div>
        </div>

        <div className="mt-3 flex w-full flex-col items-center gap-3">
          {badgeKind && badgeMinimized ? (
            <MinimizedResultCard kind={badgeKind} onReset={reset} matchOver={state.matchOver} />
          ) : (
            <BottomBar state={state} roundMs={roundMs} tentativeColor={tentativeColor} />
          )}
        </div>
      </motion.div>

      {/* Flush to viewport right; diameter 75% of grid, ~22% peek (not gap-clamped). */}
      <div
        className="pointer-events-none fixed right-0 z-40"
        style={{ top: wheelTop, width: peekW }}
      >
        <div className="pointer-events-auto">
          <ReactionWheel
            onReact={handleReact}
            interactive={state.phase === "placing"}
            diameter={wheelDiameter}
            peekWidth={peekW}
          />
        </div>
      </div>

      {/* Ink-pour desaturation overlay (below colored islands, above the rest) */}
      <InkPourOverlay active={isLoss} />

      {/* Result confetti mounts once for the whole win/loss — not inside the
          modal, so minimizing the badge does not stop / remount the rain. */}
      {isLoss && (
        <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
          <Confetti kind="lose" />
        </div>
      )}
      {isWin && (
        <div className="pointer-events-none fixed inset-0 z-[45] overflow-hidden">
          <Confetti kind="win" />
        </div>
      )}

      {/* Simultaneous XOX — "It's a tie" badge; scribbles hold back until it exits. */}
      <AnimatePresence>
        {state.tieRound && (
          <motion.div
            key="tie-overlay"
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
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
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
            <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-6 px-6">
              <div className="relative h-[200px] w-full">
                <WinBadge kind={badgeKind} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * ColoredIsland — wrapper that renders a thick painterly brush-stroke halo
 * around its children and pins them above the greyscale overlay via z-index.
 * The halo appears only when a loss is active (so the colored region reads
 * as intentional rather than accidental), fading in as the ink pours.
 */
function ColoredIsland({
  children,
  padded,
}: {
  children: React.ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className="relative"
      style={{
        zIndex: 40,
        padding: padded ? 6 : 0,
        // isolate creates a new stacking context so the backdrop-filter of
        // the overlay behind us cannot leak in and desaturate our contents.
        isolation: "isolate",
      }}
    >
      {children}
    </div>
  );
}

interface BottomBarProps {
  state: ReturnType<typeof useGameEngine>["state"];
  roundMs: number;
  tentativeColor: string;
}

function BottomBar({ state, roundMs }: BottomBarProps) {
  const idleWarn = state.idleWarning && state.phase === "placing";
  const revealing = state.phase === "revealing";
  const collision = !!state.lastReveal?.collision;
  const tie = !!state.tieRound;

  const status = useMemo(() => {
    if (revealing && tie) return { text: "both scored — tiles are toast", tone: "warn" as const };
    if (revealing && collision) return { text: "collision — tile wasted", tone: "warn" as const };
    if (revealing) return { text: "revealing rival's move…", tone: "info" as const };
    if (idleWarn) return { text: "your move — rival is waiting", tone: "alert" as const };
    if (state.myTentative) return { text: `tap again to change · ${state.myTentative.shape}`, tone: "info" as const };
    return { text: "tap tile · again = O · again = clear", tone: "info" as const };
  }, [revealing, collision, tie, idleWarn, state.myTentative]);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <StatusCard text={status.text} tone={status.tone} />
      <RoundTimer
        running={state.phase === "placing" && state.roundStarted}
        duration={roundMs}
        keyId={state.round}
        idleWarning={idleWarn}
      />
    </div>
  );
}

/** StatusCard — jazzy hand-drawn card for the unified round status line. */
function StatusCard({ text, tone }: { text: string; tone: "info" | "warn" | "alert" }) {
  const inverted = tone === "alert";
  const accent =
    tone === "warn" ? "var(--player-you)" : inverted ? "var(--paper)" : "var(--ink)";
  const bg = inverted ? "var(--ink)" : "var(--paper)";
  const textColor = inverted ? "var(--paper)" : "var(--ink)";

  return (
    <div className="relative w-full max-w-[380px]">
      <svg
        width="100%"
        height={44}
        viewBox="0 0 380 44"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <filter id="status-rough" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="6" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        {/* pulse ring under card when alerting */}
        {inverted && (
          <motion.rect
            x={2}
            y={2}
            width={376}
            height={40}
            rx={20}
            ry={20}
            fill="none"
            stroke="var(--player-you)"
            strokeWidth={2}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <g filter="url(#status-rough)">
          <path
            d="M 8 36 Q 4 8 22 6 L 360 4 Q 376 8 374 34 Q 372 42 356 40 L 22 42 Q 6 42 8 36 Z"
            fill={bg}
            stroke={inverted ? "var(--paper)" : "var(--ink)"}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <circle cx={16} cy={22} r={4} fill={accent} />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.span
            key={text}
            className="text-sm whitespace-nowrap text-center"
            style={{ color: textColor, fontFamily: "var(--font-display)" }}
            initial={{ y: 6, opacity: 0 }}
            animate={
              inverted
                ? { y: 0, opacity: [1, 0.55, 1] }
                : { y: 0, opacity: 1 }
            }
            exit={{ y: -6, opacity: 0 }}
            transition={
              inverted
                ? { opacity: { duration: 0.9, repeat: Infinity, ease: "easeInOut" } }
                : { duration: 0.22 }
            }
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

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
      style={{ filter: "none", zIndex: 50, position: "relative" }}
    >
      <div
        className="relative flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3"
        style={{
          borderColor: "var(--ink)",
          background: "var(--paper)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          filter: "none",
        }}
      >
        <MiniBadge kind={kind} />
        <button
          onClick={onReset}
          className="min-h-[44px] min-w-[44px] rounded-full border-2 px-4 py-2 text-sm transition-all duration-200 ease-in-out hover:scale-[1.04] active:scale-[0.96]"
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
