// the deckblatt: photo + contact in the sidebar, kicker + big name + mappe in main
// subject + company come from the active cover letter so the cover page reflects
// the currently chosen application

import { useApp } from "../state/AppContext";
import { docStrings } from "../i18n/docStrings";

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
  const locationRow = stammdaten.contact.find(
    (r) => r.label.toLowerCase().includes("location") || r.label.toLowerCase().includes("ort"),
  );
  const city = locationRow?.value.split(",")[0]?.trim() ?? "";

  // the standard four documents, in the template language
  const standardMappe = [
    d.mappeAnschreiben,
    d.mappeLebenslauf,
    d.mappeUeberMich,
    d.mappeZeugnisse,
  ];

  // mappe list = the standard four documents plus any anlagen, numbered through
  const mappeItems = [...standardMappe, ...stammdaten.anlagen].map(
    (item, i) => `${String(i + 1).padStart(2, "0")} ${item}`,
  );

  const year = new Date().getFullYear();
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
            <div className="cover-subject">{active.subject}</div>
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
