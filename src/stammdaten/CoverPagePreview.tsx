// the deckblatt: photo + contact in the sidebar, kicker + big name + mappe in main
// subject + company come from the active cover letter so the cover page reflects
// the currently chosen application

import { useApp } from "../state/AppContext";
import { docStrings } from "../i18n/docStrings";
import { applyPlaceholders } from "../letters/placeholders";
import { findCity } from "./city";

// name splits onto two lines: explicit \n wins, otherwise split a two-word name
function renderName(name: string) {
  if (name.includes("\n")) {
    const parts = name.split("\n");
    return parts.flatMap((part, i) =>
      i === 0 ? [part] : [<br key={i} />, part],
    );
  }
  const words = name.trim().split(/\s+/);
  if (words.length === 2) {
    return [words[0], <br key="br" />, words[1]];
  }
  return name;
}

type Props = {
  photoUrl: string;
};

export function CoverPagePreview({ photoUrl }: Props) {
  const { stammdaten, letters } = useApp();
  const isDev = stammdaten.mode === "dev";
  const d = docStrings(stammdaten.templateLocale);

  // active letter drives subject + company; fall back to first letter if id stale
  const active =
    letters.items.find((l) => l.id === letters.activeId) ?? letters.items[0];

  // location row from stammdaten contact, used in "bei Company · City"
  const city = findCity(stammdaten.contact);

  // named zeugnisse replace the generic "zeugnisse" item when present, so the
  // mappe lists each certificate by name instead of the catch-all label
  const zeugnisItems =
    stammdaten.zeugnisse.length > 0
      ? stammdaten.zeugnisse
      : [d.mappeZeugnisse];

  // the standard documents in the template language, then the zeugnis entries
  const standardMappe = [
    d.mappeAnschreiben,
    d.mappeLebenslauf,
    d.mappeUeberMich,
    ...zeugnisItems,
  ];

  // mappe list = the standard documents plus any anlagen, numbered through
  const mappeItems = [...standardMappe, ...stammdaten.anlagen].map(
    (item, i) => `${String(i + 1).padStart(2, "0")} ${item}`,
  );

  // kicker year follows the letter date, not the wall clock, so a december
  // application exported in january still shows the year it belongs to
  const year =
    (active && Number(active.date.slice(0, 4))) || new Date().getFullYear();
  const kicker = isDev ? (
    <>
      <span className="caret">&gt;</span> {d.bewerbung} / {year}
    </>
  ) : (
    <>
      {d.bewerbung} {year}
    </>
  );

  return (
    <>
      <aside className="cover-sidebar">
        <img
          className={`cover-photo${stammdaten.photoEnabled ? "" : " is-hidden"}`}
          src={photoUrl}
          alt={stammdaten.name}
        />
        {stammdaten.contact.length > 0 && (
          <div className="cover-contact">
            {stammdaten.contact.map((row) => (
              <div key={row.id}>
                <span className="contact-label">{row.label}</span>
                {row.value}
              </div>
            ))}
          </div>
        )}
      </aside>

      <section className="cover-main">
        <div>
          <div className="cover-kicker">{kicker}</div>
          <h1 className="cover-name">{renderName(stammdaten.name)}</h1>
          <div className="cover-subtitle">{stammdaten.title}</div>
        </div>

        {active && (
          <div className="cover-mappe">
            <h2 className="sec-label">
              {isDev ? "// " : ""}
              {d.bewerbungAls}
            </h2>
            <div className="cover-subject">
              {applyPlaceholders(active.subject, active.company)}
            </div>
            <div className="cover-subject-company">
              {d.bei} {active.company}
              {city ? ` · ${city}` : ""}
            </div>
            <div className="cover-mappe-label">
              {isDev ? (
                <>
                  <span className="caret">&gt;</span> {d.mappeEnthaelt}
                </>
              ) : (
                d.mappeEnthaelt
              )}
            </div>
            <div className="cover-mappe-list">
              {mappeItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
