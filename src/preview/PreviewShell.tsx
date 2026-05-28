// the A4 page frame, shared by every document preview
// applies accent color, zoom, and the dev/classic data-mode so CSS does the work
// children render the actual page contents (sidebar + main grid, etc.)
// watches the page height and flags overflow so the out-of-bounds markers
// only show when content actually grows past the A4 page

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useApp } from "../state/AppContext";
import "./preview.css";

// A4 height at 96dpi, matches --page-h in preview.css
const A4_HEIGHT = 1123;

type Props = {
  children: ReactNode;
  zoom?: number;
  pageClass?: string;
};

export const PreviewShell = forwardRef<HTMLDivElement, Props>(
  function PreviewShell({ children, zoom = 1, pageClass }, ref) {
    const { stammdaten } = useApp();
    const pageRef = useRef<HTMLElement>(null);
    const [overflow, setOverflow] = useState(false);

    // measure the page content against the A4 page height; re-run whenever
    // the page resizes (content changes, font swap, etc.)
    useEffect(() => {
      const el = pageRef.current;
      if (!el) return;
      const check = () => {
        // scrollHeight ignores the zoom transform, so compare against raw A4
        setOverflow(el.scrollHeight > A4_HEIGHT + 1);
      };
      check();
      const observer = new ResizeObserver(check);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div
        ref={ref}
        className={`af-preview-root${overflow ? " has-overflow" : ""}`}
        data-mode={stammdaten.mode}
        style={{
          ["--accent" as string]: stammdaten.theme.accent,
          ["--zoom" as string]: zoom,
        }}
      >
        <main
          ref={pageRef}
          className={`page${pageClass ? ` ${pageClass}` : ""}`}
        >
          {children}
        </main>
      </div>
    );
  },
);
