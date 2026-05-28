// modal for the Reset action: pick the seed language for the fresh defaults
// reset reseeds editable content in that language and presets templateLocale

import type { DocLocale } from "../types";
import { useT } from "../i18n/LocaleContext";

type Props = {
  open: boolean;
  onCancel: () => void;
  onReset: (locale: DocLocale) => void;
};

export function ResetDialog({ open, onCancel, onReset }: Props) {
  const t = useT();
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t("reset.title")}
      onClick={onCancel}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t("reset.title")}</h2>
        <p className="helper-text">{t("reset.helper")}</p>
        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            {t("reset.cancel")}
          </button>
          <button type="button" onClick={() => onReset("de")}>
            {t("reset.de")}
          </button>
          <button type="button" onClick={() => onReset("en")}>
            {t("reset.en")}
          </button>
        </div>
      </div>
    </div>
  );
}
