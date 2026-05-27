// top bar: tab nav on the left, mode + theme + global actions on the right
// most controls have their own component, this is just layout

import { ThemePresets } from "./ThemePresets";
import { ColorPicker } from "./ColorPicker";
import { ModeSwitcher } from "./ModeSwitcher";
import { useUiTheme } from "./useUiTheme";
import { useLocale } from "../i18n/LocaleContext";
import "./topbar.css";

export type TabId = "stammdaten" | "anschreiben" | "lebenslauf" | "about";

const TAB_IDS: { id: TabId; labelKey: string }[] = [
  { id: "stammdaten", labelKey: "topbar.tab.stammdaten" },
  { id: "anschreiben", labelKey: "topbar.tab.anschreiben" },
  { id: "lebenslauf", labelKey: "topbar.tab.lebenslauf" },
  { id: "about", labelKey: "topbar.tab.about" },
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
  const { locale, toggleLocale, t } = useLocale();
  const isDe = locale === "de";

  return (
    <header className="topbar">
      <nav className="tab-nav" aria-label={t("topbar.tabs.aria")}>
        {TAB_IDS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn${active ? " active" : ""}`}
              onClick={() => onTabChange(tab.id)}
              aria-pressed={active}
            >
              {t(tab.labelKey)}
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
        {t("topbar.button.save")}
      </button>
      <button type="button" onClick={onLoad}>
        {t("topbar.button.load")}
      </button>
      <button type="button" onClick={onReset}>
        {t("topbar.button.reset")}
      </button>
      <button type="button" onClick={onExport}>
        {t("topbar.button.export")}
      </button>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleLocale}
        aria-label={isDe ? t("topbar.locale.toEn") : t("topbar.locale.toDe")}
        title={isDe ? t("topbar.locale.toEn") : t("topbar.locale.toDe")}
      >
        {isDe ? t("topbar.locale.de") : t("topbar.locale.en")}
      </button>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleUiTheme}
        aria-label={
          isDark ? t("topbar.theme.toLight") : t("topbar.theme.toDark")
        }
        title={
          isDark ? t("topbar.theme.lightTitle") : t("topbar.theme.darkTitle")
        }
      >
        {isDark ? "☀" : "☾"}
      </button>
    </header>
  );
}
