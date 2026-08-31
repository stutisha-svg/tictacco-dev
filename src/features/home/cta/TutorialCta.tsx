/**
 * TUTORIAL — Figma Component 4 (14:941 / paper 14:942 / content 14:943).
 *
 * Paper uses bottom-anchor + Y flip; content uses absolute px box from Figma.
 */
import { HomeCtaContentRow } from "./HomeCtaContentRow";
import { HomeCtaPaper } from "./HomeCtaPaper";
import { HomeCtaShell } from "./HomeCtaShell";
import { TUTORIAL } from "./specs";

export function TutorialCta() {
  const { id, label, to, frame, paper, content, icon, labelSpec } = TUTORIAL;

  return (
    <HomeCtaShell
      id={id}
      label={label}
      to={to}
      width={frame.width}
      height={frame.height}
      align="flex-center"
    >
      <HomeCtaPaper layout={paper} />
      <HomeCtaContentRow layout={content} icon={icon} label={labelSpec} />
    </HomeCtaShell>
  );
}
