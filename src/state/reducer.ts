// all document mutations live here as a typed action union
// every action returns a new ApplicationDocument, no in-place mutation
// all document mutations live here as a typed action union
// every action returns a new ApplicationDocument, no in-place mutation

import type {
  AboutDocument,
  AboutItem,
  ApplicationDocument,
  ContactRow,
  CoverLetter,
  CvDocument,
  Direction,
  DocLocale,
  Entry,
  EntrySection,
  LayoutMode,
  SidebarRow,
  SidebarSection,
  SkillGroup,
  Stammdaten,
  StrengthCard,
  ThemePreset,
} from "../types";
import { newId } from "../types";
import { createDefaultApplication } from "../defaults";

export type Action =
  | { type: "STAMM_SET_NAME"; value: string }
  | { type: "STAMM_SET_TITLE"; value: string }
  | { type: "STAMM_SET_KURZ"; value: string }
  | { type: "STAMM_ADD_CONTACT" }
  | {
      type: "STAMM_UPDATE_CONTACT";
      id: string;
      patch: Partial<Omit<ContactRow, "id">>;
    }
  | { type: "STAMM_REMOVE_CONTACT"; id: string }
  | { type: "STAMM_MOVE_CONTACT"; id: string; direction: Direction }
  | { type: "STAMM_SET_PHOTO_ENABLED"; enabled: boolean }
  | { type: "STAMM_SET_THEME_PRESET"; preset: ThemePreset; accent: string }
  | { type: "STAMM_SET_ACCENT"; accent: string }
  | { type: "STAMM_SET_MODE"; mode: LayoutMode }
  | { type: "STAMM_SET_TEMPLATE_LOCALE"; locale: DocLocale }
  | { type: "STAMM_RENAME_SCHWERPUNKT"; heading: string }
  | { type: "STAMM_ADD_SCHWERPUNKT_ITEM"; item: string }
  | { type: "STAMM_REMOVE_SCHWERPUNKT_ITEM"; index: number }
  | { type: "STAMM_MOVE_SCHWERPUNKT_ITEM"; index: number; direction: Direction }
  | { type: "STAMM_ADD_ANLAGE"; item: string }
  | { type: "STAMM_UPDATE_ANLAGE"; index: number; value: string }
  | { type: "STAMM_REMOVE_ANLAGE"; index: number }
  | { type: "STAMM_MOVE_ANLAGE"; index: number; direction: Direction }
  | { type: "STAMM_ADD_ZEUGNIS"; item: string }
  | { type: "STAMM_UPDATE_ZEUGNIS"; index: number; value: string }
  | { type: "STAMM_REMOVE_ZEUGNIS"; index: number }
  | { type: "STAMM_MOVE_ZEUGNIS"; index: number; direction: Direction }
  | { type: "STAMM_SET_SENDER_ADDRESS"; value: string }
  | { type: "STAMM_SET_SENDER_ENABLED"; enabled: boolean }
  | { type: "LETTERS_ADD" }
  | { type: "LETTERS_DUPLICATE"; id: string }
  | { type: "LETTERS_REMOVE"; id: string }
  | { type: "LETTERS_RENAME"; id: string; label: string }
  | { type: "LETTERS_SET_ACTIVE"; id: string }
  | { type: "LETTER_UPDATE"; patch: Partial<Omit<CoverLetter, "id">> }
  | { type: "CV_SET_PROFILE"; value: string }
  | { type: "CV_ADD_SKILL_GROUP" }
  | { type: "CV_RENAME_SKILL_GROUP"; id: string; heading: string }
  | { type: "CV_REMOVE_SKILL_GROUP"; id: string }
  | { type: "CV_MOVE_SKILL_GROUP"; id: string; direction: Direction }
  | { type: "CV_ADD_SKILL"; groupId: string; item: string }
  | { type: "CV_REMOVE_SKILL"; groupId: string; index: number }
  | {
      type: "CV_MOVE_SKILL";
      groupId: string;
      index: number;
      direction: Direction;
    }
  | { type: "CV_ADD_SIDEBAR_SECTION" }
  | { type: "CV_RENAME_SIDEBAR_SECTION"; id: string; heading: string }
  | { type: "CV_REMOVE_SIDEBAR_SECTION"; id: string }
  | { type: "CV_MOVE_SIDEBAR_SECTION"; id: string; direction: Direction }
  | { type: "CV_ADD_SIDEBAR_ROW"; sectionId: string }
  | {
      type: "CV_UPDATE_SIDEBAR_ROW";
      sectionId: string;
      rowId: string;
      patch: Partial<Omit<SidebarRow, "id">>;
    }
  | { type: "CV_REMOVE_SIDEBAR_ROW"; sectionId: string; rowId: string }
  | {
      type: "CV_MOVE_SIDEBAR_ROW";
      sectionId: string;
      rowId: string;
      direction: Direction;
    }
  | { type: "CV_ADD_ENTRY_SECTION" }
  | { type: "CV_RENAME_ENTRY_SECTION"; id: string; heading: string }
  | { type: "CV_REMOVE_ENTRY_SECTION"; id: string }
  | { type: "CV_MOVE_ENTRY_SECTION"; id: string; direction: Direction }
  | { type: "CV_ADD_ENTRY"; sectionId: string }
  | {
      type: "CV_UPDATE_ENTRY";
      sectionId: string;
      entryId: string;
      patch: Partial<Omit<Entry, "id">>;
    }
  | { type: "CV_REMOVE_ENTRY"; sectionId: string; entryId: string }
  | {
      type: "CV_MOVE_ENTRY";
      sectionId: string;
      entryId: string;
      direction: Direction;
    }
  | { type: "ABOUT_SET_WARUM"; value: string }
  | { type: "ABOUT_SET_FOOTER"; value: string }
  | { type: "ABOUT_SET_STAERKEN_HEADING"; value: string }
  | { type: "ABOUT_SET_WASICHBAUE_HEADING"; value: string }
  | { type: "ABOUT_SET_AUSSERHALB_HEADING"; value: string }
  | { type: "ABOUT_ADD_STRENGTH" }
  | {
      type: "ABOUT_UPDATE_STRENGTH";
      id: string;
      patch: Partial<Omit<StrengthCard, "id">>;
    }
  | { type: "ABOUT_REMOVE_STRENGTH"; id: string }
  | { type: "ABOUT_MOVE_STRENGTH"; id: string; direction: Direction }
  | { type: "ABOUT_ADD_ITEM"; section: "wasIchBaue" | "ausserhalbDesTerminals" }
  | {
      type: "ABOUT_UPDATE_ITEM";
      section: "wasIchBaue" | "ausserhalbDesTerminals";
      id: string;
      patch: Partial<Omit<AboutItem, "id">>;
    }
  | {
      type: "ABOUT_REMOVE_ITEM";
      section: "wasIchBaue" | "ausserhalbDesTerminals";
      id: string;
    }
  | {
      type: "ABOUT_MOVE_ITEM";
      section: "wasIchBaue" | "ausserhalbDesTerminals";
      id: string;
      direction: Direction;
    }
  | { type: "LOAD_DOCUMENT"; doc: ApplicationDocument }
  | { type: "RESET"; locale?: DocLocale };

