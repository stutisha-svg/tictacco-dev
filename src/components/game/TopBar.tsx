/**
 * TopBar — Figma node 2187:405 (global chrome).
 *
 * Layered stack: Paper 17 kraft strip → iOS status bar → optional center mark → side icons.
 * Home passes showLogo={false}; game and other screens keep the center mark.
 */
interface TopBarProps {
  className?: string;
  onMenuClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  /** When false, omit the centered tic tac CO mark (homescreen). Default true. */
  showLogo?: boolean;
}

/** Figma frame size — scales with 390px shell width via aspect-ratio. */
const DESIGN_W = 407;
const DESIGN_H = 142;

export function TopBar({
  className,
  onMenuClick,
  onProfileClick,
  onSettingsClick,
  showLogo = true,
}: TopBarProps) {
  return (
    <header
      data-top-bar
      data-show-logo={showLogo ? "true" : "false"}
      className={`relative isolate z-20 m-0 w-full max-w-full shrink-0 overflow-hidden bg-transparent p-0 sm:rounded-t-[24px] ${className ?? ""}`}
      style={{ aspectRatio: `${DESIGN_W} / ${DESIGN_H}` }}
      aria-label="top bar"
    >
      {/* Paper 17 — torn kraft; white below tear stays transparent */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <img
          src="/top-bar/paper.png"
          alt=""
          draggable={false}
          className="absolute max-w-none"
          style={{
            height: "193.66%",
            width: "156.36%",
            left: "-22.77%",
            top: "-59.15%",
          }}
        />
      </div>

      {/* iOS status bar — Figma 2187:387 (402×62 @ x=3, y=0) */}
      <div
        className="pointer-events-none absolute top-0 z-[1]"
        style={{
          left: `${(3 / DESIGN_W) * 100}%`,
          width: `${(402 / DESIGN_W) * 100}%`,
          height: `${(62 / DESIGN_H) * 100}%`,
        }}
        aria-hidden
      >
        <img
          src="/top-bar/status-bar.svg"
          alt=""
          draggable={false}
          className="block size-full object-fill"
          width={402}
          height={62}
        />
      </div>

      {/* Center mark — separate layer so home can omit it cleanly */}
      {showLogo && (
        <div
          className="pointer-events-none absolute left-1/2 top-[62px] z-[1] h-[42px] w-[73px] -translate-x-1/2"
          aria-hidden
        >
          <img
            src="/top-bar/logo-mark.png"
            alt=""
            draggable={false}
            className="block size-full max-w-none object-cover"
            width={73}
            height={42}
          />
        </div>
      )}

      {/* Nav row — Figma inset 44.37% / 24.65% / ~6.4% sides; icons 44×44 */}
      <div
        className="absolute z-[2] flex items-center justify-between"
        style={{
          top: "44.37%",
          bottom: "24.65%",
          left: "6.63%",
          right: "6.14%",
        }}
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
        className="pointer-events-none block size-full max-w-none object-contain"
        width={44}
        height={44}
      />
    </button>
  );
}
