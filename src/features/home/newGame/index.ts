/**
 * `@/features/home/newGame` — home “new game” setup modal (mode → game count).
 *
 *   NewGameSetupModal     — two-step dialog
 *   NewGameSetupSheet     — paper chrome
 *   NewGameModeStep       — relaxed / timed / ???
 *   NewGameCountStep      — best-of slider 3–7
 *   newGameConfig         — types + roundMsForMode
 */
export { NewGameSetupModal } from "./NewGameSetupModal";
export {
  isNewGameConfig,
  roundMsForMode,
  clampGameCount,
  NEW_GAME_COUNT_DEFAULT,
  NEW_GAME_COUNT_MIN,
  NEW_GAME_COUNT_MAX,
} from "./newGameConfig";
export type { NewGameConfig, NewGameMode } from "./newGameConfig";
