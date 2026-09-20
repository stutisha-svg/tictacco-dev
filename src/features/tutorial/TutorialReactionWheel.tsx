/**
 * TutorialReactionWheel — static peek of reaction stickers (tap only, no spin).
 * Tutorial-local clone of the game wheel crown look. Do not import
 * `@/components/game/ReactionWheel` here.
 */
import { useMemo } from "react";
import { REACTIONS, type Reaction } from "@/components/game/reactions";
import { ReactionSticker } from "@/components/game/ReactionSticker";

type TutorialReactionWheelProps = {
  onReact: (reaction: Reaction) => void;
  interactive?: boolean;
  diameter: number;
  peekHeight: number;
};

const BTN = 44;
const STICKER = 26;
/** Stickers shown along the visible top arc. */
const VISIBLE_COUNT = 7;

export function TutorialReactionWheel({
  onReact,
  interactive = true,
  diameter,
  peekHeight,
}: TutorialReactionWheelProps) {
  const DIAM = Math.max(1, diameter);
  const R = Math.max(1, (DIAM - BTN) / 2);
  const CX = DIAM / 2;
  const CY = DIAM / 2;
  const peekH = Math.max(0, Math.min(DIAM, peekHeight));

  const slots = useMemo(() => {
    const halfChord = Math.min(
      R * 0.95,
      peekH > 0
        ? Math.sqrt(Math.max(0, 2 * R * peekH - peekH * peekH))
        : R * 0.7,
    );
    const halfAngle = Math.asin(Math.min(1, halfChord / R));
    return Array.from({ length: VISIBLE_COUNT }, (_, i) => {
      const t = i / (VISIBLE_COUNT - 1);
      const a = -Math.PI / 2 - halfAngle + t * halfAngle * 2;
      const reaction = REACTIONS[i % REACTIONS.length]!;
      return {
        key: `${reaction.id}-${i}`,
        reaction,
        x: CX + R * Math.cos(a),
        y: CY + R * Math.sin(a),
      };
    });
  }, [CX, CY, R, peekH]);

  return (
    <div
      className="relative select-none"
      style={{
        width: DIAM,
        height: peekH,
        overflow: "hidden",
        marginLeft: "50%",
        transform: "translateX(-50%) scaleX(-1)",
        opacity: interactive ? 1 : 0.4,
        pointerEvents: interactive ? "auto" : "none",
      }}
      aria-label="tutorial reaction stickers"
      role="group"
      data-tutorial-reaction-wheel
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: DIAM,
          height: DIAM,
          pointerEvents: interactive ? "auto" : "none",
        }}
      >
        <svg
          width={DIAM}
          height={DIAM}
          viewBox={`0 0 ${DIAM} ${DIAM}`}
          aria-hidden
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <filter id="tutorial-rw-rough" x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="8" />
              <feDisplacementMap in="SourceGraphic" scale="1.5" />
            </filter>
          </defs>
          <g filter="url(#tutorial-rw-rough)">
            <circle
              cx={CX}
              cy={CY}
              r={R + 10}
              fill="rgba(255,255,255,0.3)"
              stroke="var(--ink-brown)"
              strokeWidth={2.4}
            />
          </g>
        </svg>

        {slots.map(({ key, reaction, x, y }) => (
          <button
            key={key}
            type="button"
            aria-label={reaction.label}
            disabled={!interactive}
            data-tutorial-reaction-sticker={reaction.id}
            className="absolute flex items-center justify-center rounded-full bg-white"
            style={{
              width: BTN,
              height: BTN,
              left: x - BTN / 2,
              top: y - BTN / 2,
              border: "2.5px solid var(--ink)",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              transform: "scaleX(-1)",
              pointerEvents: interactive ? "auto" : "none",
              cursor: interactive ? "pointer" : undefined,
              zIndex: 2,
              padding: 0,
              margin: 0,
              appearance: "none",
              WebkitAppearance: "none",
              WebkitTapHighlightColor: "transparent",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (interactive) onReact(reaction);
            }}
          >
            <ReactionSticker reaction={reaction} size={STICKER} />
          </button>
        ))}
      </div>
    </div>
  );
}
