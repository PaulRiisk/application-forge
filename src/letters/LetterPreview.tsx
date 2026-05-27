// the anschreiben A4 page
// sidebar reuses stammdaten identity + kurz + schwerpunkt
// main has top kicker row (an / datum), betreff, body, signature, attachments

import { useApp } from "../state/AppContext";
import { renderMarkdown } from "../markdown/render";

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

// "27. mai 2026" — lowercase de month, no padding, dot after day
function formatDate(iso: string): string {
  // iso is yyyy-mm-dd from the date input; build a local date to avoid tz drift
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(y, m - 1, d);
  const month = date.toLocaleDateString("de-DE", { month: "long" }).toLowerCase();
  return `${d}. ${month} ${y}`;
}

type Props = {
  signatureUrl: string | null;
};

export function LetterPreview({ signatureUrl }: Props) {
  const { stammdaten, letters } = useApp();
  const active =
    letters.items.find((l) => l.id === letters.activeId) ?? letters.items[0];
  const isDev = stammdaten.mode === "dev";
  const prefix = isDev ? "// " : "";

  const locationRow = stammdaten.contact.find((r) =>
    r.label.toLowerCase().includes("location"),
  );
  const stammCity = locationRow?.value.split(",")[0]?.trim() ?? "";
  const city = active?.cityOverride?.trim() || stammCity;
  const dateLine = active ? `${city ? city + ", " : ""}${formatDate(active.date)}` : "";

  return (
    <>
      <aside className="letter-sidebar">
        <h1 className="letter-name">{renderName(stammdaten.name)}</h1>
        <div className="letter-kicker">
          {isDev && <span className="caret">&gt;</span>}
          {isDev ? " anschreiben" : "anschreiben"}
        </div>

        {stammdaten.contact.length > 0 && (
          <div className="contact letter-contact">
            {stammdaten.contact.map((row) => (
              <div key={row.id}>
                <span className="contact-label">{row.label}</span>
                {row.value}
              </div>
            ))}
          </div>
        )}

        {stammdaten.kurz.trim() !== "" && (
          <>
            <h2 className="sec-label">{prefix}kurz</h2>
            <p className="letter-kurz">{stammdaten.kurz}</p>
          </>
        )}

        {stammdaten.schwerpunkt.items.length > 0 && (
          <>
            <h2 className="sec-label">
              {prefix}
              {stammdaten.schwerpunkt.heading}
            </h2>
            <div className="chips">
              {stammdaten.schwerpunkt.items.map((item, i) => (
                <span className="chip" key={i}>
                  {item}
                </span>
              ))}
            </div>
          </>
        )}
      </aside>

      <section className="letter-main">
        {active && (
          <>
            <div className="letter-top-row">
              <div className="letter-recipient">
                <div className="letter-mini-label">
                  {isDev ? <><span className="caret">&gt;</span> an</> : "empfänger"}
                </div>
                {active.recipient.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
              <div className="letter-date">
                <div className="letter-mini-label">
                  {isDev ? <><span className="caret">&gt;</span> datum</> : "datum"}
                </div>
                {dateLine}
              </div>
            </div>

            <div className="letter-subject-block">
              <h2 className="sec-label">{prefix}betreff</h2>
              <div className="letter-subject">{active.subject}</div>
              {active.reference.trim() !== "" && (
                <div className="letter-reference">{active.reference}</div>
              )}
            </div>

            <div className="letter-body">{renderMarkdown(active.body)}</div>

            {signatureUrl && (
              <img
                className="letter-signature"
                src={signatureUrl}
                alt="Signature"
              />
            )}

            <div className="letter-signed">{stammdaten.name.replace(/\n/g, " ")}</div>

            <div className="letter-attachments">
              <div className="letter-mini-label">
                {isDev ? <><span className="caret">&gt;</span> anlagen</> : "anlagen"}
              </div>
              <div className="letter-attachments-list">
                lebenslauf.pdf · zeugnis_ba.pdf · arbeitszeugnis_ressortmanagel.pdf
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}
