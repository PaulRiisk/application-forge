// provides the application document and dispatch to the whole app
// state and dispatch are split into two contexts so dispatch-only components
// don't re-render when the doc changes
// the reducer is wrapped in an undo/redo history (see history.ts); ctrl+z /
// ctrl+shift+z / ctrl+y are handled globally here, replacing the native
// per-input undo — the document is the single source of truth anyway

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { ApplicationDocument } from "../types";
import { createDefaultApplication } from "../defaults";
import {
  historyReducer,
  initHistory,
  type HistoryAction,
  type HistoryState,
} from "./history";
import { loadFromLocalStorage, saveToLocalStorage } from "./persistence";

type Dispatch = (action: HistoryAction) => void;

const AppStateContext = createContext<ApplicationDocument | null>(null);
const AppDispatchContext = createContext<Dispatch | null>(null);

function initState(): HistoryState {
  return initHistory(loadFromLocalStorage() ?? createDefaultApplication());
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(historyReducer, undefined, initState);
  const doc = state.present;

  // debounce-save on every change so we don't hammer localStorage
  const saveTimer = useRef<number | null>(null);
  useEffect(() => {
    if (saveTimer.current !== null) {
      window.clearTimeout(saveTimer.current);
    }
    saveTimer.current = window.setTimeout(() => {
      saveToLocalStorage(doc);
    }, 300);
    return () => {
      if (saveTimer.current !== null) {
        window.clearTimeout(saveTimer.current);
      }
    };
  }, [doc]);

  // global undo/redo shortcuts; dispatch identity is stable so bind once
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "REDO" : "UNDO" });
      } else if (key === "y") {
        e.preventDefault();
        dispatch({ type: "REDO" });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <AppStateContext.Provider value={doc}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// hooks throw if used outside the provider so we fail loud, not silent
export function useApp(): ApplicationDocument {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function useAppDispatch(): Dispatch {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error("useAppDispatch must be used inside <AppProvider>");
  return ctx;
}
