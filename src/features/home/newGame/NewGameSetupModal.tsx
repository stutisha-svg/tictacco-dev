/**
 * NewGameSetupModal — two-step setup before `/game`.
 *   1. Game mode (relaxed / timed / ???) — pick advances automatically
 *   2. Game count (slider 3–7)
 *
 * One fixed paper shell; step content fades in place.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { NewGameSetupSheet } from "./NewGameSetupSheet";
import { NewGameModeStep } from "./NewGameModeStep";
import { NewGameCountStep } from "./NewGameCountStep";
import {
  NEW_GAME_COUNT_DEFAULT,
  type NewGameConfig,
  type NewGameMode,
} from "./newGameConfig";

type NewGameSetupStep = "mode" | "count";

type NewGameSetupModalProps = {
  open: boolean;
  onClose: () => void;
};

export function NewGameSetupModal({ open, onClose }: NewGameSetupModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<NewGameSetupStep>("mode");
  const [mode, setMode] = useState<NewGameMode | null>(null);
  const [gameCount, setGameCount] = useState(NEW_GAME_COUNT_DEFAULT);

  useEffect(() => {
    if (!open) return;
    setStep("mode");
    setMode(null);
    setGameCount(NEW_GAME_COUNT_DEFAULT);
  }, [open]);

  const pickMode = (next: NewGameMode) => {
    setMode(next);
    setStep("count");
  };

  const goPlay = () => {
    if (!mode) return;
    const config: NewGameConfig = { mode, gameCount };
    onClose();
    navigate("/game", { state: config });
  };

  const isMode = step === "mode";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-new-game-setup-modal
        >
          <button
            type="button"
            aria-label="close new game setup"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
          >
            <NewGameSetupSheet
              stepKey={step}
              title={isMode ? "Game mode" : "Game count"}
              subtitle={
                isMode
                  ? "Pick a pace."
                  : "Select the number of games for the match."
              }
              onBack={isMode ? onClose : () => setStep("mode")}
              backLabel={isMode ? "close" : "back to game mode"}
              footer={
                isMode ? undefined : (
                  <button
                    type="button"
                    onClick={goPlay}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border-2 text-sm transition-transform hover:scale-[1.02] active:scale-[0.97]"
                    style={{
                      fontFamily: "var(--font-display)",
                      borderColor: "var(--ink)",
                      background: "var(--ink)",
                      color: "var(--paper)",
                    }}
                  >
                    start match
                  </button>
                )
              }
            >
              {isMode ? (
                <NewGameModeStep value={mode} onChange={pickMode} />
              ) : (
                <NewGameCountStep value={gameCount} onChange={setGameCount} />
              )}
            </NewGameSetupSheet>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
