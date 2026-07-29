/**
 * ReactionWheel — sticker circle flush to the bottom of the screen.
 * Horizontally flipped; only the top arc peeks above the bottom edge.
 * Stickers are packed tightly around the full circumference (catalog repeats).
 * Drag horizontally to spin; tap to react.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { REACTIONS, type Reaction } from "./reactions";
import { ReactionSticker } from "./ReactionSticker";

interface Props {
  onReact: (reaction: Reaction) => void;
  interactive?: boolean;
  /** Full circle diameter — derived so the visible arc spans ~88% of grid width. */
  diameter: number;
  /** Visible peek height (locked; must not grow with diameter). */
  peekHeight: number;
}

/** Chip size — keep ≥44 for tap targets; tight gap packs many into the arc. */
const BTN = 44;
const STICKER = 26;
/** Center-to-center spacing as a multiple of BTN (< ~1.15 = closely placed). */
const SPACING_FRAC = 1.06;
const DRAG_THRESHOLD_PX = 4;
const FRICTION = 0.97;
const MIN_VEL = 0.05;
const COAST_BOOST = 0.4;

export function ReactionWheel({
  onReact,
  interactive = true,
  diameter,
  peekHeight,
}: Props) {
  const DIAM = Math.max(1, diameter);
  const R = Math.max(1, (DIAM - BTN) / 2);
  const CX = DIAM / 2;
  const CY = DIAM / 2;
  const peekH = Math.max(0, Math.min(DIAM, peekHeight));
  const pxToDeg = 180 / (Math.PI * R);

  const [rot, setRot] = useState(0);
  const rotRef = useRef(0);
  const velRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const peekRef = useRef<HTMLDivElement>(null);

  const drag = useRef({
    active: false,
    capturing: false,
    moved: false,
    pointerId: null as number | null,
    lastX: 0,
    lastT: 0,
    startX: 0,
    startY: 0,
    sessionDelta: 0,
  });

  const applyRot = useCallback((deg: number) => {
    rotRef.current = deg;
    setRot(deg);
  }, []);

  const cancelRaf = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const coast = useCallback(() => {
    cancelRaf();
    const step = () => {
      if (Math.abs(velRef.current) < MIN_VEL) {
        velRef.current = 0;
        rafRef.current = null;
        return;
      }
      velRef.current *= FRICTION;
      applyRot(rotRef.current + velRef.current);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [applyRot, cancelRaf]);

  useEffect(() => () => cancelRaf(), [cancelRaf]);

  /** Pack stickers around the ring; repeat REACTIONS to fill the circumference. */
  const slots = useMemo(() => {
    const spacing = BTN * SPACING_FRAC;
    const packed = Math.max(1, Math.round((2 * Math.PI * R) / spacing));
    const count = Math.max(packed, REACTIONS.length * 2);
    return Array.from({ length: count }, (_, i) => {
      const reaction = REACTIONS[i % REACTIONS.length]!;
      // Top of circle (−π/2) is the visible arc at the screen bottom.
      const a = -Math.PI / 2 + (i / count) * Math.PI * 2;
      return {
        key: `${reaction.id}-${i}`,
        reaction,
        x: CX + R * Math.cos(a),
        y: CY + R * Math.sin(a),
      };
    });
  }, [CX, CY, R]);

  const hub = useCallback(() => {
    const el = peekRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    // Top-aligned circle + horizontal flip (scaleX −1): visual center is still mid-box.
    return { x: r.left + r.width / 2, y: r.top + CY };
  }, [CY]);

  const stickerAt = useCallback(
    (x: number, y: number): Reaction | null => {
      const c = hub();
      // Undo horizontal flip for hit-testing in local circle space.
      const dx = -(x - c.x);
      const dy = y - c.y;
      if (Math.abs(Math.hypot(dx, dy) - R) > BTN * 0.85) return null;
      let ang = Math.atan2(dy, dx) - (rotRef.current * Math.PI) / 180;
      let n = ang + Math.PI / 2;
      const two = Math.PI * 2;
      n = ((n % two) + two) % two;
      const idx = Math.round((n / two) * slots.length) % slots.length;
      return slots[idx]?.reaction ?? null;
    },
    [hub, R, slots],
  );

  const onDown = (e: React.PointerEvent) => {
    if (!interactive || e.button !== 0) return;
    cancelRaf();
    velRef.current = 0;
    drag.current = {
      active: true,
      capturing: false,
      moved: false,
      pointerId: e.pointerId,
      lastX: e.clientX,
      lastT: performance.now(),
      startX: e.clientX,
      startY: e.clientY,
      sessionDelta: 0,
    };
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || d.pointerId !== e.pointerId) return;

    const dist = Math.hypot(e.clientX - d.startX, e.clientY - d.startY);
    if (!d.moved && dist > DRAG_THRESHOLD_PX) {
      d.moved = true;
      d.capturing = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;

    // Negate dx because the wheel is scaleX(-1).
    const dx = e.clientX - d.lastX;
    const delta = -dx * pxToDeg * (1 + COAST_BOOST);
    const now = performance.now();
    const dt = Math.max(8, now - d.lastT);
    velRef.current = Math.max(-55, Math.min(55, (delta * 16) / dt));
    d.lastX = e.clientX;
    d.lastT = now;
    d.sessionDelta += delta;
    applyRot(rotRef.current + delta);
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.active || d.pointerId !== e.pointerId) return;
    if (d.capturing) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    const spun = d.moved;
    const session = d.sessionDelta;
    d.active = false;
    d.capturing = false;
    d.pointerId = null;

    if (spun) {
      applyRot(rotRef.current + session * COAST_BOOST);
      let v = velRef.current * (1 + COAST_BOOST);
      if (Math.abs(v) < 4) v = Math.sign(session || v || 1) * 10;
      velRef.current = Math.max(-55, Math.min(55, v));
      coast();
    } else if (interactive) {
      const hit = stickerAt(e.clientX, e.clientY);
      if (hit) onReact(hit);
    }
  };

  // Top of circle peeks above the bottom edge; rest is clipped below.
  const circleTop = 0;

  return (
    <div
      ref={peekRef}
      className="relative select-none touch-none"
      style={{
        width: DIAM,
        height: peekH,
        overflow: "hidden",
        marginLeft: "50%",
        // Center under the board column + flip horizontally.
        transform: "translateX(-50%) scaleX(-1)",
        opacity: interactive ? 1 : 0.4,
        pointerEvents: interactive ? "auto" : "none",
        touchAction: "none",
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      aria-label="reaction wheel"
      role="group"
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: circleTop,
          width: DIAM,
          height: DIAM,
          transformOrigin: `${CX}px ${CY}px`,
          transform: `rotate(${rot}deg)`,
          willChange: "transform",
          pointerEvents: "none",
        }}
      >
        <svg width={DIAM} height={DIAM} viewBox={`0 0 ${DIAM} ${DIAM}`} aria-hidden>
          <defs>
            <filter id="rw-rough" x="-8%" y="-8%" width="116%" height="116%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="8" />
              <feDisplacementMap in="SourceGraphic" scale="1.5" />
            </filter>
          </defs>
          <g filter="url(#rw-rough)">
            <circle
              cx={CX}
              cy={CY}
              r={R + 10}
              fill="rgba(255,255,255,0.3)"
              stroke="var(--ink-brown)"
              strokeWidth={2.4}
              opacity={1}
            />
          </g>
        </svg>

        {slots.map(({ key, reaction, x, y }) => (
          <div
            key={key}
            className="absolute flex items-center justify-center rounded-full bg-white"
            style={{
              width: BTN,
              height: BTN,
              left: x - BTN / 2,
              top: y - BTN / 2,
              border: "2.5px solid var(--ink)",
              background: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
              // Counter-rotate + un-flip so marks stay upright / readable.
              transform: `rotate(${-rot}deg) scaleX(-1)`,
            }}
            aria-hidden
          >
            <ReactionSticker reaction={reaction} size={STICKER} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** @deprecated Prefer diameter from layoutChrome.wheelDiameterForBoard */
export const WHEEL_PEEK_H = 280;

export { REACTIONS } from "./reactions";
export { WHEEL_VISIBLE_FRAC } from "./layoutChrome";
