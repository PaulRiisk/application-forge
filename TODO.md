# TODO — application-forge

Open items to revisit, not blocking v1 phases.

## Command palette (⌘K)

- **Stage 1 — Field navigation**: index all editor fields by tab/section at runtime, floating modal with live filter, click/Enter jumps to the right tab and focuses the field via `id`.
- **Stage 2 — Actions**: add Save, Export, Reset, Dev/Classic toggle, theme preset switches as selectable entries alongside the fields.

## Electron portable build

Package the app as a standalone `.exe` (Windows) / `.app` (Mac) that users can download and run without installing Node or a browser.

- Use `electron` + `electron-builder` (`npm install --save-dev electron electron-builder`)
- `main.js`: open a `BrowserWindow` that loads `dist/index.html` (file protocol, no dev server needed)
- `electron-builder` config in `package.json`: target `portable` for Windows so no installer is required — single `.exe` the user can double-click
- Add `npm run electron:dev` (loads Vite dev server) and `npm run electron:build` (builds Vite first, then packages) scripts
- Expected output size: ~120–150 MB due to bundled Chromium; portable `.exe` in `release/`
- Photo/signature stay in memory only — no changes needed to the data model


## GitHub Pages deploy

PLAN §8 Phase 8 includes a GitHub Actions workflow that publishes the
built app to GitHub Pages. Deferred — user pushes and deploys manually
when the rest is locked down. When picking this back up:

- Add `.github/workflows/deploy.yml` modelled on the cv-builder workflow
  (Node setup, `npm ci`, `npm run build`, upload `dist/` as a Pages
  artifact, deploy). Base path is already configured in
  [vite.config.ts](vite.config.ts) → `/application-forge/` for builds.
- Enable Pages in repo settings, choose "GitHub Actions" as the source.
- README needs a live link once the URL is known.

## Other observations

- Keep an eye out for visual drift between the document previews — they
  should look like one family (shared sidebar tint, fonts, accent).

---

# Done

Resolved items, kept briefly for context:

- **"Definitive version" batch (Jul 2026)** — undo/redo (Ctrl+Z/Y, coalesced
  history around the reducer); multi-page PDF export (overflowing pages are
  sliced into extra A4 pages instead of squeezed); photo/signature persisted
  in IndexedDB (still never in the exported JSON); per-letter status tracking
  (draft/sent/reply, badge in the letter list); `{firma}` placeholder in
  subject/body + warning when another letter's company is still in the text;
  plain-text copy of the letter body; letter duplicate gets today's date;
  shared city matcher for deckblatt + anschreiben; EN date format; localized
  cv "profil" label; umlaut-aware filename slugs; word-boundary italics;
  per-letter backfills on load; export host only mounted while exporting.

- **UI language pass** — DE/EN toggle in topbar + full string map (`src/i18n`).
- **Document default language** — `defaultLocale` on stammdaten, dropdown
  in the editor, reseed-with-confirm on change (option A).
- **Anlagen + Mappe coupling** — `stammdaten.anlagen` drives both the
  deckblatt mappe list (appended, numbered) and the anschreiben footer;
  per-letter `showAnlagen` toggle gates the footer.
- **About-me footer** — editable free-text field, no auto-injected email.
- **A4 overflow indicator** — only shows when content actually overflows
  (ResizeObserver + `.has-overflow`).
- **Favicon + tab title** — new `>_` mark, German tab title.

---

# Zukunftsausblick

Items that aren't part of the v1 scope and probably not the next v
either, but worth keeping around so we don't lose the thinking.

## Selectable / searchable PDF text

Current export is raster-based (html2canvas → JPEG → jsPDF). Each page
is essentially a picture. Pros: pixel-perfect match to the in-app
preview, no font embedding headaches, every special character works.
Cons: larger files (~2 MB vs ~100 KB), no text selection or search,
worse for accessibility and for ATS pipelines that parse application
PDFs.

Options for a future text-PDF export:

- **B**: render via `jsPDF.text()` / `pdf.html()` with manual layout.
  Cleanest output, smallest file. Cost: layout has to be maintained
  twice (CSS for preview, jsPDF coordinates for export). Markdown body
  renderer for the cover letter would need a parallel implementation.
- **C**: keep the canvas image, overlay an invisible selectable text
  layer (pdf.js style). Tooling doesn't exist out of the box, the text
  layer would drift if CSS changes.
- **D**: use `window.print()` + `@media print` CSS. Browser renders
  text-PDF natively. Loses the multi-doc combine in one click — needs a
  print route that stacks the chosen pages.
- **E**: switch the export pipeline to `@react-pdf/renderer`. Parallel
  render engine, separate layout system, +200 KB dep.

Lean toward B when this becomes a priority. For now A is fine because
modern ATS readers OCR raster PDFs reliably.
