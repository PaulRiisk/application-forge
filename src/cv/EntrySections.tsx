// cv entry sections (experience, education, ...), each holds a list of entries

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import { EntryEditor } from "./EntryEditor";

export function EntrySections() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const { entrySections } = cv;

  return (
    <>
      {entrySections.map((section, sectionIndex) => (
        <div className="editor-section" key={section.id}>
          <div className="entry-section-header" style={{ padding: "10px 14px", borderBottom: "1px solid var(--ui-border)", marginBottom: 0 }}>
            <input
              type="text"
              value={section.heading}
              placeholder={t("cv.entry.sectionHeadingPlaceholder")}
              onChange={(e) =>
                dispatch({
                  type: "CV_RENAME_ENTRY_SECTION",
                  id: section.id,
                  heading: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="row-btn"
              disabled={sectionIndex === 0}
              onClick={() =>
                dispatch({
                  type: "CV_MOVE_ENTRY_SECTION",
                  id: section.id,
                  direction: "up",
                })
              }
              title={t("cv.entry.moveSectionUp")}
            >
              ↑
            </button>
            <button
              type="button"
              className="row-btn"
              disabled={sectionIndex === entrySections.length - 1}
              onClick={() =>
                dispatch({
                  type: "CV_MOVE_ENTRY_SECTION",
                  id: section.id,
                  direction: "down",
                })
              }
              title={t("cv.entry.moveSectionDown")}
            >
              ↓
            </button>
            <button
              type="button"
              className="row-btn danger"
              onClick={() =>
                dispatch({ type: "CV_REMOVE_ENTRY_SECTION", id: section.id })
              }
              title={t("cv.entry.removeSection")}
            >
              ×
            </button>
          </div>

          <div style={{ padding: "10px 14px 14px" }}>
          {section.entries.map((entry, entryIndex) => (
            <EntryEditor
              key={entry.id}
              entry={entry}
              isFirst={entryIndex === 0}
              isLast={entryIndex === section.entries.length - 1}
              onUpdate={(patch) =>
                dispatch({
                  type: "CV_UPDATE_ENTRY",
                  sectionId: section.id,
                  entryId: entry.id,
                  patch,
                })
              }
              onRemove={() =>
                dispatch({
                  type: "CV_REMOVE_ENTRY",
                  sectionId: section.id,
                  entryId: entry.id,
                })
              }
              onMoveUp={() =>
                dispatch({
                  type: "CV_MOVE_ENTRY",
                  sectionId: section.id,
                  entryId: entry.id,
                  direction: "up",
                })
              }
              onMoveDown={() =>
                dispatch({
                  type: "CV_MOVE_ENTRY",
                  sectionId: section.id,
                  entryId: entry.id,
                  direction: "down",
                })
              }
            />
          ))}
          <button
            type="button"
            className="add-btn"
            onClick={() =>
              dispatch({ type: "CV_ADD_ENTRY", sectionId: section.id })
            }
          >
            {t("cv.entry.addEntry")}
          </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() => dispatch({ type: "CV_ADD_ENTRY_SECTION" })}
      >
        {t("cv.entry.addSection")}
      </button>
    </>
  );
}
