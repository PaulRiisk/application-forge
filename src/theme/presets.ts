// theme presets and their accent colors
// neutral tokens (sidebar bg, text colors) stay fixed across presets

import type { ThemePreset } from "../types";

export const PRESETS: Record<ThemePreset, { accent: string; label: string }> = {
  blue: { accent: "#2046c6", label: "Blue" },
  teal: { accent: "#0e7d7d", label: "Teal" },
  rust: { accent: "#a04a1f", label: "Rust" },
};

export const PRESET_ORDER: ThemePreset[] = ["blue", "teal", "rust"];
