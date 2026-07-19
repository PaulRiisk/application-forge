// modal for the Export PDF action
// user picks which documents to include and (if anschreiben is in) which letter
// the dialog owns selection state; the parent runs the actual export

import { useState } from "react";
import { useApp } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";

export type ExportSelection = {
  deckblatt: boolean;
  anschreiben: boolean;
  lebenslauf: boolean;
  about: boolean;
  letterId: string;
};

type Props = {
  open: boolean;
  onCancel: () => void;
  onExport: (selection: ExportSelection) => void;
};

export function ExportDialog({ open, onCancel, onExport }: Props) {
  // remount the body on each open so the letter selection re-seeds from the
  // currently active letter without a sync effect
  return open ? <ExportDialogBody onCancel={onCancel} onExport={onExport} /> : null;
}

function ExportDialogBody({ onCancel, onExport }: Omit<Props, "open">) {
  const { letters } = useApp();
  const t = useT();

  const [deckblatt, setDeckblatt] = useState(true);
  const [anschreiben, setAnschreiben] = useState(true);
  const [lebenslauf, setLebenslauf] = useState(true);
  const [about, setAbout] = useState(true);
  const [letterId, setLetterId] = useState(letters.activeId);

  const noneSelected = !deckblatt && !anschreiben && !lebenslauf && !about;

  const handleExport = () => {
    if (noneSelected) return;
    onExport({ deckblatt, anschreiben, lebenslauf, about, letterId });
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t("export.aria")}
      onClick={onCancel}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{t("export.title")}</h2>
        <p className="helper-text">{t("export.helper")}</p>

        <ul className="export-list">
          <li>
            <label>
              <input
                type="checkbox"
                checked={deckblatt}
                onChange={(e) => setDeckblatt(e.target.checked)}
              />
              {t("export.opt.deckblatt")}
            </label>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={anschreiben}
                onChange={(e) => setAnschreiben(e.target.checked)}
              />
              {t("export.opt.anschreiben")}
            </label>
            {anschreiben && (
              <select
                className="letter-select"
                value={letterId}
                onChange={(e) => setLetterId(e.target.value)}
              >
                {letters.items.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            )}
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={lebenslauf}
                onChange={(e) => setLebenslauf(e.target.checked)}
              />
              {t("export.opt.lebenslauf")}
            </label>
          </li>
          <li>
            <label>
              <input
                type="checkbox"
                checked={about}
                onChange={(e) => setAbout(e.target.checked)}
              />
              {t("export.opt.about")}
            </label>
          </li>
        </ul>

        <div className="modal-actions">
          <button type="button" onClick={onCancel}>
            {t("export.cancel")}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={noneSelected}
          >
            {t("export.export")}
          </button>
        </div>
      </div>
    </div>
  );
}
