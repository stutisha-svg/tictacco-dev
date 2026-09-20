/**
 * TutorialRulesContainer — bottom tutorial rules panel (feature-local).
 *
 * Composes seven Figma layers into one flush-bottom panel:
 *   Paper 07 → frame border → corner/side brackets → RULES header → content slot.
 *
 * On mount, plays a Canva-style "Scrapbook" entrance (slide up + brief tilt).
 * Specs: `tutorialRulesContainerSpecs.ts` · Figma nodes 2233:707–2233:754.
 *
 * Not shared with GameScreen — do not import from `@/components/game`.
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
} from "./tutorialRulesContainerSpecs";
import {
  TUTORIAL_RULES_MOTION_ORIGIN,
  TUTORIAL_RULES_SCRAPBOOK_ENTER,
} from "./tutorialRulesContainerMotion";

type TutorialRulesContainerProps = {
  /** Rule copy / chips — rendered inside the hand-drawn frame. */
  children?: ReactNode;
  className?: string;
  /** Play the scrapbook entrance on mount. Default true. */
  animateOnMount?: boolean;
  /** Fired once when the scrapbook entrance animation completes. */
  onEntranceComplete?: () => void;
  /** Optional tap handler (legacy; advance is usually a full-screen catcher). */
  onTap?: () => void;
};

export function TutorialRulesContainer({
  children,
  className,
  animateOnMount = true,
  onEntranceComplete,
  onTap,
}: TutorialRulesContainerProps) {
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
      data-tutorial-rules-container
      aria-label="Tutorial rules"
      className={`relative w-full shrink-0 overflow-visible ${onTap ? "cursor-pointer" : ""} ${className ?? ""}`}
      style={{
        aspectRatio: `${RULES_DESIGN_W} / ${RULES_CONTAINER_H}`,
        transformOrigin: TUTORIAL_RULES_MOTION_ORIGIN,
      }}
      initial={shouldAnimate ? TUTORIAL_RULES_SCRAPBOOK_ENTER.initial : false}
      animate={shouldAnimate ? TUTORIAL_RULES_SCRAPBOOK_ENTER.animate : undefined}
      transition={shouldAnimate ? TUTORIAL_RULES_SCRAPBOOK_ENTER.transition : undefined}
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
      <TutorialRulesPaperLayer />
      <TutorialRulesFrameBorderLayer />
      <TutorialRulesBracketsLayer />
      <TutorialRulesHeaderLayer />

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
function TutorialRulesPaperLayer() {
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
function TutorialRulesFrameBorderLayer() {
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
function TutorialRulesBracketsLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: RULES_LAYER_Z.brackets }}
      aria-hidden
    >
      <TutorialRulesBracketImage
        spec={CORNER_BRACKET}
        src={RULES_ASSETS.cornerBracket}
      />
      <TutorialRulesBracketImage
        spec={SIDE_BRACKET}
        src={RULES_ASSETS.sideBracket}
      />
    </div>
  );
}

/** 2233:754 + 2233:730 + 2233:750 — flanking stars and RULES title. */
function TutorialRulesHeaderLayer() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: RULES_LAYER_Z.header }}
      aria-hidden
    >
      <TutorialRulesStar
        left={RULES_HEADER.starLeft.left}
        top={RULES_HEADER.starLeft.top}
        size={RULES_HEADER.starLeft.size}
      />
      <TutorialRulesStar
        left={RULES_HEADER.starRight.left}
        top={RULES_HEADER.starRight.top}
        size={RULES_HEADER.starRight.size}
      />
      <TutorialRulesLabel />
    </div>
  );
}

/** Positions a bracket SVG using Figma bounds + export inset. */
function TutorialRulesBracketImage({
  spec,
  src,
}: {
  spec: RulesImageSpec;
  src: string;
}) {
  return (
    <div className="absolute overflow-visible" style={rulesBoxStyle(spec)}>
      <div className="absolute" style={parseInset(spec.imgInset)}>
        <img src={src} alt="" draggable={false} className="block size-full max-w-none" />
      </div>
    </div>
  );
}

/** 2233:730 — RULES title with Figma rotation + ink outline stroke. */
function TutorialRulesLabel() {
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

function TutorialRulesStar({
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
