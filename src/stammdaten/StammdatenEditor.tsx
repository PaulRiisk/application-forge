// stammdaten editor: identity (name, title, kurz), contact rows, photo,
// schwerpunkt chip group

import { useApp, useAppDispatch } from "../state/AppContext";
import { TextField } from "../editor/TextField";
import { TextAreaField } from "../editor/TextAreaField";
import { KeyValueList } from "../editor/KeyValueList";
import { ChipInput } from "../editor/ChipInput";
import { PhotoField } from "./PhotoField";

type Props = {
  photoUrl: string | null;
  onPhotoChange: (dataUrl: string | null) => void;
};

export function StammdatenEditor({ photoUrl, onPhotoChange }: Props) {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();

  return (
    <div className="editor">
      <section className="editor-section">
        <h2>Identity</h2>
        <TextField
          label="Name"
          value={stammdaten.name}
          placeholder="Name Surname"
          onChange={(value) => dispatch({ type: "STAMM_SET_NAME", value })}
        />
        <TextField
          label="Title / subtitle"
          value={stammdaten.title}
          placeholder="your.title / role"
          onChange={(value) => dispatch({ type: "STAMM_SET_TITLE", value })}
        />
        <TextAreaField
          label="Short profile"
          value={stammdaten.kurz}
          placeholder="One or two sentences about your background and focus."
          onChange={(value) => dispatch({ type: "STAMM_SET_KURZ", value })}
        />
      </section>

      <section className="editor-section">
        <h2>Contact</h2>
        <KeyValueList
          rows={stammdaten.contact}
          labelPlaceholder="label"
          valuePlaceholder="value"
          addLabel="Add contact row"
          onAdd={() => dispatch({ type: "STAMM_ADD_CONTACT" })}
          onUpdate={(id, patch) =>
            dispatch({ type: "STAMM_UPDATE_CONTACT", id, patch })
          }
          onRemove={(id) => dispatch({ type: "STAMM_REMOVE_CONTACT", id })}
          onMove={(id, direction) =>
            dispatch({ type: "STAMM_MOVE_CONTACT", id, direction })
          }
        />
      </section>

      <PhotoField photoUrl={photoUrl} onChange={onPhotoChange} />

      <section className="editor-section">
        <h2>Schwerpunkt</h2>
        <TextField
          label="Heading"
          value={stammdaten.schwerpunkt.heading}
          placeholder="schwerpunkt"
          onChange={(heading) =>
            dispatch({ type: "STAMM_RENAME_SCHWERPUNKT", heading })
          }
        />
        <ChipInput
          items={stammdaten.schwerpunkt.items}
          placeholder="Add focus area"
          onAdd={(item) => dispatch({ type: "STAMM_ADD_SCHWERPUNKT_ITEM", item })}
          onRemove={(index) =>
            dispatch({ type: "STAMM_REMOVE_SCHWERPUNKT_ITEM", index })
          }
          onMove={(index, direction) =>
            dispatch({
              type: "STAMM_MOVE_SCHWERPUNKT_ITEM",
              index,
              direction,
            })
          }
        />
      </section>
    </div>
  );
}
