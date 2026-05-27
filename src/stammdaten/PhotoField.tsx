// photo upload + show-on-cover-page toggle
// the photo data url lives in app state, never persisted to disk

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";

type Props = {
  photoUrl: string | null;
  onChange: (dataUrl: string | null) => void;
};

export function PhotoField({ photoUrl, onChange }: Props) {
  const { stammdaten } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const { photoEnabled } = stammdaten;

  // read the picked file as a data url so we can inline it as an img src
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="editor-section">
      <div className="photo-header">
        <h2>{t("photo.title")}</h2>
        <label className="photo-toggle">
          <input
            type="checkbox"
            checked={photoEnabled}
            onChange={(e) =>
              dispatch({
                type: "STAMM_SET_PHOTO_ENABLED",
                enabled: e.target.checked,
              })
            }
          />
          {t("photo.toggle")}
        </label>
      </div>

      {photoEnabled && (
        <>
          <img
            className="photo-preview"
            src={photoUrl ?? `${import.meta.env.BASE_URL}placeholder_cv.png`}
            alt={t("photo.previewAlt")}
          />
          <p className="helper-text">{t("photo.helper")}</p>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          {photoUrl && (
            <button
              type="button"
              className="row-btn"
              style={{ marginLeft: 8 }}
              onClick={() => onChange(null)}
            >
              {t("photo.remove")}
            </button>
          )}
        </>
      )}
    </section>
  );
}
