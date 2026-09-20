/**
 * SettingsMenu — paper overlay opened from TopBar gear.
 * Controls use the same sketch frames as NewGameModeStep.
 */
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { CrayonCloseIcon } from "@/components/game/CrayonCloseIcon";
import { SettingsVolumeSlider } from "./SettingsVolumeSlider";
import { SettingsSketchFrame } from "./SettingsSketchFrame";
import {
  SETTINGS_CONTRAST_OPTIONS,
  SETTINGS_LANGUAGE_OPTIONS,
  type SettingsContrast,
  type SettingsLanguage,
  type SettingsState,
} from "./settingsConfig";

const FEEDBACK_MAIL =
  "mailto:feedback@tictacco.app?subject=tic%20tac%20co%20feedback";

type SettingsMenuProps = {
  open: boolean;
  onClose: () => void;
  settings: SettingsState;
  onSfxVolume: (n: number) => void;
  onGameVolume: (n: number) => void;
  onContrast: (c: SettingsContrast) => void;
  onLanguage: (l: SettingsLanguage) => void;
};

export function SettingsMenu({
  open,
  onClose,
  settings,
  onSfxVolume,
  onGameVolume,
  onContrast,
  onLanguage,
}: SettingsMenuProps) {
  const navigate = useNavigate();

  const goTutorial = () => {
    onClose();
    navigate("/tutorial");
  };

  const quitGame = () => {
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          data-settings-menu
        >
          <button
            type="button"
            aria-label="close settings"
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal
            aria-label="Settings"
            className="relative z-10 w-full max-w-[340px] overflow-hidden"
            initial={{ y: 20, opacity: 0, rotate: -1.5 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 12, opacity: 0, rotate: 1 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 340 500"
              preserveAspectRatio="none"
              aria-hidden
            >
              <defs>
                <filter
                  id="settings-sheet-rough"
                  x="-8%"
                  y="-8%"
                  width="116%"
                  height="116%"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.85"
                    numOctaves="2"
                    seed="21"
                  />
                  <feDisplacementMap in="SourceGraphic" scale="2.2" />
                </filter>
              </defs>
              <g filter="url(#settings-sheet-rough)">
                <path
                  d="M 18 28 Q 12 12 34 10 L 310 8 Q 332 14 328 42 L 334 450 Q 330 488 292 484 L 36 490 Q 8 480 12 442 Z"
                  fill="var(--paper)"
                  stroke="var(--ink)"
                  strokeWidth={3}
                  strokeLinejoin="round"
                />
                <path
                  d="M 32 40 Q 28 26 46 24 L 298 22 Q 318 28 314 48 L 320 436 Q 316 470 282 468 L 48 474 Q 24 466 28 432 Z"
                  fill="none"
                  stroke="var(--accent-purple)"
                  strokeWidth={2}
                  strokeDasharray="7 5"
                />
              </g>
            </svg>

            <button
              type="button"
              aria-label="close settings"
              onClick={onClose}
              className="absolute left-4 top-4 z-20 flex size-11 min-h-[44px] min-w-[44px] items-center justify-center bg-transparent p-0 transition-transform hover:scale-105 active:scale-95"
            >
              <CrayonCloseIcon size={36} />
            </button>

            <div
              className="relative flex flex-col gap-2.5 overflow-hidden pb-7 pt-11"
              style={{ paddingLeft: 36, paddingRight: 36 }}
            >
              <header className="text-center">
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--accent-purple)",
                  }}
                >
                  menu
                </p>
                <h2
                  className="mt-0.5 text-2xl font-bold leading-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink)",
                  }}
                >
                  Settings
                </h2>
              </header>

              <SettingsVolumeSlider
                id="settings-sfx"
                label="SFX volume"
                value={settings.sfxVolume}
                onChange={onSfxVolume}
              />
              <SettingsVolumeSlider
                id="settings-game"
                label="Game volume"
                value={settings.gameVolume}
                onChange={onGameVolume}
              />

              <fieldset className="m-0 border-0 p-0">
                <legend
                  className="mb-1.5 text-sm font-bold leading-snug"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink)",
                  }}
                >
                  Color contrast (accessibility)
                </legend>
                <div
                  className="grid grid-cols-3 gap-1.5"
                  role="radiogroup"
                  aria-label="Color contrast (accessibility)"
                >
                  {SETTINGS_CONTRAST_OPTIONS.map((opt) => {
                    const selected = settings.contrast === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onContrast(opt.id)}
                        className="relative min-h-[40px] bg-transparent px-1 text-xs font-bold transition-transform active:scale-[0.97]"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: selected ? "var(--paper)" : "var(--ink)",
                        }}
                      >
                        <SettingsSketchFrame
                          vbW={100}
                          vbH={40}
                          filled={selected}
                        />
                        <span className="relative">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="flex flex-col gap-1.5">
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink)",
                  }}
                >
                  Language
                </span>
                <div className="relative min-h-[44px]">
                  <SettingsSketchFrame vbW={280} vbH={48} soft />
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      onLanguage(e.target.value as SettingsLanguage)
                    }
                    className="relative z-[1] min-h-[44px] w-full appearance-none bg-transparent px-4 text-sm"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                      border: "none",
                      outline: "none",
                    }}
                  >
                    {SETTINGS_LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </label>

              <div className="mt-2.5 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={goTutorial}
                  className="relative inline-flex min-h-[46px] w-full items-center justify-center bg-transparent text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--paper)",
                  }}
                >
                  <SettingsSketchFrame vbW={280} vbH={48} filled />
                  <span className="relative">Tutorial</span>
                </button>

                <button
                  type="button"
                  onClick={quitGame}
                  className="relative inline-flex min-h-[46px] w-full items-center justify-center bg-transparent text-sm font-bold transition-transform hover:scale-[1.02] active:scale-[0.97]"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--ink)",
                  }}
                >
                  <SettingsSketchFrame vbW={280} vbH={48} soft={false} />
                  <span className="relative">Quit game</span>
                </button>
              </div>

              <a
                href={FEEDBACK_MAIL}
                className="mt-0.5 self-center text-center text-xs font-bold underline underline-offset-2"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--ink)",
                }}
              >
                report feedback
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
