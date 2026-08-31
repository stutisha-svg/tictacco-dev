/**
 * HomeScreen — Figma launch screen (14:914).
 *
 * Layer stack (bottom → top):
 *   GameEnvBg     checkered desk paper (fixed, same as GameScreen)
 *   HomeDoodles   low-opacity decorative SVGs (z-1)
 *   TopBar        global chrome, no center logo on home
 *   main          logo + CTA nav (z-10)
 *
 * CTA implementation: see `cta/` — specs in `cta/specs.ts`.
 */
import { TopBar } from "@/components/game/TopBar";
import { GameEnvBg } from "@/components/game/GameEnvBg";
import {
  AchievementsCta,
  InviteFriendCta,
  NewGameCta,
  TutorialCta,
} from "./cta";
import { HomeDoodles } from "./HomeDoodles";

const LOGO = "/homescreen/logo.png";

export function HomeScreen() {
  return (
    <div
      data-home-screen
      className="relative mx-auto flex min-h-full w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden bg-transparent"
      style={{ minHeight: "100%" }}
    >
      <GameEnvBg
        className="!fixed inset-0 overflow-hidden sm:rounded-[24px]"
        showScribble={false}
      />
      <HomeDoodles />

      <TopBar showLogo={false} />

      {/* Body offset matches tuned spacing below top bar */}
      <main className="relative z-10 mt-[30px] flex w-full flex-1 flex-col items-center px-3 pb-10 pt-1">
        <header className="relative mb-3 flex w-[276px] max-w-[90%] items-center justify-center">
          <img
            src={LOGO}
            alt="tic tac CO"
            draggable={false}
            className="relative z-[1] h-[159px] w-[276px] max-w-full object-contain"
            width={276}
            height={159}
          />
        </header>

        {/* overflow-visible lets torn paper edges extend past hit targets */}
        <nav
          className="mt-1 flex w-full flex-col items-center gap-[18px] overflow-visible"
          aria-label="Home actions"
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