// swap two neighbours in a list, no-op if the target index is out of range
function move<T>(list: T[], index: number, direction: Direction): T[] {
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= list.length) return list;
  const next = list.slice();
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function moveById<T extends { id: string }>(
  list: T[],
  id: string,
  direction: Direction,
): T[] {
  const index = list.findIndex((it) => it.id === id);
  if (index < 0) return list;
  return move(list, index, direction);
}

// helper so stammdaten branches stay short
function updateStammdaten(
  state: ApplicationDocument,
  patch: Partial<Stammdaten>,
): ApplicationDocument {
  return { ...state, stammdaten: { ...state.stammdaten, ...patch } };
}

// same idea for cv branches
function updateCv(
  state: ApplicationDocument,
  patch: Partial<CvDocument>,
): ApplicationDocument {
  return { ...state, cv: { ...state.cv, ...patch } };
}

function updateAbout(
  state: ApplicationDocument,
  patch: Partial<AboutDocument>,
): ApplicationDocument {
  return { ...state, about: { ...state.about, ...patch } };
}

export function appReducer(
  state: ApplicationDocument,
  action: Action,
): ApplicationDocument {
  switch (action.type) {
    case "STAMM_SET_NAME":
      return updateStammdaten(state, { name: action.value });
    case "STAMM_SET_TITLE":
      return updateStammdaten(state, { title: action.value });
    case "STAMM_SET_KURZ":
      return updateStammdaten(state, { kurz: action.value });

    case "STAMM_ADD_CONTACT":
      return updateStammdaten(state, {
        contact: [
          ...state.stammdaten.contact,
          { id: newId(), label: "", value: "" },
        ],
      });
    case "STAMM_UPDATE_CONTACT":
      return updateStammdaten(state, {
        contact: state.stammdaten.contact.map((row) =>
          row.id === action.id ? { ...row, ...action.patch } : row,
        ),
      });
    case "STAMM_REMOVE_CONTACT":
      return updateStammdaten(state, {
        contact: state.stammdaten.contact.filter((row) => row.id !== action.id),
      });
    case "STAMM_MOVE_CONTACT":
      return updateStammdaten(state, {
        contact: moveById(state.stammdaten.contact, action.id, action.direction),
      });

    case "STAMM_SET_PHOTO_ENABLED":
      return updateStammdaten(state, { photoEnabled: action.enabled });

    // theme: preset overwrites the accent, picker only touches accent
    case "STAMM_SET_THEME_PRESET":
      return updateStammdaten(state, {
        theme: { preset: action.preset, accent: action.accent },
      });
    case "STAMM_SET_ACCENT":
      return updateStammdaten(state, {
        theme: { ...state.stammdaten.theme, accent: action.accent },
      });

    case "STAMM_SET_MODE":
      return updateStammdaten(state, { mode: action.mode });

    // template language only swaps the fixed preview strings, non-destructive
    case "STAMM_SET_TEMPLATE_LOCALE":
      return updateStammdaten(state, { templateLocale: action.locale });

    // schwerpunkt: single chip group shown on the cover page and the letter sidebar
    case "STAMM_RENAME_SCHWERPUNKT":
      return updateStammdaten(state, {
        schwerpunkt: { ...state.stammdaten.schwerpunkt, heading: action.heading },
      });
    case "STAMM_ADD_SCHWERPUNKT_ITEM": {
      const item = action.item.trim();
      if (!item) return state;
      return updateStammdaten(state, {
        schwerpunkt: {
          ...state.stammdaten.schwerpunkt,
          items: [...state.stammdaten.schwerpunkt.items, item],
        },
      });
    }
    case "STAMM_REMOVE_SCHWERPUNKT_ITEM":
      return updateStammdaten(state, {
        schwerpunkt: {
          ...state.stammdaten.schwerpunkt,
          items: state.stammdaten.schwerpunkt.items.filter(
            (_, i) => i !== action.index,
          ),
        },
      });
    case "STAMM_MOVE_SCHWERPUNKT_ITEM":
      return updateStammdaten(state, {
        schwerpunkt: {
          ...state.stammdaten.schwerpunkt,
          items: move(
            state.stammdaten.schwerpunkt.items,
            action.index,
            action.direction,
          ),
        },
      });

    // anlagen: shared attachment list shown on the deckblatt and (optionally)
    // in the anschreiben footer
    case "STAMM_ADD_ANLAGE": {
      const item = action.item.trim();
      if (!item) return state;
      return updateStammdaten(state, {
        anlagen: [...state.stammdaten.anlagen, item],
      });
    }
    case "STAMM_UPDATE_ANLAGE":
      return updateStammdaten(state, {
        anlagen: state.stammdaten.anlagen.map((a, i) =>
          i === action.index ? action.value : a,
        ),
      });
    case "STAMM_REMOVE_ANLAGE":
      return updateStammdaten(state, {
        anlagen: state.stammdaten.anlagen.filter((_, i) => i !== action.index),
      });
    case "STAMM_MOVE_ANLAGE":
      return updateStammdaten(state, {
        anlagen: move(state.stammdaten.anlagen, action.index, action.direction),
      });

    // zeugnisse: named certificates/references; same list shape as anlagen,
    // shown on the deckblatt mappe (replacing the generic "zeugnisse" item)
    case "STAMM_ADD_ZEUGNIS": {
      const item = action.item.trim();
      if (!item) return state;
      return updateStammdaten(state, {
        zeugnisse: [...state.stammdaten.zeugnisse, item],
      });
    }
    case "STAMM_UPDATE_ZEUGNIS":
      return updateStammdaten(state, {
        zeugnisse: state.stammdaten.zeugnisse.map((z, i) =>
          i === action.index ? action.value : z,
        ),
      });
    case "STAMM_REMOVE_ZEUGNIS":
      return updateStammdaten(state, {
        zeugnisse: state.stammdaten.zeugnisse.filter(
          (_, i) => i !== action.index,
        ),
      });
    case "STAMM_MOVE_ZEUGNIS":
      return updateStammdaten(state, {
        zeugnisse: move(
          state.stammdaten.zeugnisse,
          action.index,
          action.direction,
        ),
      });

    // sender address: own postal address printed atop the cover letter
    case "STAMM_SET_SENDER_ADDRESS":
      return updateStammdaten(state, { senderAddress: action.value });
    case "STAMM_SET_SENDER_ENABLED":
      return updateStammdaten(state, { senderEnabled: action.enabled });

    // letters: add a fresh blank, switch active to it
    case "LETTERS_ADD": {
      const letter: CoverLetter = {
        id: newId(),
        label: "Untitled letter",
        company: "Company GmbH",
        recipient: ["Company GmbH", "Recipient Name", "Street 1", "12345 City"],
        cityOverride: null,
        date: new Date().toISOString().slice(0, 10),
        subject: "Subject line",
        reference: "",
        body: "",
        showAnlagen: true,
      };
      return {
        ...state,
        letters: {
          items: [...state.letters.items, letter],
          activeId: letter.id,
        },
      };
    }
    // letters: duplicate the named entry, switch active to the copy
    case "LETTERS_DUPLICATE": {
      const source = state.letters.items.find((l) => l.id === action.id);
      if (!source) return state;
      const copy: CoverLetter = {
        ...source,
        id: newId(),
        label: `${source.label} copy`,
      };
      const sourceIdx = state.letters.items.findIndex((l) => l.id === action.id);
      const next = state.letters.items.slice();
      next.splice(sourceIdx + 1, 0, copy);
      return { ...state, letters: { items: next, activeId: copy.id } };
    }
    // letters: remove; if the active letter is removed, fall back to the first
    // remaining letter, or create a fresh empty one so the list is never empty
    case "LETTERS_REMOVE": {
      const remaining = state.letters.items.filter((l) => l.id !== action.id);
      if (remaining.length === 0) {
        const fresh: CoverLetter = {
          id: newId(),
          label: "Untitled letter",
          company: "Company GmbH",
          recipient: [
            "Company GmbH",
            "Recipient Name",
            "Street 1",
            "12345 City",
          ],
          cityOverride: null,
          date: new Date().toISOString().slice(0, 10),
          subject: "Subject line",
          reference: "",
          body: "",
          showAnlagen: true,
        };
        return {
          ...state,
          letters: { items: [fresh], activeId: fresh.id },
        };
      }
      const activeId =
        state.letters.activeId === action.id
          ? remaining[0].id
          : state.letters.activeId;
      return { ...state, letters: { items: remaining, activeId } };
    }
    case "LETTERS_RENAME":
      return {
        ...state,
        letters: {
          ...state.letters,
          items: state.letters.items.map((l) =>
            l.id === action.id ? { ...l, label: action.label } : l,
          ),
        },
      };
    case "LETTERS_SET_ACTIVE":
      return { ...state, letters: { ...state.letters, activeId: action.id } };

    // patch lands on the active letter only, never on others
    case "LETTER_UPDATE":
      return {
        ...state,
        letters: {
          ...state.letters,
          items: state.letters.items.map((l) =>
            l.id === state.letters.activeId ? { ...l, ...action.patch } : l,
          ),
        },
      };

    // cv profile blurb (separate from stammdaten kurz)
    case "CV_SET_PROFILE":
      return updateCv(state, { profile: action.value });

    // cv skill groups
    case "CV_ADD_SKILL_GROUP": {
      const group: SkillGroup = { id: newId(), heading: "new group", items: [] };
      return updateCv(state, { skillGroups: [...state.cv.skillGroups, group] });
    }
    case "CV_RENAME_SKILL_GROUP":
      return updateCv(state, {
        skillGroups: state.cv.skillGroups.map((g) =>
          g.id === action.id ? { ...g, heading: action.heading } : g,
        ),
      });
    case "CV_REMOVE_SKILL_GROUP":
      return updateCv(state, {
        skillGroups: state.cv.skillGroups.filter((g) => g.id !== action.id),
      });
    case "CV_MOVE_SKILL_GROUP":
      return updateCv(state, {
        skillGroups: moveById(state.cv.skillGroups, action.id, action.direction),
      });

    case "CV_ADD_SKILL": {
      const item = action.item.trim();
      if (!item) return state;
      return updateCv(state, {
        skillGroups: state.cv.skillGroups.map((g) =>
          g.id === action.groupId ? { ...g, items: [...g.items, item] } : g,
        ),
      });
    }
    case "CV_REMOVE_SKILL":
      return updateCv(state, {
        skillGroups: state.cv.skillGroups.map((g) =>
          g.id === action.groupId
            ? { ...g, items: g.items.filter((_, i) => i !== action.index) }
            : g,
        ),
      });
    case "CV_MOVE_SKILL":
      return updateCv(state, {
        skillGroups: state.cv.skillGroups.map((g) =>
          g.id === action.groupId
            ? { ...g, items: move(g.items, action.index, action.direction) }
            : g,
        ),
      });

    // cv sidebar sections (languages, etc.)
    case "CV_ADD_SIDEBAR_SECTION": {
      const section: SidebarSection = {
        id: newId(),
        heading: "new section",
        rows: [],
      };
      return updateCv(state, {
        sidebarSections: [...state.cv.sidebarSections, section],
      });
    }
    case "CV_RENAME_SIDEBAR_SECTION":
      return updateCv(state, {
        sidebarSections: state.cv.sidebarSections.map((s) =>
          s.id === action.id ? { ...s, heading: action.heading } : s,
        ),
      });
    case "CV_REMOVE_SIDEBAR_SECTION":
      return updateCv(state, {
        sidebarSections: state.cv.sidebarSections.filter(
          (s) => s.id !== action.id,
        ),
      });
    case "CV_MOVE_SIDEBAR_SECTION":
      return updateCv(state, {
        sidebarSections: moveById(
          state.cv.sidebarSections,
          action.id,
          action.direction,
        ),
      });

    case "CV_ADD_SIDEBAR_ROW":
      return updateCv(state, {
        sidebarSections: state.cv.sidebarSections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                rows: [...s.rows, { id: newId(), label: "", value: "" }],
              }
            : s,
        ),
      });
    case "CV_UPDATE_SIDEBAR_ROW":
      return updateCv(state, {
        sidebarSections: state.cv.sidebarSections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                rows: s.rows.map((r) =>
                  r.id === action.rowId ? { ...r, ...action.patch } : r,
                ),
              }
            : s,
        ),
      });
    case "CV_REMOVE_SIDEBAR_ROW":
      return updateCv(state, {
        sidebarSections: state.cv.sidebarSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, rows: s.rows.filter((r) => r.id !== action.rowId) }
            : s,
        ),
      });
    case "CV_MOVE_SIDEBAR_ROW":
      return updateCv(state, {
        sidebarSections: state.cv.sidebarSections.map((s) =>
          s.id === action.sectionId
            ? { ...s, rows: moveById(s.rows, action.rowId, action.direction) }
            : s,
        ),
      });

    // cv entry sections (experience, education, ...)
    case "CV_ADD_ENTRY_SECTION": {
      const section: EntrySection = {
        id: newId(),
        heading: "other",
        entries: [],
      };
      return updateCv(state, {
        entrySections: [...state.cv.entrySections, section],
      });
    }
    case "CV_RENAME_ENTRY_SECTION":
      return updateCv(state, {
        entrySections: state.cv.entrySections.map((s) =>
          s.id === action.id ? { ...s, heading: action.heading } : s,
        ),
      });
    case "CV_REMOVE_ENTRY_SECTION":
      return updateCv(state, {
        entrySections: state.cv.entrySections.filter((s) => s.id !== action.id),
      });
    case "CV_MOVE_ENTRY_SECTION":
      return updateCv(state, {
        entrySections: moveById(
          state.cv.entrySections,
          action.id,
          action.direction,
        ),
      });

    case "CV_ADD_ENTRY":
      return updateCv(state, {
        entrySections: state.cv.entrySections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                entries: [
                  ...s.entries,
                  {
                    id: newId(),
                    period: "Period",
                    title: "Role",
                    place: "Organization · City",
                    bullets: [],
                  },
                ],
              }
            : s,
        ),
      });
    case "CV_UPDATE_ENTRY":
      return updateCv(state, {
        entrySections: state.cv.entrySections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                entries: s.entries.map((e) =>
                  e.id === action.entryId ? { ...e, ...action.patch } : e,
                ),
              }
            : s,
        ),
      });
    case "CV_REMOVE_ENTRY":
      return updateCv(state, {
        entrySections: state.cv.entrySections.map((s) =>
          s.id === action.sectionId
            ? { ...s, entries: s.entries.filter((e) => e.id !== action.entryId) }
            : s,
        ),
      });
    case "CV_MOVE_ENTRY":
      return updateCv(state, {
        entrySections: state.cv.entrySections.map((s) =>
          s.id === action.sectionId
            ? {
                ...s,
                entries: moveById(s.entries, action.entryId, action.direction),
              }
            : s,
        ),
      });

    // about: warum_software paragraph + footer closing line
    case "ABOUT_SET_WARUM":
      return updateAbout(state, { warumSoftware: action.value });
    case "ABOUT_SET_FOOTER":
      return updateAbout(state, { footer: action.value });
    case "ABOUT_SET_STAERKEN_HEADING":
      return updateAbout(state, { staerkenHeading: action.value });
    case "ABOUT_SET_WASICHBAUE_HEADING":
      return updateAbout(state, { wasIchBaueHeading: action.value });
    case "ABOUT_SET_AUSSERHALB_HEADING":
      return updateAbout(state, { ausserhalbHeading: action.value });

    // about: stärken cards (2x2 grid)
    case "ABOUT_ADD_STRENGTH": {
      const card: StrengthCard = {
        id: newId(),
        title: "Card title",
        body: "Short description.",
      };
      return updateAbout(state, {
        staerken: [...state.about.staerken, card],
      });
    }
    case "ABOUT_UPDATE_STRENGTH":
      return updateAbout(state, {
        staerken: state.about.staerken.map((c) =>
          c.id === action.id ? { ...c, ...action.patch } : c,
        ),
      });
    case "ABOUT_REMOVE_STRENGTH":
      return updateAbout(state, {
        staerken: state.about.staerken.filter((c) => c.id !== action.id),
      });
    case "ABOUT_MOVE_STRENGTH":
      return updateAbout(state, {
        staerken: moveById(state.about.staerken, action.id, action.direction),
      });

    // about: was_ich_baue and außerhalb_des_terminals share the AboutItem shape
    case "ABOUT_ADD_ITEM": {
      const item: AboutItem = {
        id: newId(),
        key: "year",
        title: "Title",
        body: "Short description.",
      };
      return updateAbout(state, {
        [action.section]: [...state.about[action.section], item],
      });
    }
    case "ABOUT_UPDATE_ITEM":
      return updateAbout(state, {
        [action.section]: state.about[action.section].map((it) =>
          it.id === action.id ? { ...it, ...action.patch } : it,
        ),
      });
    case "ABOUT_REMOVE_ITEM":
      return updateAbout(state, {
        [action.section]: state.about[action.section].filter(
          (it) => it.id !== action.id,
        ),
      });
    case "ABOUT_MOVE_ITEM":
      return updateAbout(state, {
        [action.section]: moveById(
          state.about[action.section],
          action.id,
          action.direction,
        ),
      });

    case "LOAD_DOCUMENT":
      return action.doc;
    case "RESET":
      // reset seeds the editable content in the chosen language and presets
      // templateLocale to match; defaults to current template language
      return createDefaultApplication(
        action.locale ?? state.stammdaten.templateLocale,
      );
  }
}
