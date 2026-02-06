import { useEffect, useState } from "react";
import { languages, models, lengths } from "../constants";

const PREFERENCES_STORAGE_KEY = "yt-summary-preferences";

type PreferenceKey = "language" | "model" | "length";

const getDefaultPreference = (key: PreferenceKey): string => {
  if (key === "language") {
    return languages[0]?.value ?? "en";
  }
  if (key === "model") {
    return models[2]?.value ?? "gemini-2.5-flash-lite";
  }
  return lengths[1]?.value ?? "medium";
};

export function usePreferences() {
  const [language, setLanguage] = useState(() =>
    getDefaultPreference("language")
  );
  const [model, setModel] = useState(() => getDefaultPreference("model"));
  const [length, setLength] = useState(() => getDefaultPreference("length"));

  useEffect(() => {
    browser.storage.local.get(PREFERENCES_STORAGE_KEY).then((result) => {
      try {
        const stored = result[PREFERENCES_STORAGE_KEY];
        if (!stored || typeof stored !== "object") {
          return;
        }
        const {
          language: storedLanguage,
          model: storedModel,
          length: storedLength,
        } = stored as Partial<Record<PreferenceKey, string>>;

        if (
          typeof storedLanguage === "string" &&
          languages.some((option) => option.value === storedLanguage)
        ) {
          setLanguage(storedLanguage);
        }
        if (
          typeof storedModel === "string" &&
          models.some((option) => option.value === storedModel)
        ) {
          setModel(storedModel);
        }
        if (
          typeof storedLength === "string" &&
          lengths.some((option) => option.value === storedLength)
        ) {
          setLength(storedLength);
        }
      } catch (error) {
        console.error("Failed to load picker preferences", error);
      }
    });
  }, []);

  useEffect(() => {
    const payload = { language, model, length };
    browser.storage.local
      .set({ [PREFERENCES_STORAGE_KEY]: payload })
      .catch((error: unknown) => {
        console.error("Failed to save picker preferences", error);
      });
  }, [language, model, length]);

  return {
    language,
    setLanguage,
    model,
    setModel,
    length,
    setLength,
  };
}
