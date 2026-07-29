/**
 * TopBar — Figma "top bar" (node 2187:405), including centered "tic tac CO" logo.
 * Flush to the top of the 390px mobile frame: no outer margin/padding.
 * White under the tear is transparent.
 */
interface TopBarProps {
  className?: string;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
}

/** Design size from Figma; scales with width via aspect-ratio. */
const DESIGN_W = 407;
const DESIGN_H = 142;

export function TopBar({
  className,
  onMenuClick,
  onProfileClick,
  onSettingsClick,
}: TopBarProps) {
  return (
    <header
      data-top-bar
      className={`relative z-20 m-0 w-full max-w-full shrink-0 overflow-hidden bg-transparent p-0 sm:rounded-t-[24px] ${className ?? ""}`}
      style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}` }}
      aria-label="top bar"
    >
      <img
        src="/top-bar/bar.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 block h-full w-full max-w-full bg-transparent object-cover object-top"
      />

      {/* Nav row — logo is centered in bar.png. Hit targets for side icons only. */}
      <div
        className="absolute inset-x-[6.4%] z-[2] flex items-center justify-between"
        style={{ top: "44.37%", bottom: "24.65%" }}
      >
        <IconHit
          label="menu"
          iconSrc="/top-bar/icon-menu.svg"
          onClick={onMenuClick}
        />
        <div className="flex items-center gap-2.5">
          <IconHit
            label="profile"
            iconSrc="/top-bar/icon-user.svg"
            onClick={onProfileClick}
          />
          <IconHit
            label="settings"
            iconSrc="/top-bar/icon-settings.svg"
            onClick={onSettingsClick}
          />
        </div>
      </div>
    </header>
  );
}

function IconHit({
  label,
  iconSrc,
  onClick,
}: {
  label: string;
  iconSrc: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative flex size-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center overflow-hidden rounded-sm bg-transparent p-0"
    >
      <img
        src={iconSrc}
        alt=""
        draggable={false}
        aria-hidden
        className="pointer-events-none size-full object-contain opacity-0"
      />
    </button>
  );
}
