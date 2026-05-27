// editor for a single experience or education entry
// bullets are stored as an array but edited as one-per-line text

import type { Entry } from "../types";
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
  return (
    <div className="entry-editor">
      <div className="entry-header">
        <button
          type="button"
          className="row-btn"
          disabled={isFirst}
          onClick={onMoveUp}
          title="Move entry up"
        >
          ↑
        </button>
        <button
          type="button"
          className="row-btn"
          disabled={isLast}
          onClick={onMoveDown}
          title="Move entry down"
        >
          ↓
        </button>
        <button
          type="button"
          className="row-btn danger"
          onClick={onRemove}
          title="Remove entry"
        >
          × Remove
        </button>
      </div>
      <TextField
        label="Period"
        value={entry.period}
        onChange={(period) => onUpdate({ period })}
        placeholder="Sep 2023 – present"
      />
      <TextField
        label="Title"
        value={entry.title}
        onChange={(title) => onUpdate({ title })}
        placeholder="Role title"
      />
      <TextField
        label="Place"
        value={entry.place}
        onChange={(place) => onUpdate({ place })}
        placeholder="Organization · City"
      />
      <TextAreaField
        label="Bullets (one per line)"
        value={entry.bullets.join("\n")}
        onChange={(text) =>
          onUpdate({
            bullets: text.split("\n").map((b) => b.replace(/\s+$/, "")),
          })
        }
        placeholder="First bullet&#10;Second bullet"
        rows={3}
      />
    </div>
  );
}
