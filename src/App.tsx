// top-level component: topbar + active tab body
// phase 1 only wires the stammdaten editor; other tabs show a placeholder
// preview pane currently shows a json dump until previews arrive in phase 2+

import { useState } from "react";
import { Topbar, type TabId } from "./topbar/Topbar";
import { StammdatenEditor } from "./stammdaten/StammdatenEditor";
import { useApp, useAppDispatch } from "./state/AppContext";
import { clearLocalStorage } from "./state/persistence";

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div className="tab-placeholder">
      {label} editor lands in a later phase.
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("stammdaten");
  const doc = useApp();
  const dispatch = useAppDispatch();

  // phase 1 stubs: real save/load/export wiring lands in later phases
  const handleSave = () => {
    window.alert("Save lands in phase 7.");
  };
  const handleLoad = () => {
    window.alert("Load lands in phase 7.");
  };
  const handleReset = () => {
    if (
      !window.confirm(
        "Reset will discard the current document set and clear saved data. Continue?",
      )
    ) {
      return;
    }
    clearLocalStorage();
    dispatch({ type: "RESET" });
  };
  const handleExport = () => {
    window.alert("Export PDF lands in phase 6.");
  };

  return (
    <div className="app">
      <Topbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        onLoad={handleLoad}
        onReset={handleReset}
        onExport={handleExport}
      />

      <main className="panes">
        <section className="editor-pane" aria-label="Editor">
          {activeTab === "stammdaten" && <StammdatenEditor />}
          {activeTab === "anschreiben" && (
            <TabPlaceholder label="Anschreiben" />
          )}
          {activeTab === "lebenslauf" && (
            <TabPlaceholder label="Lebenslauf" />
          )}
          {activeTab === "about" && <TabPlaceholder label="About Me" />}
        </section>

        <section className="preview-pane" aria-label="Preview">
          <pre className="json-dump" aria-label="Document JSON dump">
            {JSON.stringify(doc, null, 2)}
          </pre>
        </section>
      </main>
    </div>
  );
}

export default App;
