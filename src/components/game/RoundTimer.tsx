/**
 * RoundTimer — rounded-rectangle progress bar that fills left→right with a
 * chunky, hand-drawn crayon squiggle.
 *
 * Rules:
 *  - Bar starts fully EMPTY (no ghost track); the squiggle is drawn as time
 *    elapses via a left-anchored clip revealing a heavily textured path.
 *  - Fill color is always black ink so it never clashes with player colors.
 *  - `running` starts the RAF when it first flips true for the current
 *    `keyId`. Resetting `keyId` returns the bar to empty.
 */
import { useEffect, useMemo, useRef, useState } from "react";

interface RoundTimerProps {
  running: boolean;
  duration: number;
  /** kept for API compat, ignored — squiggle is always ink black */
  color?: string;
  keyId: number;
  idleWarning?: boolean;
}

const BAR_WIDTH = 320;
const BAR_HEIGHT = 26;
const PAD_X = 10;
const RADIUS = 12;

/** Rough zigzag squiggle across the usable width — dense + jittered. */
function buildZigZagPath(usableWidth: number, seed: number): string {
  const midY = BAR_HEIGHT / 2;
  const amp = 6;
  const step = 6;
  const count = Math.max(6, Math.floor(usableWidth / step));
  const j = (n: number) => {
    const v = Math.sin(seed * 12.9 + n * 4.7) * 43758.5;
    return (v - Math.floor(v)) * 2 - 1;
  };
  let d = `M ${PAD_X} ${midY}`;
  for (let i = 1; i <= count; i++) {
    const x = PAD_X + (usableWidth * i) / count + j(i) * 1.2;
    const y = midY + (i % 2 === 0 ? -amp : amp) + j(i + 3) * 1.5;
    d += ` L ${x} ${y}`;
  }
  return d;
}

export function RoundTimer({
  running,
  duration,
  keyId,
  idleWarning,
}: RoundTimerProps) {
  const [pct, setPct] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setPct(0);
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [keyId]);

  useEffect(() => {
    if (!running) return;
    if (startRef.current === null) startRef.current = Date.now();
    const tick = () => {
      const start = startRef.current!;
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / duration);
      setPct(p);
      if (p < 1 && running) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running, duration]);

  const usable = BAR_WIDTH - PAD_X * 2;
  const zigZagPath = useMemo(() => buildZigZagPath(usable, 3.1), [usable]);
  const clipWidth = Math.max(0, usable * pct);
  const idle = !running;
  const outlineColor = idleWarning ? "var(--player-you)" : "var(--ink)";

  return (
    <div className="flex w-full justify-center">
      <svg
        width="100%"
        height={BAR_HEIGHT + 6}
        viewBox={`0 0 ${BAR_WIDTH} ${BAR_HEIGHT + 6}`}
        preserveAspectRatio="none"
        className="max-w-[360px]"
        aria-label="round timer"
      >
        <defs>
          {/* Outline: light grain so the rectangle stays readable */}
          <filter id="timer-outline" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="1.1" />
          </filter>
          {/* Fill squiggle: heavy grain — feels like a real crayon stroke */}
          <filter id="timer-scribble" x="-5%" y="-40%" width="110%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="17" />
            <feDisplacementMap in="SourceGraphic" scale="3.4" />
          </filter>
          <clipPath id="timer-fill-clip">
            <rect x={PAD_X} y={0} width={clipWidth} height={BAR_HEIGHT} />
          </clipPath>
        </defs>

        {/* Outline rounded rectangle — hand drawn, empty bar */}
        <g filter="url(#timer-outline)">
          <rect
            x={2}
            y={2}
            width={BAR_WIDTH - 4}
            height={BAR_HEIGHT - 4}
            rx={RADIUS}
            ry={RADIUS}
            fill="none"
            stroke={outlineColor}
            strokeWidth={idleWarning ? 3.2 : 2.5}
            strokeLinecap="round"
            strokeDasharray={idle && !idleWarning ? "6 5" : undefined}
            opacity={idleWarning ? 0.95 : 0.9}
          />
        </g>

        {/* Chunky ink squiggle — grows left→right, no pre-existing ghost */}
        <g clipPath="url(#timer-fill-clip)" filter="url(#timer-scribble)">
          {/* double-stroke for extra crayon weight */}
          <path
            d={zigZagPath}
            stroke="var(--ink)"
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={0.95}
          />
          <path
            d={zigZagPath}
            stroke="var(--ink)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            opacity={0.7}
          />
        </g>
      </svg>
    </div>
  );
}
