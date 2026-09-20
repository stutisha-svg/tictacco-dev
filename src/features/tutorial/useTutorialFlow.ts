/**
 * useTutorialFlow — step machine for the static tutorial carousel.
 * Advances on tap / 10s, or after an emoji reaction. Not live gameplay.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildTutorialFrame } from "./tutorialFrames";
import {
  TUTORIAL_AUTO_ADVANCE_MS,
  TUTORIAL_STEPS,
} from "./tutorialSteps";

export function useTutorialFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [rulesEntranceDone, setRulesEntranceDone] = useState(false);

  const step = TUTORIAL_STEPS[stepIndex]!;
  const isLastStep = stepIndex >= TUTORIAL_STEPS.length - 1;

  const gameState = useMemo(
    () => buildTutorialFrame(step.frame),
    [step.frame],
  );

  const advance = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, TUTORIAL_STEPS.length - 1));
  }, []);

  useEffect(() => {
    if (step.advance !== "tap-or-10s") return;
    if (step.waitForRulesEntrance && !rulesEntranceDone) return;
    const t = setTimeout(advance, TUTORIAL_AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [step, stepIndex, rulesEntranceDone, advance]);

  const handleAdvanceTap = useCallback(() => {
    if (step.advance === "tap-or-10s") advance();
  }, [step.advance, advance]);

  const handleEmojiReact = useCallback(() => {
    if (step.advance === "emoji-react") advance();
  }, [step.advance, advance]);

  const overlayVisible = step.overlay !== "none";

  return {
    step,
    stepIndex,
    isLastStep,
    gameState,
    overlayVisible,
    overlayMode: step.overlay,
    rulesEntranceDone,
    setRulesEntranceDone,
    handleAdvanceTap,
    handleEmojiReact,
    advance,
  };
}
