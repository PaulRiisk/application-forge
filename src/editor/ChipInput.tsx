// chip input for skill lists: enter or click Add to create a chip
// each chip has its own move-left, move-right and remove buttons

import { useState } from "react";
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
  placeholder = "Add item",
  onAdd,
  onRemove,
  onMove,
}: Props) {
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
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button type="button" className="row-btn" onClick={submit}>
          Add
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
              aria-label="Move left"
              title="Move left"
            >
              ◀
            </button>
            <button
              type="button"
              className="chip-move"
              disabled={i === items.length - 1}
              onClick={() => onMove(i, "down")}
              aria-label="Move right"
              title="Move right"
            >
              ▶
            </button>
            {item}
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label="Remove"
              title="Remove"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
