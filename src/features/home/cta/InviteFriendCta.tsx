/**
 * INVITE FRIEND — Figma Component 3 (14:936 / content 14:938).
 *
 * No route yet — renders as `<button>`.
 * Paper nudge is in spec; label row stays centered independently.
 */
import { HomeCtaContentRow } from "./HomeCtaContentRow";
import { HomeCtaPaper } from "./HomeCtaPaper";
import { HomeCtaShell } from "./HomeCtaShell";
import { INVITE_FRIEND } from "./specs";

export function InviteFriendCta() {
  const { id, label, frame, paper, content, icon, labelSpec } = INVITE_FRIEND;

  return (
    <HomeCtaShell
      id={id}
      label={label}
      width={frame.width}
      height={frame.height}
      align="flex-center"
    >
      <HomeCtaPaper layout={paper} />
      <HomeCtaContentRow layout={content} icon={icon} label={labelSpec} />
    </HomeCtaShell>
  );
}
