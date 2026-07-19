// the palette modal: a fuzzy-filtered, grouped listbox over fields, sections
// and actions. keyboard ↑/↓ + Enter, mouse hover/click, Esc / outside-click.
// open-state + navigateTo come from PaletteContext. CommandPalette gates on
// open; PaletteBody holds the per-session state and is remounted on each open
// (via key) so query/selection start fresh without a reset effect

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp, useAppDispatch } from "../state/AppContext";
import { useLocale } from "../i18n/LocaleContext";
import { PRESETS } from "../theme/presets";
import { usePalette } from "./PaletteContext";
import {
  ACTION_ENTRIES,
  FIELD_ENTRIES,
  NAV_ENTRIES,
  type ActionKind,
} from "./registry";
import { fuzzyScore } from "./fuzzy";
import "./palette.css";

type Props = {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  onExport: () => void;
};

type Group = "fields" | "sections" | "actions";

// a flattened, runnable command with a resolved display label.
// `terms` are the strings the fuzzy matcher scores against (label + keywords)
type Command = {
  id: string;
  label: string;
  terms: string[];
  group: Group;
  run: () => void;
};

// rendered top-to-bottom in this order; the flat index follows the same order
const GROUP_ORDER: { group: Group; headingKey: string }[] = [
  { group: "fields", headingKey: "palette.group.fields" },
  { group: "sections", headingKey: "palette.group.sections" },
  { group: "actions", headingKey: "palette.group.actions" },
];

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
      case "undo":
        return dispatch({ type: "UNDO" });
      case "redo":
        return dispatch({ type: "REDO" });
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
    const terms = (labelKey: string, keywords?: string[]) => [
      t(labelKey),
      ...(keywords ?? []),
    ];

    const fieldCmds: Command[] = FIELD_ENTRIES.map((e) => ({
      id: e.id,
      label: t(e.labelKey),
      terms: terms(e.labelKey, e.keywords),
      group: "fields",
      run: () => navigateTo(e.tab, e.sectionId, e.fieldId),
    }));
    const sectionCmds: Command[] = NAV_ENTRIES.map((e) => ({
      id: e.id,
      label: t(e.labelKey),
      terms: terms(e.labelKey, e.keywords),
      group: "sections",
      run: () => navigateTo(e.tab, e.sectionId),
    }));
    const actionCmds: Command[] = ACTION_ENTRIES.map((e) => ({
      id: e.id,
      label: t(e.labelKey),
      terms: terms(e.labelKey, e.keywords),
      group: "actions",
      run: () => runAction(e.action),
    }));
    return [...fieldCmds, ...sectionCmds, ...actionCmds];
    // t identity changes with locale; navigateTo/runAction read fresh refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const q = query.trim();

  // score each command (best of its terms); drop non-matches when querying
  const scored = useMemo(() => {
    if (!q) return commands.map((cmd) => ({ cmd, score: 0 }));
    const out: { cmd: Command; score: number }[] = [];
    for (const cmd of commands) {
      let best: number | null = null;
      for (const term of cmd.terms) {
        const s = fuzzyScore(term, q);
        if (s !== null && (best === null || s > best)) best = s;
      }
      if (best !== null) out.push({ cmd, score: best });
    }
    return out;
  }, [commands, q]);

  // group, and when querying sort each group by score (stable order otherwise)
  const grouped = GROUP_ORDER.map(({ group, headingKey }) => {
    const items = scored.filter((s) => s.cmd.group === group);
    if (q) items.sort((a, b) => b.score - a.score);
    return { headingKey, items: items.map((s) => s.cmd) };
  });

  // flat order must match the rendered order for ↑/↓ indexing
  const ordered = grouped.flatMap((g) => g.items);

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
      <li key={headingKey} className="palette-group" role="presentation">
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

  // running flat index so each group knows where it starts in `ordered`
  let flatStart = 0;

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
            grouped.map(({ headingKey, items }) => {
              const node = renderGroup(headingKey, items, flatStart);
              flatStart += items.length;
              return node;
            })
          )}
        </ul>
      </div>
    </div>
  );
}
