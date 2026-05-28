// the about-me A4 page
// single full-width column with a 2-col grid inside the body
// pulls the author name from stammdaten; the footer line is free text the
// user types (no auto-injected email)

import { useApp } from "../state/AppContext";
import { docStrings } from "../i18n/docStrings";

export function AboutPreview() {
  const { stammdaten, about } = useApp();
  const isDev = stammdaten.mode === "dev";
  const prefix = isDev ? "// " : "";
  const d = docStrings(stammdaten.templateLocale);
  const authorName = stammdaten.name.replace(/\n/g, " ");

  return (
    <section className="about-page">
      <header className="about-header">
        <div className="about-kicker">
          {isDev ? (
            <>
              <span className="caret">&gt;</span> {d.aboutKicker}
            </>
          ) : (
            `seite 03 / ${d.aboutKicker.replace(/_/g, " ")}`
          )}
        </div>
        <h1 className="about-title">{d.aboutTitle}</h1>
        <div className="about-author">
          <div>{authorName}</div>
          <div>03 / 04</div>
        </div>
      </header>

      <div className="about-body">
        <div className="about-col-left">
          {about.warumSoftware.trim() !== "" && (
            <>
              <h2 className="sec-label">{prefix}{d.warumSoftware}</h2>
              <p className="about-para">{about.warumSoftware}</p>
            </>
          )}

          {about.wasIchBaue.length > 0 && (
            <>
              <h2 className="sec-label about-mt">
                {prefix}{about.wasIchBaueHeading}
              </h2>
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
              <h2 className="sec-label">{prefix}{about.staerkenHeading}</h2>
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
                {prefix}{about.ausserhalbHeading}
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

      {about.footer.trim() !== "" && (
        <footer className="about-footer">
          {isDev && <span className="caret">&gt;</span>}
          {isDev ? " " : ""}
          {about.footer}
        </footer>
      )}
    </section>
  );
}
