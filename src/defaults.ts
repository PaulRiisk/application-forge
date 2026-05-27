// fresh placeholder application set, used on first load and on reset
// no personal data here, all values are generic stand-ins

import type { ApplicationDocument, CoverLetter } from "./types";
import { newId } from "./types";

function createDefaultLetter(): CoverLetter {
  return {
    id: newId(),
    label: "Untitled letter",
    company: "Company GmbH",
    recipient: ["Company GmbH", "Recipient Name", "Street 1", "12345 City"],
    cityOverride: null,
    date: new Date().toISOString().slice(0, 10),
    subject: "Subject line",
    reference: "",
    body: "",
  };
}

export function createDefaultApplication(): ApplicationDocument {
  const firstLetter = createDefaultLetter();
  return {
    version: 1,
    stammdaten: {
      name: "Name Surname",
      title: "your.title / role",
      kurz:
        "Short profile text describing your background, interests, and what you are looking for. Keep it to one or two sentences.",
      contact: [
        { id: newId(), label: "email", value: "mail.mail@mail.com" },
        { id: newId(), label: "github", value: "github.com/username" },
        { id: newId(), label: "linkedin", value: "linkedin.com/in/username" },
        { id: newId(), label: "location", value: "City, Country" },
      ],
      schwerpunkt: {
        id: newId(),
        heading: "schwerpunkt",
        items: [],
      },
      photoEnabled: true,
      theme: {
        preset: "blue",
        accent: "#2046c6",
      },
      mode: "dev",
    },
    letters: {
      items: [firstLetter],
      activeId: firstLetter.id,
    },
    cv: {
      profile:
        "Short profile text describing your background, interests, and what you are looking for. Keep it to one or two sentences.",
      skillGroups: [
        { id: newId(), heading: "development", items: [] },
        { id: newId(), heading: "tools", items: [] },
      ],
      sidebarSections: [
        {
          id: newId(),
          heading: "languages",
          rows: [{ id: newId(), label: "english", value: "C1" }],
        },
      ],
      entrySections: [
        {
          id: newId(),
          heading: "experience",
          entries: [
            {
              id: newId(),
              period: "Period",
              title: "Role",
              place: "Company GmbH · City",
              bullets: [],
            },
          ],
        },
        {
          id: newId(),
          heading: "education",
          entries: [
            {
              id: newId(),
              period: "Period",
              title: "Degree",
              place: "Organization · City",
              bullets: [],
            },
          ],
        },
      ],
    },
    about: {
      warumSoftware: "",
      staerken: [
        { id: newId(), title: "Card title", body: "Short description." },
        { id: newId(), title: "Card title", body: "Short description." },
        { id: newId(), title: "Card title", body: "Short description." },
        { id: newId(), title: "Card title", body: "Short description." },
      ],
      wasIchBaue: [
        { id: newId(), key: "year", title: "Project title", body: "Short description." },
      ],
      ausserhalbDesTerminals: [
        { id: newId(), key: "topic", title: "Title", body: "Short description." },
      ],
    },
  };
}
