// ui locale (DE/EN) for the app chrome, independent of document content
// state persists in localStorage under its own key

import { useEffect, useState } from "react";
import type { UiLocale } from "./strings";

const STORAGE_KEY = "application-forge-ui-locale";

function readStored(): UiLocale | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "de" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

// fall back to the browser/OS language on first visit
function systemPreference(): UiLocale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language ?? "en";
  return lang.toLowerCase().startsWith("de") ? "de" : "en";
}

export function useUiLocale(): [UiLocale, () => void] {
  const [locale, setLocale] = useState<UiLocale>(
    () => readStored() ?? systemPreference(),
  );

  useEffect(() => {
    document.documentElement.setAttribute("lang", locale);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // no-op
    }
  }, [locale]);

  const toggle = () => setLocale((l) => (l === "de" ? "en" : "de"));
  return [locale, toggle];
}
