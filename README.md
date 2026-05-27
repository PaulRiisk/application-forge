# application-forge

A small, browser-only tool that builds a complete job-application set —
cover page, cover letter, CV, and an about-me page — from one shared
source of base data. Edit on the left, see the A4 preview on the right,
export the chosen pages as a single PDF.

Successor to [cv-builder](https://github.com/paulriisk/cv-builder),
generalized from one CV to a four-document application set behind one
consistent design system.

> **Status:** work in progress. Phases 1–7 of the build plan are done
> (scaffold, Stammdaten + cover page, cover letter, CV, about-me, PDF
> export, persistence). Polish + GitHub Pages deploy still ahead. See
> `TODO.md` for the open items.

## Features

- **Four document types**, one design system. The deckblatt, cover
  letter, CV, and about-me page share fonts, accent color, layout
  tokens, and the dev/classic mode switch.
- **One source of truth** for base data (name, contact, photo, theme,
  schwerpunkt). The other three documents read from it.
- **Multiple cover letters per application set**. Add, duplicate,
  rename, delete; one preview at a time; pick which letter goes into
  the export.
- **Live A4 preview** with zoom toolbar and an out-of-bounds indicator
  that hatches everything past the A4 page height.
- **Dev / Classic layout modes**. Dev keeps `>` carets, `// prefixes`,
  lowercase headings, and a monospace accent font. Classic drops them,
  uppercases the labels, and swaps every font to Open Sans.
- **Theme presets** (Blue / Teal / Rust) plus a custom accent picker.
- **Markdown body for the cover letter**. A small toolbar wraps
  selections with `**bold**`, `_italic_`, or `- bullet` lines. Body
  renders through a tiny in-house markdown parser.
- **Combined multi-page PDF export**. Pick which of the four documents
  to include; each one is captured and stacked into a single PDF.
- **Local persistence**: every change auto-saves to `localStorage`
  (300 ms debounce). Manual save downloads a `.json` of the whole
  application set; manual load reads it back. Reset confirms, clears,
  and seeds the defaults again.
- **Photo and signature stay in memory only** — they never reach
  `localStorage` or the exported JSON, so a saved set is shareable
  without leaking pictures.
- **DE/EN UI toggle** in the top bar. Independent of document content.

## Tech stack

- React 19 + TypeScript (strict), Vite 8.
- Plain CSS with CSS variables for the design tokens. No Tailwind, no
  CSS-in-JS.
- `useReducer` + split state/dispatch contexts. No Redux, no Zustand.
- `html2canvas` + `jsPDF` for the multi-page export.
- `@fontsource/ibm-plex-sans` + `@fontsource/jetbrains-mono` for dev
  mode, `@fontsource/open-sans` for classic mode. All self-hosted, no
  Google Fonts CDN at runtime.

## Project layout

```
src/
├── App.tsx
├── defaults.ts        # placeholder application set used on first load
├── main.tsx
├── types.ts           # ApplicationDocument + sub-types
├── stammdaten/        # base-data tab + cover page preview + photo upload
├── letters/           # cover letter list, editor, markdown toolbar, preview
├── cv/                # CV editor (profile, skills, sidebar, entries) + preview
├── about/             # about-me editor + preview
├── preview/           # shared A4 page frame, zoom toolbar, preview.css
├── editor/            # TextField, TextAreaField, KeyValueList, ChipInput
├── pdf/               # multi-page jsPDF export + offscreen capture host
├── topbar/            # tab nav, theme presets, dark-mode + locale toggles
├── state/             # AppContext, reducer, persistence
├── theme/             # preset accent colors
└── i18n/              # DE/EN string maps + useUiLocale hook
```

## Running locally

```bash
npm install
npm run dev
```

Dev server runs on http://localhost:5173/.

```bash
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
```

## Data model

Everything lives in one `ApplicationDocument`:

```ts
type ApplicationDocument = {
  version: 1;
  stammdaten: Stammdaten;   // shared identity, contact, theme, mode
  letters: { items: CoverLetter[]; activeId: string };
  cv: CvDocument;
  about: AboutDocument;
};
```

That object is the only thing that gets persisted to `localStorage`
(key `application-forge-v1`) and downloaded by the Save button. Photo
and signature live in component state outside that tree.

## Acceptance criteria covered so far

From the v1 requirements:

1. ✅ Filling all four tabs and exporting all four produces one PDF.
2. ✅ Dev → Classic restyles every document consistently.
3. ✅ Changing accent or photo updates every preview.
4. ✅ Duplicating a letter and picking it in Export produces the right
   PDF for that company.
5. ✅ Reloading restores everything except photo and signature.
6. ✅ Save → Load round-trip is lossless (minus images).
7. ✅ Reset returns to defaults.
8. ✅ No personal data in the codebase or default state.

## License

MIT — see `LICENSE`.
