// static command-palette registry: navigable sections + runnable actions
// section ids are locale-independent constants so jumps survive a language
// switch; labelKey points at the existing i18n string for display

import type { TabId } from "../topbar/Topbar";

// a jump target: switch tab, expand + scroll to the section, focus first field
export type NavEntry = {
  id: string;
  tab: TabId;
  sectionId: string;
  labelKey: string;
  keywords?: string[];
};

// a field target: like a nav entry but also focuses a specific input by id.
// only fixed fields with a stable label are listed — dynamic list rows
// (contact lines, skill items, cv entries) stay reachable via their section
export type FieldEntry = {
  id: string;
  tab: TabId;
  sectionId: string;
  fieldId: string;
  labelKey: string;
  keywords?: string[];
};

// the action handlers are wired up where dispatch + the app callbacks live;
// this kind tag is all the registry needs to carry
export type ActionKind =
  | "save"
  | "load"
  | "reset"
  | "export"
  | "undo"
  | "redo"
  | "modeDev"
  | "modeClassic"
  | "themeBlue"
  | "themeTeal"
  | "themeRust";

export type ActionEntry = {
  id: string;
  labelKey: string;
  action: ActionKind;
  keywords?: string[];
};

// only fixed sections with a stable id are listed; dynamic cv entry sections
// are skipped because their headings are user-generated and have no anchor
export const NAV_ENTRIES: NavEntry[] = [
  // stammdaten (all EditorSection, force-open supported)
  { id: "nav-stamm-docLocale", tab: "stammdaten", sectionId: "sec-stamm-docLocale", labelKey: "stamm.section.docLocale" },
  { id: "nav-stamm-identity", tab: "stammdaten", sectionId: "sec-stamm-identity", labelKey: "stamm.section.identity" },
  { id: "nav-stamm-contact", tab: "stammdaten", sectionId: "sec-stamm-contact", labelKey: "stamm.section.contact" },
  { id: "nav-stamm-schwerpunkt", tab: "stammdaten", sectionId: "sec-stamm-schwerpunkt", labelKey: "stamm.section.schwerpunkt" },
  { id: "nav-stamm-anlagen", tab: "stammdaten", sectionId: "sec-stamm-anlagen", labelKey: "stamm.section.anlagen" },
  // anschreiben (EditorSection)
  { id: "nav-letter-addressee", tab: "anschreiben", sectionId: "sec-letter-addressee", labelKey: "letter.section.addressee" },
  { id: "nav-letter-dateCity", tab: "anschreiben", sectionId: "sec-letter-dateCity", labelKey: "letter.section.dateCity" },
  { id: "nav-letter-subject", tab: "anschreiben", sectionId: "sec-letter-subject", labelKey: "letter.section.subject" },
  { id: "nav-letter-body", tab: "anschreiben", sectionId: "sec-letter-body", labelKey: "letter.section.body" },
  { id: "nav-letter-signature", tab: "anschreiben", sectionId: "sec-letter-signature", labelKey: "letter.section.signature" },
  // lebenslauf
  { id: "nav-cv-profile", tab: "lebenslauf", sectionId: "sec-cv-profile", labelKey: "cv.section.profile" },
  { id: "nav-cv-skills", tab: "lebenslauf", sectionId: "sec-cv-skills", labelKey: "cv.section.skills" },
  { id: "nav-cv-sidebar", tab: "lebenslauf", sectionId: "sec-cv-sidebar", labelKey: "cv.section.sidebarSections" },
  // über mich (raw always-open sections, scroll/focus only)
  { id: "nav-about-warum", tab: "about", sectionId: "sec-about-warum", labelKey: "about.section.warum" },
  { id: "nav-about-staerken", tab: "about", sectionId: "sec-about-staerken", labelKey: "about.section.staerken" },
  { id: "nav-about-wasIchBaue", tab: "about", sectionId: "sec-about-wasIchBaue", labelKey: "about.section.wasIchBaue" },
  { id: "nav-about-ausserhalb", tab: "about", sectionId: "sec-about-ausserhalb", labelKey: "about.section.ausserhalbDesTerminals" },
];

