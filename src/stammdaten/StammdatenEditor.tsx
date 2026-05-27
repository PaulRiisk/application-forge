// stammdaten editor: identity (name, title, kurz) + contact rows
// photo, schwerpunkt chips and the cover-page preview arrive in phase 2

import { useApp, useAppDispatch } from "../state/AppContext";
import { TextField } from "../editor/TextField";
import { TextAreaField } from "../editor/TextAreaField";
import { KeyValueList } from "../editor/KeyValueList";

export function StammdatenEditor() {
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
    </div>
  );
}
