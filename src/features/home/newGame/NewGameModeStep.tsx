/**
 * NewGameModeStep — three plain picks: relaxed / timed / ???
 * Selected fill is the sketch path itself (stays inside the outline).
 */
import { NEW_GAME_MODES, type NewGameMode } from "./newGameConfig";

/** Shared sketch path for fill + stroke so ink never spills past the outline. */
const SKETCH_PATH =
  "M 6 10 Q 4 3 14 4 L 266 3 Q 276 5 275 14 L 277 44 Q 276 53 264 52 L 12 54 Q 3 52 4 42 Z";

type NewGameModeStepProps = {
  value: NewGameMode | null;
  onChange: (mode: NewGameMode) => void;
};

export function NewGameModeStep({ value, onChange }: NewGameModeStepProps) {
  return (
    <div
      className="flex flex-col gap-3"
      data-new-game-mode-step
      role="listbox"
      aria-label="Game mode"
    >
      {NEW_GAME_MODES.map((m) => {
        const selected = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="option"
            aria-selected={selected}
            data-new-game-mode={m.id}
            onClick={() => onChange(m.id)}
            className="relative w-full min-h-[52px] bg-transparent px-4 py-3 text-center text-xl font-bold leading-none transition-transform active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-display)",
              color: selected ? "var(--paper)" : "var(--ink)",
            }}
          >
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 280 56"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d={SKETCH_PATH}
                fill={selected ? "var(--ink)" : "rgba(255,255,255,0.45)"}
                stroke="var(--ink)"
                strokeWidth={2.4}
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
