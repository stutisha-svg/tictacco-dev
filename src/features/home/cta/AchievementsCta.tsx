/**
 * ACHIEVEMENTS — Figma Component 5 (14:946 / paper 14:947 / content 14:948).
 *
 * Wider paper (242px) centered and flipped XY; content centered so label
 * stays inside the kraft strip. Adjust `paper.nudgeX` in specs to nudge paper only.
 */
import { HomeCtaContentRow } from "./HomeCtaContentRow";
import { HomeCtaPaper } from "./HomeCtaPaper";
import { HomeCtaShell } from "./HomeCtaShell";
import { ACHIEVEMENTS } from "./specs";

export function AchievementsCta() {
  const { id, label, to, frame, paper, content, icon, labelSpec } = ACHIEVEMENTS;

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
