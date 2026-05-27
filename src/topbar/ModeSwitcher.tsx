// segmented control for the layout mode (dev vs classic)

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import type { LayoutMode } from "../types";

const MODES: { id: LayoutMode; labelKey: string }[] = [
  { id: "dev", labelKey: "topbar.mode.dev" },
  { id: "classic", labelKey: "topbar.mode.classic" },
];

export function ModeSwitcher() {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const mode = stammdaten.mode;
  const t = useT();

  return (
    <div className="mode-switcher" role="group" aria-label={t("topbar.mode.aria")}>
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            className={`mode-btn${active ? " active" : ""}`}
            onClick={() => dispatch({ type: "STAMM_SET_MODE", mode: m.id })}
            aria-pressed={active}
          >
            {t(m.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
