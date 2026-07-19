// minimal markdown renderer for cover letter bodies
// supported syntax (toolbar inserts these, see MarkdownToolbar):
//   **bold**, _italic_, lines starting with "- " become a bullet list,
//   blank line separates paragraphs

import { Fragment, type ReactNode } from "react";

// letters/digits (incl. umlauts) count as word characters for the italic
// boundary check; undefined (string edge) counts as a boundary
function isWordChar(ch: string | undefined): boolean {
  return ch !== undefined && /[\p{L}\p{N}]/u.test(ch);
}

// inline pass: walk the string, emit text + <strong>/<em> spans
// no escaping needed because react escapes by default; we never use innerHTML
function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let buf = "";
  let counter = 0;
  const flush = () => {
    if (buf !== "") {
      out.push(buf);
      buf = "";
    }
  };
  while (i < text.length) {
    // bold: **...**
    if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end !== -1) {
        flush();
        out.push(
          <strong key={`${keyBase}-b-${counter++}`}>
            {renderInline(text.slice(i + 2, end), `${keyBase}-b${counter}`)}
          </strong>,
        );
        i = end + 2;
        continue;
      }
    }
    // italic: _..._ — only at word boundaries so snake_case_words in the
    // body don't get eaten as formatting
    if (text[i] === "_" && !isWordChar(text[i - 1])) {
      let end = text.indexOf("_", i + 1);
      // closing marker must also sit on a word boundary
      while (end !== -1 && isWordChar(text[end + 1])) {
        end = text.indexOf("_", end + 1);
      }
      if (end !== -1 && end > i + 1) {
        flush();
        out.push(
          <em key={`${keyBase}-i-${counter++}`}>
            {renderInline(text.slice(i + 1, end), `${keyBase}-i${counter}`)}
          </em>,
        );
        i = end + 1;
        continue;
      }
    }
    buf += text[i];
    i++;
  }
  flush();
  return out;
}

// block pass: group consecutive bullet lines into one <ul>, blank lines split paragraphs
type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul"; items: string[] };

function tokenize(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let bullets: string[] = [];

  const flushPara = () => {
    if (para.length > 0) {
      blocks.push({ type: "p", lines: para });
      para = [];
    }
  };
  const flushUl = () => {
    if (bullets.length > 0) {
      blocks.push({ type: "ul", items: bullets });
      bullets = [];
    }
  };

  for (const raw of lines) {
    const line = raw;
    if (line.trim() === "") {
      flushPara();
      flushUl();
      continue;
    }
    if (/^\s*-\s+/.test(line)) {
      flushPara();
      bullets.push(line.replace(/^\s*-\s+/, ""));
      continue;
    }
    flushUl();
    para.push(line);
  }
  flushPara();
  flushUl();
  return blocks;
}

// strip the markdown markers for plain-text use (copy into web forms, mail
// bodies). bullets keep their "- ", paragraphs stay separated by blank lines
export function markdownToPlain(src: string): string {
  return src
    .replace(/\r\n/g, "\n")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(^|[^\p{L}\p{N}])_([^_\n]+)_(?![\p{L}\p{N}])/gu, "$1$2");
}

export function renderMarkdown(src: string): ReactNode {
  const blocks = tokenize(src);
  return (
    <>
      {blocks.map((block, idx) => {
        if (block.type === "p") {
          return (
            <p key={idx}>
              {block.lines.map((line, i) => (
                <Fragment key={i}>
                  {i > 0 && <br />}
                  {renderInline(line, `${idx}-${i}`)}
                </Fragment>
              ))}
            </p>
          );
        }
        return (
          <ul key={idx}>
            {block.items.map((item, i) => (
              <li key={i}>{renderInline(item, `${idx}-${i}`)}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}
