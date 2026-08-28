/**
 * NEW GAME CTA — Figma node 14:935 (Component 2).
 * 279×86 frame; Paper 17 strip 279×82 @ y=4 with torn-edge crop.
 */
import { Link } from "react-router-dom";

const PAPER = "/homescreen/btn-paper.png";
const ICON = "/homescreen/icon-play.svg";

/** Figma frame width — paper aspect uses W×82 strip inside 86px-tall hit target. */
const W = 279;

export function NewGameCta() {
  return (
    <Link
      to="/game"
      aria-label="NEW GAME"
      data-cta="new-game"
      className="relative block h-[86px] w-[279px] max-w-[92%] shrink-0 transition-transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Paper 17 — Figma I14:935;11:295 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1 overflow-hidden"
        style={{ aspectRatio: `${W} / 82` }}
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

      {/* Label row — Figma inset 26.74% / 8.24% / 17.44% / 4.66% */}
      <span
        className="absolute flex items-center gap-[13.339px]"
        style={{
          top: "26.74%",
          right: "8.24%",
          bottom: "17.44%",
          left: "4.66%",
        }}
      >
        <span className="relative size-12 shrink-0 overflow-clip">
          <img
            src={ICON}
            alt=""
            draggable={false}
            aria-hidden
            className="absolute inset-0 block size-full max-w-none object-contain"
            width={48}
            height={48}
          />
        </span>
        <span
          className="h-[34px] w-[280px] shrink-0 break-words leading-[26px] text-[var(--ink)]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 40,
          }}
        >
          NEW GAME
        </span>
      </span>
    </Link>
  );
}
