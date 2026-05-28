# application-forge

A browser-only tool for writing job applications. Fill in your details once, pick an accent color, and export a cover page, cover letter, CV, and about-me page as a single PDF. All formatting is handled for you.

Successor to [cv-builder](https://github.com/paulriisk/cv-builder), extended from a single CV to a full four-document application set with a shared design system.

## Features

- **Four documents, one design system.** Cover page, cover letter, CV, and about-me share fonts, accent color, and layout.
- **Multiple cover letters.** Add, duplicate, rename, and delete; pick which one goes into the export.
- **Live A4 preview** with zoom and an out-of-bounds indicator for content past the page edge.
- **Dev / Classic modes.** Dev: carets, lowercase headings, monospace accent font. Classic: standard capitalization, Open Sans throughout.
- **Theme presets** (Blue, Teal, Rust) plus a custom accent color picker.
- **Markdown in the cover letter body.** Bold, italic, and bullet list via toolbar or shortcuts.
- **PDF export.** Select which documents to include; merged into one file.
- **Auto-save to localStorage** plus manual save/load as JSON. Reset restores defaults.
- **Photos and signatures stay in memory only,** never written to localStorage or exported JSON.
- **DE / EN UI toggle** independent of document content.

## Tech stack

React 19, TypeScript (strict), Vite 8. Plain CSS with CSS variables, no Tailwind or CSS-in-JS. `useReducer` with split state/dispatch contexts. `html2canvas` + `jsPDF` for export. All fonts self-hosted via `@fontsource` packages (IBM Plex Sans, JetBrains Mono, Open Sans).

## Running locally

```bash
npm install
npm run dev        # dev server at http://localhost:5173/
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
```

## License

MIT — see `LICENSE`.
