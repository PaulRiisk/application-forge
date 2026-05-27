// preset color buttons (Blue / Teal / Rust)
// active state checks both the preset id and the accent, so the picker
// overriding the accent makes the preset look inactive

import { useApp, useAppDispatch } from "../state/AppContext";
import { PRESETS, PRESET_ORDER } from "../theme/presets";

export function ThemePresets() {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const { theme } = stammdaten;

  return (
    <div className="theme-presets" role="group" aria-label="Theme presets">
      {PRESET_ORDER.map((key) => {
        const preset = PRESETS[key];
        const active = theme.preset === key && theme.accent === preset.accent;
        return (
          <button
            key={key}
            type="button"
            className={`preset-swatch${active ? " active" : ""}`}
            onClick={() =>
              dispatch({
                type: "STAMM_SET_THEME_PRESET",
                preset: key,
                accent: preset.accent,
              })
            }
            title={preset.label}
            aria-label={`Theme: ${preset.label}`}
          >
            <span
              className="preset-dot"
              style={{ background: preset.accent }}
            />
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}
