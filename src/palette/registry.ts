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

// the action handlers are wired up where dispatch + the app callbacks live;
// this kind tag is all the registry needs to carry
export type ActionKind =
  | "save"
  | "load"
  | "reset"
  | "export"
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

// labels reuse the existing topbar strings so there's nothing new to translate
export const ACTION_ENTRIES: ActionEntry[] = [
  { id: "act-save", labelKey: "topbar.button.save", action: "save" },
  { id: "act-export", labelKey: "topbar.button.export", action: "export" },
  { id: "act-load", labelKey: "topbar.button.load", action: "load" },
  { id: "act-reset", labelKey: "topbar.button.reset", action: "reset" },
  { id: "act-modeDev", labelKey: "topbar.mode.dev", action: "modeDev", keywords: ["dev", "modus", "mode"] },
  { id: "act-modeClassic", labelKey: "topbar.mode.classic", action: "modeClassic", keywords: ["classic", "klassisch", "modus", "mode"] },
  { id: "act-themeBlue", labelKey: "topbar.theme.blue", action: "themeBlue", keywords: ["theme", "farbe", "color", "accent", "akzent"] },
  { id: "act-themeTeal", labelKey: "topbar.theme.teal", action: "themeTeal", keywords: ["theme", "farbe", "color", "accent", "akzent"] },
  { id: "act-themeRust", labelKey: "topbar.theme.rust", action: "themeRust", keywords: ["theme", "farbe", "color", "accent", "akzent"] },
];
