/**
 * PlayerCards — top strip showing both players' avatars, the shared XOX
 * indicator, and (after a win is announced) a hand-drawn crown above the
 * winning player's avatar.
 *
 * Avatars use hand-drawn crayon glyphs (bug for you, rocket for rival) so
 * both circles stay consistent with the crayon UI language.
 */
import { AnimatePresence, motion } from "motion/react";
import { XoxIndicator } from "./XoxIndicator";
import { Crown } from "./Crown";
import { ReactionSticker } from "./ReactionSticker";
import type { Reaction } from "./reactions";
import type { Owner } from "@/game/rules";
import type { MatchScore } from "@/game/useGameEngine";

interface PlayerCardsProps {
  progressYou: number;
  progressOpp: number;
  leader: Owner | null;
  /** Set to the winning owner AFTER the badge minimizes; renders the crown. */
  crownedWinner?: Owner | null;
  match: MatchScore;
  matchTarget: number;
  /** Winning owner while phase is won — floods the XOX tube. */
  tubeWinner?: Owner | null;
  /** Pulse the tube fill after the result badge collapses. */
  tubeCelebrate?: boolean;
  /** Optional reaction bubble rendered as a thought cloud over the avatar. */
  youReaction?: Reaction | null;
  /** Bumps so re-picking the same sticker still re-animates the cloud. */
  youReactionKey?: number;
  oppReaction?: Reaction | null;
}

interface AvatarProps {
  name: string;
  glyph: "bug" | "rocket";
  owner: Owner;
  active: boolean;
  crowned: boolean;
  score: number;
  reaction?: Reaction | null;
  reactionKey?: number;
}

function BugGlyph({ size, color }: { size: number; color: string }) {
  // small hand-drawn bug: oval body, head, antennae, legs
  const s = size;
  return (
    <g stroke={color} strokeWidth={2.2} strokeLinecap="round" fill="none">
      {/* body */}
      <ellipse cx={s / 2} cy={s * 0.58} rx={s * 0.22} ry={s * 0.28} fill={color} fillOpacity={0.15} />
      {/* segment line */}
      <path d={`M ${s / 2} ${s * 0.34} L ${s / 2} ${s * 0.82}`} />
      {/* head */}
      <circle cx={s / 2} cy={s * 0.3} r={s * 0.09} fill={color} fillOpacity={0.15} />
      {/* antennae */}
      <path d={`M ${s * 0.45} ${s * 0.24} L ${s * 0.38} ${s * 0.14}`} />
      <path d={`M ${s * 0.55} ${s * 0.24} L ${s * 0.62} ${s * 0.14}`} />
      {/* legs */}
      <path d={`M ${s * 0.28} ${s * 0.5} L ${s * 0.18} ${s * 0.44}`} />
      <path d={`M ${s * 0.28} ${s * 0.6} L ${s * 0.16} ${s * 0.6}`} />
      <path d={`M ${s * 0.28} ${s * 0.7} L ${s * 0.18} ${s * 0.78}`} />
      <path d={`M ${s * 0.72} ${s * 0.5} L ${s * 0.82} ${s * 0.44}`} />
      <path d={`M ${s * 0.72} ${s * 0.6} L ${s * 0.84} ${s * 0.6}`} />
      <path d={`M ${s * 0.72} ${s * 0.7} L ${s * 0.82} ${s * 0.78}`} />
    </g>
  );
}

function RocketGlyph({ size, color }: { size: number; color: string }) {
  const s = size;
  // stylized rocket: pointed nose, body, fins, flame
  return (
    <g stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* body + nose */}
      <path
        d={`M ${s / 2} ${s * 0.16}
            C ${s * 0.66} ${s * 0.28} ${s * 0.66} ${s * 0.55} ${s * 0.6} ${s * 0.68}
            L ${s * 0.4} ${s * 0.68}
            C ${s * 0.34} ${s * 0.55} ${s * 0.34} ${s * 0.28} ${s / 2} ${s * 0.16} Z`}
        fill={color}
        fillOpacity={0.15}
      />
      {/* window */}
      <circle cx={s / 2} cy={s * 0.4} r={s * 0.07} />
      {/* fins */}
      <path d={`M ${s * 0.4} ${s * 0.6} L ${s * 0.28} ${s * 0.78} L ${s * 0.42} ${s * 0.72}`} />
      <path d={`M ${s * 0.6} ${s * 0.6} L ${s * 0.72} ${s * 0.78} L ${s * 0.58} ${s * 0.72}`} />
      {/* flame */}
      <path
        d={`M ${s * 0.44} ${s * 0.72} Q ${s / 2} ${s * 0.92} ${s * 0.56} ${s * 0.72}`}
        stroke={color}
      />
    </g>
  );
}

