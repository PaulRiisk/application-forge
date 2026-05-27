# TODO — application-forge

Open items to revisit, not blocking v1 phases.

## Anlagen + Mappe coupling

Currently the anschreiben preview footer shows a hardcoded attachment line
(`lebenslauf.pdf · zeugnis_ba.pdf · …`) and the deckblatt's "mappe enthält"
shows the fixed `01 anschreiben · 02 lebenslauf · 03 über mich · 04 zeugnisse`
list. Both should be data-driven and share one source of truth:

- Add an `anlagen: string[]` field to the application document (probably on
  `stammdaten` since it's cross-document). Each entry is a filename or label.
- On the **Deckblatt** (Stammdaten editor): editable list next to / under the
  mappe block. The mappe list shows the 4 standard documents + the optional
  anlagen entries.
- On the **Anschreiben**: per-letter `showAnlagen: boolean` (default true).
  When true, the footer renders the same anlagen list; when false, the
  footer block is hidden.
- Reflect both in the preview live.

## Web logo / favicon

`favicon.svg` is currently the cv-builder logo, copied during scaffold. Needs
a new round logo for application-forge — per PLAN §2 ("new round logo for
app-forge"). Same shape language, distinct mark.

## About-me footer line

Currently the footer reads `> gerne mehr im persönlichen gespräch —
<email>` with email auto-filled from the stammdaten `email` contact row.
Make this configurable per the about doc:

- Add a `footer: string` field on `AboutDocument` (or rename — could be
  `closingLine`). Default to the current proposed string but **without the
  trailing email**, so the user fills it in manually if they want it.
- Editor: one TextField in the About editor, with the current default as a
  placeholder so it's obviously editable.
- Preview: render whatever the user typed, no auto-substitution. If they
  want the email, they paste it. Keeps the rule "no auto-injected personal
  data" clean.

## UI language pass

The UI strings are mixed German/English (e.g. editor headings "Identity",
"Skills", "Profile" but document defaults use "schwerpunkt", "kurz",
"profil"). Need:

1. **UI language toggle** in the topbar, next to the dark-mode icon. A
   small DE/EN icon button. Swaps every UI string (labels, helper text,
   button text, alerts). Persisted under its own localStorage key like
   `useUiTheme`. Independent of the document-language setting below.
2. **Document default language** in Stammdaten editor as the first
   control. Dropdown DE/EN. Decides whether the *seeded* default content
   (heading "experience" vs "erfahrung", "// schwerpunkt" vs
   "// focus", section labels, default placeholders) starts in DE or EN.
   Switching this **resets all default-content fields** — needs a
   confirmation modal with a clear warning that user edits in those
   fields are lost.

The two settings are independent: someone might run the UI in English
but build a German CV, or vice versa. Mixing inside one document is
still possible — the user just types whatever language they want into a
field. The language setting only controls *seeded defaults*.

Approach decided: option A — global `defaultLocale` field, explicit
reset-with-confirm on change. Alternatives B (locale at first-load /
reset only) and C (replace only empty fields) considered and rejected
for v1.

## A4 overflow indicator

The red diagonal hatching + "Beyond A4 — won't appear in PDF" badge
currently render under every preview, even when content fits. They
should only appear when the content actually overflows the A4 height.

Implementation: measure the page content height in a ResizeObserver,
toggle a `.has-overflow` class on the preview root, gate the `::before`
/ `::after` rules on that class. Or use container queries / size queries
if simpler.

## Other observations

- Phase 2 verification noted the Deckblatt sidebar tint was missing; fixed in
  Phase 3 follow-up. Keep an eye out for similar drift between the document
  previews — they should look like one family.
