/**
 * TutorialEmojiStep — end-of-tutorial modal + tap-only sticker strip.
 * Uses TutorialReactionWheel (not game ReactionWheel) and TutorialModal.
 */
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { TutorialReactionWheel } from "./TutorialReactionWheel";
import { TutorialModal } from "./TutorialModal";
import type { Reaction } from "@/components/game/reactions";
import {
  wheelDiameterForBoard,
  wheelPeekHeightForBoard,
} from "@/components/game/layoutChrome";

type TutorialEmojiStepProps = {
  boardPx: number;
  modalText: string;
  showStartButton: boolean;
  onReact: (reaction: Reaction) => void;
};

/** Ink pill CTA — matches AchievementModal / play-again styling. */
const TUTORIAL_CTA_STYLE: CSSProperties = {
  fontFamily: "var(--font-display)",
  borderColor: "var(--ink)",
  background: "var(--ink)",
  color: "var(--paper)",
};

export function TutorialEmojiStep({
  boardPx,
  modalText,
  showStartButton,
  onReact,
}: TutorialEmojiStepProps) {
  const peekH = wheelPeekHeightForBoard(boardPx);
  const wheelDiameter = wheelDiameterForBoard(boardPx);
  const canReact = !showStartButton;

  return (
    <div
      className="relative z-[100] flex w-full min-w-0 flex-col items-center"
      style={{ pointerEvents: "auto" }}
      data-tutorial-emoji-step
    >
      <TutorialModal
        label={showStartButton ? "Ready to play" : "Emoji reactions"}
        className="mx-4 mb-2"
      >
        <p
          className="text-base leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          {modalText}
        </p>
        {showStartButton && (
          <Link
            to="/game"
            data-tutorial-start-game
            className="mt-1 inline-flex min-h-[44px] items-center justify-center self-center rounded-full border-2 px-5 py-2 text-sm transition-transform hover:scale-[1.03] active:scale-[0.97]"
            style={TUTORIAL_CTA_STYLE}
          >
            start game
          </Link>
        )}
      </TutorialModal>

      <div
        className="relative z-[100] mx-auto w-full shrink-0 overflow-hidden"
        style={{
          height: peekH,
          width: boardPx,
          marginBottom: 0,
          pointerEvents: "auto",
        }}
        data-tutorial-wheel-shell
      >
        <TutorialReactionWheel
          onReact={onReact}
          interactive={canReact}
          diameter={wheelDiameter}
          peekHeight={peekH}
        />
      </div>
    </div>
  );
}
