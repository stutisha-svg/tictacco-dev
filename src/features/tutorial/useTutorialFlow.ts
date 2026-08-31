/**
 * Tutorial flow — preset step machine (not live gameplay).
 *
 * Drives board snapshots, overlays, and scripted animations per step.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findAllWins, idx } from "@/game/rules";
import type { GameState } from "@/game/useGameEngine";
import {
  COLLISION_DEMO_TILE,
  SCRIBBLE_DEMO_TILE,
  WIN_DEMO_SLOT,
  boardCollisionDemo,
  boardScribbleDemo,
  boardWinDemo,
  deadCollisionTile,
  emptyTutorialBoard,
  tileWith,
} from "./tutorialPresets";
import {
  TUTORIAL_AUTO_ADVANCE_MS,
  TUTORIAL_STEPS,
  type TutorialStep,
  tutorialBaseState,
} from "./tutorialSteps";

const OPP_DEMO_TILES = [idx(4, 3), idx(4, 5)];
const REVEAL_MS = 2200;

export function useTutorialFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [rulesEntranceDone, setRulesEntranceDone] = useState(false);
  const [gameState, setGameState] = useState<GameState>(tutorialBaseState);
  const [practiceTile, setPracticeTile] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [emojiReacted, setEmojiReacted] = useState(false);
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const step = TUTORIAL_STEPS[stepIndex]!;
  const isLastStep = stepIndex >= TUTORIAL_STEPS.length - 1;

  const spotlightTile = useMemo(() => {
    if (step.spotlightTile != null) return step.spotlightTile;
    if (step.overlay === "spotlight-tile" || step.blinkTile) {
      if (step.id.startsWith("ongoing")) return OPP_DEMO_TILES[0];
      if (step.id === "place-x-collision") return COLLISION_DEMO_TILE;
      if (step.id === "place-o-scribble") return SCRIBBLE_DEMO_TILE;
      if (step.id === "ongoing-place-o") return WIN_DEMO_SLOT;
      return practiceTile;
    }
    return practiceTile;
  }, [step, practiceTile]);

  const advance = useCallback(() => {
    setShowConfetti(false);
    setStepIndex((i) => Math.min(i + 1, TUTORIAL_STEPS.length - 1));
  }, []);

  const applyStepBoard = useCallback((nextStep: TutorialStep) => {
    setGameState((prev) => {
      const base = { ...prev, idleWarning: false, tieRound: null, winner: null };

      switch (nextStep.id) {
        case "tap-place":
          return {
            ...tutorialBaseState(),
            board: emptyTutorialBoard(),
          };
        case "tap-change":
        case "timer-active":
        case "tap-erase":
          return base;
        case "how-to-win":
          return {
            ...tutorialBaseState(),
            board: emptyTutorialBoard(),
            myTentative: null,
          };
        case "ongoing-intro":
        case "ongoing-opp-move":
        case "ongoing-shape-color":
          return {
            ...base,
            phase: "placing",
            board: boardWinDemo(),
            oppMove: null,
            myTentative: null,
            roundStarted: true,
            progressYou: 1,
            progressOpp: 2,
          };
        case "ongoing-reveal":
          return {
            ...base,
            phase: "revealing",
            board: boardWinDemo(),
            oppMove: { tile: idx(4, 5), shape: "X" },
            myTentative: null,
            roundStarted: true,
            progressYou: 1,
            progressOpp: 2,
          };
        case "ongoing-place-o":
          return {
            ...base,
            phase: "placing",
            board: boardWinDemo(),
            myTentative: null,
            roundStarted: true,
            progressYou: 1,
            progressOpp: 2,
          };
        case "you-win":
          return {
            ...base,
            phase: "won",
            board: (() => {
              const b = boardWinDemo();
              b[WIN_DEMO_SLOT] = tileWith("you", "O");
              return b;
            })(),
            winner: { owner: "you", line: [idx(4, 3), WIN_DEMO_SLOT, idx(4, 5)] },
            progressYou: 3,
            progressOpp: 2,
          };
        case "other-rules":
          return { ...tutorialBaseState(), board: emptyTutorialBoard() };
        case "place-x-collision":
          return {
            ...base,
            phase: "placing",
            board: boardCollisionDemo(),
            myTentative: null,
            roundStarted: true,
          };
        case "double-collision":
          return {
            ...base,
            phase: "revealing",
            board: (() => {
              const b = boardCollisionDemo();
              b[COLLISION_DEMO_TILE] = tileWith("you", "X");
              b[idx(5, 2)] = tileWith("opp", "X");
              return b;
            })(),
            tieRound: {
              tiles: [idx(3, 0), idx(3, 1), COLLISION_DEMO_TILE, idx(5, 0), idx(5, 1), idx(5, 2)],
              lines: [
                [idx(3, 0), idx(3, 1), COLLISION_DEMO_TILE],
                [idx(5, 0), idx(5, 1), idx(5, 2)],
              ],
            },
          };
        case "place-o-scribble":
          return {
            ...base,
            phase: "placing",
            board: boardScribbleDemo(),
            myTentative: null,
            roundStarted: true,
          };
        case "scribble-draw":
          return {
            ...base,
            phase: "revealing",
            board: (() => {
              const b = boardScribbleDemo();
              b[SCRIBBLE_DEMO_TILE] = deadCollisionTile("O", "X");
              return b;
            })(),
            oppMove: { tile: SCRIBBLE_DEMO_TILE, shape: "X" },
            lastReveal: {
              mine: { tile: SCRIBBLE_DEMO_TILE, shape: "O" },
              opp: { tile: SCRIBBLE_DEMO_TILE, shape: "X" },
              collision: true,
            },
          };
        case "best-of":
          return {
            ...tutorialBaseState(),
            match: { you: 1, opp: 0, history: ["you"] },
            matchTarget: 3,
          };
        case "emoji-wheel":
        case "good-luck":
          return { ...tutorialBaseState(), board: emptyTutorialBoard() };
        default:
          return base;
      }
    });
  }, []);

  useEffect(() => {
    applyStepBoard(step);
    setTimerRunning(step.showTimer ?? false);
    setShowConfetti(step.showConfetti ?? false);

    if (step.id === "ongoing-reveal") {
      revealTimer.current = setTimeout(advance, REVEAL_MS);
    }
    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, [stepIndex, step, applyStepBoard, advance]);

  useEffect(() => {
    if (step.advance !== "tap-or-10s") return;
    if (step.waitForRulesEntrance && !rulesEntranceDone) return;
    const t = setTimeout(advance, TUTORIAL_AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [step, stepIndex, rulesEntranceDone, advance]);

  const handleAdvanceTap = useCallback(() => {
    if (step.advance === "tap-or-10s") advance();
  }, [step.advance, advance]);

  const handleGridTap = useCallback(
    (tile: number) => {
      if (step.id === "tap-place") {
        setPracticeTile(tile);
        setGameState((s) => ({
          ...s,
          myTentative: { tile, shape: "X" },
          roundStarted: true,
          timerStart: Date.now(),
        }));
        advance();
        return;
      }

      if (step.id === "tap-change" && practiceTile === tile) {
        setGameState((s) => ({
          ...s,
          myTentative: { tile, shape: "O" },
        }));
        advance();
        return;
      }

      if (step.id === "tap-erase" && practiceTile === tile) {
        setGameState((s) => ({
          ...s,
          myTentative: null,
          timerStart: null,
          roundStarted: true,
        }));
        setTimerRunning(false);
        advance();
        return;
      }

      if (step.id === "ongoing-place-o" && tile === WIN_DEMO_SLOT) {
        const board = boardWinDemo();
        board[WIN_DEMO_SLOT] = tileWith("you", "O");
        const wins = findAllWins(board);
        setGameState((s) => ({
          ...s,
          board,
          phase: "won",
          winner: wins[0] ?? { owner: "you", line: [idx(4, 3), WIN_DEMO_SLOT, idx(4, 5)] },
          myTentative: null,
          progressYou: 3,
        }));
        setShowConfetti(true);
        advance();
        return;
      }

      if (step.id === "place-x-collision" && tile === COLLISION_DEMO_TILE) {
        advance();
        return;
      }

      if (step.id === "place-o-scribble" && tile === SCRIBBLE_DEMO_TILE) {
        advance();
        return;
      }
    },
    [step.id, practiceTile, advance],
  );

  const handleEmojiReact = useCallback(() => {
    setEmojiReacted(true);
    advance();
  }, [advance]);

  const overlayVisible = step.overlay !== "none";

  const ongoingSpotlightTile =
    step.id === "ongoing-shape-color" ? OPP_DEMO_TILES[1] : OPP_DEMO_TILES[0];

  const resolvedSpotlight =
    step.id === "ongoing-opp-move" || step.id === "ongoing-shape-color"
      ? ongoingSpotlightTile
      : spotlightTile;

  return {
    step,
    stepIndex,
    isLastStep,
    gameState,
    practiceTile,
    spotlightTile: resolvedSpotlight,
    overlayVisible,
    overlayMode: step.overlay,
    showConfetti,
    timerRunning,
    timerFadeIn: step.timerFadeIn ?? false,
    emojiReacted,
    rulesEntranceDone,
    setRulesEntranceDone,
    handleAdvanceTap,
    handleGridTap,
    handleEmojiReact,
    advance,
  };
}
