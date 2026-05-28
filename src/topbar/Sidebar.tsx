// vertical tab sidebar with sliding active indicator

import { useRef, useLayoutEffect, useState } from "react";
import { User, Mail, FileText, Info } from "lucide-react";
import { useLocale } from "../i18n/LocaleContext";
import type { TabId } from "./Topbar";
import "./sidebar.css";

const TABS: { id: TabId; icon: React.ReactNode; de: string; en: string }[] = [
  { id: "stammdaten", icon: <User size={18} />, de: "Stamm·", en: "Info" },
  { id: "anschreiben", icon: <Mail size={18} />, de: "Anschr.", en: "Letter" },
  { id: "lebenslauf", icon: <FileText size={18} />, de: "CV", en: "CV" },
  { id: "about", icon: <Info size={18} />, de: "Über", en: "About" },
];

type Props = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function Sidebar({ activeTab, onTabChange }: Props) {
  const { locale } = useLocale();
  const navRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<{ top: number; height: number }>({ top: 0, height: 0 });

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activeBtn = nav.querySelector<HTMLButtonElement>(`[data-tab="${activeTab}"]`);
    if (!activeBtn) return;
    setIndicatorStyle({ top: activeBtn.offsetTop, height: activeBtn.offsetHeight });
  }, [activeTab]);

  return (
    <nav className="sidebar" aria-label="Document tabs">
      <div className="sidebar-tabs" ref={navRef}>
        {/* sliding background pill */}
        <span
          className="sidebar-indicator"
          style={{ top: indicatorStyle.top, height: indicatorStyle.height }}
          aria-hidden="true"
        />
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const label = locale === "de" ? tab.de : tab.en;
          return (
            <button
              key={tab.id}
              type="button"
              data-tab={tab.id}
              className={`sidebar-tab${active ? " active" : ""}`}
              onClick={() => onTabChange(tab.id)}
              aria-pressed={active}
              title={label}
            >
              <span className="sidebar-tab-icon">{tab.icon}</span>
              <span className="sidebar-tab-label">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
