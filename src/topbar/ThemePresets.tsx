// preset color buttons (Blue / Teal / Rust)
// active state checks both the preset id and the accent, so the picker
// overriding the accent makes the preset look inactive

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import { PRESETS, PRESET_ORDER } from "../theme/presets";

const LABEL_KEYS = {
  blue: "topbar.theme.blue",
  teal: "topbar.theme.teal",
  rust: "topbar.theme.rust",
} as const;

export function ThemePresets() {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const { theme } = stammdaten;

  return (
    <div className="theme-presets" role="group" aria-label={t("topbar.theme.aria")}>
      {PRESET_ORDER.map((key) => {
        const preset = PRESETS[key];
        const active = theme.preset === key && theme.accent === preset.accent;
        const label = t(LABEL_KEYS[key]);
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
            title={label}
            aria-label={`${t("topbar.theme.alias")}: ${label}`}
          >
            <span
              className="preset-dot"
              style={{ background: preset.accent }}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
