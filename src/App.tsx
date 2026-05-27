// top-level component: topbar + active tab body + preview pane
// app owns the photo url (kept in memory only, never persisted) and zoom state
// each tab decides what its preview is; stammdaten owns the cover page

import { useState } from "react";
import { Topbar, type TabId } from "./topbar/Topbar";
import { StammdatenEditor } from "./stammdaten/StammdatenEditor";
import { CoverPagePreview } from "./stammdaten/CoverPagePreview";
import { LettersTab } from "./letters/LettersTab";
import { LetterPreview } from "./letters/LetterPreview";
import { PreviewShell } from "./preview/PreviewShell";
import { PreviewToolbar } from "./preview/PreviewToolbar";
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

  // photo and signature live in app state only, never in the document
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.75);

  const doc = useApp();
  const dispatch = useAppDispatch();

  // phase 1/2 stubs, real wiring lands in later phases
  const handleSave = () => window.alert("Save lands in phase 7.");
  const handleLoad = () => window.alert("Load lands in phase 7.");
  const handleExport = () => window.alert("Export PDF lands in phase 6.");
  const handleReset = () => {
    if (
      !window.confirm(
        "Reset will discard the current document set and clear saved data. Continue?",
      )
    ) {
      return;
    }
    clearLocalStorage();
    setPhotoUrl(null);
    setSignatureUrl(null);
    dispatch({ type: "RESET" });
  };

  // fall back to the bundled placeholder if no photo is uploaded
  const photoSrc = photoUrl ?? `${import.meta.env.BASE_URL}placeholder_cv.png`;

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
          {activeTab === "stammdaten" && (
            <StammdatenEditor
              photoUrl={photoUrl}
              onPhotoChange={setPhotoUrl}
            />
          )}
          {activeTab === "anschreiben" && (
            <LettersTab
              signatureUrl={signatureUrl}
              onSignatureChange={setSignatureUrl}
            />
          )}
          {activeTab === "lebenslauf" && (
            <TabPlaceholder label="Lebenslauf" />
          )}
          {activeTab === "about" && <TabPlaceholder label="About Me" />}
        </section>

        <section className="preview-pane" aria-label="Preview">
          {activeTab === "stammdaten" && (
            <>
              <PreviewToolbar zoom={zoom} onZoomChange={setZoom} />
              <PreviewShell zoom={zoom} pageClass="deckblatt">
                <CoverPagePreview photoUrl={photoSrc} />
              </PreviewShell>
            </>
          )}
          {activeTab === "anschreiben" && (
            <>
              <PreviewToolbar zoom={zoom} onZoomChange={setZoom} />
              <PreviewShell zoom={zoom} pageClass="anschreiben">
                <LetterPreview signatureUrl={signatureUrl} />
              </PreviewShell>
            </>
          )}
          {(activeTab === "lebenslauf" || activeTab === "about") && (
            <pre className="json-dump" aria-label="Document JSON dump">
              {JSON.stringify(doc, null, 2)}
            </pre>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