// fixed fields, jumped to + focused by their input id. keywords add findable
// synonyms because some labels are terse (e.g. "Überschrift", "Absatz")
export const FIELD_ENTRIES: FieldEntry[] = [
  // stammdaten
  { id: "fld-stamm-name", tab: "stammdaten", sectionId: "sec-stamm-identity", fieldId: "fld-stamm-name", labelKey: "stamm.field.name" },
  { id: "fld-stamm-title", tab: "stammdaten", sectionId: "sec-stamm-identity", fieldId: "fld-stamm-title", labelKey: "stamm.field.title", keywords: ["titel", "title", "untertitel", "subtitle", "role"] },
  { id: "fld-stamm-kurz", tab: "stammdaten", sectionId: "sec-stamm-identity", fieldId: "fld-stamm-kurz", labelKey: "stamm.field.kurz", keywords: ["kurzprofil", "profil", "profile", "bio"] },
  { id: "fld-stamm-schwerpunkt-heading", tab: "stammdaten", sectionId: "sec-stamm-schwerpunkt", fieldId: "fld-stamm-schwerpunkt-heading", labelKey: "stamm.schwerpunkt.heading", keywords: ["schwerpunkt", "focus", "überschrift", "heading"] },
  // anschreiben
  { id: "fld-letter-company", tab: "anschreiben", sectionId: "sec-letter-addressee", fieldId: "fld-letter-company", labelKey: "letter.field.company", keywords: ["firma", "company", "unternehmen"] },
  { id: "fld-letter-recipient", tab: "anschreiben", sectionId: "sec-letter-addressee", fieldId: "fld-letter-recipient", labelKey: "letter.field.recipient", keywords: ["empfänger", "adresse", "recipient", "address"] },
  { id: "fld-letter-date", tab: "anschreiben", sectionId: "sec-letter-dateCity", fieldId: "fld-letter-date", labelKey: "letter.field.date", keywords: ["datum", "date"] },
  { id: "fld-letter-cityOverride", tab: "anschreiben", sectionId: "sec-letter-dateCity", fieldId: "fld-letter-cityOverride", labelKey: "letter.field.cityOverride", keywords: ["ort", "stadt", "city"] },
  { id: "fld-letter-subject", tab: "anschreiben", sectionId: "sec-letter-subject", fieldId: "fld-letter-subject", labelKey: "letter.field.subject", keywords: ["betreff", "subject"] },
  { id: "fld-letter-reference", tab: "anschreiben", sectionId: "sec-letter-subject", fieldId: "fld-letter-reference", labelKey: "letter.field.reference", keywords: ["referenz", "reference"] },
  // lebenslauf
  { id: "fld-cv-profile", tab: "lebenslauf", sectionId: "sec-cv-profile", fieldId: "fld-cv-profile", labelKey: "cv.field.profile", keywords: ["profil", "profile", "über mich", "about"] },
  // über mich
  { id: "fld-about-warum", tab: "about", sectionId: "sec-about-warum", fieldId: "fld-about-warum", labelKey: "about.warum.label", keywords: ["warum software", "warum_software", "absatz", "paragraph"] },
  { id: "fld-about-footer", tab: "about", sectionId: "sec-about-footer", fieldId: "fld-about-footer", labelKey: "about.footer.label", keywords: ["fußzeile", "footer", "abschluss"] },
];

// labels reuse the existing topbar strings so there's nothing new to translate
export const ACTION_ENTRIES: ActionEntry[] = [
  { id: "act-save", labelKey: "topbar.button.save", action: "save" },
  { id: "act-export", labelKey: "topbar.button.export", action: "export" },
  { id: "act-load", labelKey: "topbar.button.load", action: "load" },
  { id: "act-reset", labelKey: "topbar.button.reset", action: "reset" },
  { id: "act-undo", labelKey: "palette.act.undo", action: "undo", keywords: ["undo", "rückgängig", "ctrl+z"] },
  { id: "act-redo", labelKey: "palette.act.redo", action: "redo", keywords: ["redo", "wiederholen", "ctrl+y"] },
  { id: "act-modeDev", labelKey: "topbar.mode.dev", action: "modeDev", keywords: ["dev", "modus", "mode"] },
  { id: "act-modeClassic", labelKey: "topbar.mode.classic", action: "modeClassic", keywords: ["classic", "klassisch", "modus", "mode"] },
  { id: "act-themeBlue", labelKey: "topbar.theme.blue", action: "themeBlue", keywords: ["theme", "farbe", "color", "accent", "akzent"] },
  { id: "act-themeTeal", labelKey: "topbar.theme.teal", action: "themeTeal", keywords: ["theme", "farbe", "color", "accent", "akzent"] },
  { id: "act-themeRust", labelKey: "topbar.theme.rust", action: "themeRust", keywords: ["theme", "farbe", "color", "accent", "akzent"] },
];
