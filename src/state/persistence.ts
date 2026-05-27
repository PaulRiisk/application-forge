// localStorage hydration + JSON file save/load
// photo and signature live in app state only, never persisted here
// phase 1 keeps a minimal validator; later phases extend it

import type { ApplicationDocument } from "../types";

const STORAGE_KEY = "application-forge-v1";

// loose shape check so junk in localStorage doesn't crash the app
function isValidDocument(value: unknown): value is ApplicationDocument {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === 1 &&
    typeof v.stammdaten === "object" &&
    v.stammdaten !== null &&
    typeof v.letters === "object" &&
    v.letters !== null &&
    typeof v.cv === "object" &&
    v.cv !== null &&
    typeof v.about === "object" &&
    v.about !== null
  );
}

// localStorage handlers, wrapped in try so quota / private mode don't crash
export function loadFromLocalStorage(): ApplicationDocument | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidDocument(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveToLocalStorage(doc: ApplicationDocument): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch {
    // quota or disabled, silent fallback
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
