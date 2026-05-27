// cv skill groups: heading + chip list each, reorderable

import { useApp, useAppDispatch } from "../state/AppContext";
import { ChipInput } from "../editor/ChipInput";

export function SkillGroups() {
  const { cv } = useApp();
  const dispatch = useAppDispatch();
  const { skillGroups } = cv;

  return (
    <div className="editor-section">
      <h2>Skills</h2>
      {skillGroups.map((group, i) => (
        <div className="skill-group" key={group.id}>
          <div className="skill-group-header">
            <input
              type="text"
              value={group.heading}
              placeholder="group heading"
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
              title="Move group up"
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
              title="Move group down"
            >
              ↓
            </button>
            <button
              type="button"
              className="row-btn danger"
              onClick={() =>
                dispatch({ type: "CV_REMOVE_SKILL_GROUP", id: group.id })
              }
              title="Remove group"
            >
              ×
            </button>
          </div>
          <ChipInput
            items={group.items}
            placeholder="Add skill"
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
        + Add skill group
      </button>
    </div>
  );
}
