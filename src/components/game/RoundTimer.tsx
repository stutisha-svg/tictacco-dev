/**
 * RoundTimer — rounded-rectangle progress bar.
 *
 * - Idle "rival is waiting": dark-orange stroke traces the outline only (no fill).
 * - Running (after placement): black crayon squiggle fills left→right.
 * - Idle (no warning): dashed empty outline.
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
const RX = 2;
const RY = 2;
const RW = BAR_WIDTH - 4;
const RH = BAR_HEIGHT - 4;

/** Perimeter of the rounded rect outline (for stroke-dash animation). */
function roundedRectPerimeter(w: number, h: number, r: number): number {
  const rr = Math.min(r, w / 2, h / 2);
  return 2 * (w + h - 2 * rr) + 2 * Math.PI * rr;
}

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
  const tracing = !!idleWarning && idle;
  const perimeter = useMemo(() => roundedRectPerimeter(RW, RH, RADIUS), []);

  return (
    <div className="flex w-full justify-center">
      <svg
        width="100%"
        height={BAR_HEIGHT + 6}
        viewBox={`0 0 ${BAR_WIDTH} ${BAR_HEIGHT + 6}`}
        preserveAspectRatio="none"
        className="max-w-[360px]"
        aria-label={tracing ? "rival is waiting" : "round timer"}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={tracing ? undefined : Math.round(pct * 100)}
      >
        <defs>
          <filter id="timer-outline" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="1.1" />
          </filter>
          <filter id="timer-scribble" x="-5%" y="-40%" width="110%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="17" />
            <feDisplacementMap in="SourceGraphic" scale="3.4" />
          </filter>
          <clipPath id="timer-fill-clip">
            <rect x={PAD_X} y={0} width={clipWidth} height={BAR_HEIGHT} />
          </clipPath>
        </defs>

        {/* Base outline — dashed when idle, solid when running; faint guide when tracing */}
        <g filter="url(#timer-outline)">
          <rect
            x={RX}
            y={RY}
            width={RW}
            height={RH}
            rx={RADIUS}
            ry={RADIUS}
            fill="none"
            stroke={tracing ? "color-mix(in oklab, var(--player-you) 45%, var(--ink-brown))" : "var(--ink)"}
            strokeWidth={tracing ? 2.2 : 2.5}
            strokeLinecap="round"
            strokeDasharray={idle && !tracing ? "6 5" : undefined}
            opacity={tracing ? 0.45 : 0.9}
          />
        </g>

        {/* Idle warning: dark-orange stroke traces the border (no fill / no shimmer) */}
        {tracing && (
          <g filter="url(#timer-outline)">
            <rect
              x={RX}
              y={RY}
              width={RW}
              height={RH}
              rx={RADIUS}
              ry={RADIUS}
              fill="none"
              stroke="color-mix(in oklab, var(--player-you) 55%, var(--ink))"
              strokeWidth={3.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={perimeter}
              strokeDashoffset={perimeter}
            >
              <animate
                attributeName="stroke-dashoffset"
                values={`${perimeter};0;${perimeter}`}
                dur="2.4s"
                repeatCount="indefinite"
                calcMode="spline"
                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                keyTimes="0;0.55;1"
              />
            </rect>
          </g>
        )}

        {/* Chunky ink squiggle — only while the round timer is running */}
        {running && (
          <g clipPath="url(#timer-fill-clip)" filter="url(#timer-scribble)">
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
        )}
      </svg>
    </div>
  );
}
