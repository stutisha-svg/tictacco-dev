import { useEffect, useRef, useState } from "react";

interface Props {
  running: boolean;
  duration: number;
  color: string;
  keyId: number;
}

/** Crayon-styled progress bar. Runs 0->100% while `running` is true, using `keyId` to reset. */
export function RoundTimer({ running, duration, color, keyId }: Props) {
  const [pct, setPct] = useState(0);
  const start = useRef(Date.now());
  const raf = useRef<number | null>(null);

  useEffect(() => {
    start.current = Date.now();
    setPct(0);
    if (!running) return;
    const tick = () => {
      const el = Date.now() - start.current;
      const p = Math.min(1, el / duration);
      setPct(p);
      if (p < 1 && running) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [keyId, running, duration]);

  const h = 14;
  const w = 320;
  return (
    <div className="w-full flex justify-center pt-1">
      <svg width="100%" height={h + 8} viewBox={`0 0 ${w} ${h + 8}`} preserveAspectRatio="none" style={{ maxWidth: 360 }}>
        <defs>
          <filter id="bar-rough" x="-5%" y="-30%" width="110%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="2" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        <g filter="url(#bar-rough)">
          <rect x={2} y={4} width={w - 4} height={h} rx={h / 2} fill="none" stroke="var(--ink)" strokeOpacity={0.55} strokeWidth={2} />
          <rect
            x={4}
            y={6}
            width={Math.max(0, (w - 8) * pct)}
            height={h - 4}
            rx={(h - 4) / 2}
            fill={color}
            opacity={0.85}
          />
        </g>
      </svg>
    </div>
  );
}
