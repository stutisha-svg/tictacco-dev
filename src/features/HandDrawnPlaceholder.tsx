/**
 * Shared hand-drawn placeholder chrome for unfinished feature screens.
 * Same TopBar + checkered paper as GameScreen.
 */
import { Link } from "react-router-dom";
import { TopBar } from "@/components/game/TopBar";
import { GameEnvBg } from "@/components/game/GameEnvBg";

export function HandDrawnPlaceholder({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <div
      className="relative flex min-h-full w-full flex-1 flex-col overflow-hidden bg-transparent"
      style={{ minHeight: "100%" }}
    >
      <GameEnvBg className="!fixed inset-0 overflow-hidden sm:rounded-[24px]" />
      <TopBar />

      <div className="relative z-10 -mt-[20px] flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="relative w-full max-w-[320px]">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 320 220"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <filter id="ph-rough" x="-8%" y="-8%" width="116%" height="116%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
                <feDisplacementMap in="SourceGraphic" scale="2.1" />
              </filter>
            </defs>
            <g filter="url(#ph-rough)">
              <path
                d="M 18 28 Q 10 10 36 8 L 286 6 Q 314 12 310 40 L 316 178 Q 312 212 276 208 L 42 214 Q 12 204 14 170 Z"
                fill="rgba(255,255,255,0.72)"
                stroke="var(--ink)"
                strokeWidth={2.6}
                strokeLinejoin="round"
              />
              <path
                d="M 32 40 Q 26 24 48 22 L 274 20 Q 296 26 292 48 L 298 166 Q 294 196 264 194 L 54 200 Q 30 192 32 162 Z"
                fill="none"
                stroke="var(--ink-brown)"
                strokeWidth={1.8}
                strokeDasharray="6 5"
              />
            </g>
          </svg>

          <div className="relative flex flex-col items-center gap-3 px-8 py-10 text-center">
            <h1
              className="text-3xl leading-tight text-[var(--ink)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
            <p
              className="text-base leading-snug text-[var(--ink-soft)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {blurb}
            </p>
            <Link
              to="/"
              className="relative mt-2 inline-flex h-[61px] min-h-[44px] w-[199px] max-w-full items-center justify-center overflow-hidden transition-transform active:scale-[0.97]"
              aria-label="Back home"
            >
              <img
                src="/top-bar/bar.png"
                alt=""
                draggable={false}
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              />
              <span
                className="relative z-[1] text-[28px] leading-none text-[var(--ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                back home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
