// undo/redo wrapper around the document reducer
// past/present/future stacks of whole documents (they're small, plain json).
// consecutive actions of the same type within a short window are coalesced
// into one history entry so typing a sentence is one undo step, not fifty

import type { ApplicationDocument } from "../types";
import { appReducer, type Action } from "./reducer";

export type HistoryAction = Action | { type: "UNDO" } | { type: "REDO" };

export type HistoryState = {
  past: ApplicationDocument[];
  present: ApplicationDocument;
  future: ApplicationDocument[];
  // coalescing bookkeeping: last mutating action type + when it happened
  lastActionType: string | null;
  lastActionTime: number;
};

const MAX_PAST = 100;
const COALESCE_MS = 1000;

export function initHistory(doc: ApplicationDocument): HistoryState {
  return {
    past: [],
    present: doc,
    future: [],
    lastActionType: null,
    lastActionTime: 0,
  };
}

export function historyReducer(
  state: HistoryState,
  action: HistoryAction,
): HistoryState {
  if (action.type === "UNDO") {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
      lastActionType: null,
      lastActionTime: 0,
    };
  }

  if (action.type === "REDO") {
    if (state.future.length === 0) return state;
    const [next, ...rest] = state.future;
    return {
      past: [...state.past, state.present],
      present: next,
      future: rest,
      lastActionType: null,
      lastActionTime: 0,
    };
  }

  const next = appReducer(state.present, action);
  if (next === state.present) return state;

  // same action type in quick succession updates the present in place so a
  // typing burst collapses into the entry pushed by its first keystroke
  const now = Date.now();
  const coalesce =
    action.type === state.lastActionType &&
    now - state.lastActionTime < COALESCE_MS;

  const past = coalesce ? state.past : [...state.past, state.present];
  return {
    past: past.length > MAX_PAST ? past.slice(past.length - MAX_PAST) : past,
    present: next,
    future: [],
    lastActionType: action.type,
    lastActionTime: now,
  };
}
