// b / i / bullet buttons that wrap the textarea selection
// the caller passes a ref to the textarea and the current body string;
// we compute the new value + selection range and report both back

import type { RefObject } from "react";

type Props = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (next: string, selection: { start: number; end: number }) => void;
};

// wrap or unwrap a selection with the given prefix/suffix markers
function wrap(
  textarea: HTMLTextAreaElement,
  value: string,
  prefix: string,
  suffix: string,
): { next: string; start: number; end: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const before = value.slice(0, start);
  const selected = value.slice(start, end);
  const after = value.slice(end);
  const next = `${before}${prefix}${selected}${suffix}${after}`;
  // keep the wrapped span selected so a second click can unwrap or extend
  return {
    next,
    start: start + prefix.length,
    end: end + prefix.length,
  };
}

// add "- " to the start of every line in the selection (or the current line)
function bullet(
  textarea: HTMLTextAreaElement,
  value: string,
): { next: string; start: number; end: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  // expand to full lines
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const lineEndRaw = value.indexOf("\n", end);
  const lineEnd = lineEndRaw === -1 ? value.length : lineEndRaw;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const prefixed = lines.map((l) => (l.startsWith("- ") ? l : `- ${l}`));
  const replaced = prefixed.join("\n");
  const next = value.slice(0, lineStart) + replaced + value.slice(lineEnd);
  return {
    next,
    start: lineStart,
    end: lineStart + replaced.length,
  };
}

export function MarkdownToolbar({ textareaRef, value, onChange }: Props) {
  const apply = (
    fn: (
      ta: HTMLTextAreaElement,
      value: string,
    ) => { next: string; start: number; end: number },
  ) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const result = fn(ta, value);
    onChange(result.next, { start: result.start, end: result.end });
  };

  return (
    <div className="md-toolbar" role="toolbar" aria-label="Body formatting">
      <button
        type="button"
        className="md-btn"
        onClick={() => apply((ta, v) => wrap(ta, v, "**", "**"))}
        aria-label="Bold"
        title="Bold (**...**)"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        className="md-btn"
        onClick={() => apply((ta, v) => wrap(ta, v, "_", "_"))}
        aria-label="Italic"
        title="Italic (_..._)"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        className="md-btn"
        onClick={() => apply(bullet)}
        aria-label="Bullet"
        title="Bullet list"
      >
        •
      </button>
    </div>
  );
}
