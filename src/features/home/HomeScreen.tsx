/**
 * HomeScreen — Figma launch screen (node 14:914).
 * Shared TopBar (no center logo) + same checkered paper as GameScreen.
 * CTA sizes follow Figma (NEW GAME 279×86 / secondary 199×61).
 */
import { TopBar } from "@/components/game/TopBar";
import { GameEnvBg } from "@/components/game/GameEnvBg";
import { NewGameCta } from "./NewGameCta";
import { InviteFriendCta } from "./InviteFriendCta";
import { TutorialCta } from "./TutorialCta";
import { AchievementsCta } from "./AchievementsCta";

const ASSET = "/homescreen";

export function HomeScreen() {
  return (
    <div
      data-home-screen
      className="relative mx-auto flex min-h-full w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden bg-transparent"
      style={{ minHeight: "100%" }}
    >
      {/* Identical checkered paper treatment as GameScreen */}
      <GameEnvBg
        className="!fixed inset-0 overflow-hidden sm:rounded-[24px]"
        showScribble={false}
      />
      <HomeDoodles />

      <TopBar showLogo={false} />

      <main className="relative z-10 mt-[30px] flex w-full flex-1 flex-col items-center px-3 pb-10 pt-1">
        <div className="relative mb-3 flex w-[276px] max-w-[90%] items-center justify-center">
          <img
            src={`${ASSET}/logo.png`}
            alt="tic tac CO"
            draggable={false}
            className="relative z-[1] h-[159px] w-[276px] max-w-full object-contain"
            width={276}
            height={159}
          />
        </div>

        <nav
          className="mt-1 flex w-full flex-col items-center gap-[18px] overflow-visible"
          aria-label="home actions"
        >
          <NewGameCta />
          <InviteFriendCta />
          <TutorialCta />
          <AchievementsCta />
        </nav>
      </main>
    </div>
  );
}

/** Homescreen-only doodles — leave as-is; do not swap for GameEnv scribble. */
function HomeDoodles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <img
        src={`${ASSET}/deco-grid.svg`}
        alt=""
        className="absolute left-[-8%] top-[18%] w-[72%] max-w-[320px] -rotate-[135deg] opacity-[0.12]"
      />
      <img
        src={`${ASSET}/deco-face.svg`}
        alt=""
        className="absolute right-[8%] top-[22%] size-[53px] opacity-10"
      />
      <img
        src={`${ASSET}/deco-flower.svg`}
        alt=""
        className="absolute left-[-8%] top-[42%] h-[116px] w-[100px] opacity-5"
      />
      <img
        src={`${ASSET}/deco-stars.svg`}
        alt=""
        className="absolute right-[-6%] top-[48%] size-[171px] opacity-[0.06]"
      />
      <img
        src={`${ASSET}/deco-hearts.svg`}
        alt=""
        className="absolute left-[-2%] top-[62%] size-[63px] opacity-[0.06]"
      />
      <img
        src={`${ASSET}/deco-scribble.svg`}
        alt=""
        className="absolute left-[-8%] top-[78%] h-[57px] w-[150px] opacity-[0.06]"
      />
    </div>
  );
}
