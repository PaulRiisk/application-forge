// command palette provider: owns open-state, the global ⌘K/Ctrl+K listener,
// and navigateTo (switch tab → force-open the section → scroll → focus first
// field). exposes usePalette() for triggers and useNavTarget() so EditorSection
// can force itself open when it's the jump target.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TabId } from "../topbar/Topbar";
import { CommandPalette } from "./CommandPalette";

// which section was targeted, plus a nonce so repeat jumps to the same section
// still re-trigger the open/scroll/focus effect
type NavTarget = { sectionId: string; nonce: number };

type PaletteContextValue = {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
  navigateTo: (tab: TabId, sectionId: string) => void;
  // current nonce if this section is the active jump target, else null
  navNonceFor: (sectionId: string) => number | null;
};

const PaletteContext = createContext<PaletteContextValue | null>(null);

// wait two frames so react commits the new tab and the browser lays it out
// before we go looking for the target element (same trick App uses for export)
function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

type Props = {
  children: ReactNode;
  setActiveTab: (tab: TabId) => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => void;
};

export function PaletteProvider({
  children,
  setActiveTab,
  onSave,
  onLoad,
  onReset,
  onExport,
}: Props) {
  const [open, setOpen] = useState(false);
  const [navTarget, setNavTarget] = useState<NavTarget | null>(null);
  // remember what to restore focus to when the palette closes
  const triggerRef = useRef<Element | null>(null);

  const openPalette = useCallback(() => {
    triggerRef.current = document.activeElement;
    setOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    // hand focus back to whatever opened the palette
    if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
  }, []);

  // global shortcut: ⌘K / Ctrl+K toggles, Esc closes
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) triggerRef.current = document.activeElement;
          return !v;
        });
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        closePalette();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closePalette]);

  const navigateTo = useCallback(
    (tab: TabId, sectionId: string) => {
      setActiveTab(tab);
      // bump the nonce so EditorSection re-opens even on a repeat jump
      setNavTarget((prev) => ({ sectionId, nonce: (prev?.nonce ?? 0) + 1 }));
      void (async () => {
        // let the tab body mount + lay out before we touch the DOM
        await nextFrame();
        await nextFrame();
        const el = document.getElementById(sectionId);
        if (!el) return;
        el.scrollIntoView({ block: "start", behavior: "smooth" });
        // focus the first real field, never the collapse-toggle header
        const focusable = el.querySelector<HTMLElement>(
          "input, textarea, select",
        );
        focusable?.focus();
      })();
    },
    [setActiveTab],
  );

  const navNonceFor = useCallback(
    (sectionId: string) =>
      navTarget && navTarget.sectionId === sectionId ? navTarget.nonce : null,
    [navTarget],
  );

  const value = useMemo(
    () => ({ open, openPalette, closePalette, navigateTo, navNonceFor }),
    [open, openPalette, closePalette, navigateTo, navNonceFor],
  );

  return (
    <PaletteContext.Provider value={value}>
      {children}
      <CommandPalette
        onSave={onSave}
        onLoad={onLoad}
        onReset={onReset}
        onExport={onExport}
      />
    </PaletteContext.Provider>
  );
}

export function usePalette(): PaletteContextValue {
  const ctx = useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used inside <PaletteProvider>");
  return ctx;
}

// EditorSection calls this with its id; a non-null nonce means "force open now"
export function useNavNonce(sectionId: string | undefined): number | null {
  const ctx = useContext(PaletteContext);
  if (!ctx || !sectionId) return null;
  return ctx.navNonceFor(sectionId);
}
