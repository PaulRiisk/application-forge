// editor for one cover letter: company, recipient block, date, subject,
// reference, body (with markdown toolbar), and an optional signature upload

import { useEffect, useRef, useState } from "react";
import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import type { LetterStatus } from "../types";
import { TextField } from "../editor/TextField";
import { TextAreaField } from "../editor/TextAreaField";
import { EditorSection } from "../editor/EditorSection";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { markdownToPlain } from "../markdown/render";
import { applyPlaceholders } from "./placeholders";

const STATUS_VALUES: LetterStatus[] = ["draft", "sent", "answered"];

type Props = {
  signatureUrl: string | null;
  onSignatureChange: (dataUrl: string | null) => void;
};

export function LetterEditor({ signatureUrl, onSignatureChange }: Props) {
  const { letters, stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const active =
    letters.items.find((l) => l.id === letters.activeId) ?? letters.items[0];

  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  // transient "copied!" feedback for the plain-text copy button
  const [copied, setCopied] = useState(false);
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
      <div className="editor-section" style={{ padding: "14px" }}>
        <p className="helper-text">{t("letters.empty")}</p>
      </div>
    );
  }

  const update = (patch: Partial<typeof active>) => {
    dispatch({ type: "LETTER_UPDATE", patch });
  };

  // the classic duplicate-and-forget mistake: the body (or subject) still
  // names the company of another letter. cheap to detect since every letter
  // lives in the same document
  const activeText = `${active.subject}\n${active.body}`.toLowerCase();
  const activeCompany = active.company.trim().toLowerCase();
  const staleCompanies = [
    ...new Set(
      letters.items
        .filter((l) => l.id !== active.id)
        .map((l) => l.company.trim())
        .filter(
          (c) =>
            c.length > 3 &&
            c.toLowerCase() !== activeCompany &&
            activeText.includes(c.toLowerCase()),
        ),
    ),
  ];

  const handleCopyPlain = async () => {
    const plain = markdownToPlain(
      applyPlaceholders(active.body, active.company),
    );
    try {
      await navigator.clipboard.writeText(plain);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked (permissions); nothing sensible to do
    }
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
      <EditorSection id="sec-letter-sender" title={t("stamm.section.sender")}>
        <label className="photo-toggle">
          <input
            type="checkbox"
            checked={stammdaten.senderEnabled}
            onChange={(e) =>
              dispatch({
                type: "STAMM_SET_SENDER_ENABLED",
                enabled: e.target.checked,
              })
            }
          />
          {t("stamm.sender.toggle")}
        </label>
        <p className="helper-text">{t("stamm.sender.helper")}</p>
        {stammdaten.senderEnabled && (
          <TextAreaField
            id="fld-letter-sender"
            label={t("stamm.sender.label")}
            value={stammdaten.senderAddress}
            placeholder={t("stamm.sender.placeholder")}
            rows={3}
            onChange={(value) =>
              dispatch({ type: "STAMM_SET_SENDER_ADDRESS", value })
            }
          />
        )}
      </EditorSection>

      <EditorSection id="sec-letter-addressee" title={t("letter.section.addressee")}>
        <TextField
          id="fld-letter-company"
          label={t("letter.field.company")}
          value={active.company}
          placeholder={t("letter.field.company.placeholder")}
          onChange={(company) => update({ company })}
        />
        <TextAreaField
          id="fld-letter-recipient"
          label={t("letter.field.recipient")}
          value={active.recipient.join("\n")}
          placeholder={t("letter.field.recipient.placeholder")}
          rows={4}
          onChange={(text) => update({ recipient: text.split("\n") })}
        />
      </EditorSection>

      <EditorSection id="sec-letter-dateCity" title={t("letter.section.dateCity")}>
        <div className="field">
          <label htmlFor="fld-letter-date">{t("letter.field.date")}</label>
          <input
            id="fld-letter-date"
            type="date"
            value={active.date}
            onChange={(e) => update({ date: e.target.value })}
          />
        </div>
        <TextField
          id="fld-letter-cityOverride"
          label={t("letter.field.cityOverride")}
          value={active.cityOverride ?? ""}
          placeholder={t("letter.field.cityOverride.placeholder")}
          onChange={(v) => update({ cityOverride: v === "" ? null : v })}
        />
      </EditorSection>

      <EditorSection id="sec-letter-subject" title={t("letter.section.subject")}>
        <TextField
          id="fld-letter-subject"
          label={t("letter.field.subject")}
          value={active.subject}
          placeholder={t("letter.field.subject.placeholder")}
          onChange={(subject) => update({ subject })}
        />
        <TextField
          id="fld-letter-reference"
          label={t("letter.field.reference")}
          value={active.reference}
          placeholder={t("letter.field.reference.placeholder")}
          onChange={(reference) => update({ reference })}
        />
      </EditorSection>

      <EditorSection id="sec-letter-body" title={t("letter.section.body")}>
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
        {staleCompanies.length > 0 && (
          <p className="helper-text helper-warning">
            {t("letter.warn.company", staleCompanies.join(", "))}
          </p>
        )}
        <button type="button" className="row-btn" onClick={handleCopyPlain}>
          {copied ? t("letter.copyPlain.done") : t("letter.copyPlain")}
        </button>
      </EditorSection>

      <EditorSection id="sec-letter-status" title={t("letter.section.status")}>
        <div className="field">
          <label htmlFor="fld-letter-status">{t("letter.section.status")}</label>
          <select
            id="fld-letter-status"
            value={active.status}
            onChange={(e) =>
              dispatch({
                type: "LETTERS_SET_STATUS",
                id: active.id,
                status: e.target.value as LetterStatus,
              })
            }
          >
            {STATUS_VALUES.map((s) => (
              <option key={s} value={s}>
                {t(`letter.status.${s}`)}
              </option>
            ))}
          </select>
        </div>
        <p className="helper-text">{t("letter.status.helper")}</p>
      </EditorSection>

      <EditorSection title={t("letter.field.showAnlagen")}>
        <label className="photo-toggle">
          <input
            type="checkbox"
            checked={active.showAnlagen}
            onChange={(e) => update({ showAnlagen: e.target.checked })}
          />
          {t("letter.field.showAnlagen")}
        </label>
      </EditorSection>

      <EditorSection id="sec-letter-signature" title={t("letter.section.signature")} defaultOpen={false}>
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
      </EditorSection>
    </>
  );
}
