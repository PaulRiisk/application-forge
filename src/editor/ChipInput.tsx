// chip input for skill lists: enter or click Add to create a chip
// each chip has its own move-left, move-right and remove buttons

import { useState } from "react";
import { useT } from "../i18n/LocaleContext";
import type { Direction } from "../types";

type Props = {
  items: string[];
  placeholder?: string;
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: Direction) => void;
};

export function ChipInput({
  items,
  placeholder,
  onAdd,
  onRemove,
  onMove,
}: Props) {
  const t = useT();
  const [draft, setDraft] = useState("");

  // local draft to allow Enter-to-submit without trimming on every keystroke
  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    onAdd(value);
    setDraft("");
  };

  return (
    <div>
      <div className="chip-input-row">
        <input
          type="text"
          value={draft}
          placeholder={placeholder ?? t("cv.skill.addItem")}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button type="button" className="row-btn" onClick={submit}>
          {t("chip.addBtn")}
        </button>
      </div>
      <div className="chip-list">
        {items.map((item, i) => (
          <span className="chip-edit" key={i}>
            <button
              type="button"
              className="chip-move"
              disabled={i === 0}
              onClick={() => onMove(i, "up")}
              aria-label={t("row.moveLeft")}
              title={t("row.moveLeft")}
            >
              ◀
            </button>
            <button
              type="button"
              className="chip-move"
              disabled={i === items.length - 1}
              onClick={() => onMove(i, "down")}
              aria-label={t("row.moveRight")}
              title={t("row.moveRight")}
            >
              ▶
            </button>
            {item}
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={t("row.remove")}
              title={t("row.remove")}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
