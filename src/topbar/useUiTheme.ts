// light/dark mode for the app chrome only, never for the document previews
// persisted under its own localStorage key

import { useEffect, useState } from "react";

export type UiTheme = "light" | "dark";

const STORAGE_KEY = "application-forge-ui-theme";

function readStored(): UiTheme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

function systemPreference(): UiTheme {
  if (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function useUiTheme(): [UiTheme, () => void] {
  const [theme, setTheme] = useState<UiTheme>(
    () => readStored() ?? systemPreference(),
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // no-op
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}
