/**
 * ACHIEVEMENTS CTA — Figma Component 5 (14:946).
 * Paper + content share one center so the label stays inside the kraft strip.
 */
import { Link } from "react-router-dom";

const PAPER = "/homescreen/btn-paper.png";
const ICON = "/homescreen/icon-trophy.svg";

export function AchievementsCta() {
  return (
    <Link
      to="/achievements"
      aria-label="ACHIEVEMENTS"
      data-cta="achievements"
      className="relative flex h-[61.34px] w-[199px] shrink-0 items-center justify-center overflow-visible transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Paper 17 — 14:947 242×71, flipped X+Y; sized to wrap content */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[71px] w-[242px] overflow-hidden"
        style={{ transform: "translate(-50%, -50%) scale(-1, -1)" }}
        aria-hidden
      >
        <img
          src={PAPER}
          alt=""
          draggable={false}
          className="absolute max-w-none"
          style={{
            height: "160.2%",
            width: "108.96%",
            left: "-5.38%",
            top: "-30.71%",
          }}
        />
      </div>

      {/* Frame 1 — 14:948: icon 28 + gap 12 + label, centered on paper */}
      <span className="relative z-[1] flex h-[35px] max-w-[220px] shrink-0 items-center justify-center gap-[12px] px-3">
        <span className="relative size-[28px] shrink-0 overflow-visible">
          <img
            src={ICON}
            alt=""
            draggable={false}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 block h-[28px] w-[28px] max-w-none object-contain object-center"
            width={28}
            height={28}
          />
        </span>
        <span
          className="relative h-[25px] shrink-0 whitespace-nowrap text-[28.53px] not-italic leading-[18.545px] text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ACHIEVEMENTS
        </span>
      </span>
    </Link>
  );
}
