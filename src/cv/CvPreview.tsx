// the lebenslauf A4 page
// sidebar pulls identity/contact/photo from stammdaten, the rest from cv doc
// main column is the entry sections list (experience, education, ...)

import { useApp } from "../state/AppContext";
import { docStrings } from "../i18n/docStrings";

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

export function CvPreview({ photoUrl }: Props) {
  const { stammdaten, cv } = useApp();
  const isDev = stammdaten.mode === "dev";
  const prefix = isDev ? "// " : "";
  const d = docStrings(stammdaten.templateLocale);

  return (
    <>
      <aside className="cv-sidebar">
        {stammdaten.photoEnabled && (
          <img className="photo" src={photoUrl} alt={stammdaten.name} />
        )}

        <h1 className="cv-name">{renderName(stammdaten.name)}</h1>
        <div className="cv-title">
          {isDev && <span className="caret">&gt;</span>}
          {isDev ? " " : ""}
          {stammdaten.title}
        </div>

        {stammdaten.contact.length > 0 && (
          <div className="contact cv-contact">
            {stammdaten.contact.map((row) => (
              <div key={row.id}>
                <span className="contact-label">{row.label}</span>
                {row.value}
              </div>
            ))}
          </div>
        )}

        {cv.profile.trim() !== "" && (
          <>
            <h2 className="sec-label">{prefix}{d.profil}</h2>
            <p className="cv-profile">{cv.profile}</p>
          </>
        )}

        {cv.skillGroups.map((group) => (
          <div key={group.id}>
            <h2 className="sec-label">
              {prefix}
              {group.heading}
            </h2>
            <div className="chips">
              {group.items.map((item, i) => (
                <span className="chip" key={i}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}

        {cv.sidebarSections.map((section) => (
          <div key={section.id}>
            <h2 className="sec-label">
              {prefix}
              {section.heading}
            </h2>
            {section.rows.map((row) => (
              <div className="lang" key={row.id}>
                <span className="lang-key">{row.label}:</span>{" "}
                <span className="mono">{row.value}</span>
              </div>
            ))}
          </div>
        ))}
      </aside>

      <section className="cv-main">
        {cv.entrySections.map((section, sectionIndex) => (
          <div key={section.id}>
            <h2
              className={`sec-label main-sec${sectionIndex > 0 ? " mt" : ""}`}
            >
              {prefix}
              {section.heading}
            </h2>
            {section.entries.map((entry) => (
              <article className="exp" key={entry.id}>
                <div className="exp-date">{entry.period}</div>
                <h3 className="exp-role">{entry.title}</h3>
                <div className="exp-company">{entry.place}</div>
                {entry.bullets
                  .filter((b) => b.trim() !== "")
                  .map((bullet, i) => (
                    <p className="bullet" key={i}>
                      {bullet}
                    </p>
                  ))}
              </article>
            ))}
          </div>
        ))}
      </section>
    </>
  );
}
