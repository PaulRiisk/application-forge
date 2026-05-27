// the A4 page frame, shared by every document preview
// applies accent color, zoom, and the dev/classic data-mode so CSS does the work
// children render the actual page contents (sidebar + main grid, etc.)

import { forwardRef, type ReactNode } from "react";
import { useApp } from "../state/AppContext";
import "./preview.css";

type Props = {
  children: ReactNode;
  zoom?: number;
  pageClass?: string;
};

export const PreviewShell = forwardRef<HTMLDivElement, Props>(
  function PreviewShell({ children, zoom = 1, pageClass }, ref) {
    const { stammdaten } = useApp();
    return (
      <div
        ref={ref}
        className="af-preview-root"
        data-mode={stammdaten.mode}
        style={{
          ["--accent" as string]: stammdaten.theme.accent,
          ["--zoom" as string]: zoom,
        }}
      >
        <main className={`page${pageClass ? ` ${pageClass}` : ""}`}>
          {children}
        </main>
      </div>
    );
  },
);
