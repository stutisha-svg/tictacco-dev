/**
 * useSettings — load/save settings from localStorage; sync contrast to <html>.
 */
import { useCallback, useEffect, useState } from "react";
import {
  SETTINGS_DEFAULTS,
  SETTINGS_STORAGE_KEY,
  applyContrastToDocument,
  clampVolume,
  parseSettings,
  type SettingsContrast,
  type SettingsLanguage,
  type SettingsState,
} from "./settingsConfig";

function readStored(): SettingsState {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return { ...SETTINGS_DEFAULTS };
    return parseSettings(JSON.parse(raw));
  } catch {
    return { ...SETTINGS_DEFAULTS };
  }
}

function writeStored(next: SettingsState) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsState>(() => readStored());

  useEffect(() => {
    applyContrastToDocument(settings.contrast);
  }, [settings.contrast]);

  const patch = useCallback((partial: Partial<SettingsState>) => {
    setSettings((prev) => {
      const next: SettingsState = {
        ...prev,
        ...partial,
        sfxVolume:
          partial.sfxVolume != null
            ? clampVolume(partial.sfxVolume)
            : prev.sfxVolume,
        gameVolume:
          partial.gameVolume != null
            ? clampVolume(partial.gameVolume)
            : prev.gameVolume,
      };
      writeStored(next);
      return next;
    });
  }, []);

  const setSfxVolume = useCallback(
    (sfxVolume: number) => patch({ sfxVolume }),
    [patch],
  );
  const setGameVolume = useCallback(
    (gameVolume: number) => patch({ gameVolume }),
    [patch],
  );
  const setContrast = useCallback(
    (contrast: SettingsContrast) => patch({ contrast }),
    [patch],
  );
  const setLanguage = useCallback(
    (language: SettingsLanguage) => patch({ language }),
    [patch],
  );

  return {
    settings,
    setSfxVolume,
    setGameVolume,
    setContrast,
    setLanguage,
  };
}
