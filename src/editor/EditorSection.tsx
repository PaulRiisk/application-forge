// collapsible editor section card with accent left border

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function EditorSection({ title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="editor-section">
      <div
        className="editor-section-header"
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <h2>{title}</h2>
        <span className={`editor-section-chevron${open ? " open" : ""}`}>
          <ChevronDown size={15} />
        </span>
      </div>
      {open && <div className="editor-section-body">{children}</div>}
    </section>
  );
}
