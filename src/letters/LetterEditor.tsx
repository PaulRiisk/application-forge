// editor for one cover letter: company, recipient block, date, subject,
// reference, body (with markdown toolbar), and an optional signature upload

import { useEffect, useRef } from "react";
import { useApp, useAppDispatch } from "../state/AppContext";
import { TextField } from "../editor/TextField";
import { TextAreaField } from "../editor/TextAreaField";
import { MarkdownToolbar } from "./MarkdownToolbar";

type Props = {
  signatureUrl: string | null;
  onSignatureChange: (dataUrl: string | null) => void;
};

export function LetterEditor({ signatureUrl, onSignatureChange }: Props) {
  const { letters } = useApp();
  const dispatch = useAppDispatch();
  const active =
    letters.items.find((l) => l.id === letters.activeId) ?? letters.items[0];

  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  // when the toolbar rewrites the body, restore the selection after the
  // controlled re-render so the user can keep typing or click another marker
  const pendingSelection = useRef<{ start: number; end: number } | null>(null);
  useEffect(() => {
    if (pendingSelection.current && bodyRef.current) {
      const { start, end } = pendingSelection.current;
      bodyRef.current.focus();
      bodyRef.current.setSelectionRange(start, end);
      pendingSelection.current = null;
    }
  }, [active?.body]);

  if (!active) {
    return (
      <section className="editor-section">
        <p className="helper-text">No letter selected.</p>
      </section>
    );
  }

  const update = (patch: Partial<typeof active>) => {
    dispatch({ type: "LETTER_UPDATE", patch });
  };

  const handleSignatureFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onSignatureChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <section className="editor-section">
        <h2>Addressee</h2>
        <TextField
          label="Company (for filename + cover page)"
          value={active.company}
          placeholder="Company GmbH"
          onChange={(company) => update({ company })}
        />
        <TextAreaField
          label="Recipient block (one line each)"
          value={active.recipient.join("\n")}
          placeholder={"Company GmbH\nRecipient Name\nStreet 1\n12345 City"}
          rows={4}
          onChange={(text) => update({ recipient: text.split("\n") })}
        />
      </section>

      <section className="editor-section">
        <h2>Date & city</h2>
        <div className="field">
          <label>Date</label>
          <input
            type="date"
            value={active.date}
            onChange={(e) => update({ date: e.target.value })}
          />
        </div>
        <TextField
          label="City override (optional, defaults to stammdaten location)"
          value={active.cityOverride ?? ""}
          placeholder="leave empty to use stammdaten city"
          onChange={(v) => update({ cityOverride: v === "" ? null : v })}
        />
      </section>

      <section className="editor-section">
        <h2>Subject</h2>
        <TextField
          label="Subject line"
          value={active.subject}
          placeholder="Bewerbung als ..."
          onChange={(subject) => update({ subject })}
        />
        <TextField
          label="Reference (optional)"
          value={active.reference}
          placeholder="Referenz-ID: 2026-WS-042 · Ihre Anzeige auf LinkedIn"
          onChange={(reference) => update({ reference })}
        />
      </section>

      <section className="editor-section">
        <h2>Body</h2>
        <MarkdownToolbar
          textareaRef={bodyRef}
          value={active.body}
          onChange={(body, selection) => {
            pendingSelection.current = selection;
            update({ body });
          }}
        />
        <textarea
          ref={bodyRef}
          className="body-textarea"
          value={active.body}
          rows={14}
          placeholder={"Sehr geehrte Frau Mustermann,\n\nals dualer Student..."}
          onChange={(e) => update({ body: e.target.value })}
        />
        <p className="helper-text">
          Toolbar inserts markdown markers: <code>**bold**</code>,{" "}
          <code>_italic_</code>, <code>- bullet</code>. Blank line = paragraph
          break.
        </p>
      </section>

      <section className="editor-section">
        <h2>Signature image (optional)</h2>
        {signatureUrl && (
          <img
            className="signature-preview"
            src={signatureUrl}
            alt="Signature preview"
          />
        )}
        <p className="helper-text">
          Signature is not saved with your data — re-upload after loading a
          saved file.
        </p>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleSignatureFile(file);
            e.target.value = "";
          }}
        />
        {signatureUrl && (
          <button
            type="button"
            className="row-btn"
            style={{ marginLeft: 8 }}
            onClick={() => onSignatureChange(null)}
          >
            Remove signature
          </button>
        )}
      </section>
    </>
  );
}
