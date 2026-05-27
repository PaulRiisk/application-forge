// stammdaten editor: identity (name, title, kurz), contact rows, photo,
// schwerpunkt chip group

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
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
  const t = useT();

  return (
    <div className="editor">
      <section className="editor-section">
        <h2>{t("stamm.section.identity")}</h2>
        <TextField
          label={t("stamm.field.name")}
          value={stammdaten.name}
          placeholder={t("stamm.field.name.placeholder")}
          onChange={(value) => dispatch({ type: "STAMM_SET_NAME", value })}
        />
        <TextField
          label={t("stamm.field.title")}
          value={stammdaten.title}
          placeholder={t("stamm.field.title.placeholder")}
          onChange={(value) => dispatch({ type: "STAMM_SET_TITLE", value })}
        />
        <TextAreaField
          label={t("stamm.field.kurz")}
          value={stammdaten.kurz}
          placeholder={t("stamm.field.kurz.placeholder")}
          onChange={(value) => dispatch({ type: "STAMM_SET_KURZ", value })}
        />
      </section>

      <section className="editor-section">
        <h2>{t("stamm.section.contact")}</h2>
        <KeyValueList
          rows={stammdaten.contact}
          labelPlaceholder={t("stamm.contact.labelPlaceholder")}
          valuePlaceholder={t("stamm.contact.valuePlaceholder")}
          addLabel={t("stamm.contact.add")}
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
        <h2>{t("stamm.section.schwerpunkt")}</h2>
        <TextField
          label={t("stamm.schwerpunkt.heading")}
          value={stammdaten.schwerpunkt.heading}
          placeholder={t("stamm.schwerpunkt.headingPlaceholder")}
          onChange={(heading) =>
            dispatch({ type: "STAMM_RENAME_SCHWERPUNKT", heading })
          }
        />
        <ChipInput
          items={stammdaten.schwerpunkt.items}
          placeholder={t("stamm.schwerpunkt.addPlaceholder")}
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
