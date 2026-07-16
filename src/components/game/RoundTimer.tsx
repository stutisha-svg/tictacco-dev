/**
 * RoundTimer — rounded-rectangle progress bar filled with a crayon squiggle.
 *
 * Purpose: shows time remaining for the current 5s round.
 * State: local RAF-driven percentage; restarts when `keyId` changes AND
 *        `running` flips to true.
 * Deps: none.
 *
 * Visual: hand-drawn rounded-rect outline; inside, a zigzag crayon stroke
 * spans the full width. A left-anchored clip reveals more of the squiggle
 * as time elapses, so the bar "fills up" without changing the underlying
 * squiggle path.
 */
import { useEffect, useMemo, useRef, useState } from "react";

interface RoundTimerProps {
  running: boolean;
  duration: number;
  color: string;
  keyId: number;
  idleWarning?: boolean;
}

const BAR_WIDTH = 320;
const BAR_HEIGHT = 26;
const PAD_X = 10;
const RADIUS = 12;

/** Build a dense zigzag squiggle path spanning the usable width. */
function buildZigZagPath(usableWidth: number, seed: number): string {
  const midY = BAR_HEIGHT / 2;
  const amp = 5;
  const step = 8;
  const count = Math.max(4, Math.floor(usableWidth / step));
  const j = (n: number) => ((Math.sin(seed * 12.9 + n * 4.7) * 43758.5) % 1) * 1.2;
  let d = `M ${PAD_X} ${midY}`;
  for (let i = 1; i <= count; i++) {
    const x = PAD_X + (usableWidth * i) / count;
    const y = midY + (i % 2 === 0 ? -amp : amp) + j(i);
    d += ` L ${x} ${y}`;
  }
  return d;
}

export function RoundTimer({
  running,
  duration,
  color,
  keyId,
  idleWarning,
}: RoundTimerProps) {
  const [pct, setPct] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // reset whenever the round changes
    setPct(0);
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [keyId]);

  useEffect(() => {
    if (!running) return;
    // start the clock the first time we become "running" for this key
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
          <filter id="timer-rough" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="1.1" />
          </filter>
          <clipPath id="timer-fill-clip">
            <rect
              x={PAD_X}
              y={0}
              width={clipWidth}
              height={BAR_HEIGHT}
            />
          </clipPath>
        </defs>

        <g filter="url(#timer-rough)">
          {/* Outline rounded rectangle — hand drawn */}
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
            opacity={idleWarning ? 0.95 : 0.85}
          />

          {/* Faint full-length ghost squiggle so users see the track */}
          <path
            d={zigZagPath}
            stroke="var(--ink)"
            strokeOpacity={0.18}
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />

          {/* Filled squiggle — same path, revealed left-to-right by the clip */}
          <g clipPath="url(#timer-fill-clip)">
            <path
              d={zigZagPath}
              stroke={color}
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              opacity={0.95}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
