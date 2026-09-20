/**
 * NewGameCountStep — best-of slider (3–7, default 3).
 */
import type { CSSProperties } from "react";
import {
  NEW_GAME_COUNT_MAX,
  NEW_GAME_COUNT_MIN,
  clampGameCount,
} from "./newGameConfig";

type NewGameCountStepProps = {
  value: number;
  onChange: (n: number) => void;
};

export function NewGameCountStep({ value, onChange }: NewGameCountStepProps) {
  const n = clampGameCount(value);
  const pct =
    ((n - NEW_GAME_COUNT_MIN) / (NEW_GAME_COUNT_MAX - NEW_GAME_COUNT_MIN)) * 100;

  const sliderStyle = {
    ["--new-game-slider-pct" as string]: `${pct}%`,
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-4" data-new-game-count-step>
      <div className="flex items-end justify-center gap-2">
        <span
          className="text-5xl font-bold tabular-nums leading-none"
          style={{
            fontFamily: "'Caveat', 'Patrick Hand', cursive",
            color: "var(--ink)",
            WebkitTextStroke: "1px var(--ink)",
          }}
          aria-live="polite"
        >
          {n}
        </span>
        <span
          className="mb-1 text-sm"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink-soft)" }}
        >
          games
        </span>
      </div>

      <div
        className="self-center rounded-full border-2 px-3 py-1 text-center text-xs uppercase tracking-wide"
        style={{
          fontFamily: "var(--font-display)",
          borderColor: "var(--ink)",
          background: "rgba(255,255,255,0.55)",
          color: "var(--ink)",
        }}
      >
        best of {n}
      </div>

      <div className="mx-auto flex w-[78%] items-center gap-3">
        <span
          className="w-6 shrink-0 text-center text-lg font-bold tabular-nums"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          aria-hidden
        >
          {NEW_GAME_COUNT_MIN}
        </span>
        <label className="flex min-w-0 flex-1 flex-col">
          <span className="sr-only">Number of games in the match</span>
          <input
            type="range"
            min={NEW_GAME_COUNT_MIN}
            max={NEW_GAME_COUNT_MAX}
            step={1}
            value={n}
            onChange={(e) => onChange(clampGameCount(Number(e.target.value)))}
            className="new-game-count-slider w-full cursor-pointer appearance-none bg-transparent"
            style={sliderStyle}
            aria-valuemin={NEW_GAME_COUNT_MIN}
            aria-valuemax={NEW_GAME_COUNT_MAX}
            aria-valuenow={n}
          />
        </label>
        <span
          className="w-6 shrink-0 text-center text-lg font-bold tabular-nums"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
          aria-hidden
        >
          {NEW_GAME_COUNT_MAX}
        </span>
      </div>

      <style>{`
        .new-game-count-slider {
          height: 28px;
        }
        .new-game-count-slider::-webkit-slider-runnable-track {
          height: 10px;
          border-radius: 999px;
          border: 2px solid var(--ink);
          background: linear-gradient(
            to right,
            var(--accent-purple) 0%,
            var(--accent-purple) var(--new-game-slider-pct, 0%),
            rgba(255, 255, 255, 0.55) var(--new-game-slider-pct, 0%),
            rgba(255, 255, 255, 0.55) 100%
          );
        }
        .new-game-count-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: -8px;
          border-radius: 999px;
          border: 2.5px solid var(--ink);
          background: var(--paper);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);
        }
        .new-game-count-slider::-moz-range-track {
          height: 10px;
          border-radius: 999px;
          border: 2px solid var(--ink);
          background: rgba(255, 255, 255, 0.55);
        }
        .new-game-count-slider::-moz-range-progress {
          height: 10px;
          border-radius: 999px;
          background: var(--accent-purple);
        }
        .new-game-count-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 999px;
          border: 2.5px solid var(--ink);
          background: var(--paper);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
}
