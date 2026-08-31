/**
 * RulesContainer — bottom tutorial panel (replaces ReactionWheel on /tutorial).
 *
 * Composes seven Figma layers into one flush-bottom panel:
 *   Paper 07 → frame border → corner/side brackets → RULES header → content slot.
 *
 * On mount, the whole panel plays a Canva-style "Scrapbook" entrance: slide up
 * from below with a brief tilt that settles flat.
 *
 * Specs: `rulesContainerSpecs.ts` · Figma nodes 2233:707–2233:754.
 */
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  CONTENT_INSET,
  CORNER_BRACKET,
  FRAME_BORDER,
  FRAME_BORDER_INSET,
  PAPER_07,
  PAPER_07_CROP,
  RULES_ASSETS,
  RULES_CONTAINER_H,
  RULES_DESIGN_W,
  RULES_HEADER,
  RULES_LAYER_Z,
  SIDE_BRACKET,
  type RulesBoxSpec,
  type RulesImageSpec,
  parseInset,
  rulesBoxStyle,
  rulesPctX,
  rulesPctY,
} from "./rulesContainerSpecs";
import {
  RULES_MOTION_ORIGIN,
  RULES_SCRAPBOOK_ENTER,
} from "./rulesContainerMotion";

type RulesContainerProps = {
  /** Rule copy / illustrations — rendered inside the hand-drawn frame. */
  children?: ReactNode;
  className?: string;
  /** Play the scrapbook entrance on mount. Default true. */
  animateOnMount?: boolean;
  /** Fired once when the scrapbook entrance animation completes. */
  onEntranceComplete?: () => void;
  /** Tap anywhere on the panel — used to cycle static tutorial messages. */
  onTap?: () => void;
};

export function RulesContainer({
  children,
  className,
  animateOnMount = true,
  onEntranceComplete,
  onTap,
}: RulesContainerProps) {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animateOnMount && !reduceMotion;
  const entranceFired = useRef(false);

  useEffect(() => {
    if (!shouldAnimate && !entranceFired.current) {
      entranceFired.current = true;
      onEntranceComplete?.();
    }
  }, [shouldAnimate, onEntranceComplete]);

  return (
    <motion.section
      data-rules-container
      aria-label="Rules"
      className={`relative w-full shrink-0 overflow-visible ${onTap ? "cursor-pointer" : ""} ${className ?? ""}`}
      style={{
        aspectRatio: `${RULES_DESIGN_W} / ${RULES_CONTAINER_H}`,
        transformOrigin: RULES_MOTION_ORIGIN,
      }}
      initial={shouldAnimate ? RULES_SCRAPBOOK_ENTER.initial : false}
      animate={shouldAnimate ? RULES_SCRAPBOOK_ENTER.animate : undefined}
      transition={shouldAnimate ? RULES_SCRAPBOOK_ENTER.transition : undefined}
      onAnimationComplete={() => {
        if (shouldAnimate && !entranceFired.current) {
          entranceFired.current = true;
          onEntranceComplete?.();
        }
      }}
      onClick={onTap}
      onKeyDown={
        onTap
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTap();
              }
            }
          : undefined
      }
      role={onTap ? "button" : undefined}
      tabIndex={onTap ? 0 : undefined}
    >
      <RulesPaperLayer />
      <RulesFrameBorderLayer />
      <RulesBracketsLayer />
      <RulesHeaderLayer />

      {children != null && (
        <div
          className="absolute overflow-y-auto"
          style={{
            zIndex: RULES_LAYER_Z.content,
            top: rulesPctY(CONTENT_INSET.top),
            left: rulesPctX(CONTENT_INSET.left),
            right: rulesPctX(CONTENT_INSET.right),
            bottom: rulesPctY(CONTENT_INSET.bottom),
          }}
        >
          {children}
        </div>
      )}
    </motion.section>
  );
}

/** 2233:707 — torn kraft background with exact Figma fill crop. */
function RulesPaperLayer() {
  return (
    <div
      className="pointer-events-none absolute overflow-hidden"
      style={{ zIndex: RULES_LAYER_Z.paper, ...rulesBoxStyle(PAPER_07) }}
      aria-hidden
    >
      <img
        src={RULES_ASSETS.paper}
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={PAPER_07_CROP}
      />
    </div>
  );
}

/** 2233:712 — hand-drawn rounded rectangle that frames rule content. */
function RulesFrameBorderLayer() {
  return (
    <div
      className="pointer-events-none absolute overflow-visible"
      style={{ zIndex: RULES_LAYER_Z.frame, ...rulesBoxStyle(FRAME_BORDER) }}
      aria-hidden
    >
      <div className="absolute" style={parseInset(FRAME_BORDER_INSET)}>
        <img
          src={RULES_ASSETS.frameBorder}
          alt=""
          draggable={false}
          className="block size-full max-w-none"
        />
      </div>
    </div>
  );
}

/** 2233:714 + 2233:715 — decorative L-brackets above the header row. */
function RulesBracketsLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: RULES_LAYER_Z.brackets }}
      aria-hidden
    >
      <RulesBracketImage spec={CORNER_BRACKET} src={RULES_ASSETS.cornerBracket} />
      <RulesBracketImage spec={SIDE_BRACKET} src={RULES_ASSETS.sideBracket} />
    </div>
  );
}

/** 2233:754 + 2233:730 + 2233:750 — flanking stars and RULES title. */
function RulesHeaderLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: RULES_LAYER_Z.header }}
      aria-hidden
    >
      <RulesStar
        left={RULES_HEADER.starLeft.left}
        top={RULES_HEADER.starLeft.top}
        size={RULES_HEADER.starLeft.size}
      />
      <RulesStar
        left={RULES_HEADER.starRight.left}
        top={RULES_HEADER.starRight.top}
        size={RULES_HEADER.starRight.size}
      />
      <RulesLabel />
    </div>
  );
}

/** Positions a bracket SVG using Figma bounds + export inset. */
function RulesBracketImage({ spec, src }: { spec: RulesImageSpec; src: string }) {
  return (
    <div className="absolute overflow-visible" style={rulesBoxStyle(spec)}>
      <div className="absolute" style={parseInset(spec.imgInset)}>
        <img src={src} alt="" draggable={false} className="block size-full max-w-none" />
      </div>
    </div>
  );
}

/** 2233:730 — RULES title with Figma rotation + ink outline stroke. */
function RulesLabel() {
  const label = RULES_HEADER.label;
  return (
    <div
      className="absolute overflow-visible"
      style={{
        ...rulesBoxStyle(label),
        transform: `rotate(${label.rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${label.width} ${label.height}`}
        overflow="visible"
        aria-hidden
      >
        <text
          x={0}
          y={label.height / 2}
          dominantBaseline="central"
          fontFamily="var(--font-display)"
          fontSize={label.fontSize}
          fill={label.color}
          stroke={label.stroke}
          strokeWidth={label.strokeWidth}
          strokeLinejoin="round"
          paintOrder="stroke"
        >
          RULES
        </text>
      </svg>
    </div>
  );
}

function RulesStar({
  left,
  top,
  size,
}: {
  left: number;
  top: number;
  size: number;
}) {
  const box: RulesBoxSpec = { left, top, width: size, height: size };

  return (
    <div className="absolute overflow-clip" style={rulesBoxStyle(box)}>
      <div className="absolute" style={parseInset(RULES_HEADER.starImgInset)}>
        <img
          src={RULES_ASSETS.star}
          alt=""
          draggable={false}
          className="absolute inset-0 block size-full max-w-none object-contain"
        />
      </div>
    </div>
  );
}
