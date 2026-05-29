// cv skill groups: heading + chip list each, reorderable

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import { ChipInput } from "../editor/ChipInput";

export function SkillGroups() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const { skillGroups } = cv;

  return (
    <div className="editor-section" id="sec-cv-skills">
      <h2>{t("cv.section.skills")}</h2>
      <div style={{ padding: "10px 14px 14px" }}>
      {skillGroups.map((group, i) => (
        <div className="skill-group" key={group.id}>
          <div className="skill-group-header">
            <input
              type="text"
              value={group.heading}
              placeholder={t("cv.skill.groupHeadingPlaceholder")}
              onChange={(e) =>
                dispatch({
                  type: "CV_RENAME_SKILL_GROUP",
                  id: group.id,
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
                  type: "CV_MOVE_SKILL_GROUP",
                  id: group.id,
                  direction: "up",
                })
              }
              title={t("cv.skill.moveGroupUp")}
            >
              ↑
            </button>
            <button
              type="button"
              className="row-btn"
              disabled={i === skillGroups.length - 1}
              onClick={() =>
                dispatch({
                  type: "CV_MOVE_SKILL_GROUP",
                  id: group.id,
                  direction: "down",
                })
              }
              title={t("cv.skill.moveGroupDown")}
            >
              ↓
            </button>
            <button
              type="button"
              className="row-btn danger"
              onClick={() =>
                dispatch({ type: "CV_REMOVE_SKILL_GROUP", id: group.id })
              }
              title={t("cv.skill.removeGroup")}
            >
              ×
            </button>
          </div>
          <ChipInput
            items={group.items}
            placeholder={t("cv.skill.addItem")}
            onAdd={(item) =>
              dispatch({ type: "CV_ADD_SKILL", groupId: group.id, item })
            }
            onRemove={(index) =>
              dispatch({ type: "CV_REMOVE_SKILL", groupId: group.id, index })
            }
            onMove={(index, direction) =>
              dispatch({
                type: "CV_MOVE_SKILL",
                groupId: group.id,
                index,
                direction,
              })
            }
          />
        </div>
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() => dispatch({ type: "CV_ADD_SKILL_GROUP" })}
      >
        {t("cv.skill.addGroup")}
      </button>
      </div>
    </div>
  );
}
