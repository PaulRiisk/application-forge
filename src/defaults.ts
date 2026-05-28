// fresh placeholder application set, used on first load and on reset
// no personal data here, all values are generic stand-ins
// seeded content comes in two languages (de / en); the choice lives on
// stammdaten.defaultLocale and only affects this seeded content, not the UI

import type { ApplicationDocument, CoverLetter, DocLocale } from "./types";
import { newId } from "./types";

// all the seeded strings that differ between de and en defaults
type DefaultContent = {
  kurz: string;
  schwerpunktHeading: string;
  letterLabel: string;
  letterSubject: string;
  cvProfile: string;
  skillGroups: string[];
  languagesHeading: string;
  languageRow: { label: string; value: string };
  experienceHeading: string;
  educationHeading: string;
  entryPeriod: string;
  entryRole: string;
  entryDegree: string;
  entryPlaceCompany: string;
  entryPlaceOrg: string;
  cardTitle: string;
  cardBody: string;
  itemTitle: string;
  itemBody: string;
  itemKeyYear: string;
  itemKeyTopic: string;
  aboutFooter: string;
  aboutStaerkenHeading: string;
  aboutWasIchBaueHeading: string;
  aboutAusserhalbHeading: string;
};

const CONTENT: Record<DocLocale, DefaultContent> = {
  de: {
    kurz:
      "Kurzer Profiltext zu deinem Hintergrund, deinen Interessen und was du suchst. Ein bis zwei Sätze.",
    schwerpunktHeading: "schwerpunkt",
    letterLabel: "Unbenanntes Anschreiben",
    letterSubject: "Betreffzeile",
    cvProfile:
      "Kurzer Profiltext zu deinem Hintergrund, deinen Interessen und was du suchst. Ein bis zwei Sätze.",
    skillGroups: ["entwicklung", "werkzeuge"],
    languagesHeading: "sprachen",
    languageRow: { label: "deutsch", value: "Muttersprache" },
    experienceHeading: "erfahrung",
    educationHeading: "ausbildung",
    entryPeriod: "Zeitraum",
    entryRole: "Rolle",
    entryDegree: "Abschluss",
    entryPlaceCompany: "Firma GmbH · Stadt",
    entryPlaceOrg: "Organisation · Stadt",
    cardTitle: "Kartentitel",
    cardBody: "Kurze Beschreibung.",
    itemTitle: "Projekttitel",
    itemBody: "Kurze Beschreibung.",
    itemKeyYear: "jahr",
    itemKeyTopic: "thema",
    aboutFooter: "gerne mehr im persönlichen gespräch",
    aboutStaerkenHeading: "stärken",
    aboutWasIchBaueHeading: "was ich baue",
    aboutAusserhalbHeading: "außerhalb des terminals",
  },
  en: {
    kurz:
      "Short profile text describing your background, interests, and what you are looking for. Keep it to one or two sentences.",
    schwerpunktHeading: "focus",
    letterLabel: "Untitled letter",
    letterSubject: "Subject line",
    cvProfile:
      "Short profile text describing your background, interests, and what you are looking for. Keep it to one or two sentences.",
    skillGroups: ["development", "tools"],
    languagesHeading: "languages",
    languageRow: { label: "english", value: "C1" },
    experienceHeading: "experience",
    educationHeading: "education",
    entryPeriod: "Period",
    entryRole: "Role",
    entryDegree: "Degree",
    entryPlaceCompany: "Company GmbH · City",
    entryPlaceOrg: "Organization · City",
    cardTitle: "Card title",
    cardBody: "Short description.",
    itemTitle: "Project title",
    itemBody: "Short description.",
    itemKeyYear: "year",
    itemKeyTopic: "topic",
    aboutFooter: "happy to tell you more in person",
    aboutStaerkenHeading: "strengths",
    aboutWasIchBaueHeading: "what_i_build",
    aboutAusserhalbHeading: "beyond_the_terminal",
  },
};

function createDefaultLetter(c: DefaultContent): CoverLetter {
  return {
    id: newId(),
    label: c.letterLabel,
    company: "Company GmbH",
    recipient: ["Company GmbH", "Recipient Name", "Street 1", "12345 City"],
    cityOverride: null,
    date: new Date().toISOString().slice(0, 10),
    subject: c.letterSubject,
    reference: "",
    body: "",
    showAnlagen: true,
  };
}

export function createDefaultApplication(
  locale: DocLocale = "de",
): ApplicationDocument {
  const c = CONTENT[locale];
  const firstLetter = createDefaultLetter(c);
  return {
    version: 1,
    stammdaten: {
      name: "Name Surname",
      title: "your.title / role",
      kurz: c.kurz,
      contact: [
        { id: newId(), label: "email", value: "mail.mail@mail.com" },
        { id: newId(), label: "github", value: "github.com/username" },
        { id: newId(), label: "linkedin", value: "linkedin.com/in/username" },
        { id: newId(), label: "location", value: "City, Country" },
      ],
      schwerpunkt: {
        id: newId(),
        heading: c.schwerpunktHeading,
        items: [],
      },
      anlagen: [],
      photoEnabled: true,
      theme: {
        preset: "blue",
        accent: "#2046c6",
      },
      mode: "dev",
      templateLocale: locale,
    },
    letters: {
      items: [firstLetter],
      activeId: firstLetter.id,
    },
    cv: {
      profile: c.cvProfile,
      skillGroups: c.skillGroups.map((heading) => ({
        id: newId(),
        heading,
        items: [],
      })),
      sidebarSections: [
        {
          id: newId(),
          heading: c.languagesHeading,
          rows: [
            {
              id: newId(),
              label: c.languageRow.label,
              value: c.languageRow.value,
            },
          ],
        },
      ],
      entrySections: [
        {
          id: newId(),
          heading: c.experienceHeading,
          entries: [
            {
              id: newId(),
              period: c.entryPeriod,
              title: c.entryRole,
              place: c.entryPlaceCompany,
              bullets: [],
            },
          ],
        },
        {
          id: newId(),
          heading: c.educationHeading,
          entries: [
            {
              id: newId(),
              period: c.entryPeriod,
              title: c.entryDegree,
              place: c.entryPlaceOrg,
              bullets: [],
            },
          ],
        },
      ],
    },
    about: {
      warumSoftware: "",
      staerkenHeading: c.aboutStaerkenHeading,
      wasIchBaueHeading: c.aboutWasIchBaueHeading,
      ausserhalbHeading: c.aboutAusserhalbHeading,
      staerken: [
        { id: newId(), title: c.cardTitle, body: c.cardBody },
        { id: newId(), title: c.cardTitle, body: c.cardBody },
        { id: newId(), title: c.cardTitle, body: c.cardBody },
        { id: newId(), title: c.cardTitle, body: c.cardBody },
      ],
      wasIchBaue: [
        { id: newId(), key: c.itemKeyYear, title: c.itemTitle, body: c.itemBody },
      ],
      ausserhalbDesTerminals: [
        { id: newId(), key: c.itemKeyTopic, title: c.itemTitle, body: c.itemBody },
      ],
      footer: c.aboutFooter,
    },
  };
}
