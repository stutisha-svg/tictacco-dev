/**
 * TutorialScreen — `/tutorial` static board-frame walkthrough (not playable).
 *
 * Reuses GameScreen chrome (TopBar, PlayerCards, Board, GameEnvBg) for visual
 * parity, but all interaction is scripted via `useTutorialFlow` + frame snapshots.
 *
 * Layout (matches GameScreen orientation):
 *   profiles → board → (mt-auto) rules / emoji flush to bottom.
 * Timer is absolutely positioned above the rules panel so introducing it
 * never pushes TutorialRulesContainer down.
 *
 * Stacking: profiles/board stay under TutorialDimOverlay (z-20);
 * TutorialRulesContainer sits at z-40+ so it paints above the dim.
 */
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlayerCards } from "@/components/game/PlayerCards";
import { Board } from "@/components/game/Board";
import { TopBar } from "@/components/game/TopBar";
import { GameEnvBg } from "@/components/game/GameEnvBg";
import { Confetti } from "@/components/game/Confetti";
import type { Reaction } from "@/components/game/reactions";
import { boardSizeForViewport, MIN_BOARD_PX } from "@/components/game/layoutChrome";
import { TutorialRulesContainer } from "./TutorialRulesContainer";
import { TutorialRulesText } from "./TutorialRulesText";
import { TutorialRulesChip } from "./TutorialRulesChip";
import { TutorialDimOverlay } from "./TutorialDimOverlay";
import { TutorialSpotlightOverlay } from "./TutorialSpotlightOverlay";
import { TutorialTileBlink } from "./TutorialTileBlink";
import { TutorialGridTapCue } from "./TutorialGridTapCue";
import { TutorialEmojiStep } from "./TutorialEmojiStep";
import { TutorialRoundTimer } from "./TutorialRoundTimer";
import { useTutorialFlow } from "./useTutorialFlow";
import {
  TUTORIAL_STEPS,
  TUTORIAL_TIMER_INTRO_ID,
} from "./tutorialSteps";

/** Stable key so TutorialRoundTimer pause/resume persists across frames. */
const TUTORIAL_TIMER_KEY = 1;
/** Demo duration for the scripted timer lessons (not live round length). */
const TUTORIAL_TIMER_MS = 8000;
/** Thought-cloud TTL — matches GameScreen REACTION_TTL_MS. */
const TUTORIAL_REACTION_TTL_MS = 2600;
/** Advance to good-luck after the cloud has been visible briefly. */
const TUTORIAL_EMOJI_ADVANCE_MS = 1600;

const TIMER_INTRO_INDEX = TUTORIAL_STEPS.findIndex(
  (s) => s.id === TUTORIAL_TIMER_INTRO_ID,
);

