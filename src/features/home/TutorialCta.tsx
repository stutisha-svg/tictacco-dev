/**
 * TUTORIAL CTA — Figma Component 4 (14:941).
 * Paper 17 = 14:942 (199×58.487, vertically flipped).
 * Content = 14:943 (icon 28×28 @ 0, gap 12px, TUTORIAL @ x=40).
 */
import { Link } from "react-router-dom";

const PAPER = "/homescreen/btn-paper.png";
const ICON = "/homescreen/icon-lightbulb.svg";

export function TutorialCta() {
  return (
    <Link
      to="/tutorial"
      aria-label="TUTORIAL"
      data-cta="tutorial"
      className="relative flex h-[61.34px] w-[199px] shrink-0 items-center justify-center overflow-visible transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Paper 17 — 14:942 @ (0, 61.34) 199×58.487, flipped on Y */}
      <div
        className="pointer-events-none absolute left-0 top-[61.34px] h-[58.487px] w-[199px] origin-top -scale-y-100 overflow-hidden"
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

      {/* Frame 1 — 14:943 @ (9.272, 16.405) 173.32×34.24 */}
      <span
        className="absolute z-[1] flex items-center gap-[12px]"
        style={{
          left: 9.272,
          top: 16.405,
          width: 173.323,
          height: 34.237,
        }}
      >
        {/* lightbulb — 14:944 @ (0, 3.118) 28×28 */}
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

        {/* TUTORIAL — 14:945 @ (40, 4.993); 40 − 28 = 12px gap */}
        <span
          className="relative h-[24.251px] shrink-0 whitespace-nowrap text-[28.53px] not-italic leading-[18.545px] text-[var(--ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          TUTORIAL
        </span>
      </span>
    </Link>
  );
}
