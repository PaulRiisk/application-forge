// provides the current ui locale + a t() lookup to the whole tree
// toggle button lives in the topbar and calls cycleLocale
// the t() helper accepts a string key and (optionally) a single string arg
// for keys whose value is a (label) => string template (e.g. delete confirms)

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { STRINGS, type UiLocale } from "./strings";
import { useUiLocale } from "./useUiLocale";

type LocaleContextValue = {
  locale: UiLocale;
  toggleLocale: () => void;
  t: (key: string, arg?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, toggleLocale] = useUiLocale();

  // lookup is keyed on the current locale; falls back to the english string
  // (then to the key itself) if a translation is missing — defensive only
  const t = useCallback(
    (key: string, arg?: string) => {
      const map = STRINGS[locale] as Record<
        string,
        string | ((arg: string) => string)
      >;
      const fallbackMap = STRINGS.en as Record<
        string,
        string | ((arg: string) => string)
      >;
      const raw = map[key] ?? fallbackMap[key] ?? key;
      if (typeof raw === "function") return raw(arg ?? "");
      return raw;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, toggleLocale, t }),
    [locale, toggleLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}

// convenience for components that only need t()
export function useT(): LocaleContextValue["t"] {
  return useLocale().t;
}
