// about-me editor: four sections matching the aboutme screenshots
// - warum_software: one freeform paragraph
// - stärken: 2x2 grid of small cards (title + body), reorderable
// - was_ich_baue: list of (key, bold title, body) rows
// - außerhalb_des_terminals: same shape as was_ich_baue

import { useApp, useAppDispatch } from "../state/AppContext";
import { useT } from "../i18n/LocaleContext";
import type { AboutItem, Direction, StrengthCard } from "../types";
import { TextAreaField } from "../editor/TextAreaField";
import { TextField } from "../editor/TextField";

type ItemSection = "wasIchBaue" | "ausserhalbDesTerminals";

function StrengthEditor({
  card,
  isFirst,
  isLast,
  onUpdate,
  onMove,
  onRemove,
}: {
  card: StrengthCard;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (patch: Partial<Omit<StrengthCard, "id">>) => void;
  onMove: (direction: Direction) => void;
  onRemove: () => void;
}) {
  const t = useT();
  return (
    <div className="entry-editor">
      <div className="entry-header">
        <button
          type="button"
          className="row-btn"
          disabled={isFirst}
          onClick={() => onMove("up")}
          title={t("row.moveUp")}
        >
          ↑
        </button>
        <button
          type="button"
          className="row-btn"
          disabled={isLast}
          onClick={() => onMove("down")}
          title={t("row.moveDown")}
        >
          ↓
        </button>
        <button
          type="button"
          className="row-btn danger"
          onClick={onRemove}
          title={t("about.staerken.removeTitle")}
        >
          {t("cv.entry.remove")}
        </button>
      </div>
      <TextField
        label={t("about.staerken.title")}
        value={card.title}
        placeholder={t("about.staerken.titlePlaceholder")}
        onChange={(title) => onUpdate({ title })}
      />
      <TextAreaField
        label={t("about.staerken.body")}
        value={card.body}
        placeholder={t("about.staerken.bodyPlaceholder")}
        rows={2}
        onChange={(body) => onUpdate({ body })}
      />
    </div>
  );
}

function ItemEditor({
  item,
  isFirst,
  isLast,
  onUpdate,
  onMove,
  onRemove,
}: {
  item: AboutItem;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (patch: Partial<Omit<AboutItem, "id">>) => void;
  onMove: (direction: Direction) => void;
  onRemove: () => void;
}) {
  const t = useT();
  return (
    <div className="entry-editor">
      <div className="entry-header">
        <button
          type="button"
          className="row-btn"
          disabled={isFirst}
          onClick={() => onMove("up")}
          title={t("row.moveUp")}
        >
          ↑
        </button>
        <button
          type="button"
          className="row-btn"
          disabled={isLast}
          onClick={() => onMove("down")}
          title={t("row.moveDown")}
        >
          ↓
        </button>
        <button
          type="button"
          className="row-btn danger"
          onClick={onRemove}
          title={t("about.item.removeTitle")}
        >
          {t("cv.entry.remove")}
        </button>
      </div>
      <TextField
        label={t("about.item.key")}
        value={item.key}
        placeholder={t("about.item.keyPlaceholder")}
        onChange={(key) => onUpdate({ key })}
      />
      <TextField
        label={t("about.item.title")}
        value={item.title}
        placeholder={t("about.item.titlePlaceholder")}
        onChange={(title) => onUpdate({ title })}
      />
      <TextAreaField
        label={t("about.item.body")}
        value={item.body}
        placeholder={t("about.item.bodyPlaceholder")}
        rows={2}
        onChange={(body) => onUpdate({ body })}
      />
    </div>
  );
}

function ItemListSection({
  headingValue,
  onHeadingChange,
  section,
}: {
  headingValue: string;
  onHeadingChange: (value: string) => void;
  section: ItemSection;
}) {
  const { about } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();
  const items = about[section];
  return (
    <section className="editor-section">
      <TextField
        label={t("about.heading.label")}
        value={headingValue}
        onChange={onHeadingChange}
      />
      {items.map((item, i) => (
        <ItemEditor
          key={item.id}
          item={item}
          isFirst={i === 0}
          isLast={i === items.length - 1}
          onUpdate={(patch) =>
            dispatch({ type: "ABOUT_UPDATE_ITEM", section, id: item.id, patch })
          }
          onMove={(direction) =>
            dispatch({
              type: "ABOUT_MOVE_ITEM",
              section,
              id: item.id,
              direction,
            })
          }
          onRemove={() =>
            dispatch({ type: "ABOUT_REMOVE_ITEM", section, id: item.id })
          }
        />
      ))}
      <button
        type="button"
        className="add-btn"
        onClick={() => dispatch({ type: "ABOUT_ADD_ITEM", section })}
      >
        {t("about.item.add")}
      </button>
    </section>
  );
}

export function AboutEditor() {
  const { about } = useApp();
  const dispatch = useAppDispatch();
  const t = useT();

  return (
    <div className="editor">
      <section className="editor-section">
        <h2>{t("about.section.warum")}</h2>
        <TextAreaField
          label={t("about.warum.label")}
          value={about.warumSoftware}
          placeholder={t("about.warum.placeholder")}
          rows={5}
          onChange={(value) => dispatch({ type: "ABOUT_SET_WARUM", value })}
        />
      </section>

      <section className="editor-section">
        <TextField
          label={t("about.heading.label")}
          value={about.staerkenHeading}
          onChange={(value) =>
            dispatch({ type: "ABOUT_SET_STAERKEN_HEADING", value })
          }
        />
        {about.staerken.map((card, i) => (
          <StrengthEditor
            key={card.id}
            card={card}
            isFirst={i === 0}
            isLast={i === about.staerken.length - 1}
            onUpdate={(patch) =>
              dispatch({ type: "ABOUT_UPDATE_STRENGTH", id: card.id, patch })
            }
            onMove={(direction) =>
              dispatch({
                type: "ABOUT_MOVE_STRENGTH",
                id: card.id,
                direction,
              })
            }
            onRemove={() =>
              dispatch({ type: "ABOUT_REMOVE_STRENGTH", id: card.id })
            }
          />
        ))}
        <button
          type="button"
          className="add-btn"
          onClick={() => dispatch({ type: "ABOUT_ADD_STRENGTH" })}
        >
          {t("about.staerken.add")}
        </button>
      </section>

      <ItemListSection
        headingValue={about.wasIchBaueHeading}
        onHeadingChange={(value) =>
          dispatch({ type: "ABOUT_SET_WASICHBAUE_HEADING", value })
        }
        section="wasIchBaue"
      />
      <ItemListSection
        headingValue={about.ausserhalbHeading}
        onHeadingChange={(value) =>
          dispatch({ type: "ABOUT_SET_AUSSERHALB_HEADING", value })
        }
        section="ausserhalbDesTerminals"
      />

      <section className="editor-section">
        <h2>{t("about.section.footer")}</h2>
        <TextField
          label={t("about.footer.label")}
          value={about.footer}
          placeholder={t("about.footer.placeholder")}
          onChange={(value) => dispatch({ type: "ABOUT_SET_FOOTER", value })}
        />
      </section>
    </div>
  );
}
