// about-me editor: four sections matching the aboutme screenshots
// - warum_software: one freeform paragraph
// - stärken: 2x2 grid of small cards (title + body), reorderable
// - was_ich_baue: list of (key, bold title, body) rows
// - außerhalb_des_terminals: same shape as was_ich_baue

import { useApp, useAppDispatch } from "../state/AppContext";
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
  return (
    <div className="entry-editor">
      <div className="entry-header">
        <button
          type="button"
          className="row-btn"
          disabled={isFirst}
          onClick={() => onMove("up")}
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          className="row-btn"
          disabled={isLast}
          onClick={() => onMove("down")}
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          className="row-btn danger"
          onClick={onRemove}
          title="Remove card"
        >
          × Remove
        </button>
      </div>
      <TextField
        label="Title"
        value={card.title}
        placeholder="systematisch"
        onChange={(title) => onUpdate({ title })}
      />
      <TextAreaField
        label="Body"
        value={card.body}
        placeholder="One or two short sentences."
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
  return (
    <div className="entry-editor">
      <div className="entry-header">
        <button
          type="button"
          className="row-btn"
          disabled={isFirst}
          onClick={() => onMove("up")}
          title="Move up"
        >
          ↑
        </button>
        <button
          type="button"
          className="row-btn"
          disabled={isLast}
          onClick={() => onMove("down")}
          title="Move down"
        >
          ↓
        </button>
        <button
          type="button"
          className="row-btn danger"
          onClick={onRemove}
          title="Remove item"
        >
          × Remove
        </button>
      </div>
      <TextField
        label="Key (year or category)"
        value={item.key}
        placeholder="2025"
        onChange={(key) => onUpdate({ key })}
      />
      <TextField
        label="Title"
        value={item.title}
        placeholder="Project title"
        onChange={(title) => onUpdate({ title })}
      />
      <TextAreaField
        label="Body"
        value={item.body}
        placeholder="One short sentence."
        rows={2}
        onChange={(body) => onUpdate({ body })}
      />
    </div>
  );
}

function ItemListSection({
  heading,
  section,
}: {
  heading: string;
  section: ItemSection;
}) {
  const { about } = useApp();
  const dispatch = useAppDispatch();
  const items = about[section];
  return (
    <section className="editor-section">
      <h2>{heading}</h2>
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
        + Add item
      </button>
    </section>
  );
}

export function AboutEditor() {
  const { about } = useApp();
  const dispatch = useAppDispatch();

  return (
    <div className="editor">
      <section className="editor-section">
        <h2>warum_software</h2>
        <TextAreaField
          label="Paragraph"
          value={about.warumSoftware}
          placeholder="What pulled you into software."
          rows={5}
          onChange={(value) => dispatch({ type: "ABOUT_SET_WARUM", value })}
        />
      </section>

      <section className="editor-section">
        <h2>stärken (2×2 cards)</h2>
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
          + Add card
        </button>
      </section>

      <ItemListSection heading="was_ich_baue" section="wasIchBaue" />
      <ItemListSection
        heading="außerhalb_des_terminals"
        section="ausserhalbDesTerminals"
      />
    </div>
  );
}
