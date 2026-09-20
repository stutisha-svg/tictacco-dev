/**
 * NEW GAME — Figma Component 2 (14:935).
 *
 * Composition: Shell (279×86) → Paper (primary-strip) → Content (48px icon + 40px label).
 * Spec: `specs.ts` → NEW_GAME
 *
 * Keeps the same Link shell as before; click opens NewGameSetupModal instead of
 * navigating straight to `/game`.
 */
import { useState, type MouseEvent } from "react";
import { NewGameSetupModal } from "@/features/home/newGame";
import { HomeCtaContentRow } from "./HomeCtaContentRow";
import { HomeCtaPaper } from "./HomeCtaPaper";
import { HomeCtaShell } from "./HomeCtaShell";
import { NEW_GAME } from "./specs";

export function NewGameCta() {
  const [setupOpen, setSetupOpen] = useState(false);
  const { id, label, to, frame, paper, content, icon, labelSpec } = NEW_GAME;

  const openSetup = (e: MouseEvent) => {
    e.preventDefault();
    setSetupOpen(true);
  };

  return (
    <>
      <HomeCtaShell
        id={id}
        label={label}
        to={to}
        width={frame.width}
        height={frame.height}
        maxWidthClass={frame.maxWidthClass}
        onClick={openSetup}
      >
        <HomeCtaPaper layout={paper} />
        <HomeCtaContentRow layout={content} icon={icon} label={labelSpec} />
      </HomeCtaShell>

      <NewGameSetupModal open={setupOpen} onClose={() => setSetupOpen(false)} />
    </>
  );
}
