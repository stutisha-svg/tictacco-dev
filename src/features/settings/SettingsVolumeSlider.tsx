/**
 * SettingsVolumeSlider — sketch track matching NewGameCountStep slider.
 */
import type { CSSProperties } from "react";
import { clampVolume } from "./settingsConfig";

type SettingsVolumeSliderProps = {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
};

export function SettingsVolumeSlider({
  id,
  label,
  value,
  onChange,
}: SettingsVolumeSliderProps) {
  const n = clampVolume(value);
  const sliderStyle = {
    ["--settings-slider-pct" as string]: `${n}%`,
  } as CSSProperties;

  return (
    <div className="flex flex-col gap-1" data-settings-volume={id}>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className="text-sm font-bold"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          {label}
        </label>
        <span
          className="text-sm font-bold tabular-nums"
          style={{
            fontFamily: "'Caveat', 'Patrick Hand', cursive",
            color: "var(--ink)",
          }}
        >
          {n}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={n}
        onChange={(e) => onChange(clampVolume(Number(e.target.value)))}
        className="settings-volume-slider w-full cursor-pointer appearance-none bg-transparent"
        style={sliderStyle}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={n}
      />
      <style>{`
        .settings-volume-slider {
          height: 28px;
        }
        .settings-volume-slider::-webkit-slider-runnable-track {
          height: 10px;
          border-radius: 3px 8px 4px 9px;
          border: 2.5px solid var(--ink);
          background: linear-gradient(
            to right,
            var(--accent-purple) 0%,
            var(--accent-purple) var(--settings-slider-pct, 0%),
            rgba(255, 255, 255, 0.55) var(--settings-slider-pct, 0%),
            rgba(255, 255, 255, 0.55) 100%
          );
        }
        .settings-volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: -8px;
          border-radius: 60% 45% 55% 50%;
          border: 2.5px solid var(--ink);
          background: var(--paper);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);
        }
        .settings-volume-slider::-moz-range-track {
          height: 10px;
          border-radius: 3px 8px 4px 9px;
          border: 2.5px solid var(--ink);
          background: rgba(255, 255, 255, 0.55);
        }
        .settings-volume-slider::-moz-range-progress {
          height: 10px;
          border-radius: 3px 8px 4px 9px;
          background: var(--accent-purple);
        }
        .settings-volume-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 60% 45% 55% 50%;
          border: 2.5px solid var(--ink);
          background: var(--paper);
          box-shadow: 0 2px 0 rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
}
