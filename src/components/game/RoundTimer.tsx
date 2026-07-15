/**
 * RoundTimer — hand-drawn crayon progress bar for the 5s round window.
 *
 * Purpose: shows time remaining until placements are locked.
 * State: local RAF-driven percentage; resets whenever `keyId` changes.
 * Deps: none.
 *
 * Style: the fill is a squiggly hand-drawn line drawn as an SVG path with the
 * shared crayon filter, so it visually matches the rest of the grid strokes.
 */
import { useEffect, useMemo, useRef, useState } from "react";

interface RoundTimerProps {
  running: boolean;
  duration: number;
  color: string;
  keyId: number;
}

const BAR_WIDTH = 320;
const BAR_HEIGHT = 22;
const PAD_X = 8;

/** Build a squiggle path across a given pixel width. */
function buildSquigglePath(pixelWidth: number, seed: number): string {
  const usable = Math.max(0, pixelWidth);
  const segments = Math.max(2, Math.round(usable / 10));
  const midY = BAR_HEIGHT / 2;
  const amp = 3.2;
  let d = `M ${PAD_X} ${midY}`;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const x = PAD_X + usable * t;
    const wobble = Math.sin(t * Math.PI * 6 + seed) * amp;
    const drift = ((Math.sin(seed * 12.9 + i * 4.7) * 43758.5) % 1) * 1.4;
    d += ` L ${x} ${midY + wobble + drift}`;
  }
  return d;
}

export function RoundTimer({ running, duration, color, keyId }: RoundTimerProps) {
  const [pct, setPct] = useState(0);
  const startRef = useRef(Date.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = Date.now();
    setPct(0);
    if (!running) return;
    const tick = () => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(1, elapsed / duration);
      setPct(p);
      if (p < 1 && running) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [keyId, running, duration]);

  const trackWidth = BAR_WIDTH - PAD_X * 2;
  const trackPath = useMemo(
    () => buildSquigglePath(trackWidth, 3.2),
    [trackWidth],
  );
  const fillPath = useMemo(
    () => buildSquigglePath(trackWidth * pct, 7.1),
    [pct, trackWidth],
  );

  return (
    <div className="flex w-full justify-center">
      <svg
        width="100%"
        height={BAR_HEIGHT + 6}
        viewBox={`0 0 ${BAR_WIDTH} ${BAR_HEIGHT + 6}`}
        preserveAspectRatio="none"
        className="max-w-[360px]"
      >
        <defs>
          <filter id="timer-rough" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="1.4" />
          </filter>
        </defs>
        <g filter="url(#timer-rough)">
          {/* Track — thin squiggle */}
          <path
            d={trackPath}
            stroke="var(--ink)"
            strokeOpacity={0.35}
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
          {/* Fill — thick colored squiggle grows across track */}
          <path
            d={fillPath}
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={0.9}
          />
        </g>
      </svg>
    </div>
  );
}
