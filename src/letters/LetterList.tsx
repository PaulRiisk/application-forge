// list of cover letters at the top of the letters tab
// inline rename per entry; per-letter duplicate / delete; one click to switch

import { useState } from "react";
import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";

export function LetterList() {
  const { letters } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();

  // which entry is currently being renamed (id of the letter, null = none)
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");

  const startRename = (id: string, currentLabel: string) => {
    setRenamingId(id);
    setDraftLabel(currentLabel);
  };
  const commitRename = () => {
    if (renamingId !== null) {
      dispatch({
        type: "LETTERS_RENAME",
        id: renamingId,
        label: draftLabel.trim() || t("letters.defaultLabel"),
      });
    }
    setRenamingId(null);
  };

  const handleDelete = (id: string, label: string) => {
    if (!window.confirm(t("letters.deleteConfirm", label))) {
      return;
    }
    dispatch({ type: "LETTERS_REMOVE", id });
  };

  return (
    <section className="editor-section">
      <h2>{t("letters.section")}</h2>
      <div style={{ padding: "10px 14px 14px" }}>
      <ul className="letter-list">
        {letters.items.map((letter) => {
          const active = letter.id === letters.activeId;
          const isRenaming = renamingId === letter.id;
          return (
            <li
              key={letter.id}
              className={`letter-row${active ? " active" : ""}`}
            >
              {isRenaming ? (
                <input
                  className="letter-label-input"
                  autoFocus
                  type="text"
                  value={draftLabel}
                  onChange={(e) => setDraftLabel(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="letter-label"
                  onClick={() =>
                    dispatch({ type: "LETTERS_SET_ACTIVE", id: letter.id })
                  }
                >
                  {letter.label}
                </button>
              )}
              <button
                type="button"
                className="row-btn"
                onClick={() => startRename(letter.id, letter.label)}
                title={t("row.rename")}
                aria-label={t("row.rename")}
              >
                ✎
              </button>
              <button
                type="button"
                className="row-btn"
                onClick={() =>
                  dispatch({ type: "LETTERS_DUPLICATE", id: letter.id })
                }
                title={t("row.duplicate")}
                aria-label={t("row.duplicate")}
              >
                ⧉
              </button>
              <button
                type="button"
                className="row-btn danger"
                onClick={() => handleDelete(letter.id, letter.label)}
                title={t("row.delete")}
                aria-label={t("row.delete")}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="add-btn"
        onClick={() => dispatch({ type: "LETTERS_ADD" })}
      >
        {t("letters.addBtn")}
      </button>
      </div>
    </section>
  );
}
