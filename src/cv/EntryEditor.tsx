// editor for a single experience or education entry
// bullets are stored as an array but edited as one-per-line text

import type { Entry } from "../types";
import { useT } from "../i18n/LocaleContext";
import { TextField } from "../editor/TextField";
import { TextAreaField } from "../editor/TextAreaField";

type Props = {
  entry: Entry;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (patch: Partial<Omit<Entry, "id">>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function EntryEditor({
  entry,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  const t = useT();
  return (
    <div className="entry-editor">
      <div className="entry-header">
        <button
          type="button"
          className="row-btn"
          disabled={isFirst}
          onClick={onMoveUp}
          title={t("cv.entry.moveUp")}
        >
          ↑
        </button>
        <button
          type="button"
          className="row-btn"
          disabled={isLast}
          onClick={onMoveDown}
          title={t("cv.entry.moveDown")}
        >
          ↓
        </button>
        <button
          type="button"
          className="row-btn danger"
          onClick={onRemove}
          title={t("cv.entry.removeTitle")}
          aria-label={t("cv.entry.removeTitle")}
        >
          ×
        </button>
      </div>
      <TextField
        label={t("cv.entry.period")}
        value={entry.period}
        onChange={(period) => onUpdate({ period })}
        placeholder={t("cv.entry.period.placeholder")}
      />
      <TextField
        label={t("cv.entry.title")}
        value={entry.title}
        onChange={(title) => onUpdate({ title })}
        placeholder={t("cv.entry.title.placeholder")}
      />
      <TextField
        label={t("cv.entry.place")}
        value={entry.place}
        onChange={(place) => onUpdate({ place })}
        placeholder={t("cv.entry.place.placeholder")}
      />
      <TextAreaField
        label={t("cv.entry.bullets")}
        value={entry.bullets.join("\n")}
        onChange={(text) =>
          onUpdate({
            bullets: text.split("\n").map((b) => b.replace(/\s+$/, "")),
          })
        }
        placeholder={t("cv.entry.bullets.placeholder")}
        rows={3}
      />
    </div>
  );
}
