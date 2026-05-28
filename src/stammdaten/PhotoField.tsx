// photo upload + show-on-cover-page toggle

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
        <h2 style={{ border: "none", padding: 0, margin: 0 }}>{t("photo.title")}</h2>
        <label className="photo-toggle">
          <input
            type="checkbox"
            checked={photoEnabled}
            onChange={(e) =>
              dispatch({ type: "STAMM_SET_PHOTO_ENABLED", enabled: e.target.checked })
            }
          />
          {t("photo.toggle")}
        </label>
      </div>

      {photoEnabled && (
        <div className="photo-body">
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
        </div>
      )}
    </section>
  );
}
