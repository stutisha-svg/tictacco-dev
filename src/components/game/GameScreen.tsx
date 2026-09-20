/**
 * GameScreen — top-level game container.
 *
 * Handles layout, the reveal-focus spotlight overlay, the win/lose badge
 * lifecycle (full → minimized floating card), the player-driven timer +
 * blank-turn warning, the post-win crown, the fluid ink-pour greyscale on
 * loss, reactions between players, and achievement banners / modal.
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
import {
  ACHIEVEMENT_DEFS,
  achievementFromDef,
  type Achievement,
} from "./achievements";
import { AchievementNudge } from "./AchievementNudge";
import { AchievementModal } from "./AchievementModal";
import { InkPourOverlay } from "./InkPourOverlay";
import { TopBar } from "./TopBar";
import { GameEnvBg } from "./GameEnvBg";
import {
  boardSizeForViewport,
  MIN_BOARD_PX,
  wheelDiameterForBoard,
  wheelPeekHeightForBoard,
} from "./layoutChrome";
import { useScoringMatchOverHandoff } from "@/features/scoring/useScoringMatchOverHandoff";

const BADGE_HOLD_MS = 1600;
const REACTION_TTL_MS = 2600;
const STATUS_CYCLE_MS = 3500;
const UNLOCK_FLASH_MS = 5500;

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

  const wheelDiameter = wheelDiameterForBoard(boardPx);
  const peekH = wheelPeekHeightForBoard(boardPx);

  useEffect(() => {
    const compute = () => {
      // Centered column sizing only — wheel must not change this.
      // Budget leaves room for wheel peek + status/timer under the board.
      setBoardPx(
        boardSizeForViewport(
          Math.min(window.innerWidth, 390),
          window.innerHeight - 480,
        ),
      );
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

  // Scoring feature owns series-end timing + /score navigation.
  const { keepFullBadge } = useScoringMatchOverHandoff({
    matchOver: state.matchOver,
    badgeKind,
    youWins: state.match.you,
    oppWins: state.match.opp,
    matchTarget: state.matchTarget,
  });

  useEffect(() => {
    if (!badgeKind) {
      setBadgeMinimized(false);
      return;
    }
    if (keepFullBadge) {
      setBadgeMinimized(false);
      return;
    }
    const t = setTimeout(() => setBadgeMinimized(true), BADGE_HOLD_MS);
    return () => clearTimeout(t);
  }, [badgeKind, keepFullBadge]);

  const crownedWinner =
    badgeMinimized && badgeKind === "win" ? state.winner?.owner ?? null : null;

  const tubeWinner =
    state.phase === "won" && state.winner ? state.winner.owner : null;
  const tubeCelebrate = badgeMinimized && !!tubeWinner;

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

  // ---------- Achievements (status cycle + top nudge + modal) ----------
  const [flashUnlockedId, setFlashUnlockedId] = useState<string | null>(null);
  const [modalAchievement, setModalAchievement] = useState<Achievement | null>(null);
  const seenUnlocks = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unlockId =
      state.match.you >= 2 && !seenUnlocks.current.has("on-a-roll")
        ? "on-a-roll"
        : state.match.you >= 1 && !seenUnlocks.current.has("first-sketch")
          ? "first-sketch"
          : null;
    if (!unlockId) return;
    seenUnlocks.current.add(unlockId);
    setFlashUnlockedId(unlockId);
    const t = setTimeout(() => setFlashUnlockedId(null), UNLOCK_FLASH_MS);
    return () => clearTimeout(t);
  }, [state.match.you]);

  const achievements = useMemo<Achievement[]>(() => {
    const list: Achievement[] = [];
    if (flashUnlockedId && ACHIEVEMENT_DEFS[flashUnlockedId]) {
      list.push(achievementFromDef(ACHIEVEMENT_DEFS[flashUnlockedId], 1, "unlocked"));
    }
    if (
      state.progressYou >= 2 &&
      state.phase !== "won" &&
      flashUnlockedId !== "first-win-close"
    ) {
      list.push(
        achievementFromDef(
          ACHIEVEMENT_DEFS["first-win-close"],
          state.progressYou / 3,
          "tracking",
        ),
      );
    }
    if (
      state.match.you >= 1 &&
      state.match.you < 2 &&
      state.phase !== "won" &&
      flashUnlockedId !== "on-a-roll"
    ) {
      list.push(
        achievementFromDef(
          ACHIEVEMENT_DEFS["on-a-roll"],
          state.match.you / 2,
          "tracking",
        ),
      );
    }
    return list;
  }, [state.progressYou, state.match.you, state.phase, flashUnlockedId]);

  const nudgeAchievement = useMemo(() => {
    return (
      achievements.find((a) => a.status === "unlocked") ?? achievements[0] ?? null
    );
  }, [achievements]);

  const openAchievement = useCallback((a: Achievement) => {
    setModalAchievement(a);
  }, []);

  return (
    <div
      data-game-shell
      className="relative mx-auto flex min-h-full w-full min-w-0 max-w-full flex-1 flex-col items-center overflow-visible bg-transparent pb-0"
      style={{ minHeight: "100%" }}
    >
      {/* Fills the mobile frame; paper is overscaled so opaque area covers full height.
          Fixed to the frame so short content still paints the full phone height. */}
      <GameEnvBg className="!fixed inset-0 overflow-hidden sm:rounded-[24px]" />

      {/* Figma top bar + achievement drawer peeking under the tear. */}
      <div className="relative w-full shrink-0 overflow-visible">
        <TopBar />
        <AchievementNudge
          achievement={nudgeAchievement}
          onOpen={() => nudgeAchievement && openAchievement(nudgeAchievement)}
        />
      </div>

      {/* Game chrome — overflow visible so reaction clouds can overlap the top bar */}
      <motion.div
        className="relative z-30 -mt-[20px] flex w-full min-w-0 flex-1 flex-col items-center gap-3 overflow-visible pt-0"
        animate={
          shouldShake
            ? { x: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, 4, -4, 3, -3, 0, 0, 0] }
            : shouldCelebrate
              ? { scale: [1, 1.02, 1], y: [0, -6, 0] }
              : {}
        }
        transition={{ duration: shouldCelebrate ? 0.9 : 0.6 }}
      >
        <div className="relative z-[60] flex w-full min-w-0 flex-col items-center overflow-visible">
          <ColoredIsland>
            <PlayerCards
              progressYou={state.progressYou}
              progressOpp={state.progressOpp}
              leader={leader}
              crownedWinner={crownedWinner}
              match={state.match}
              matchTarget={state.matchTarget}
              tubeWinner={tubeWinner}
              tubeCelebrate={tubeCelebrate}
              youReaction={youReaction}
              youReactionKey={youReactionKey}
              oppReaction={oppReaction}
            />
          </ColoredIsland>
        </div>

        <div
          ref={boardWrapRef}
          className="relative mt-2 flex w-full min-w-0 items-start justify-center overflow-visible"
        >
          <div className="relative max-w-full shrink-0">
            <ColoredIsland>
              <Board state={state} onTap={tap} boardPx={boardPx} />
            </ColoredIsland>
          </div>
        </div>

        {/* Status + timer, then wheel flush to the bottom edge of the screen. */}
        <div className="mt-auto flex w-full min-w-0 flex-col items-center">
          <div className="relative z-50 mb-2 flex w-full min-w-0 flex-col items-center gap-3 px-0">
            {badgeKind && badgeMinimized && !keepFullBadge ? (
              <MinimizedResultCard kind={badgeKind} onReset={reset} />
            ) : (
              <BottomBar
                state={state}
                roundMs={roundMs}
                achievements={achievements}
                onAchievementOpen={openAchievement}
              />
            )}
          </div>

          <div
            className="relative z-40 mx-auto w-full shrink-0 overflow-hidden"
            style={{ height: peekH, width: boardPx, marginBottom: 0 }}
          >
            <ReactionWheel
              onReact={handleReact}
              interactive={state.phase === "placing"}
              diameter={wheelDiameter}
              peekHeight={peekH}
            />
          </div>
        </div>
      </motion.div>

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

      {/* Simultaneous XOX — mid-game "major collision"; play continues after. */}
      <AnimatePresence>
        {state.tieRound && (
          <motion.div
            key="collision-overlay"
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex w-full min-w-0 flex-col items-center gap-6 px-4">
              <div className="relative aspect-[2/1] w-full max-h-[200px]">
                <WinBadge kind="collision" />
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
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
            <div className="relative z-10 flex w-full min-w-0 flex-col items-center gap-6 px-4">
              <div className="relative aspect-[2/1] w-full max-h-[200px]">
                <WinBadge kind={badgeKind} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AchievementModal
        achievement={modalAchievement}
        open={!!modalAchievement}
        onClose={() => setModalAchievement(null)}
      />
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
      className="relative w-full max-w-full min-w-0 overflow-visible"
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

type StatusTone = "info" | "warn" | "alert" | "achievement" | "achievement-hot";

interface StatusSlide {
  key: string;
  text: string;
  tone: StatusTone;
  achievement?: Achievement;
}

interface BottomBarProps {
  state: ReturnType<typeof useGameEngine>["state"];
  roundMs: number;
  achievements: Achievement[];
  onAchievementOpen: (a: Achievement) => void;
}

function BottomBar({
  state,
  roundMs,
  achievements,
  onAchievementOpen,
}: BottomBarProps) {
  const idleWarn = state.idleWarning && state.phase === "placing";
  const revealing = state.phase === "revealing";
  const collision = !!state.lastReveal?.collision;
  const tie = !!state.tieRound;

  const gameStatus = useMemo((): StatusSlide => {
    if (revealing && tie)
      return { key: "game", text: "major collision — tiles are toast", tone: "warn" };
    if (revealing && collision)
      return { key: "game", text: "collision — tile wasted", tone: "warn" };
    if (revealing)
      return { key: "game", text: "revealing rival's move…", tone: "info" };
    // After 10s with no tap — same flag as board skeleton + timer outline.
    if (idleWarn)
      return { key: "game", text: "your move — rival is waiting", tone: "alert" };
    if (state.myTentative)
      return {
        key: "game",
        text: `tap again to change · ${state.myTentative.shape}`,
        tone: "info",
      };
    if (!state.roundStarted)
      return { key: "game", text: "tap the grid to start", tone: "info" };
    return { key: "game", text: "tap tile · again = O · again = clear", tone: "info" };
  }, [revealing, collision, tie, idleWarn, state.myTentative, state.roundStarted]);

  const sticky = gameStatus.tone === "alert" || gameStatus.tone === "warn";

  const slides = useMemo((): StatusSlide[] => {
    if (sticky || achievements.length === 0) return [gameStatus];
    return [
      gameStatus,
      ...achievements.map((a) => ({
        key: `ach-${a.id}-${a.status}`,
        text: a.banner,
        tone: (a.status === "unlocked" ? "achievement-hot" : "achievement") as StatusTone,
        achievement: a,
      })),
    ];
  }, [gameStatus, achievements, sticky]);

  const [slideIdx, setSlideIdx] = useState(0);
  const slideKey = slides.map((s) => s.key).join("|");

  useEffect(() => {
    setSlideIdx(0);
  }, [slideKey]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setSlideIdx((i) => (i + 1) % slides.length);
    }, STATUS_CYCLE_MS);
    return () => clearInterval(t);
  }, [slides.length, slideKey]);

  const current = slides[slideIdx % slides.length] ?? gameStatus;

  return (
    <div className="flex w-[80%] max-w-[80%] min-w-0 flex-col items-center gap-3">
      <StatusCard
        text={current.text}
        tone={current.tone}
        onClick={
          current.achievement
            ? () => onAchievementOpen(current.achievement!)
            : undefined
        }
      />
      <div className="flex w-full min-w-0 justify-center">
        <RoundTimer
          running={
            state.phase === "placing" &&
            state.roundStarted &&
            !!state.myTentative
          }
          duration={roundMs}
          keyId={state.round}
          idleWarning={idleWarn}
        />
      </div>
    </div>
  );
}

