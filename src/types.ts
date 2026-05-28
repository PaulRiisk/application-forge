// types for the whole application document and its sub-pieces
// every document in the set reads identity bits from stammdaten

export type ContactRow = {
  id: string;
  label: string;
  value: string;
};

export type SkillGroup = {
  id: string;
  heading: string;
  items: string[];
};

export type SidebarRow = {
  id: string;
  label: string;
  value: string;
};

export type SidebarSection = {
  id: string;
  heading: string;
  rows: SidebarRow[];
};

export type Entry = {
  id: string;
  period: string;
  title: string;
  place: string;
  bullets: string[];
};

export type EntrySection = {
  id: string;
  heading: string;
  entries: Entry[];
};

export type ThemePreset = "blue" | "teal" | "rust";

export type Theme = {
  preset: ThemePreset;
  accent: string;
};

export type LayoutMode = "dev" | "classic";

// language used for two distinct things, both independent of the UI language:
//  - templateLocale: the fixed preview strings the user can't edit
//    (kicker words, "betreff", mappe items, ...). live, non-destructive.
//  - the reset seed language: which language the editable default content
//    is seeded in. chosen at reset time, also presets templateLocale.
export type DocLocale = "de" | "en";

// shared identity, contact, theme, mode — every document reads from here
export type Stammdaten = {
  name: string;
  title: string;
  kurz: string;
  contact: ContactRow[];
  schwerpunkt: SkillGroup;
  anlagen: string[];
  photoEnabled: boolean;
  theme: Theme;
  mode: LayoutMode;
  templateLocale: DocLocale;
};

// one cover letter inside the letters list
export type CoverLetter = {
  id: string;
  label: string;
  company: string;
  recipient: string[];
  cityOverride: string | null;
  date: string;
  subject: string;
  reference: string;
  body: string;
  showAnlagen: boolean;
};

export type CvDocument = {
  profile: string;
  skillGroups: SkillGroup[];
  sidebarSections: SidebarSection[];
  entrySections: EntrySection[];
};

export type StrengthCard = {
  id: string;
  title: string;
  body: string;
};

export type AboutItem = {
  id: string;
  key: string;
  title: string;
  body: string;
};

export type AboutDocument = {
  warumSoftware: string;
  // section headings are editable so the user can rename them
  staerkenHeading: string;
  wasIchBaueHeading: string;
  ausserhalbHeading: string;
  staerken: StrengthCard[];
  wasIchBaue: AboutItem[];
  ausserhalbDesTerminals: AboutItem[];
  footer: string;
};

// the whole application set lives in one object, saved and loaded as-is
export type ApplicationDocument = {
  version: 1;
  stammdaten: Stammdaten;
  letters: {
    items: CoverLetter[];
    activeId: string;
  };
  cv: CvDocument;
  about: AboutDocument;
};

export type Direction = "up" | "down";

// short random id for react keys and reducer targeting
export function newId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID().slice(0, 8);
  }
  return Math.random().toString(36).slice(2, 10);
}
