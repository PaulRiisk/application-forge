// native color input wired to the accent token

import { useApp, useAppDispatch } from "../state/AppContext";

export function ColorPicker() {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();

  return (
    <label className="color-picker" title="Accent color">
      <span>Accent</span>
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
