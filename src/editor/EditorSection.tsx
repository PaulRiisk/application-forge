// collapsible editor section card with accent left border
// an optional id makes the section a command-palette jump target: when the
// palette targets it, useNavNonce flips and we force the section open

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavNonce } from "../palette/PaletteContext";

type Props = {
  id?: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

export function EditorSection({ id, title, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  // force open when the palette jumps here (nonce changes per jump).
  // state is adjusted during render instead of in an effect so the section
  // is already open in the same commit the jump happens
  const navNonce = useNavNonce(id);
  const [seenNonce, setSeenNonce] = useState(navNonce);
  if (navNonce !== seenNonce) {
    setSeenNonce(navNonce);
    if (navNonce !== null && !open) setOpen(true);
  }

  return (
    <section className="editor-section" id={id}>
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
