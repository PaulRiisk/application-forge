// cv sidebar sections (languages etc.), each with key/value rows

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import { KeyValueList } from "../editor/KeyValueList";

export function SidebarSections() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const { sidebarSections } = cv;

  return (
    <div className="editor-section">
      <h2>{t("cv.section.sidebarSections")}</h2>
      {sidebarSections.map((section, i) => (
        <div className="skill-group" key={section.id}>
          <div className="skill-group-header">
            <input
              type="text"
              value={section.heading}
              placeholder={t("cv.sidebar.sectionHeadingPlaceholder")}
              onChange={(e) =>
                dispatch({
                  type: "CV_RENAME_SIDEBAR_SECTION",
                  id: section.id,
                  heading: e.target.value,
                })
              }
            />
            <button
              type="button"
              className="row-btn"
              disabled={i === 0}
              onClick={() =>
                dispatch({
                  type: "CV_MOVE_SIDEBAR_SECTION",
                  id: section.id,
                  direction: "up",
                })
              }
              title={t("cv.sidebar.moveSectionUp")}
            >
              ↑
            </button>
            <button
              type="button"
              className="row-btn"
              disabled={i === sidebarSections.length - 1}
              onClick={() =>
                dispatch({
                  type: "CV_MOVE_SIDEBAR_SECTION",
                  id: section.id,
                  direction: "down",
                })
              }
              title={t("cv.sidebar.moveSectionDown")}
            >
              ↓
            </button>
            <button
              type="button"
              className="row-btn danger"
              onClick={() =>
                dispatch({
                  type: "CV_REMOVE_SIDEBAR_SECTION",
                  id: section.id,
                })
              }
              title={t("cv.sidebar.removeSection")}
            >
              ×
            </button>
          </div>

          <KeyValueList
            rows={section.rows}
            addLabel={t("cv.sidebar.addRow")}
            onUpdate={(rowId, patch) =>
              dispatch({
                type: "CV_UPDATE_SIDEBAR_ROW",
                sectionId: section.id,
                rowId,
                patch,
              })
            }
            onRemove={(rowId) =>
              dispatch({
                type: "CV_REMOVE_SIDEBAR_ROW",
                sectionId: section.id,
                rowId,
              })
            }
            onMove={(rowId, direction) =>
              dispatch({
                type: "CV_MOVE_SIDEBAR_ROW",
                sectionId: section.id,
                rowId,
                direction,
              })
            }
            onAdd={() =>
              dispatch({ type: "CV_ADD_SIDEBAR_ROW", sectionId: section.id })
            }
          />
        </div>
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() => dispatch({ type: "CV_ADD_SIDEBAR_SECTION" })}
      >
        {t("cv.sidebar.addSection")}
      </button>
    </div>
  );
}
