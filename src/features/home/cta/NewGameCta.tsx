/**
 * NEW GAME — Figma Component 2 (14:935).
 *
 * Composition: Shell (279×86) → Paper (primary-strip) → Content (48px icon + 40px label).
 * Spec: `specs.ts` → NEW_GAME
 */
import { HomeCtaContentRow } from "./HomeCtaContentRow";
import { HomeCtaPaper } from "./HomeCtaPaper";
import { HomeCtaShell } from "./HomeCtaShell";
import { NEW_GAME } from "./specs";

export function NewGameCta() {
  const { id, label, to, frame, paper, content, icon, labelSpec } = NEW_GAME;

  return (
    <HomeCtaShell
      id={id}
      label={label}
      to={to}
      width={frame.width}
      height={frame.height}
      maxWidthClass={frame.maxWidthClass}
    >
      <HomeCtaPaper layout={paper} />
      <HomeCtaContentRow layout={content} icon={icon} label={labelSpec} />
    </HomeCtaShell>
  );
}
