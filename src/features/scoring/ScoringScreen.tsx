/**
 * ScoringScreen — `/score` post-series results (scoring feature).
 *
 * Shown ~3s after matchOver confetti via useScoringMatchOverHandoff.
 * Profiles, best-of pips, groop XP, crown on series winner, rematch / quit.
 */
import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { TopBar } from "@/components/game/TopBar";
import { GameEnvBg } from "@/components/game/GameEnvBg";
import { ScoringAvatar } from "./ScoringAvatar";
import {
  ScoringBestOfBadge,
  ScoringGroopXpCard,
  ScoringScoreDuel,
} from "./ScoringSeriesChrome";
import { isScoringMatchResult } from "./scoringMatchResult";

const SCORING_TITLE_FONT = "'Caveat', 'Patrick Hand', cursive";

export function ScoringScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = useMemo(() => {
    const raw = location.state;
    return isScoringMatchResult(raw) ? raw : null;
  }, [location.state]);

  useEffect(() => {
    if (!result) navigate("/", { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  const headline =
    result.matchWinner === "you"
      ? "YOU TAKE THE SERIES"
      : result.matchWinner === "opp"
        ? "RIVAL TAKES IT"
        : "SERIES SPLIT";
  const sub =
    result.matchWinner === "you"
      ? "bold strokes — you own this page"
      : result.matchWinner === "opp"
        ? "they sketched the last laugh"
        : "even ink — rematch to settle it";

  const accent =
    result.matchWinner === "you"
      ? "var(--player-you)"
      : result.matchWinner === "opp"
        ? "var(--player-opp)"
        : "var(--accent-purple)";

  return (
    <div
      data-scoring-screen
      className="relative mx-auto flex min-h-full w-full min-w-0 max-w-full flex-1 flex-col items-center overflow-x-clip bg-transparent pb-6"
      style={{ minHeight: "100%" }}
    >
      <GameEnvBg className="!fixed inset-0 overflow-hidden sm:rounded-[24px]" />

      <div className="relative w-full shrink-0" data-scoring-topbar>
        <TopBar />
      </div>

      <div className="relative z-10 -mt-3 flex w-full min-w-0 flex-1 flex-col items-center px-4 pt-2">
        <ScoringTitleRibbon
          headline={headline}
          sub={sub}
          accent={accent}
          titleColor={
            result.matchWinner === "you" || result.matchWinner === "opp"
              ? accent
              : "var(--ink)"
          }
        />

        {/* Profiles + XP — 30px below title */}
        <div
          className="flex w-full flex-col items-center"
          style={{ marginTop: 30 }}
          data-scoring-body
        >
          <div className="mb-2 flex w-full max-w-[360px] items-start justify-between gap-2 px-2">
            <ScoringAvatar
              owner="you"
              name="you"
              score={result.youWins}
              crowned={result.matchWinner === "you"}
              delay={0.15}
            />
            <ScoringBestOfBadge target={result.matchTarget} delay={0.35} />
            <ScoringAvatar
              owner="opp"
              name="rival"
              score={result.oppWins}
              crowned={result.matchWinner === "opp"}
              delay={0.25}
            />
          </div>

          <ScoringScoreDuel
            you={result.youWins}
            opp={result.oppWins}
            target={result.matchTarget}
          />

          <ScoringGroopXpCard xp={result.xpEarned} delay={0.9} />
        </div>

        <motion.div
          className="mt-auto flex w-full max-w-[320px] flex-col gap-3 pb-2 pt-8"
          data-scoring-actions
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.15, type: "spring", stiffness: 220, damping: 20 }}
        >
          <Link
            to="/game"
            replace
            data-scoring-rematch
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-2 text-base transition-transform hover:scale-[1.02] active:scale-[0.97]"
            style={{
              fontFamily: "var(--font-display)",
              borderColor: "var(--ink)",
              background: "var(--ink)",
              color: "var(--paper)",
            }}
          >
            rematch
          </Link>
          <Link
            to="/"
            replace
            data-scoring-quit
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full border-2 text-base transition-transform hover:scale-[1.02] active:scale-[0.97]"
            style={{
              fontFamily: "var(--font-display)",
              borderColor: "var(--ink)",
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          >
            quit game
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

/** Scrapbook headline ribbon at the top of ScoringScreen. */
function ScoringTitleRibbon({
  headline,
  sub,
  accent,
  titleColor,
}: {
  headline: string;
  sub: string;
  accent: string;
  titleColor: string;
}) {
  return (
    <motion.div
      data-scoring-title
      className="relative mb-6 w-full max-w-[340px]"
      initial={{ y: -24, opacity: 0, rotate: -3 }}
      animate={{ y: 0, opacity: 1, rotate: -1.5 }}
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 340 110"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter id="scoring-title-rough" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
        </defs>
        <g filter="url(#scoring-title-rough)">
          <path
            d="M 16 22 L 324 14 L 318 92 L 22 98 Z"
            fill="var(--paper)"
            stroke="var(--ink)"
            strokeWidth={3.2}
            strokeLinejoin="round"
          />
          <path
            d="M 28 32 L 312 24 L 306 82 L 34 88 Z"
            fill="none"
            stroke={accent}
            strokeWidth={2.2}
            strokeDasharray="7 5"
          />
        </g>
      </svg>
      <div className="relative flex flex-col items-center gap-1 px-6 py-5 text-center">
        <p
          className="text-[clamp(1.6rem,7vw,2.15rem)] font-bold leading-none"
          style={{
            fontFamily: SCORING_TITLE_FONT,
            color: titleColor,
            WebkitTextStroke: "1px var(--ink)",
            paintOrder: "stroke",
          }}
        >
          {headline}
        </p>
        <p
          className="text-sm leading-snug"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink-soft)" }}
        >
          {sub}
        </p>
      </div>
    </motion.div>
  );
}
