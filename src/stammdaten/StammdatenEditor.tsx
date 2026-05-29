// stammdaten editor: identity (name, title, kurz), contact rows, photo,
// schwerpunkt chip group, shared anlagen list

import { useState } from "react";
import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import { TextField } from "../editor/TextField";
import { TextAreaField } from "../editor/TextAreaField";
import { KeyValueList } from "../editor/KeyValueList";
import { ChipInput } from "../editor/ChipInput";
import { EditorSection } from "../editor/EditorSection";
import { PhotoField } from "./PhotoField";

type Props = {
  photoUrl: string | null;
  onPhotoChange: (dataUrl: string | null) => void;
};

export function StammdatenEditor({ photoUrl, onPhotoChange }: Props) {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const [anlageDraft, setAnlageDraft] = useState("");

  const submitAnlage = () => {
    const item = anlageDraft.trim();
    if (!item) return;
    dispatch({ type: "STAMM_ADD_ANLAGE", item });
    setAnlageDraft("");
  };

  return (
    <div className="editor">
      <EditorSection id="sec-stamm-docLocale" title={t("stamm.section.docLocale")}>
        <div className="field">
          <label>{t("stamm.docLocale.label")}</label>
          <select
            value={stammdaten.templateLocale}
            onChange={(e) =>
              dispatch({
                type: "STAMM_SET_TEMPLATE_LOCALE",
                locale: e.target.value as "de" | "en",
              })
            }
          >
            <option value="de">{t("stamm.docLocale.de")}</option>
            <option value="en">{t("stamm.docLocale.en")}</option>
          </select>
        </div>
        <p className="helper-text">{t("stamm.docLocale.helper")}</p>
      </EditorSection>

      <EditorSection id="sec-stamm-identity" title={t("stamm.section.identity")}>
        <TextField
          id="fld-stamm-name"
          label={t("stamm.field.name")}
          value={stammdaten.name}
          placeholder={t("stamm.field.name.placeholder")}
          onChange={(value) => dispatch({ type: "STAMM_SET_NAME", value })}
        />
        <TextField
          id="fld-stamm-title"
          label={t("stamm.field.title")}
          value={stammdaten.title}
          placeholder={t("stamm.field.title.placeholder")}
          onChange={(value) => dispatch({ type: "STAMM_SET_TITLE", value })}
        />
        <TextAreaField
          id="fld-stamm-kurz"
          label={t("stamm.field.kurz")}
          value={stammdaten.kurz}
          placeholder={t("stamm.field.kurz.placeholder")}
          onChange={(value) => dispatch({ type: "STAMM_SET_KURZ", value })}
        />
      </EditorSection>

      <EditorSection id="sec-stamm-contact" title={t("stamm.section.contact")}>
        <KeyValueList
          rows={stammdaten.contact}
          labelPlaceholder={t("stamm.contact.labelPlaceholder")}
          valuePlaceholder={t("stamm.contact.valuePlaceholder")}
          addLabel={t("stamm.contact.add")}
          onAdd={() => dispatch({ type: "STAMM_ADD_CONTACT" })}
          onUpdate={(id, patch) =>
            dispatch({ type: "STAMM_UPDATE_CONTACT", id, patch })
          }
          onRemove={(id) => dispatch({ type: "STAMM_REMOVE_CONTACT", id })}
          onMove={(id, direction) =>
            dispatch({ type: "STAMM_MOVE_CONTACT", id, direction })
          }
        />
      </EditorSection>

      <PhotoField photoUrl={photoUrl} onChange={onPhotoChange} />

      <EditorSection id="sec-stamm-schwerpunkt" title={t("stamm.section.schwerpunkt")}>
        <TextField
          id="fld-stamm-schwerpunkt-heading"
          label={t("stamm.schwerpunkt.heading")}
          value={stammdaten.schwerpunkt.heading}
          placeholder={t("stamm.schwerpunkt.headingPlaceholder")}
          onChange={(heading) =>
            dispatch({ type: "STAMM_RENAME_SCHWERPUNKT", heading })
          }
        />
        <ChipInput
          items={stammdaten.schwerpunkt.items}
          placeholder={t("stamm.schwerpunkt.addPlaceholder")}
          onAdd={(item) => dispatch({ type: "STAMM_ADD_SCHWERPUNKT_ITEM", item })}
          onRemove={(index) =>
            dispatch({ type: "STAMM_REMOVE_SCHWERPUNKT_ITEM", index })
          }
          onMove={(index, direction) =>
            dispatch({
              type: "STAMM_MOVE_SCHWERPUNKT_ITEM",
              index,
              direction,
            })
          }
        />
      </EditorSection>

      <EditorSection id="sec-stamm-anlagen" title={t("stamm.section.anlagen")}>
        <p className="helper-text">{t("stamm.anlagen.helper")}</p>
        <div className="chip-input-row">
          <input
            type="text"
            value={anlageDraft}
            placeholder={t("stamm.anlagen.addPlaceholder")}
            onChange={(e) => setAnlageDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitAnlage();
              }
            }}
          />
          <button type="button" className="row-btn" onClick={submitAnlage}>
            {t("chip.addBtn")}
          </button>
        </div>
        {stammdaten.anlagen.map((anlage, i) => (
          <div className="kv-row" key={i}>
            <input
              type="text"
              style={{ gridColumn: "1 / 3" }}
              value={anlage}
              placeholder={t("stamm.anlagen.itemPlaceholder")}
              onChange={(e) =>
                dispatch({
                  type: "STAMM_UPDATE_ANLAGE",
                  index: i,
                  value: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="row-btn"
              disabled={i === 0}
              onClick={() =>
                dispatch({ type: "STAMM_MOVE_ANLAGE", index: i, direction: "up" })
              }
              aria-label={t("row.moveUp")}
              title={t("row.moveUp")}
            >
              ↑
            </button>
            <button
              type="button"
              className="row-btn"
              disabled={i === stammdaten.anlagen.length - 1}
              onClick={() =>
                dispatch({
                  type: "STAMM_MOVE_ANLAGE",
                  index: i,
                  direction: "down",
                })
              }
              aria-label={t("row.moveDown")}
              title={t("row.moveDown")}
            >
              ↓
            </button>
            <button
              type="button"
              className="row-btn danger"
              onClick={() => dispatch({ type: "STAMM_REMOVE_ANLAGE", index: i })}
              aria-label={t("row.remove")}
              title={t("row.remove")}
            >
              ×
            </button>
          </div>
        ))}
      </EditorSection>
    </div>
  );
}
