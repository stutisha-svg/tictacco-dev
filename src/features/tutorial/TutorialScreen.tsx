/**
 * TutorialScreen — preset tutorial walkthrough (not live gameplay).
 *
 * Layer order (bottom → top): game chrome → dim scrim → rules container.
 * The scrim fades out when a step has no overlay so the game screen is in focus.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PlayerCards } from "@/components/game/PlayerCards";
import { Board } from "@/components/game/Board";
import { TopBar } from "@/components/game/TopBar";
import { GameEnvBg } from "@/components/game/GameEnvBg";
import { Confetti } from "@/components/game/Confetti";
import { WinBadge } from "@/components/game/WinBadge";
import { RoundTimer } from "@/components/game/RoundTimer";
import { boardSizeForViewport, MIN_BOARD_PX } from "@/components/game/layoutChrome";
import { RulesContainer } from "./RulesContainer";
import { TutorialRulesText } from "./TutorialRulesText";
import { TutorialDimOverlay } from "./TutorialDimOverlay";
import { TutorialSpotlightOverlay } from "./TutorialSpotlightOverlay";
import { TutorialTileBlink } from "./TutorialTileBlink";
import { TutorialGridTapCue } from "./TutorialGridTapCue";
import { TutorialEmojiStep } from "./TutorialEmojiStep";
import { useTutorialFlow } from "./useTutorialFlow";

export function TutorialScreen() {
  const [boardPx, setBoardPx] = useState(MIN_BOARD_PX);
  const boardRef = useRef<HTMLDivElement>(null);

  const {
    step,
    gameState,
    spotlightTile,
    overlayVisible,
    overlayMode,
    showConfetti,
    timerRunning,
    timerFadeIn,
    rulesEntranceDone,
    setRulesEntranceDone,
    handleAdvanceTap,
    handleGridTap,
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

  const canTapToAdvance = step.advance === "tap-or-10s";
  const showDimOverlay =
    overlayVisible && overlayMode !== "spotlight-tile" && overlayMode !== "none";
  const showSpotlight = overlayMode === "spotlight-tile" && overlayVisible;
  const spotlightPassThrough =
    step.advance === "tap-grid" ||
    step.advance === "tap-spotlight" ||
    step.advance === "tap-spotlight-win" ||
    step.advance === "tap-spotlight-collision" ||
    step.advance === "tap-spotlight-scribble";
  const showEmojiStep = step.id === "emoji-wheel" || step.id === "good-luck";
  /** Intro copy waits until the scrapbook entrance finishes; later steps update immediately. */
  const showRuleText = step.id !== "intro" || rulesEntranceDone;

  return (
    <div
      data-tutorial-screen
      className="relative mx-auto flex min-h-full w-full min-w-0 max-w-full flex-1 flex-col items-center overflow-visible bg-transparent pb-0"
      style={{ minHeight: "100%" }}
    >
      <GameEnvBg className="!fixed inset-0 overflow-hidden sm:rounded-[24px]" />

      <div className="relative w-full shrink-0 overflow-visible">
        <TopBar />
      </div>

      {/* Game chrome — bottom layer (z-10) */}
      <div className="relative z-10 -mt-[20px] flex w-full min-w-0 flex-1 flex-col items-center gap-3 overflow-visible pt-0">
        <div className="relative flex w-full min-w-0 flex-col items-center overflow-visible">
          <ColoredIsland>
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
              youReaction={null}
              youReactionKey={0}
              oppReaction={null}
            />
          </ColoredIsland>
        </div>

        {timerRunning && (
          <motion.div
            className="relative flex w-full justify-center px-3"
            initial={timerFadeIn ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <RoundTimer
              running={timerRunning && gameState.myTentative != null}
              duration={gameState.duration}
              keyId={step.id.length}
              idleWarning={false}
            />
          </motion.div>
        )}

        <div
          ref={boardRef}
          className="relative mt-2 flex w-full min-w-0 items-start justify-center overflow-visible"
        >
          <div className="relative max-w-full shrink-0">
            <ColoredIsland>
              <Board
                state={gameState}
                onTap={handleGridTap}
                boardPx={boardPx}
                showWaitingOverlay={false}
              />
              {step.showGridTapCue && <TutorialGridTapCue />}
              {step.blinkTile && spotlightTile != null && (
                <TutorialTileBlink tile={spotlightTile} boardPx={boardPx} />
              )}
            </ColoredIsland>
          </div>
        </div>
      </div>

      {/* Dim scrim — middle layer (z-20), behind rules, dissolves on step change */}
      <AnimatePresence>
        {showDimOverlay && (
          <TutorialDimOverlay
            mode={overlayMode}
            tappable={canTapToAdvance && showRuleText}
            onTap={handleAdvanceTap}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSpotlight && (
          <TutorialSpotlightOverlay
            key="tutorial-spotlight"
            boardRef={boardRef}
            tile={spotlightTile}
            boardPx={boardPx}
            passThrough={spotlightPassThrough}
            tappable={canTapToAdvance}
            onTap={handleAdvanceTap}
          />
        )}
      </AnimatePresence>

      {/* Rules container — top layer (z-30), always in focus when visible */}
      {step.showRulesContainer !== false && (
        <div className="relative z-30 mt-auto flex w-full min-w-0 flex-col items-center">
          <RulesContainer
            onEntranceComplete={() => setRulesEntranceDone(true)}
            onTap={
              canTapToAdvance && showRuleText ? handleAdvanceTap : undefined
            }
          >
            {showRuleText && (
              <TutorialRulesText key={step.id}>{step.text}</TutorialRulesText>
            )}
          </RulesContainer>
        </div>
      )}

      <AnimatePresence>
        {step.showCollisionBadge && gameState.tieRound && (
          <motion.div
            key="tutorial-collision"
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-x-hidden"
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

      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-[25] overflow-hidden">
          <Confetti kind="win" />
        </div>
      )}

      {showEmojiStep && (
        <TutorialEmojiStep
          boardPx={boardPx}
          modalText={step.text}
          showStartButton={step.id === "good-luck"}
          onReact={step.id === "emoji-wheel" ? handleEmojiReact : () => {}}
        />
      )}
    </div>
  );
}

function ColoredIsland({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full max-w-full min-w-0 overflow-visible"
      style={{ isolation: "isolate" }}
    >
      {children}
    </div>
  );
}
