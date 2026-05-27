// the about-me A4 page
// single full-width column with a 2-col grid inside the body
// pulls name + email from stammdaten for the page header and footer

import { useApp } from "../state/AppContext";

// pull the user's email from the stammdaten contact rows, fall back to "" if missing
function pickEmail(contact: { label: string; value: string }[]): string {
  const row = contact.find((r) => r.label.toLowerCase().includes("email"));
  return row?.value ?? "";
}

export function AboutPreview() {
  const { stammdaten, about } = useApp();
  const isDev = stammdaten.mode === "dev";
  const prefix = isDev ? "// " : "";
  const email = pickEmail(stammdaten.contact);
  const authorName = stammdaten.name.replace(/\n/g, " ");

  return (
    <section className="about-page">
      <header className="about-header">
        <div className="about-kicker">
          {isDev ? (
            <>
              <span className="caret">&gt;</span> seite_03 / über_mich
            </>
          ) : (
            "seite 03 / über mich"
          )}
        </div>
        <h1 className="about-title">Was mich antreibt.</h1>
        <div className="about-author">
          <div>{authorName}</div>
          <div>03 / 04</div>
        </div>
      </header>

      <div className="about-body">
        <div className="about-col-left">
          {about.warumSoftware.trim() !== "" && (
            <>
              <h2 className="sec-label">{prefix}warum_software</h2>
              <p className="about-para">{about.warumSoftware}</p>
            </>
          )}

          {about.wasIchBaue.length > 0 && (
            <>
              <h2 className="sec-label about-mt">{prefix}was_ich_baue</h2>
              <div className="about-item-list">
                {about.wasIchBaue.map((item) => (
                  <div className="about-item" key={item.id}>
                    <div className="about-item-key">{item.key}</div>
                    <div className="about-item-body">
                      <strong>{item.title}</strong>
                      {item.body ? ` — ${item.body}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="about-col-right">
          {about.staerken.length > 0 && (
            <>
              <h2 className="sec-label">{prefix}stärken</h2>
              <div className="about-strengths">
                {about.staerken.map((card) => (
                  <div className="about-strength" key={card.id}>
                    <div className="about-strength-title">{card.title}</div>
                    <div className="about-strength-body">{card.body}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {about.ausserhalbDesTerminals.length > 0 && (
            <>
              <h2 className="sec-label about-mt">
                {prefix}außerhalb_des_terminals
              </h2>
              <div className="about-item-list">
                {about.ausserhalbDesTerminals.map((item) => (
                  <div className="about-item" key={item.id}>
                    <div className="about-item-key">{item.key}</div>
                    <div className="about-item-body">
                      <strong>{item.title}</strong>
                      {item.body ? ` — ${item.body}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="about-footer">
        {isDev ? (
          <>
            <span className="caret">&gt;</span> gerne mehr im persönlichen
            gespräch — {email}
          </>
        ) : (
          <>gerne mehr im persönlichen gespräch — {email}</>
        )}
      </footer>
    </section>
  );
}
