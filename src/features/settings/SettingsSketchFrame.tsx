/**
 * SettingsSketchFrame — uneven hand-drawn outline (same language as NewGameModeStep).
 */
import { useId } from "react";

type SettingsSketchFrameProps = {
  /** viewBox width — stretch with preserveAspectRatio none. */
  vbW?: number;
  vbH?: number;
  /** Filled when selected / primary. */
  filled?: boolean;
  /** Soft paper fill when not filled. */
  soft?: boolean;
};

/** Wobbly rounded rect path in a 280×48 box. */
const WIDE_PATH =
  "M 6 9 Q 4 2 14 3 L 266 2 Q 276 4 275 12 L 277 36 Q 276 46 264 45 L 12 47 Q 3 45 4 36 Z";

/** Narrower chip path in a 100×40 box. */
const CHIP_PATH =
  "M 4 7 Q 3 2 10 2 L 90 2 Q 97 3 96 10 L 97 30 Q 96 38 88 37 L 10 38 Q 3 36 4 29 Z";

export function SettingsSketchFrame({
  vbW = 280,
  vbH = 48,
  filled = false,
  soft = true,
}: SettingsSketchFrameProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `settings-ctl-rough-${uid}`;
  const path = vbW <= 120 ? CHIP_PATH : WIDE_PATH;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${vbW} ${vbH}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <filter id={filterId} x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={9} />
          <feDisplacementMap in="SourceGraphic" scale="1.8" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>
        <path
          d={path}
          fill={
            filled
              ? "var(--ink)"
              : soft
                ? "rgba(255,255,255,0.45)"
                : "var(--paper)"
          }
          stroke="var(--ink)"
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
