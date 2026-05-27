// provides the application document and dispatch to the whole app
// state and dispatch are split into two contexts so dispatch-only components
// don't re-render when the doc changes

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
import { appReducer, type Action } from "./reducer";
import { loadFromLocalStorage, saveToLocalStorage } from "./persistence";

type Dispatch = (action: Action) => void;

const AppStateContext = createContext<ApplicationDocument | null>(null);
const AppDispatchContext = createContext<Dispatch | null>(null);

function initDocument(): ApplicationDocument {
  return loadFromLocalStorage() ?? createDefaultApplication();
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [doc, dispatch] = useReducer(appReducer, undefined, initDocument);

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
