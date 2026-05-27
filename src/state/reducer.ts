// all document mutations live here as a typed action union
// every action returns a new ApplicationDocument, no in-place mutation
// phase 1 covers stammdaten actions only; later phases extend the union

import type {
  ApplicationDocument,
  ContactRow,
  Direction,
  LayoutMode,
  Stammdaten,
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
  | { type: "STAMM_RENAME_SCHWERPUNKT"; heading: string }
  | { type: "STAMM_ADD_SCHWERPUNKT_ITEM"; item: string }
  | { type: "STAMM_REMOVE_SCHWERPUNKT_ITEM"; index: number }
  | { type: "STAMM_MOVE_SCHWERPUNKT_ITEM"; index: number; direction: Direction }
  | { type: "LOAD_DOCUMENT"; doc: ApplicationDocument }
  | { type: "RESET" };

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

    case "LOAD_DOCUMENT":
      return action.doc;
    case "RESET":
      return createDefaultApplication();
  }
}
