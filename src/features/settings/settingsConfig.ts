/**
 * settingsConfig — persisted prefs for the TopBar settings overlay.
 */
export type SettingsContrast = "default" | "high" | "max";

export type SettingsLanguage = "en" | "es" | "fr";

export type SettingsState = {
  sfxVolume: number;
  gameVolume: number;
  contrast: SettingsContrast;
  language: SettingsLanguage;
};

export const SETTINGS_STORAGE_KEY = "tictacco.settings.v1";

export const SETTINGS_DEFAULTS: SettingsState = {
  sfxVolume: 70,
  gameVolume: 70,
  contrast: "default",
  language: "en",
};

export const SETTINGS_CONTRAST_OPTIONS: {
  id: SettingsContrast;
  label: string;
}[] = [
  { id: "default", label: "default" },
  { id: "high", label: "high" },
  { id: "max", label: "max" },
];

export const SETTINGS_LANGUAGE_OPTIONS: {
  id: SettingsLanguage;
  label: string;
}[] = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
];

export function clampVolume(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function isSettingsContrast(v: unknown): v is SettingsContrast {
  return v === "default" || v === "high" || v === "max";
}

export function isSettingsLanguage(v: unknown): v is SettingsLanguage {
  return v === "en" || v === "es" || v === "fr";
}

export function parseSettings(raw: unknown): SettingsState {
  if (!raw || typeof raw !== "object") return { ...SETTINGS_DEFAULTS };
  const o = raw as Record<string, unknown>;
  return {
    sfxVolume:
      typeof o.sfxVolume === "number"
        ? clampVolume(o.sfxVolume)
        : SETTINGS_DEFAULTS.sfxVolume,
    gameVolume:
      typeof o.gameVolume === "number"
        ? clampVolume(o.gameVolume)
        : SETTINGS_DEFAULTS.gameVolume,
    contrast: isSettingsContrast(o.contrast)
      ? o.contrast
      : SETTINGS_DEFAULTS.contrast,
    language: isSettingsLanguage(o.language)
      ? o.language
      : SETTINGS_DEFAULTS.language,
  };
}

/** Apply contrast token on <html> for future CSS hooks. */
export function applyContrastToDocument(contrast: SettingsContrast) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.contrast = contrast;
}
