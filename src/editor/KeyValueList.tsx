// reusable list of label/value rows with move + remove buttons
// shared by contact rows and (later) sidebar section rows

import type { Direction } from "../types";

type Row = { id: string; label: string; value: string };

type Props = {
  rows: Row[];
  labelPlaceholder?: string;
  valuePlaceholder?: string;
  onUpdate: (id: string, patch: Partial<Omit<Row, "id">>) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: Direction) => void;
  onAdd: () => void;
  addLabel?: string;
};

export function KeyValueList({
  rows,
  labelPlaceholder = "label",
  valuePlaceholder = "value",
  onUpdate,
  onRemove,
  onMove,
  onAdd,
  addLabel = "Add row",
}: Props) {
  return (
    <div>
      {rows.map((row, i) => (
        <div className="kv-row" key={row.id}>
          <input
            type="text"
            value={row.label}
            placeholder={labelPlaceholder}
            onChange={(e) => onUpdate(row.id, { label: e.target.value })}
          />
          <input
            type="text"
            value={row.value}
            placeholder={valuePlaceholder}
            onChange={(e) => onUpdate(row.id, { value: e.target.value })}
          />
          <button
            type="button"
            className="row-btn"
            disabled={i === 0}
            onClick={() => onMove(row.id, "up")}
            aria-label="Move up"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            className="row-btn"
            disabled={i === rows.length - 1}
            onClick={() => onMove(row.id, "down")}
            aria-label="Move down"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            className="row-btn danger"
            onClick={() => onRemove(row.id)}
            aria-label="Remove"
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={onAdd}>
        + {addLabel}
      </button>
    </div>
  );
}
