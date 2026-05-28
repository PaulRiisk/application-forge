// top bar: logo + breadcrumb left, search centre, icon-actions right

import { useRef, useState, useEffect, useCallback } from "react";
import {
  FilePlus,
  Save,
  Upload,
  FileDown,
  SlidersHorizontal,
  Languages,
  Sun,
  Moon,
} from "lucide-react";
import { useUiTheme } from "./useUiTheme";
import { useLocale } from "../i18n/LocaleContext";
import { useApp, useAppDispatch } from "../state/AppContext";
import { PRESETS, PRESET_ORDER } from "../theme/presets";
import type { LayoutMode } from "../types";
import "./topbar.css";

export type TabId = "stammdaten" | "anschreiben" | "lebenslauf" | "about";

const TAB_LABELS: Record<TabId, { de: string; en: string }> = {
  stammdaten: { de: "Stammdaten", en: "Personal info" },
  anschreiben: { de: "Anschreiben", en: "Cover letter" },
  lebenslauf: { de: "Lebenslauf", en: "CV" },
  about: { de: "Über mich", en: "About me" },
};

const LOCALE_LABELS: Record<string, { de: string; en: string }> = {
  de: { de: "Deutsch", en: "German" },
  en: { de: "Englisch", en: "English" },
};

type Props = {
  activeTab: TabId;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => void;
};

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, cb]);
}

export function Topbar({ activeTab, onSave, onLoad, onReset, onExport }: Props) {
  const [uiTheme, toggleUiTheme] = useUiTheme();
  const isDark = uiTheme === "dark";
  const { locale, toggleLocale } = useLocale();

  const [designOpen, setDesignOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const designRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useOutsideClick(designRef, useCallback(() => setDesignOpen(false), []));
  useOutsideClick(langRef, useCallback(() => setLangOpen(false), []));

  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const { theme, mode } = stammdaten;

  const tabLabel = locale === "de"
    ? TAB_LABELS[activeTab].de
    : TAB_LABELS[activeTab].en;

  return (
    <header className="topbar">
      {/* left: logo + breadcrumb */}
      <div className="topbar-brand">
        <div className="topbar-logo" aria-hidden="true">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} width="24" height="24" alt="" />
        </div>
        <span className="topbar-appname">Application Forge</span>
        <span className="topbar-breadcrumb-sep" aria-hidden="true">·</span>
        <span className="topbar-active-tab">{tabLabel}</span>
      </div>

      {/* centre: search (decorative / future) */}
      <div className="topbar-search-wrap">
        <div className="topbar-search">
          <svg className="topbar-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="topbar-search-input"
            type="text"
            placeholder={locale === "de" ? "Springe zu Feld, Sektion, Aktion…" : "Jump to field, section, action…"}
            readOnly
          />
          <span className="topbar-search-kbd">
            <kbd>⌘</kbd><kbd>K</kbd>
          </span>
        </div>
      </div>

      {/* right: action icons */}
      <div className="topbar-actions">
        <button
          type="button"
          className="tb-icon-btn"
          onClick={onReset}
          title={locale === "de" ? "Zurücksetzen" : "Reset"}
        >
          <FilePlus size={16} />
        </button>
        <button
          type="button"
          className="tb-icon-btn"
          onClick={onSave}
          title={locale === "de" ? "Speichern" : "Save"}
        >
          <Save size={16} />
        </button>
        <button
          type="button"
          className="tb-icon-btn"
          onClick={onLoad}
          title={locale === "de" ? "Laden" : "Load"}
        >
          <Upload size={16} />
        </button>

        <button
          type="button"
          className="tb-icon-btn tb-icon-btn--primary"
          onClick={onExport}
          title={locale === "de" ? "PDF exportieren" : "Export PDF"}
        >
          <FileDown size={16} />
          <span className="tb-btn-label">{locale === "de" ? "PDF exportieren" : "Export PDF"}</span>
        </button>

        <span className="topbar-divider" />

        {/* design popover */}
        <div className="popover-anchor" ref={designRef}>
          <button
            type="button"
            className={`tb-icon-btn${designOpen ? " tb-icon-btn--active" : ""}`}
            onClick={() => setDesignOpen((v) => !v)}
            title={locale === "de" ? "Design-Einstellungen" : "Design settings"}
          >
            <SlidersHorizontal size={16} />
          </button>

          {designOpen && (
            <div className="popover-panel popover-panel--design">
              <p className="popover-section-label">
                {locale === "de" ? "Modus" : "Mode"}
              </p>
              <div className="mode-switcher">
                {(["dev", "classic"] as LayoutMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`mode-btn${mode === m ? " active" : ""}`}
                    onClick={() => dispatch({ type: "STAMM_SET_MODE", mode: m })}
                  >
                    {m === "dev" ? "Dev" : locale === "de" ? "Klassisch" : "Classic"}
                  </button>
                ))}
              </div>

              <p className="popover-section-label" style={{ marginTop: 14 }}>
                {locale === "de" ? "Theme-Preset" : "Theme preset"}
              </p>
              <div className="theme-presets">
                {PRESET_ORDER.map((key) => {
                  const preset = PRESETS[key];
                  const active = theme.preset === key && theme.accent === preset.accent;
                  const label = key === "blue"
                    ? (locale === "de" ? "Blau" : "Blue")
                    : key === "teal"
                      ? (locale === "de" ? "Petrol" : "Teal")
                      : (locale === "de" ? "Rost" : "Rust");
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`preset-swatch${active ? " active" : ""}`}
                      onClick={() =>
                        dispatch({ type: "STAMM_SET_THEME_PRESET", preset: key, accent: preset.accent })
                      }
                      title={label}
                    >
                      <span className="preset-dot" style={{ background: preset.accent }} />
                      {label}
                    </button>
                  );
                })}
              </div>

              <p className="popover-section-label" style={{ marginTop: 14 }}>
                {locale === "de" ? "Akzentfarbe" : "Accent color"}
              </p>
              <label className="color-picker">
                <input
                  type="color"
                  value={theme.accent}
                  onChange={(e) =>
                    dispatch({ type: "STAMM_SET_ACCENT", accent: e.target.value })
                  }
                />
                <span className="color-picker-value">{theme.accent}</span>
                <span className="color-picker-custom">
                  {locale === "de" ? "Custom…" : "Custom…"}
                </span>
              </label>
            </div>
          )}
        </div>

        {/* language popover */}
        <div className="popover-anchor" ref={langRef}>
          <button
            type="button"
            className={`tb-icon-btn${langOpen ? " tb-icon-btn--active" : ""}`}
            onClick={() => setLangOpen((v) => !v)}
            title={locale === "de" ? "Sprache" : "Language"}
          >
            <Languages size={16} />
          </button>

          {langOpen && (
            <div className="popover-panel">
              <p className="popover-section-label">UI-Sprache / UI language</p>
              <div className="lang-options">
                {(["de", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`lang-btn${locale === l ? " active" : ""}`}
                    onClick={() => {
                      if (locale !== l) toggleLocale();
                      setLangOpen(false);
                    }}
                  >
                    {LOCALE_LABELS[l][locale as "de" | "en"]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* dark/light toggle */}
        <button
          type="button"
          className="tb-icon-btn"
          onClick={toggleUiTheme}
          title={isDark
            ? (locale === "de" ? "Heller Modus" : "Light mode")
            : (locale === "de" ? "Dunkler Modus" : "Dark mode")}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
