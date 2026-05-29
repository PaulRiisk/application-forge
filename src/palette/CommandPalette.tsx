// the palette modal: a filtered, grouped listbox over nav targets + actions
// keyboard ↑/↓ + Enter, mouse hover/click, Esc / outside-click to close
// open-state + navigateTo come from PaletteContext. CommandPalette gates on
// open; PaletteBody holds the per-session state and is remounted on each open
// (via key) so query/selection start fresh without a reset effect

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, useAppDispatch } from "../state/AppContext";
import { useLocale } from "../i18n/LocaleContext";
import { PRESETS } from "../theme/presets";
import { usePalette } from "./PaletteContext";
import { ACTION_ENTRIES, NAV_ENTRIES, type ActionKind } from "./registry";
import "./palette.css";

type Props = {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => void;
};

// a flattened, runnable command with a resolved display label
type Command = {
  id: string;
  label: string;
  haystack: string;
  group: "fields" | "actions";
  run: () => void;
};

export function CommandPalette(props: Props) {
  const { open } = usePalette();
  // remount on each open so the body's initial state is the reset state
  return open ? <PaletteBody {...props} /> : null;
}

function PaletteBody({ onSave, onLoad, onReset, onExport }: Props) {
  const { closePalette, navigateTo } = usePalette();
  const { t, locale } = useLocale();
  const dispatch = useAppDispatch();
  // subscribing to the doc is harmless — the body only mounts while open
  useApp();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // map an action kind to its handler; reads current dispatch/callbacks
  const runAction = (kind: ActionKind) => {
    switch (kind) {
      case "save":
        return onSave();
      case "load":
        return onLoad();
      case "reset":
        return onReset();
      case "export":
        return onExport();
      case "modeDev":
        return dispatch({ type: "STAMM_SET_MODE", mode: "dev" });
      case "modeClassic":
        return dispatch({ type: "STAMM_SET_MODE", mode: "classic" });
      case "themeBlue":
        return dispatch({ type: "STAMM_SET_THEME_PRESET", preset: "blue", accent: PRESETS.blue.accent });
      case "themeTeal":
        return dispatch({ type: "STAMM_SET_THEME_PRESET", preset: "teal", accent: PRESETS.teal.accent });
      case "themeRust":
        return dispatch({ type: "STAMM_SET_THEME_PRESET", preset: "rust", accent: PRESETS.rust.accent });
    }
  };

  // full command list (translated); rebuilt only when the locale changes
  const commands = useMemo<Command[]>(() => {
    const build = (
      entries: { id: string; labelKey: string; keywords?: string[] }[],
      group: "fields" | "actions",
      run: (id: string) => void,
    ): Command[] =>
      entries.map((e) => {
        const label = t(e.labelKey);
        return {
          id: e.id,
          label,
          haystack: [label, ...(e.keywords ?? [])].join(" ").toLowerCase(),
          group,
          run: () => run(e.id),
        };
      });

    const navCmds = build(NAV_ENTRIES, "fields", (id) => {
      const entry = NAV_ENTRIES.find((n) => n.id === id)!;
      navigateTo(entry.tab, entry.sectionId);
    });
    const actionCmds = build(ACTION_ENTRIES, "actions", (id) => {
      const entry = ACTION_ENTRIES.find((a) => a.id === id)!;
      runAction(entry.action);
    });
    return [...navCmds, ...actionCmds];
    // t identity changes with locale; navigateTo/runAction read fresh refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const q = query.trim().toLowerCase();
  const filtered = q ? commands.filter((c) => c.haystack.includes(q)) : commands;
  const fieldResults = filtered.filter((c) => c.group === "fields");
  const actionResults = filtered.filter((c) => c.group === "actions");
  // flat order must match the rendered order for ↑/↓ indexing
  const ordered = [...fieldResults, ...actionResults];

  // clamp on read so a shrinking list never points past the end (no effect)
  const safeIndex = Math.min(activeIndex, Math.max(0, ordered.length - 1));

  // focus the input on mount; scroll the active row into view as it moves
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${safeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [safeIndex]);

  const select = (cmd: Command | undefined) => {
    if (!cmd) return;
    closePalette();
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(Math.min(safeIndex + 1, ordered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(Math.max(safeIndex - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(ordered[safeIndex]);
    }
    // Esc is handled globally by the provider
  };

  // render one group; flatStart is the index of its first item in `ordered`
  const renderGroup = (
    headingKey: string,
    items: Command[],
    flatStart: number,
  ) => {
    if (items.length === 0) return null;
    return (
      <li className="palette-group" role="presentation">
        <div className="palette-group-label">{t(headingKey)}</div>
        <ul role="presentation">
          {items.map((cmd, i) => {
            const index = flatStart + i;
            const active = index === safeIndex;
            return (
              <li
                key={cmd.id}
                id={`palette-opt-${cmd.id}`}
                role="option"
                aria-selected={active}
                data-index={index}
                className={`palette-option${active ? " active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(e) => {
                  // mousedown so we beat the input losing focus
                  e.preventDefault();
                  select(cmd);
                }}
              >
                {cmd.label}
              </li>
            );
          })}
        </ul>
      </li>
    );
  };

  const activeCmd = ordered[safeIndex];

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={t("palette.placeholder")}
      onMouseDown={closePalette}
    >
      <div className="palette" onMouseDown={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="palette-input"
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-listbox"
          aria-activedescendant={
            activeCmd ? `palette-opt-${activeCmd.id}` : undefined
          }
          placeholder={t("palette.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <ul
          ref={listRef}
          id="palette-listbox"
          className="palette-list"
          role="listbox"
        >
          {ordered.length === 0 ? (
            <li className="palette-empty" role="presentation">
              {t("palette.empty")}
            </li>
          ) : (
            <>
              {renderGroup("palette.group.fields", fieldResults, 0)}
              {renderGroup(
                "palette.group.actions",
                actionResults,
                fieldResults.length,
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
