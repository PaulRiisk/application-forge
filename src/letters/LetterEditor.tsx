// editor for one cover letter: company, recipient block, date, subject,
// reference, body (with markdown toolbar), and an optional signature upload

import { useEffect, useRef } from "react";
import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
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
  const t = useT();
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
        <p className="helper-text">{t("letters.empty")}</p>
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
        <h2>{t("letter.section.addressee")}</h2>
        <TextField
          label={t("letter.field.company")}
          value={active.company}
          placeholder={t("letter.field.company.placeholder")}
          onChange={(company) => update({ company })}
        />
        <TextAreaField
          label={t("letter.field.recipient")}
          value={active.recipient.join("\n")}
          placeholder={t("letter.field.recipient.placeholder")}
          rows={4}
          onChange={(text) => update({ recipient: text.split("\n") })}
        />
      </section>

      <section className="editor-section">
        <h2>{t("letter.section.dateCity")}</h2>
        <div className="field">
          <label>{t("letter.field.date")}</label>
          <input
            type="date"
            value={active.date}
            onChange={(e) => update({ date: e.target.value })}
          />
        </div>
        <TextField
          label={t("letter.field.cityOverride")}
          value={active.cityOverride ?? ""}
          placeholder={t("letter.field.cityOverride.placeholder")}
          onChange={(v) => update({ cityOverride: v === "" ? null : v })}
        />
      </section>

      <section className="editor-section">
        <h2>{t("letter.section.subject")}</h2>
        <TextField
          label={t("letter.field.subject")}
          value={active.subject}
          placeholder={t("letter.field.subject.placeholder")}
          onChange={(subject) => update({ subject })}
        />
        <TextField
          label={t("letter.field.reference")}
          value={active.reference}
          placeholder={t("letter.field.reference.placeholder")}
          onChange={(reference) => update({ reference })}
        />
      </section>

      <section className="editor-section">
        <h2>{t("letter.section.body")}</h2>
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
          placeholder={t("letter.field.body.placeholder")}
          onChange={(e) => update({ body: e.target.value })}
        />
        <p className="helper-text">{t("letter.body.helper")}</p>
      </section>

      <section className="editor-section">
        <h2>{t("letter.section.signature")}</h2>
        {signatureUrl && (
          <img
            className="signature-preview"
            src={signatureUrl}
            alt={t("letter.signature.previewAlt")}
          />
        )}
        <p className="helper-text">{t("letter.signature.helper")}</p>
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
            {t("letter.signature.remove")}
          </button>
        )}
      </section>
    </>
  );
}
