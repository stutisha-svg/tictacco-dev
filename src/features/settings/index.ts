/**
 * `@/features/settings` — TopBar settings overlay (volume, contrast, language…).
 */
export { SettingsMenu } from "./SettingsMenu";
export { useSettings } from "./useSettings";
export {
  SETTINGS_DEFAULTS,
  SETTINGS_CONTRAST_OPTIONS,
  SETTINGS_LANGUAGE_OPTIONS,
} from "./settingsConfig";
export type {
  SettingsState,
  SettingsContrast,
  SettingsLanguage,
} from "./settingsConfig";
