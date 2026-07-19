/**
 * InkPourOverlay — full-screen desaturation effect that "pours" upward from
 * the bottom like ink filling a page. Uses backdrop-filter grayscale on a
 * fixed element whose top edge is a wobbly SVG path, animated upward.
 *
 * Elements marked as "colored islands" should be positioned above this
 * overlay via z-index so backdrop-filter never affects them.
 */
import { motion } from "motion/react";

interface Props {
  active: boolean;
}

export function InkPourOverlay({ active }: Props) {
  // The overlay is a mask-image applied to a full-viewport fixed div; the
  // mask reveals the bottom, sliding upward as `active` flips true.
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20"
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{
        clipPath: active ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
      }}
      transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
      style={{
        backdropFilter: "grayscale(1) brightness(0.9) contrast(1.02)",
        WebkitBackdropFilter: "grayscale(1) brightness(0.9)",
      }}
    >
      {/* wobbly meniscus edge along the top of the pour */}
      <motion.svg
        className="absolute left-0 right-0"
        style={{ top: -18, width: "100%", height: 24 }}
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <defs>
          <filter id="ink-edge-rough" x="-2%" y="-40%" width="104%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="14" />
            <feDisplacementMap in="SourceGraphic" scale="4" />
          </filter>
        </defs>
        <g filter="url(#ink-edge-rough)">
          <path
            d="M 0 20 Q 50 8 100 16 T 200 14 T 300 18 T 400 12 L 400 24 L 0 24 Z"
            fill="rgba(0,0,0,0.35)"
          />
          <path
            d="M 0 20 Q 50 8 100 16 T 200 14 T 300 18 T 400 12"
            stroke="rgba(0,0,0,0.55)"
            strokeWidth={1.6}
            fill="none"
          />
        </g>
      </motion.svg>
    </motion.div>
  );
}
