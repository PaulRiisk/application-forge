// letters tab editor pane: list at the top, active-letter editor below
// the right pane (preview) is owned by App.tsx so it can share the zoom toolbar

import { LetterList } from "./LetterList";
import { LetterEditor } from "./LetterEditor";

type Props = {
  signatureUrl: string | null;
  onSignatureChange: (dataUrl: string | null) => void;
};

export function LettersTab({ signatureUrl, onSignatureChange }: Props) {
  return (
    <div className="editor">
      <LetterList />
      <LetterEditor
        signatureUrl={signatureUrl}
        onSignatureChange={onSignatureChange}
      />
    </div>
  );
}
