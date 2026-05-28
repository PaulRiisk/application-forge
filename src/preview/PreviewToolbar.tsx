// small floating bar above the preview with zoom buttons

import { Maximize2 } from "lucide-react";
import { useT } from "../i18n/LocaleContext";

type Props = {
  zoom: number;
  onZoomChange: (zoom: number) => void;
};

// fixed zoom stops, picked to feel familiar (50% to 200%)
const STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function nextStep(zoom: number, direction: 1 | -1): number {
  const idx = STEPS.findIndex((s) => s >= zoom - 0.001);
  const target =
    direction === 1
      ? Math.min(STEPS.length - 1, idx + 1)
      : Math.max(0, idx - 1);
  return STEPS[target];
}

export function PreviewToolbar({ zoom, onZoomChange }: Props) {
  const t = useT();
  return (
    <div className="preview-toolbar" role="toolbar" aria-label={t("preview.toolbar.aria")}>
      <button
        type="button"
        className="row-btn"
        onClick={() => onZoomChange(nextStep(zoom, -1))}
        disabled={zoom <= STEPS[0] + 0.001}
        aria-label={t("preview.toolbar.zoomOut")}
        title={t("preview.toolbar.zoomOut")}
      >
        −
      </button>
      <span className="zoom-level" aria-live="polite">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        className="row-btn"
        onClick={() => onZoomChange(nextStep(zoom, 1))}
        disabled={zoom >= STEPS[STEPS.length - 1] - 0.001}
        aria-label={t("preview.toolbar.zoomIn")}
        title={t("preview.toolbar.zoomIn")}
      >
        +
      </button>
      <button
        type="button"
        className="row-btn"
        onClick={() => onZoomChange(1)}
        disabled={Math.abs(zoom - 1) < 0.001}
        aria-label={t("preview.toolbar.resetTitle")}
        title={t("preview.toolbar.resetTitle")}
      >
        <Maximize2 size={13} />
      </button>
    </div>
  );
}
