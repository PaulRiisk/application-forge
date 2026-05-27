// offscreen container that holds the four document previews during export
// each preview gets its own ref so the export pipeline can snapshot them
// rendered at zoom=1 and outside the visual flow so it doesn't disturb the UI
// caller controls which letter is active for the anschreiben snapshot

import { forwardRef, useImperativeHandle, useRef } from "react";
import { PreviewShell } from "../preview/PreviewShell";
import { CoverPagePreview } from "../stammdaten/CoverPagePreview";
import { LetterPreview } from "../letters/LetterPreview";
import { CvPreview } from "../cv/CvPreview";
import { AboutPreview } from "../about/AboutPreview";

export type ExportRefs = {
  deckblatt: HTMLDivElement | null;
  anschreiben: HTMLDivElement | null;
  lebenslauf: HTMLDivElement | null;
  about: HTMLDivElement | null;
};

type Props = {
  photoUrl: string;
  signatureUrl: string | null;
};

export const ExportHost = forwardRef<ExportRefs, Props>(function ExportHost(
  { photoUrl, signatureUrl },
  ref,
) {
  const deckblattRef = useRef<HTMLDivElement>(null);
  const anschreibenRef = useRef<HTMLDivElement>(null);
  const lebenslaufRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  // expose all four to the parent so it can hand them to html2canvas
  useImperativeHandle(ref, () => ({
    get deckblatt() {
      return deckblattRef.current;
    },
    get anschreiben() {
      return anschreibenRef.current;
    },
    get lebenslauf() {
      return lebenslaufRef.current;
    },
    get about() {
      return aboutRef.current;
    },
  }));

  return (
    <div className="export-host" aria-hidden="true">
      <PreviewShell ref={deckblattRef} zoom={1} pageClass="deckblatt">
        <CoverPagePreview photoUrl={photoUrl} />
      </PreviewShell>
      <PreviewShell ref={anschreibenRef} zoom={1} pageClass="anschreiben">
        <LetterPreview signatureUrl={signatureUrl} />
      </PreviewShell>
      <PreviewShell ref={lebenslaufRef} zoom={1} pageClass="lebenslauf">
        <CvPreview photoUrl={photoUrl} />
      </PreviewShell>
      <PreviewShell ref={aboutRef} zoom={1} pageClass="aboutme">
        <AboutPreview />
      </PreviewShell>
    </div>
  );
});
