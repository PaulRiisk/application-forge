// reusable list of label/value rows with move + remove buttons
// shared by contact rows and (later) sidebar section rows

import { useT } from "../i18n/LocaleContext";
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
  labelPlaceholder,
  valuePlaceholder,
  onUpdate,
  onRemove,
  onMove,
  onAdd,
  addLabel,
}: Props) {
  const t = useT();
  return (
    <div>
      {rows.map((row, i) => (
        <div className="kv-row" key={row.id}>
          <input
            type="text"
            value={row.label}
            placeholder={labelPlaceholder ?? t("stamm.contact.labelPlaceholder")}
            onChange={(e) => onUpdate(row.id, { label: e.target.value })}
          />
          <input
            type="text"
            value={row.value}
            placeholder={valuePlaceholder ?? t("stamm.contact.valuePlaceholder")}
            onChange={(e) => onUpdate(row.id, { value: e.target.value })}
          />
          <button
            type="button"
            className="row-btn"
            disabled={i === 0}
            onClick={() => onMove(row.id, "up")}
            aria-label={t("row.moveUp")}
            title={t("row.moveUp")}
          >
            ↑
          </button>
          <button
            type="button"
            className="row-btn"
            disabled={i === rows.length - 1}
            onClick={() => onMove(row.id, "down")}
            aria-label={t("row.moveDown")}
            title={t("row.moveDown")}
          >
            ↓
          </button>
          <button
            type="button"
            className="row-btn danger"
            onClick={() => onRemove(row.id)}
            aria-label={t("row.remove")}
            title={t("row.remove")}
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" className="add-btn" onClick={onAdd}>
        + {addLabel ?? t("kv.addBtn")}
      </button>
    </div>
  );
}