function ThoughtCloud({ reaction, color }: { reaction: Reaction; color: string }) {
  // Figma Paper 01 / cloud paper (2036:538) — scaled down; sticker on the main body.
  // Asset aspect ~343×228; trail bubbles sit bottom-right so emoji sits upper-center.
  const W = 72;
  const H = Math.round((W * 228) / 343);
  return (
    <div
      className="pointer-events-none absolute -top-1.5 left-1/2 z-[60]"
      style={{ transform: "translate(-50%, -100%)", width: W, height: H }}
      aria-label={reaction.label}
    >
      <img
        src="/reactions/cloud-paper.png"
        alt=""
        draggable={false}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
      />
      <div
        className="relative flex w-full items-center justify-center"
        style={{ height: "62%", paddingTop: "4%" }}
      >
        <ReactionSticker reaction={reaction} size={24} color={color} />
      </div>
    </div>
  );
}

function Avatar({ name, glyph, owner, active, crowned, score, reaction, reactionKey = 0 }: AvatarProps) {
  const color = owner === "you" ? "var(--player-you)" : "var(--player-opp)";
  const size = 64;
  const purpleBg =
    owner === "you" ? "var(--accent-purple)" : "color-mix(in oklab, var(--accent-purple) 55%, transparent)";
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative"
        style={{ width: size, height: size, overflow: "visible" }}
        data-colored-island="true"
      >
        <AnimatePresence>
          {reaction && (
            <motion.div
              key={`${reaction.id}-${reactionKey}`}
              className="absolute inset-0 z-[60]"
              style={{ overflow: "visible" }}
              initial={{ opacity: 0, y: 6, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <ThoughtCloud reaction={reaction} color={color} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Crown — plain div wrapper handles translateX so motion's animated
            transform on the inner element can't clobber it. */}
        <AnimatePresence>
          {crowned && (
            <div
              key="crown-wrap"
              className="pointer-events-none absolute"
              style={{
                top: -size * 0.55,
                left: "50%",
                width: 0,
                height: 0,
              }}
            >
              <motion.div
                key="crown"
                style={{
                  width: size * 0.85,
                  height: size * 0.65,
                  marginLeft: -(size * 0.85) / 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
                initial={{ y: 4, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Crown color={color} size={size * 0.75} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.div
          animate={{ scale: active ? [1, 1.06, 1] : 1 }}
          transition={{ duration: 1.2, repeat: active ? Infinity : 0 }}
          style={{ width: size, height: size }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="overflow-visible"
          >
            <defs>
              <filter id={`av-${owner}`} x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.7"
                  numOctaves="2"
                  seed={owner === "you" ? 4 : 9}
                />
                <feDisplacementMap in="SourceGraphic" scale="2" />
              </filter>
            </defs>
            <g filter={`url(#av-${owner})`}>
              <circle cx={size / 2} cy={size / 2} r={size / 2 - 5} fill="rgba(255,255,255,0.3)" />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 5}
                fill="none"
                stroke={color}
                strokeWidth={3.5}
              />
              {glyph === "bug" ? (
                <BugGlyph size={size} color={color} />
              ) : (
                <RocketGlyph size={size} color={color} />
              )}
            </g>
          </svg>
        </motion.div>
      </div>
      <div className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
        {name}
      </div>
      {/* small purple score tab */}
      <div
        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs"
        style={{
          background: purpleBg,
          color: "var(--paper)",
          fontFamily: "var(--font-display)",
          lineHeight: 1.2,
        }}
      >
        <span style={{ fontWeight: 700 }}>{score}</span>
        <span style={{ opacity: 0.8 }}>wins</span>
      </div>
    </div>
  );
}

export function PlayerCards({
  progressYou,
  progressOpp,
  leader,
  crownedWinner,
  match,
  matchTarget,
  tubeWinner = null,
  tubeCelebrate = false,
  youReaction,
  youReactionKey = 0,
  oppReaction,
}: PlayerCardsProps) {
  return (
    <div className="flex w-full items-start justify-between px-2 pt-6">
      <Avatar
        name="you"
        glyph="bug"
        owner="you"
        active={leader === "you"}
        crowned={crownedWinner === "you"}
        score={match.you}
        reaction={youReaction}
        reactionKey={youReactionKey}
      />
      <div className="flex flex-col items-center pt-2">
        <XoxIndicator
          progressYou={progressYou}
          progressOpp={progressOpp}
          leader={leader}
          match={match}
          matchTarget={matchTarget}
          winner={tubeWinner}
          celebrate={tubeCelebrate}
        />
        <div className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
          first one to X-O-X wins!
        </div>
      </div>
      <Avatar
        name="rival"
        glyph="rocket"
        owner="opp"
        active={leader === "opp"}
        crowned={crownedWinner === "opp"}
        score={match.opp}
        reaction={oppReaction}
      />
    </div>
  );
}
