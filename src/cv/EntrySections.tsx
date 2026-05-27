// cv entry sections (experience, education, ...), each holds a list of entries

import { useApp, useAppDispatch } from "../state/AppContext";
import { EntryEditor } from "./EntryEditor";

export function EntrySections() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();
  const { entrySections } = cv;

  return (
    <>
      {entrySections.map((section, sectionIndex) => (
        <div className="editor-section" key={section.id}>
          <div className="entry-section-header">
            <input
              type="text"
              value={section.heading}
              placeholder="section heading"
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
              title="Move section up"
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
              title="Move section down"
            >
              ↓
            </button>
            <button
              type="button"
              className="row-btn danger"
              onClick={() =>
                dispatch({ type: "CV_REMOVE_ENTRY_SECTION", id: section.id })
              }
              title="Remove section"
            >
              ×
            </button>
          </div>

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
            + Add entry
          </button>
        </div>
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() => dispatch({ type: "CV_ADD_ENTRY_SECTION" })}
      >
        + Add entry section
      </button>
    </>
  );
}