export function TutorialScreen() {
  const [boardPx, setBoardPx] = useState(MIN_BOARD_PX);
  const [youReaction, setYouReaction] = useState<Reaction | null>(null);
  const [youReactionKey, setYouReactionKey] = useState(0);

  const {
    step,
    stepIndex,
    gameState,
    overlayVisible,
    overlayMode,
    rulesEntranceDone,
    setRulesEntranceDone,
    handleAdvanceTap,
    handleEmojiReact,
  } = useTutorialFlow();

  useEffect(() => {
    const compute = () => {
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
    gameState.progressYou === gameState.progressOpp
      ? null
      : gameState.progressYou > gameState.progressOpp
        ? ("you" as const)
        : ("opp" as const);

  const canTapToAdvance =
    step.advance === "tap-or-10s" &&
    (step.id !== "intro" || rulesEntranceDone);
  const showDimOverlay = overlayVisible && overlayMode === "except-rules";
  const showEmojiStep = step.id === "emoji-wheel" || step.id === "good-luck";
  const showRules = step.showRulesContainer !== false && !showEmojiStep;
  const showRuleText = step.id !== "intro" || rulesEntranceDone;
  const showSpotlight = step.spotlightTile != null && !showEmojiStep;

  /** Once introduced, timer stays (idle on later frames). Hidden only for emoji. */
  const showTimer =
    !showEmojiStep &&
    TIMER_INTRO_INDEX >= 0 &&
    stepIndex >= TIMER_INTRO_INDEX;

  const timerRunning = !!step.timerRunning && !step.timerExpired;
  const timerExpired = !!step.timerExpired;
  const timerIdle =
    showTimer &&
    !step.showTimer &&
    !step.timerRunning &&
    !step.timerExpired;

  /** Same thought-cloud path as GameScreen handleReact. */
  const onEmojiReact = (reaction: Reaction) => {
    setYouReaction(reaction);
    setYouReactionKey((k) => k + 1);
    window.setTimeout(() => setYouReaction(null), TUTORIAL_REACTION_TTL_MS);
    window.setTimeout(() => handleEmojiReact(), TUTORIAL_EMOJI_ADVANCE_MS);
  };

  const timerBlock = useMemo(() => {
    if (!showTimer) return null;
    const bar = (
      <TutorialRoundTimer
        running={timerRunning}
        duration={TUTORIAL_TIMER_MS}
        keyId={TUTORIAL_TIMER_KEY}
        idleWarning={false}
        forcePct={timerExpired ? 1 : timerIdle ? 0 : undefined}
      />
    );
    const shell = (
      <div className="flex w-[80%] max-w-[80%] min-w-0 flex-col items-center">
        {bar}
      </div>
    );
    if (timerExpired) {
      return (
        <motion.div
          className="flex w-full min-w-0 justify-center"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
        >
          {shell}
        </motion.div>
      );
    }
    return shell;
  }, [showTimer, timerRunning, timerExpired, timerIdle]);

  return (
    <div
      data-tutorial-screen
      className="relative mx-auto flex min-h-full w-full min-w-0 max-w-full flex-1 flex-col items-center overflow-visible bg-transparent pb-0"
      style={{ minHeight: "100%" }}
    >
      <GameEnvBg className="!fixed inset-0 overflow-hidden sm:rounded-[24px]" />

      <div className="relative w-full shrink-0 overflow-visible" data-tutorial-topbar>
        <TopBar />
      </div>

      {/*
        No shared z-index on this column — that would trap TutorialRulesContainer
        under the fixed dim overlay. Profiles/board: z-0 (under dim);
        bottom chrome: z-40+ (above dim).
      */}
      <div className="relative -mt-[20px] flex w-full min-w-0 flex-1 flex-col items-center gap-3 overflow-visible pt-0">
        <div
          data-tutorial-profiles
          className={`relative flex w-full min-w-0 flex-col items-center overflow-visible ${showEmojiStep ? "z-[80]" : "z-0"}`}
        >
          <TutorialProfileIsland>
            <PlayerCards
              progressYou={gameState.progressYou}
              progressOpp={gameState.progressOpp}
              leader={leader}
              crownedWinner={null}
              match={gameState.match}
              matchTarget={gameState.matchTarget}
              tabLabel="tutorial"
              tubeWinner={null}
              tubeCelebrate={false}
              youReaction={youReaction}
              youReactionKey={youReactionKey}
              oppReaction={null}
            />
          </TutorialProfileIsland>
        </div>

        <div
          data-tutorial-board
          className="relative mt-2 flex w-full min-w-0 items-start justify-center overflow-visible"
        >
          <div
            className="relative shrink-0"
            style={{ width: boardPx, height: boardPx }}
          >
            <div className="pointer-events-none absolute inset-0">
              <Board
                state={gameState}
                onTap={() => {}}
                boardPx={boardPx}
                showWaitingOverlay={false}
              />
            </div>
            {step.showGridTapCue && <TutorialGridTapCue />}
            {showSpotlight && step.spotlightTile != null && (
              <TutorialSpotlightOverlay
                tile={step.spotlightTile}
                boardPx={boardPx}
              />
            )}
            {step.blinkTile != null && !showSpotlight && (
              <TutorialTileBlink tile={step.blinkTile} boardPx={boardPx} />
            )}
          </div>
        </div>

        {/*
          Bottom chrome — mt-auto pins rules/wheel to the bottom edge.
          Timer is absolute above rules so introducing it does NOT shift the panel.
          z-40+ so TutorialRulesContainer paints above TutorialDimOverlay (z-20).
        */}
        <div
          data-tutorial-bottom-chrome
          className="relative z-40 mt-auto flex w-full min-w-0 flex-col items-center"
        >
          <div className="relative flex w-full min-w-0 flex-col items-center">
            {showTimer && (
              <div
                data-tutorial-timer-slot
                className="absolute bottom-full left-0 right-0 z-50 mb-2 flex w-full min-w-0 flex-col items-center gap-3 px-0"
              >
                {timerBlock}
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {showRules && (
                <motion.div
                  key="tutorial-rules"
                  className="pointer-events-none relative z-40 flex w-full min-w-0 flex-col items-center"
                  initial={false}
                  exit={{ y: "110%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TutorialRulesContainer
                    onEntranceComplete={() => setRulesEntranceDone(true)}
                  >
                    {showRuleText && (
                      <TutorialRulesText
                        key={step.id}
                        trailing={
                          step.chip ? (
                            <TutorialRulesChip chip={step.chip} />
                          ) : null
                        }
                      >
                        {step.text}
                      </TutorialRulesText>
                    )}
                  </TutorialRulesContainer>
                </motion.div>
              )}
            </AnimatePresence>

            {showEmojiStep && (
              <TutorialEmojiStep
                boardPx={boardPx}
                modalText={step.text}
                showStartButton={step.id === "good-luck"}
                onReact={step.id === "emoji-wheel" ? onEmojiReact : () => {}}
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDimOverlay && (
          <TutorialDimOverlay
            mode={overlayMode}
            tappable={false}
            onTap={undefined}
          />
        )}
      </AnimatePresence>

      {canTapToAdvance && (
        <button
          type="button"
          aria-label="Next rule"
          data-tutorial-advance-catcher
          className="fixed inset-0 z-[70] cursor-pointer bg-transparent"
          onClick={handleAdvanceTap}
        />
      )}

      {step.showConfetti && (
        <div
          data-tutorial-confetti
          className="pointer-events-none fixed inset-0 z-[25] overflow-hidden"
        >
          <Confetti kind="win" />
        </div>
      )}
    </div>
  );
}

/** Local isolation wrapper — not GameScreen’s ColoredIsland. */
function TutorialProfileIsland({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-tutorial-profile-island
      className="relative w-full max-w-full min-w-0 overflow-visible"
      style={{ isolation: "isolate" }}
    >
      {children}
    </div>
  );
}
