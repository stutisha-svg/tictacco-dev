/**
 * AchievementsScreen — `/achievements` static badge gallery.
 *
 * Frame height stays locked; card list scrolls inside with no visible scrollbar.
 * Tap a card → AchievementModal (game chrome).
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { TopBar } from "@/components/game/TopBar";
import { GameEnvBg } from "@/components/game/GameEnvBg";
import { AchievementModal } from "@/components/game/AchievementModal";
import { CrayonBackIcon } from "@/components/game/CrayonBackIcon";
import type { Achievement } from "@/components/game/achievements";
import { ACHIEVEMENTS_GALLERY } from "./achievementsCatalog";
import { AchievementsSummary } from "./AchievementsSummary";
import { AchievementsCard } from "./AchievementsCard";
import { AchievementsFabFrame } from "./AchievementsFabFrame";

export function AchievementsScreen() {
  const [selected, setSelected] = useState<Achievement | null>(null);

  return (
    <div
      data-achievements-screen
      className="absolute inset-0 flex flex-col overflow-hidden bg-transparent"
    >
      <GameEnvBg className="!absolute inset-0 overflow-hidden sm:rounded-[24px]" />

      <div className="relative w-full shrink-0">
        <TopBar />
      </div>

      {/* Invisible scroll — screen height never grows with card list. */}
      <div
        data-achievements-scroll
        className="relative z-10 -mt-2 flex min-h-0 w-full min-w-0 flex-1 flex-col items-center overflow-x-hidden overflow-y-auto px-4 pb-24 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="w-full max-w-[340px] shrink-0"
        >
          <AchievementsSummary />
        </motion.div>

        <ul className="mt-4 flex w-full max-w-[340px] list-none flex-col gap-3 p-0">
          {ACHIEVEMENTS_GALLERY.map((a, i) => (
            <li key={a.id}>
              <AchievementsCard
                achievement={a}
                index={i}
                onOpen={() => setSelected(a)}
              />
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/"
        data-achievements-fab
        aria-label="Back home"
        className="absolute left-1/2 z-30 flex min-h-[48px] w-[220px] -translate-x-1/2 items-center justify-center gap-2 bg-transparent transition-transform hover:scale-[1.02] active:scale-[0.97]"
        style={{ bottom: 20 }}
      >
        <AchievementsFabFrame />
        <CrayonBackIcon size={28} stroke="var(--paper)" />
        <span
          className="relative text-sm font-bold leading-none"
          style={{ fontFamily: "var(--font-display)", color: "var(--paper)" }}
        >
          back home
        </span>
      </Link>

      <AchievementModal
        achievement={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
