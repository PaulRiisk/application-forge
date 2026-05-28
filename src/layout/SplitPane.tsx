// resizable two-pane split: drag the handle to resize, reset button snaps back
// editor width is stored in local state only (not persisted)

import { useRef, useState, useCallback, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import "./SplitPane.css";

const DEFAULT_WIDTH = 460;
const MIN_WIDTH = 280;
const MAX_FRACTION = 0.65; // never wider than 65% of the container

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
};

export function SplitPane({ left, right }: Props) {
  const [editorWidth, setEditorWidth] = useState(DEFAULT_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = editorWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [editorWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current || !containerRef.current) return;
      const delta = e.clientX - startX.current;
      const containerW = containerRef.current.offsetWidth;
      const maxW = Math.floor(containerW * MAX_FRACTION);
      const next = Math.min(maxW, Math.max(MIN_WIDTH, startWidth.current + delta));
      setEditorWidth(next);
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const isDefault = editorWidth === DEFAULT_WIDTH;

  return (
    <div className="split-pane" ref={containerRef}>
      {/* editor */}
      <div
        className="editor-pane"
        style={{ flexBasis: editorWidth, flexShrink: 0, flexGrow: 0 }}
      >
        {left}
      </div>

      {/* drag handle */}
      <div className="split-handle" onMouseDown={onMouseDown} role="separator" aria-orientation="vertical">
        <div className="split-handle-bar" />
        {!isDefault && (
          <button
            type="button"
            className="split-reset-btn"
            onClick={() => setEditorWidth(DEFAULT_WIDTH)}
            title="Reset split"
            aria-label="Reset split to default"
          >
            <RotateCcw size={11} />
          </button>
        )}
      </div>

      {/* preview */}
      <div className="preview-pane">
        {right}
      </div>
    </div>
  );
}