/** StatusCard — jazzy hand-drawn card for the unified round status line. */
function StatusCard({
  text,
  tone,
  onClick,
}: {
  text: string;
  tone: StatusTone;
  onClick?: () => void;
}) {
  const inverted = tone === "alert" || tone === "achievement-hot";
  const isAchievement = tone === "achievement" || tone === "achievement-hot";
  const accent =
    tone === "warn"
      ? "var(--player-you)"
      : isAchievement
        ? "var(--accent-purple)"
        : inverted
          ? "#fff"
          : "var(--ink)";
  const bg =
    tone === "achievement-hot"
      ? "var(--accent-purple)"
      : tone === "achievement"
        ? "rgba(255,255,255,0.55)"
        : inverted
          ? "var(--ink)"
          : "rgba(255,255,255,0.3)";
  const textColor =
    tone === "achievement-hot" || inverted ? "#fff" : "var(--ink)";
  const stroke =
    tone === "achievement" || tone === "achievement-hot"
      ? "var(--ink)"
      : inverted
        ? "var(--paper)"
        : "var(--ink)";

  const inner = (
    <>
      <svg
        width="100%"
        height={44}
        viewBox="0 0 380 44"
        preserveAspectRatio="none"
        className="block h-[44px] w-full overflow-visible"
      >
        <defs>
          <filter id="status-rough" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="6" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        {tone === "alert" && (
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
            stroke={stroke}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <circle cx={16} cy={22} r={4} fill={accent} />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex min-h-[44px] items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.span
            key={text}
            className="max-w-full truncate text-center text-sm"
            style={{ color: textColor, fontFamily: "var(--font-display)" }}
            initial={{ y: 6, opacity: 0 }}
            animate={
              tone === "alert"
                ? { y: 0, opacity: [1, 0.55, 1] }
                : { y: 0, opacity: 1 }
            }
            exit={{ y: -6, opacity: 0 }}
            transition={
              tone === "alert"
                ? { opacity: { duration: 0.9, repeat: Infinity, ease: "easeInOut" } }
                : { duration: 0.22 }
            }
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative w-full min-w-0 min-h-[44px] text-left transition-transform active:scale-[0.98]"
        aria-label={`achievement details: ${text}`}
      >
        {inner}
      </button>
    );
  }

  return <div className="relative w-full min-w-0 min-h-[44px]">{inner}</div>;
}

function MinimizedResultCard({
  kind,
  onReset,
}: {
  kind: BadgeKind;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="mini-card"
      className="flex w-[80%] max-w-[80%] min-w-0 flex-col items-center gap-3"
      initial={{ y: 30, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 30, opacity: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      style={{ filter: "none", zIndex: 50, position: "relative" }}
    >
      <div
        className="relative flex w-full min-h-[44px] min-w-0 items-center gap-2 rounded-2xl border-2 px-3 py-2"
        style={{
          borderColor: "var(--ink)",
          background: "var(--paper)",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
          filter: "none",
        }}
      >
        <div className="flex min-h-[44px] min-w-0 flex-1 items-center overflow-hidden pr-1">
          <MiniBadge kind={kind} />
        </div>
        <button
          type="button"
          onClick={onReset}
          className="min-h-[44px] min-w-[44px] shrink-0 rounded-full border-2 px-3 py-2 text-sm transition-all duration-200 ease-in-out hover:scale-[1.04] active:scale-[0.96]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "normal",
            borderColor: "var(--ink)",
            color: "var(--paper)",
            background: "var(--ink)",
          }}
        >
          play again
        </button>
      </div>
    </motion.div>
  );
}
