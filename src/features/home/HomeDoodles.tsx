/**
 * Homescreen decorative accents — Figma 14:914 background doodles.
 *
 * Sits above GameEnvBg (z-1) but below TopBar and main content.
 * Do not replace with GameEnv scribble; these are launch-screen-specific assets.
 */
const ASSET = "/homescreen";

export function HomeDoodles() {
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
