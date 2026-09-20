/**
 * AppRoutes — central react-router-dom navigation for tic tac co screens.
 * Rendered inside the 390px mobile device wrapper in `__root.tsx`.
 */
import { Navigate, Route, Routes } from "react-router-dom";
import { HomeScreen } from "@/features/home/HomeScreen";
import { TutorialScreen } from "@/features/tutorial";
import { ScoringScreen } from "@/features/scoring/ScoringScreen";
import { AchievementsScreen } from "@/features/achievements";
import { GameScreen } from "@/components/game/GameScreen";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/tutorial" element={<TutorialScreen />} />
      <Route path="/score" element={<ScoringScreen />} />
      <Route path="/achievements" element={<AchievementsScreen />} />
      {/* Existing game UI — unchanged component; Home now owns `/`. */}
      <Route path="/game" element={<GameScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
