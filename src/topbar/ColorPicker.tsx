// native color input wired to the accent token

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";

export function ColorPicker() {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();

  return (
    <label className="color-picker" title={t("topbar.accent.title")}>
      <span>{t("topbar.accent.label")}</span>
      <input
        type="color"
        value={stammdaten.theme.accent}
        onChange={(e) =>
          dispatch({ type: "STAMM_SET_ACCENT", accent: e.target.value })
        }
      />
    </label>
  );
}
