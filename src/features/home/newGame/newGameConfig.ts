/**
 * newGameConfig — setup choices from NewGameSetupModal → `/game` router state.
 *
 * Modes tweak round pace; gameCount sets best-of (matchTarget). GameScreen
 * reads this via router state and passes options into useGameEngine.
 */
export type NewGameMode = "relaxed" | "timed" | "blitz";

export type NewGameConfig = {
  mode: NewGameMode;
  /** Games in the series (best of N). Clamped 3–7. */
  gameCount: number;
};

export const NEW_GAME_COUNT_MIN = 3;
export const NEW_GAME_COUNT_MAX = 7;
export const NEW_GAME_COUNT_DEFAULT = 3;

export const NEW_GAME_MODES: { id: NewGameMode; label: string }[] = [
  { id: "relaxed", label: "relaxed" },
  { id: "timed", label: "timed" },
  { id: "blitz", label: "???" },
];

/** Round length (ms) per mode — applied as engine `duration`. */
export function roundMsForMode(mode: NewGameMode): number {
  switch (mode) {
    case "relaxed":
      return 12_000;
    case "blitz":
      return 3_000;
    case "timed":
    default:
      return 5_000;
  }
}

export function clampGameCount(n: number): number {
  return Math.min(
    NEW_GAME_COUNT_MAX,
    Math.max(NEW_GAME_COUNT_MIN, Math.round(n)),
  );
}

export function isNewGameConfig(v: unknown): v is NewGameConfig {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    (o.mode === "relaxed" || o.mode === "timed" || o.mode === "blitz") &&
    typeof o.gameCount === "number" &&
    o.gameCount >= NEW_GAME_COUNT_MIN &&
    o.gameCount <= NEW_GAME_COUNT_MAX
  );
}
