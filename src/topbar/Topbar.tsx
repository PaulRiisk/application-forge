// top bar: tab nav on the left, mode + theme + global actions on the right
// most controls have their own component, this is just layout

import { ThemePresets } from "./ThemePresets";
import { ColorPicker } from "./ColorPicker";
import { ModeSwitcher } from "./ModeSwitcher";
import { useUiTheme } from "./useUiTheme";
import "./topbar.css";

export type TabId = "stammdaten" | "anschreiben" | "lebenslauf" | "about";

const TABS: { id: TabId; label: string }[] = [
  { id: "stammdaten", label: "Stammdaten" },
  { id: "anschreiben", label: "Anschreiben" },
  { id: "lebenslauf", label: "Lebenslauf" },
  { id: "about", label: "About Me" },
];

type Props = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => void;
};

export function Topbar({
  activeTab,
  onTabChange,
  onSave,
  onLoad,
  onReset,
  onExport,
}: Props) {
  const [uiTheme, toggleUiTheme] = useUiTheme();
  const isDark = uiTheme === "dark";

  return (
    <header className="topbar">
      <nav className="tab-nav" aria-label="Document tabs">
        {TABS.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              className={`tab-btn${active ? " active" : ""}`}
              onClick={() => onTabChange(t.id)}
              aria-pressed={active}
            >
              {t.label}
            </button>
          );
        })}
      </nav>
      <span className="topbar-spacer" style={{ marginRight: "auto" }} />
      <ModeSwitcher />
      <span className="topbar-divider" />
      <ThemePresets />
      <span className="topbar-divider" />
      <ColorPicker />
      <span className="topbar-divider" />
      <button type="button" onClick={onSave}>
        Save
      </button>
      <button type="button" onClick={onLoad}>
        Load
      </button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
      <button type="button" onClick={onExport}>
        Export PDF
      </button>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleUiTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
      >
        {isDark ? "☀" : "☾"}
      </button>
    </header>
  );
}
