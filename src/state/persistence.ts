// localStorage hydration + JSON file save/load
// photo and signature live in app-level state, never reach this module

import type { ApplicationDocument } from "../types";
import { newId } from "../types";

const STORAGE_KEY = "application-forge-v1";

// loose shape check so junk in localStorage / a bad file doesn't crash the app
function isValidDocument(value: unknown): value is ApplicationDocument {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (v.version !== 1) return false;

  const stamm = v.stammdaten as Record<string, unknown> | undefined;
  if (!stamm || typeof stamm !== "object") return false;
  if (typeof stamm.name !== "string") return false;
  if (typeof stamm.title !== "string") return false;
  if (typeof stamm.kurz !== "string") return false;
  if (!Array.isArray(stamm.contact)) return false;
  if (!stamm.schwerpunkt || typeof stamm.schwerpunkt !== "object") return false;
  if (!stamm.theme || typeof stamm.theme !== "object") return false;
  if (stamm.mode !== "dev" && stamm.mode !== "classic") return false;

  const letters = v.letters as Record<string, unknown> | undefined;
  if (!letters || typeof letters !== "object") return false;
  if (!Array.isArray(letters.items)) return false;
  if (typeof letters.activeId !== "string") return false;

  const cv = v.cv as Record<string, unknown> | undefined;
  if (!cv || typeof cv !== "object") return false;
  if (typeof cv.profile !== "string") return false;
  if (!Array.isArray(cv.skillGroups)) return false;
  if (!Array.isArray(cv.sidebarSections)) return false;
  if (!Array.isArray(cv.entrySections)) return false;

  const about = v.about as Record<string, unknown> | undefined;
  if (!about || typeof about !== "object") return false;
  if (typeof about.warumSoftware !== "string") return false;
  if (!Array.isArray(about.staerken)) return false;
  if (!Array.isArray(about.wasIchBaue)) return false;
  if (!Array.isArray(about.ausserhalbDesTerminals)) return false;

  return true;
}

// give every list entry a fresh id so react keys stay unique after a load
// also keeps the active-letter reference stable by remapping it to the new id
function regenerateIds(doc: ApplicationDocument): ApplicationDocument {
  const letterIdMap = new Map<string, string>();
  const lettersItems = doc.letters.items.map((l) => {
    const fresh = newId();
    letterIdMap.set(l.id, fresh);
    return { ...l, id: fresh };
  });
  const nextActiveId =
    letterIdMap.get(doc.letters.activeId) ??
    lettersItems[0]?.id ??
    doc.letters.activeId;

  return {
    ...doc,
    stammdaten: {
      ...doc.stammdaten,
      contact: doc.stammdaten.contact.map((row) => ({ ...row, id: newId() })),
      schwerpunkt: { ...doc.stammdaten.schwerpunkt, id: newId() },
    },
    letters: {
      items: lettersItems,
      activeId: nextActiveId,
    },
    cv: {
      ...doc.cv,
      skillGroups: doc.cv.skillGroups.map((g) => ({ ...g, id: newId() })),
      sidebarSections: doc.cv.sidebarSections.map((s) => ({
        ...s,
        id: newId(),
        rows: s.rows.map((r) => ({ ...r, id: newId() })),
      })),
      entrySections: doc.cv.entrySections.map((s) => ({
        ...s,
        id: newId(),
        entries: s.entries.map((e) => ({ ...e, id: newId() })),
      })),
    },
    about: {
      ...doc.about,
      staerken: doc.about.staerken.map((c) => ({ ...c, id: newId() })),
      wasIchBaue: doc.about.wasIchBaue.map((i) => ({ ...i, id: newId() })),
      ausserhalbDesTerminals: doc.about.ausserhalbDesTerminals.map((i) => ({
        ...i,
        id: newId(),
      })),
    },
  };
}

// localStorage handlers, wrapped in try so quota / private mode don't crash
export function loadFromLocalStorage(): ApplicationDocument | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidDocument(parsed)) return null;
    return regenerateIds(parsed);
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

// turn a free-text name into a safe filename slug
function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "application";
}

// trigger a browser download for the whole application document
export function downloadJson(doc: ApplicationDocument): void {
  const blob = new Blob([JSON.stringify(doc, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(doc.stammdaten.name)}-application-forge.json`;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// read a user-picked JSON file and validate it as an application document
export function readJsonFile(file: File): Promise<ApplicationDocument> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!isValidDocument(parsed)) {
          reject(
            new Error("File is not a valid application-forge document (version 1)."),
          );
          return;
        }
        resolve(regenerateIds(parsed));
      } catch {
        reject(new Error("File is not valid JSON."));
      }
    };
    reader.readAsText(file);
  });
}
