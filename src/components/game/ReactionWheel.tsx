/**
 * ReactionWheel — semi-circular fan of 8 hand-drawn text-emoji reactions.
 *
 * Auto-spins every 20s (whether used or not) as a nudge for the player.
 * To the right of the wheel sits a small avatar with a "react!" cloud.
 * Selecting a reaction fires onReact(text); the parent renders the picked
 * reaction in a thought-cloud over the player's profile.
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export const REACTIONS: string[] = [
  "gg!",
  "wow",
  "oof",
  "hah",
  ":P",
  "wow!",
  "T_T",
  "^_^",
];

interface Props {
  onReact: (text: string) => void;
}

export function ReactionWheel({ onReact }: Props) {
  const [rot, setRot] = useState(0);
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // spin every 20s regardless of interaction
    timerRef.current = setInterval(() => {
      setRot((r) => r + 360);
      setShowNudge(true);
    }, 20000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const R = 78; // radius of arc placement
  const wheelSize = 200;
  const cx = wheelSize / 2;
  const cy = wheelSize - 20; // pivot near bottom-center → semicircle up top

  // 8 reactions distributed on an upper semicircle (180° → 360°/0°)
  const count = REACTIONS.length;
  const positions = REACTIONS.map((r, i) => {
    const t = i / (count - 1); // 0..1
    const angle = Math.PI + t * Math.PI; // π..2π (top arc)
    return {
      text: r,
      x: cx + R * Math.cos(angle),
      y: cy + R * Math.sin(angle),
    };
  });

  const pick = (text: string) => {
    onReact(text);
    setOpen(false);
    setShowNudge(false);
  };

  return (
    <div className="pointer-events-none relative flex w-full items-end justify-center gap-3 px-4">
      {/* Semi-circle reaction wheel */}
      <motion.div
        className="pointer-events-auto relative"
        style={{ width: wheelSize, height: wheelSize / 2 + 24, overflow: "visible" }}
        animate={{ rotate: rot }}
        transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg
          width={wheelSize}
          height={wheelSize / 2 + 24}
          viewBox={`0 ${cy - R - 20} ${wheelSize} ${R + 40}`}
          className="overflow-visible"
        >
          <defs>
            <filter id="rw-rough" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="8" />
              <feDisplacementMap in="SourceGraphic" scale="1.6" />
            </filter>
          </defs>
          {/* arc backing */}
          <g filter="url(#rw-rough)">
            <path
              d={`M ${cx - R - 10} ${cy} A ${R + 10} ${R + 10} 0 0 1 ${cx + R + 10} ${cy}`}
              fill="var(--paper)"
              stroke="var(--ink-brown)"
              strokeWidth={2}
              opacity={0.85}
            />
          </g>
        </svg>
        {positions.map((p, i) => (
          <button
            key={i}
            onClick={() => pick(p.text)}
            className="absolute flex items-center justify-center rounded-full bg-white transition-transform duration-200 hover:scale-110 active:scale-95"
            style={{
              width: 40,
              height: 40,
              left: p.x - 20,
              top: p.y - 20,
              border: "2.5px solid var(--ink)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              fontFamily: "var(--font-display)",
              fontSize: 15,
              color: "var(--ink)",
              // counter-rotate so text stays upright while wheel spins
              transform: `rotate(${-rot}deg)`,
              transition: "transform 1.4s cubic-bezier(.34,1.56,.64,1)",
            }}
            aria-label={`react ${p.text}`}
          >
            {p.text}
          </button>
        ))}
      </motion.div>

      {/* Mini profile + "react!" cloud on right */}
      <div className="pointer-events-auto relative flex flex-col items-center pb-1">
        <AnimatePresence>
          {showNudge && (
            <motion.div
              key="nudge"
              className="absolute -top-8"
              initial={{ opacity: 0, y: 4, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div
                className="relative rounded-full border-2 bg-white px-2 py-0.5"
                style={{
                  borderColor: "var(--ink)",
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                }}
              >
                react!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => {
            setOpen((o) => !o);
            setShowNudge(false);
          }}
          className="flex items-center justify-center rounded-full bg-white transition-transform active:scale-95"
          style={{
            width: 36,
            height: 36,
            border: "2.5px solid var(--player-you)",
            color: "var(--player-you)",
            fontSize: 18,
            fontFamily: "var(--font-display)",
          }}
          aria-label="react"
        >
          ★
        </button>
      </div>
    </div>
  );
}
