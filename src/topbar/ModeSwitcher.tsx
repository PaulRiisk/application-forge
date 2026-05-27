// segmented control for the layout mode (dev vs classic)

import { useApp, useAppDispatch } from "../state/AppContext";
import type { LayoutMode } from "../types";

const MODES: { id: LayoutMode; label: string }[] = [
  { id: "dev", label: "Dev" },
  { id: "classic", label: "Classic" },
];

export function ModeSwitcher() {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const mode = stammdaten.mode;

  return (
    <div className="mode-switcher" role="group" aria-label="Layout mode">
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
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
