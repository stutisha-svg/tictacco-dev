/**
 * PlayerCards — top strip showing both players' avatars, the shared XOX
 * indicator, and (after a win is announced) a hand-drawn crown above the
 * winning player's avatar.
 */
import { AnimatePresence, motion } from "motion/react";
import { XoxIndicator } from "./XoxIndicator";
import { Crown } from "./Crown";
import type { Owner } from "@/game/rules";

interface PlayerCardsProps {
  progressYou: number;
  progressOpp: number;
  leader: Owner | null;
  /** Set to the winning owner AFTER the badge minimizes; renders the crown. */
  crownedWinner?: Owner | null;
}

interface AvatarProps {
  name: string;
  initial: string;
  owner: Owner;
  active: boolean;
  crowned: boolean;
}

function Avatar({ name, initial, owner, active, crowned }: AvatarProps) {
  const color = owner === "you" ? "var(--player-you)" : "var(--player-opp)";
  const size = 64;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <AnimatePresence>
          {crowned && (
            <motion.div
              key="crown"
              className="pointer-events-none absolute left-1/2"
              style={{ top: -size * 0.55, transform: "translateX(-50%)" }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Crown color={color} size={size * 0.7} />
            </motion.div>
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
              <circle cx={size / 2} cy={size / 2} r={size / 2 - 5} fill="var(--paper)" />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={size / 2 - 5}
                fill="none"
                stroke={color}
                strokeWidth={3.5}
              />
            </g>
            <text
              x={size / 2}
              y={size / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-display)"
              fontStyle="normal"
              fontWeight={700}
              fontSize={28}
              fill="var(--ink)"
            >
              {initial}
            </text>
          </svg>
        </motion.div>
      </div>
      <div className="text-body-sm" style={{ color: "var(--ink)" }}>
        {name}
      </div>
    </div>
  );
}

export function PlayerCards({
  progressYou,
  progressOpp,
  leader,
  crownedWinner,
}: PlayerCardsProps) {
  return (
    <div className="flex w-full items-start justify-between px-4 pt-3">
      <Avatar
        name="you"
        initial="Y"
        owner="you"
        active={leader === "you"}
        crowned={crownedWinner === "you"}
      />
      <div className="flex flex-col items-center pt-2">
        <XoxIndicator
          progressYou={progressYou}
          progressOpp={progressOpp}
          leader={leader}
        />
        <div className="mt-1 text-body-sm" style={{ color: "var(--ink-soft)" }}>
          first one to X-O-X wins!
        </div>
      </div>
      <Avatar
        name="rival"
        initial="R"
        owner="opp"
        active={leader === "opp"}
        crowned={crownedWinner === "opp"}
      />
    </div>
  );
}
