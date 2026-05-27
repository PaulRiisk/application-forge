// top-level component: topbar + active tab body + preview pane
// app owns photo + signature (memory only) and zoom state
// also hosts the offscreen export tree so the export dialog can snapshot all four

import { useRef, useState } from "react";
import { Topbar, type TabId } from "./topbar/Topbar";
import { StammdatenEditor } from "./stammdaten/StammdatenEditor";
import { CoverPagePreview } from "./stammdaten/CoverPagePreview";
import { LettersTab } from "./letters/LettersTab";
import { LetterPreview } from "./letters/LetterPreview";
import { CvEditor } from "./cv/CvEditor";
import { CvPreview } from "./cv/CvPreview";
import { AboutEditor } from "./about/AboutEditor";
import { AboutPreview } from "./about/AboutPreview";
import { PreviewShell } from "./preview/PreviewShell";
import { PreviewToolbar } from "./preview/PreviewToolbar";
import { ExportDialog, type ExportSelection } from "./topbar/ExportDialog";
import { ExportHost, type ExportRefs } from "./pdf/ExportHost";
import {
  exportApplicationPdf,
  slugify,
  type ExportPage,
} from "./pdf/exportPdf";
import { useApp, useAppDispatch } from "./state/AppContext";
import { useT } from "./i18n/LocaleContext";
import {
  clearLocalStorage,
  downloadJson,
  readJsonFile,
} from "./state/persistence";

// wait one animation frame so layout flushes after a state change
function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>("stammdaten");

  // photo and signature live in app state only, never in the document
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.75);
  const [exportOpen, setExportOpen] = useState(false);

  const doc = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const exportRefs = useRef<ExportRefs>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => downloadJson(doc);

  const handleLoad = () => fileInputRef.current?.click();

  const handleLoadFile = async (file: File) => {
    try {
      const loaded = await readJsonFile(file);
      dispatch({ type: "LOAD_DOCUMENT", doc: loaded });
      // photo and signature aren't in the document — clear so the user knows
      // to re-upload after loading a saved file
      setPhotoUrl(null);
      setSignatureUrl(null);
    } catch (err) {
      // persistence.ts rejects with a translation key as the error message
      const key = err instanceof Error ? err.message : "app.load.fallback";
      window.alert(t(key));
    }
  };

  const handleReset = () => {
    if (!window.confirm(t("app.resetConfirm"))) {
      return;
    }
    clearLocalStorage();
    setPhotoUrl(null);
    setSignatureUrl(null);
    dispatch({ type: "RESET" });
  };

  // build filename from §6 of the plan
  const buildFilename = (sel: ExportSelection): string => {
    const nameSlug = slugify(doc.stammdaten.name);
    const all = sel.deckblatt && sel.anschreiben && sel.lebenslauf && sel.about;
    if (all) return `${nameSlug}-application.pdf`;
    const onlyLetter =
      !sel.deckblatt && sel.anschreiben && !sel.lebenslauf && !sel.about;
    if (onlyLetter) {
      const letter = doc.letters.items.find((l) => l.id === sel.letterId);
      const companySlug = slugify(letter?.company ?? "company");
      return `${nameSlug}-anschreiben-${companySlug}.pdf`;
    }
    const parts: string[] = [];
    if (sel.deckblatt) parts.push("deckblatt");
    if (sel.anschreiben) parts.push("anschreiben");
    if (sel.lebenslauf) parts.push("lebenslauf");
    if (sel.about) parts.push("about");
    return `${nameSlug}-${parts.join("-")}.pdf`;
  };

  // run the export pipeline: switch active letter if needed, snapshot all
  // chosen previews, restore active letter, save the pdf
  const runExport = async (sel: ExportSelection) => {
    setExportOpen(false);

    const previousActive = doc.letters.activeId;
    const needLetterSwitch =
      sel.anschreiben && sel.letterId !== previousActive;
    if (needLetterSwitch) {
      dispatch({ type: "LETTERS_SET_ACTIVE", id: sel.letterId });
    }

    // give react two frames to commit + browser to lay out the offscreen tree
    await nextFrame();
    await nextFrame();

    const refs = exportRefs.current;
    if (!refs) {
      window.alert(t("export.hostNotMounted"));
      return;
    }

    const order: { key: keyof ExportRefs; flag: boolean }[] = [
      { key: "deckblatt", flag: sel.deckblatt },
      { key: "anschreiben", flag: sel.anschreiben },
      { key: "lebenslauf", flag: sel.lebenslauf },
      { key: "about", flag: sel.about },
    ];

    const pages: ExportPage[] = [];
    for (const { key, flag } of order) {
      if (!flag) continue;
      const el = refs[key];
      if (el) {
        // suppress the A4 overflow indicator while exporting
        el.classList.add("pdf-exporting");
        pages.push({ element: el, key });
      }
    }

    try {
      await exportApplicationPdf(pages, buildFilename(sel));
    } catch (err) {
      // exportPdf.ts throws translation keys; fall back to the generic msg
      const key = err instanceof Error ? err.message : "export.failed";
      window.alert(t(key));
    } finally {
      pages.forEach((p) => p.element.classList.remove("pdf-exporting"));
      if (needLetterSwitch) {
        dispatch({ type: "LETTERS_SET_ACTIVE", id: previousActive });
      }
    }
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
        onExport={() => setExportOpen(true)}
      />

      {/* hidden file input opened by the Load button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleLoadFile(file);
          e.target.value = "";
        }}
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
          {activeTab === "lebenslauf" && <CvEditor />}
          {activeTab === "about" && <AboutEditor />}
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
          {activeTab === "lebenslauf" && (
            <>
              <PreviewToolbar zoom={zoom} onZoomChange={setZoom} />
              <PreviewShell zoom={zoom} pageClass="lebenslauf">
                <CvPreview photoUrl={photoSrc} />
              </PreviewShell>
            </>
          )}
          {activeTab === "about" && (
            <>
              <PreviewToolbar zoom={zoom} onZoomChange={setZoom} />
              <PreviewShell zoom={zoom} pageClass="aboutme">
                <AboutPreview />
              </PreviewShell>
            </>
          )}
        </section>
      </main>

      {/* offscreen tree used only by the export pipeline */}
      <ExportHost
        ref={exportRefs}
        photoUrl={photoSrc}
        signatureUrl={signatureUrl}
      />

      <ExportDialog
        open={exportOpen}
        onCancel={() => setExportOpen(false)}
        onExport={runExport}
      />
    </div>
  );
}

export default App;
