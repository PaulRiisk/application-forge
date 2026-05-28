// fixed preview strings the user can't edit inline (kicker words, section
// labels baked into the layout, mappe items). switched live by
// stammdaten.templateLocale, independent of the UI language and the seeded
// editable content. the dev-mode > and // markers are added by the previews,
// these are the bare words only.

import type { DocLocale } from "../types";

export type DocStrings = {
  // deckblatt
  bewerbung: string; // kicker: "> bewerbung / 2026"
  bewerbungAls: string; // "// bewerbung als"
  bei: string; // connector: "bei Company · City"
  mappeEnthaelt: string; // "> mappe enthält"
  mappeAnschreiben: string;
  mappeLebenslauf: string;
  mappeUeberMich: string;
  mappeZeugnisse: string;
  // anschreiben
  anschreiben: string; // sidebar kicker
  kurz: string; // "// kurz"
  an: string; // "> an" / recipient label
  datum: string; // "> datum"
  betreff: string; // "// betreff"
  anlagen: string; // "> anlagen"
  dateLocale: string; // intl locale for the month name
  // about
  aboutKicker: string; // "seite_03 / über_mich" (dev) — see note below
  aboutTitle: string; // "Was mich antreibt."
  warumSoftware: string; // "// warum_software"
};

export const DOC_STRINGS: Record<DocLocale, DocStrings> = {
  de: {
    bewerbung: "bewerbung",
    bewerbungAls: "bewerbung als",
    bei: "bei",
    mappeEnthaelt: "mappe enthält",
    mappeAnschreiben: "anschreiben",
    mappeLebenslauf: "lebenslauf",
    mappeUeberMich: "über mich",
    mappeZeugnisse: "zeugnisse",
    anschreiben: "anschreiben",
    kurz: "kurz",
    an: "an",
    datum: "datum",
    betreff: "betreff",
    anlagen: "anlagen",
    dateLocale: "de-DE",
    aboutKicker: "über mich",
    aboutTitle: "Was mich antreibt.",
    warumSoftware: "warum_software",
  },
  en: {
    bewerbung: "application",
    bewerbungAls: "applying for",
    bei: "at",
    mappeEnthaelt: "set contains",
    mappeAnschreiben: "cover letter",
    mappeLebenslauf: "cv",
    mappeUeberMich: "about me",
    mappeZeugnisse: "references",
    anschreiben: "cover letter",
    kurz: "profile",
    an: "to",
    datum: "date",
    betreff: "subject",
    anlagen: "attachments",
    dateLocale: "en-GB",
    aboutKicker: "about_me",
    aboutTitle: "What drives me.",
    warumSoftware: "why_software",
  },
};

export function docStrings(locale: DocLocale): DocStrings {
  return DOC_STRINGS[locale];
}
