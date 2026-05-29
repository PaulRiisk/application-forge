// flat string map per locale, consumed via useT()
// new strings go here first, then referenced by key in components
// keep keys grouped by component / area to stay readable

export type UiLocale = "de" | "en";

export const STRINGS = {
  de: {
    // topbar tabs
    "topbar.tabs.aria": "Dokumenten-Tabs",
    "topbar.tab.stammdaten": "Stammdaten",
    "topbar.tab.anschreiben": "Anschreiben",
    "topbar.tab.lebenslauf": "Lebenslauf",
    "topbar.tab.about": "Über mich",

    // topbar controls
    "topbar.mode.aria": "Layout-Modus",
    "topbar.mode.dev": "Dev",
    "topbar.mode.classic": "Klassisch",
    "topbar.theme.aria": "Farb-Presets",
    "topbar.theme.alias": "Farbschema",
    "topbar.theme.blue": "Blau",
    "topbar.theme.teal": "Petrol",
    "topbar.theme.rust": "Rost",
    "topbar.accent.label": "Akzent",
    "topbar.accent.title": "Akzentfarbe",
    "topbar.button.save": "Speichern",
    "topbar.button.load": "Laden",
    "topbar.button.reset": "Zurücksetzen",
    "topbar.button.export": "PDF exportieren",
    "topbar.theme.toLight": "Zu hellem Modus wechseln",
    "topbar.theme.toDark": "Zu dunklem Modus wechseln",
    "topbar.theme.lightTitle": "Heller Modus",
    "topbar.theme.darkTitle": "Dunkler Modus",
    "topbar.locale.toEn": "Switch UI to English",
    "topbar.locale.toDe": "UI auf Deutsch umstellen",
    "topbar.locale.de": "DE",
    "topbar.locale.en": "EN",

    // preview toolbar (zoom)
    "preview.toolbar.aria": "Preview-Zoom",
    "preview.toolbar.zoomOut": "Verkleinern",
    "preview.toolbar.zoomIn": "Vergrößern",
    "preview.toolbar.reset": "Zoom",
    "preview.toolbar.resetTitle": "Zoom auf 100% zurücksetzen",

    // command palette
    "palette.placeholder": "Springe zu Feld, Sektion, Aktion…",
    "palette.empty": "Keine Treffer",
    "palette.group.fields": "Felder",
    "palette.group.sections": "Sektionen",
    "palette.group.actions": "Aktionen",

    // generic row controls
    "row.moveUp": "Nach oben",
    "row.moveDown": "Nach unten",
    "row.moveLeft": "Nach links",
    "row.moveRight": "Nach rechts",
    "row.remove": "Entfernen",
    "row.rename": "Umbenennen",
    "row.duplicate": "Duplizieren",
    "row.delete": "Löschen",

    // stammdaten editor
    "stamm.section.docLocale": "Sprache der Vorlagentexte",
    "stamm.docLocale.label": "Vorlagensprache",
    "stamm.docLocale.de": "Deutsch",
    "stamm.docLocale.en": "Englisch",
    "stamm.docLocale.helper":
      "Steuert die festen Texte in den Dokumenten, die du nicht direkt bearbeiten kannst (z. B. „bewerbung“, „betreff“, „mappe enthält“). Wird sofort umgeschaltet, ohne deine Eingaben zu verändern. Unabhängig von der UI-Sprache.",
    "stamm.section.identity": "Identität",
    "stamm.field.name": "Name",
    "stamm.field.name.placeholder": "Vorname Nachname",
    "stamm.field.title": "Titel / Untertitel",
    "stamm.field.title.placeholder": "deine.rolle / fachgebiet",
    "stamm.field.kurz": "Kurzprofil",
    "stamm.field.kurz.placeholder":
      "Ein, zwei Sätze zu deinem Hintergrund und Fokus.",
    "stamm.section.contact": "Kontakt",
    "stamm.contact.add": "Kontaktzeile hinzufügen",
    "stamm.contact.labelPlaceholder": "Bezeichnung",
    "stamm.contact.valuePlaceholder": "Wert",
    "stamm.section.schwerpunkt": "Schwerpunkt",
    "stamm.schwerpunkt.heading": "Überschrift",
    "stamm.schwerpunkt.headingPlaceholder": "schwerpunkt",
    "stamm.schwerpunkt.addPlaceholder": "Schwerpunkt hinzufügen",
    "stamm.section.anlagen": "Anlagen",
    "stamm.anlagen.helper":
      "Anlagen erscheinen im Deckblatt unter „mappe enthält“ und optional im Anschreiben-Fuß. Je ein Dateiname oder Stichwort pro Zeile.",
    "stamm.anlagen.addPlaceholder": "Anlage hinzufügen (z. B. zeugnis.pdf)",
    "stamm.anlagen.itemPlaceholder": "Anlage",
    "stamm.section.sender": "Absender",
    "stamm.sender.toggle": "Absender im Anschreiben anzeigen",
    "stamm.sender.helper":
      "Deine eigene Postanschrift, oben im Anschreiben über dem Empfänger. Eine Zeile pro Eintrag.",
    "stamm.sender.label": "Anschrift",
    "stamm.sender.placeholder": "Name\nStraße 1\n12345 Stadt",
    "stamm.section.zeugnisse": "Zeugnisse",
    "stamm.zeugnisse.helper":
      "Benannte Zeugnisse erscheinen im Deckblatt unter „mappe enthält“ und ersetzen den pauschalen Eintrag „zeugnisse“. Nur Bezeichnungen — keine Dateien werden angehängt.",
    "stamm.zeugnisse.addPlaceholder": "Zeugnis hinzufügen (z. B. Arbeitszeugnis Firma X)",
    "stamm.zeugnisse.itemPlaceholder": "Zeugnis",

    // photo
    "photo.title": "Profilfoto",
    "photo.toggle": "Foto auf Deckblatt anzeigen",
    "photo.helper":
      "Verwende ein quadratisches Bild (1:1). Nicht-quadratische Bilder werden zentriert beschnitten. Das Foto wird nicht mitgespeichert — bitte nach dem Laden einer Datei erneut hochladen.",
    "photo.remove": "Foto entfernen",
    "photo.previewAlt": "Foto-Vorschau",

    // letters tab
    "letters.section": "Anschreiben",
    "letters.addBtn": "+ Neues Anschreiben",
    "letters.defaultLabel": "Unbenanntes Anschreiben",
    "letters.deleteConfirm": (label: string) =>
      `Anschreiben „${label}" löschen? Das lässt sich nicht rückgängig machen.`,
    "letters.empty": "Kein Anschreiben ausgewählt.",

    // letter editor
    "letter.section.addressee": "Empfänger",
    "letter.field.company": "Firma (für Dateiname + Deckblatt)",
    "letter.field.company.placeholder": "Firma GmbH",
    "letter.field.recipient": "Adressblock (eine Zeile pro Eintrag)",
    "letter.field.recipient.placeholder":
      "Firma GmbH\nName Empfänger\nStraße 1\n12345 Stadt",
    "letter.section.dateCity": "Datum & Ort",
    "letter.field.date": "Datum",
    "letter.field.cityOverride":
      "Ort überschreiben (optional, sonst aus Stammdaten)",
    "letter.field.cityOverride.placeholder": "leer = Ort aus Stammdaten",
    "letter.section.subject": "Betreff",
    "letter.field.subject": "Betreffzeile",
    "letter.field.subject.placeholder": "Bewerbung als ...",
    "letter.field.reference": "Referenz (optional)",
    "letter.field.reference.placeholder":
      "Referenz-ID: 2026-WS-042 · Ihre Anzeige auf LinkedIn",
    "letter.section.body": "Inhalt",
    "letter.field.body.placeholder":
      "Sehr geehrte Frau Mustermann,\n\nals dualer Student...",
    "letter.body.helper":
      "Toolbar fügt Markdown-Marker ein: **fett**, _kursiv_, - Aufzählung. Leerzeile = Absatz.",
    "letter.field.showAnlagen": "Anlagen im Fuß anzeigen",
    "letter.section.signature": "Unterschrift (optional)",
    "letter.signature.previewAlt": "Vorschau Unterschrift",
    "letter.signature.helper":
      "Unterschrift wird nicht mitgespeichert — bitte nach dem Laden einer Datei erneut hochladen.",
    "letter.signature.remove": "Unterschrift entfernen",

    // markdown toolbar
    "md.toolbar.aria": "Text-Formatierung",
    "md.bold": "Fett",
    "md.bold.title": "Fett (**...**)",
    "md.italic": "Kursiv",
    "md.italic.title": "Kursiv (_..._)",
    "md.bullet": "Aufzählung",
    "md.bullet.title": "Aufzählungsliste",

    // cv editor
    "cv.section.profile": "Profil",
    "cv.field.profile": "Über mich (CV-spezifisch, separat von Kurzprofil)",
    "cv.field.profile.placeholder": "Kurzer Profiltext...",
    "cv.section.skills": "Kenntnisse",
    "cv.skill.addGroup": "+ Gruppe hinzufügen",
    "cv.skill.groupHeadingPlaceholder": "Gruppen-Überschrift",
    "cv.skill.moveGroupUp": "Gruppe nach oben",
    "cv.skill.moveGroupDown": "Gruppe nach unten",
    "cv.skill.removeGroup": "Gruppe entfernen",
    "cv.skill.addItem": "Kenntnis hinzufügen",
    "cv.section.sidebarSections": "Seitenleisten-Abschnitte",
    "cv.sidebar.addSection": "+ Abschnitt hinzufügen",
    "cv.sidebar.sectionHeadingPlaceholder": "Abschnitts-Überschrift",
    "cv.sidebar.moveSectionUp": "Abschnitt nach oben",
    "cv.sidebar.moveSectionDown": "Abschnitt nach unten",
    "cv.sidebar.removeSection": "Abschnitt entfernen",
    "cv.sidebar.addRow": "Zeile hinzufügen",
    "cv.entry.sectionHeadingPlaceholder": "Abschnitts-Überschrift",
    "cv.entry.moveSectionUp": "Abschnitt nach oben",
    "cv.entry.moveSectionDown": "Abschnitt nach unten",
    "cv.entry.removeSection": "Abschnitt entfernen",
    "cv.entry.addEntry": "+ Eintrag hinzufügen",
    "cv.entry.addSection": "+ Eintrags-Abschnitt hinzufügen",
    "cv.entry.moveUp": "Eintrag nach oben",
    "cv.entry.moveDown": "Eintrag nach unten",
    "cv.entry.remove": "× Entfernen",
    "cv.entry.removeTitle": "Eintrag entfernen",
    "cv.entry.period": "Zeitraum",
    "cv.entry.period.placeholder": "Sep 2023 – heute",
    "cv.entry.title": "Titel",
    "cv.entry.title.placeholder": "Rollen-Bezeichnung",
    "cv.entry.place": "Ort",
    "cv.entry.place.placeholder": "Organisation · Stadt",
    "cv.entry.bullets": "Bullets (eine pro Zeile)",
    "cv.entry.bullets.placeholder": "Erste Bullet\nZweite Bullet",

    // about editor
    "about.section.warum": "warum_software",
    "about.warum.label": "Absatz",
    "about.warum.placeholder": "Was dich in die Software-Welt gezogen hat.",
    "about.section.footer": "Abschlusszeile",
    "about.footer.label": "Fußzeile (frei editierbar)",
    "about.footer.placeholder": "gerne mehr im persönlichen gespräch",
    "about.heading.label": "Abschnitts-Überschrift",
    "about.section.staerken": "stärken (2×2-Karten)",
    "about.staerken.add": "+ Karte hinzufügen",
    "about.staerken.removeTitle": "Karte entfernen",
    "about.staerken.title": "Titel",
    "about.staerken.titlePlaceholder": "systematisch",
    "about.staerken.body": "Text",
    "about.staerken.bodyPlaceholder": "Ein, zwei kurze Sätze.",
    "about.section.wasIchBaue": "was_ich_baue",
    "about.section.ausserhalbDesTerminals": "außerhalb_des_terminals",
    "about.item.add": "+ Eintrag hinzufügen",
    "about.item.removeTitle": "Eintrag entfernen",
    "about.item.key": "Schlüssel (Jahr oder Kategorie)",
    "about.item.keyPlaceholder": "2025",
    "about.item.title": "Titel",
    "about.item.titlePlaceholder": "Projekt-Titel",
    "about.item.body": "Text",
    "about.item.bodyPlaceholder": "Ein kurzer Satz.",

    // editor primitives
    "chip.addBtn": "Hinzufügen",
    "kv.addBtn": "Zeile hinzufügen",

    // export dialog
    "export.title": "PDF exportieren",
    "export.helper":
      "Wähle aus, welche Dokumente in die kombinierte PDF kommen. Sie erscheinen in der gezeigten Reihenfolge.",
    "export.opt.deckblatt": "Deckblatt",
    "export.opt.anschreiben": "Anschreiben",
    "export.opt.lebenslauf": "Lebenslauf",
    "export.opt.about": "Über mich",
    "export.cancel": "Abbrechen",
    "export.export": "Exportieren",
    "export.aria": "PDF exportieren",
    "export.hostNotMounted": "Export fehlgeschlagen: Preview nicht bereit.",
    "export.failed": "PDF-Export fehlgeschlagen.",
    "export.noPages": "Keine Seiten zum Export ausgewählt.",

    // reset dialog
    "reset.title": "Zurücksetzen",
    "reset.helper":
      "Setzt alle vier Dokumente auf die Vorbelegung zurück. Wähle die Sprache der vorbelegten Inhalte. Alle aktuellen Eingaben gehen verloren.",
    "reset.de": "Auf Deutsch zurücksetzen",
    "reset.en": "Auf Englisch zurücksetzen",
    "reset.cancel": "Abbrechen",

    // app-level alerts
    "app.load.invalidDoc":
      "Datei ist kein gültiges application-forge-Dokument (Version 1).",
    "app.load.invalidJson": "Datei ist kein gültiges JSON.",
    "app.load.readFailed": "Datei konnte nicht gelesen werden.",
    "app.load.fallback": "Datei konnte nicht geladen werden.",
  },

  en: {
    // topbar tabs
    "topbar.tabs.aria": "Document tabs",
    "topbar.tab.stammdaten": "Personal info",
    "topbar.tab.anschreiben": "Cover letter",
    "topbar.tab.lebenslauf": "CV",
    "topbar.tab.about": "About me",

    // topbar controls
    "topbar.mode.aria": "Layout mode",
    "topbar.mode.dev": "Dev",
    "topbar.mode.classic": "Classic",
    "topbar.theme.aria": "Theme presets",
    "topbar.theme.alias": "Theme",
    "topbar.theme.blue": "Blue",
    "topbar.theme.teal": "Teal",
    "topbar.theme.rust": "Rust",
    "topbar.accent.label": "Accent",
    "topbar.accent.title": "Accent color",
    "topbar.button.save": "Save",
    "topbar.button.load": "Load",
    "topbar.button.reset": "Reset",
    "topbar.button.export": "Export PDF",
    "topbar.theme.toLight": "Switch to light mode",
    "topbar.theme.toDark": "Switch to dark mode",
    "topbar.theme.lightTitle": "Light mode",
    "topbar.theme.darkTitle": "Dark mode",
    "topbar.locale.toEn": "Switch UI to English",
    "topbar.locale.toDe": "UI auf Deutsch umstellen",
    "topbar.locale.de": "DE",
    "topbar.locale.en": "EN",

    // preview toolbar (zoom)
    "preview.toolbar.aria": "Preview zoom",
    "preview.toolbar.zoomOut": "Zoom out",
    "preview.toolbar.zoomIn": "Zoom in",
    "preview.toolbar.reset": "Reset",
    "preview.toolbar.resetTitle": "Reset zoom to 100%",

    // command palette
    "palette.placeholder": "Jump to field, section, action…",
    "palette.empty": "No matches",
    "palette.group.fields": "Fields",
    "palette.group.sections": "Sections",
    "palette.group.actions": "Actions",

    // generic row controls
    "row.moveUp": "Move up",
    "row.moveDown": "Move down",
    "row.moveLeft": "Move left",
    "row.moveRight": "Move right",
    "row.remove": "Remove",
    "row.rename": "Rename",
    "row.duplicate": "Duplicate",
    "row.delete": "Delete",

    // stammdaten editor
    "stamm.section.docLocale": "Template text language",
    "stamm.docLocale.label": "Template language",
    "stamm.docLocale.de": "German",
    "stamm.docLocale.en": "English",
    "stamm.docLocale.helper":
      "Controls the fixed document text you can't edit directly (e.g. \"application\", \"subject\", \"set contains\"). Switches instantly without changing your own input. Independent of the UI language.",
    "stamm.section.identity": "Identity",
    "stamm.field.name": "Name",
    "stamm.field.name.placeholder": "Name Surname",
    "stamm.field.title": "Title / subtitle",
    "stamm.field.title.placeholder": "your.title / role",
    "stamm.field.kurz": "Short profile",
    "stamm.field.kurz.placeholder":
      "One or two sentences about your background and focus.",
    "stamm.section.contact": "Contact",
    "stamm.contact.add": "Add contact row",
    "stamm.contact.labelPlaceholder": "label",
    "stamm.contact.valuePlaceholder": "value",
    "stamm.section.schwerpunkt": "Focus",
    "stamm.schwerpunkt.heading": "Heading",
    "stamm.schwerpunkt.headingPlaceholder": "focus",
    "stamm.schwerpunkt.addPlaceholder": "Add focus area",
    "stamm.section.anlagen": "Attachments",
    "stamm.anlagen.helper":
      "Attachments show on the cover page under \"mappe enthält\" and optionally in the cover-letter footer. One filename or label per line.",
    "stamm.anlagen.addPlaceholder": "Add attachment (e.g. reference.pdf)",
    "stamm.anlagen.itemPlaceholder": "Attachment",
    "stamm.section.sender": "Sender",
    "stamm.sender.toggle": "Show sender address on the cover letter",
    "stamm.sender.helper":
      "Your own postal address, shown at the top of the cover letter above the recipient. One line per entry.",
    "stamm.sender.label": "Address",
    "stamm.sender.placeholder": "Name\nStreet 1\n12345 City",
    "stamm.section.zeugnisse": "References",
    "stamm.zeugnisse.helper":
      "Named references show on the cover page under \"mappe enthält\" and replace the generic \"references\" item. Labels only — no files are attached.",
    "stamm.zeugnisse.addPlaceholder": "Add reference (e.g. Reference Company X)",
    "stamm.zeugnisse.itemPlaceholder": "Reference",

    // photo
    "photo.title": "Profile photo",
    "photo.toggle": "Show photo on cover page",
    "photo.helper":
      "Use a square image (1:1). Non-square images will be center-cropped to fit the circle. Photo is not saved with your data — re-upload after loading a saved file.",
    "photo.remove": "Remove photo",
    "photo.previewAlt": "Profile preview",

    // letters tab
    "letters.section": "Letters",
    "letters.addBtn": "+ New letter",
    "letters.defaultLabel": "Untitled letter",
    "letters.deleteConfirm": (label: string) =>
      `Delete letter "${label}"? This can't be undone.`,
    "letters.empty": "No letter selected.",

    // letter editor
    "letter.section.addressee": "Addressee",
    "letter.field.company": "Company (for filename + cover page)",
    "letter.field.company.placeholder": "Company GmbH",
    "letter.field.recipient": "Recipient block (one line each)",
    "letter.field.recipient.placeholder":
      "Company GmbH\nRecipient Name\nStreet 1\n12345 City",
    "letter.section.dateCity": "Date & city",
    "letter.field.date": "Date",
    "letter.field.cityOverride":
      "City override (optional, defaults to stammdaten location)",
    "letter.field.cityOverride.placeholder":
      "leave empty to use stammdaten city",
    "letter.section.subject": "Subject",
    "letter.field.subject": "Subject line",
    "letter.field.subject.placeholder": "Application as ...",
    "letter.field.reference": "Reference (optional)",
    "letter.field.reference.placeholder":
      "Reference ID: 2026-WS-042 · your posting on LinkedIn",
    "letter.section.body": "Body",
    "letter.field.body.placeholder":
      "Dear Ms. Mustermann,\n\nas a dual student...",
    "letter.body.helper":
      "Toolbar inserts markdown markers: **bold**, _italic_, - bullet. Blank line = paragraph break.",
    "letter.field.showAnlagen": "Show attachments in footer",
    "letter.section.signature": "Signature image (optional)",
    "letter.signature.previewAlt": "Signature preview",
    "letter.signature.helper":
      "Signature is not saved with your data — re-upload after loading a saved file.",
    "letter.signature.remove": "Remove signature",

    // markdown toolbar
    "md.toolbar.aria": "Body formatting",
    "md.bold": "Bold",
    "md.bold.title": "Bold (**...**)",
    "md.italic": "Italic",
    "md.italic.title": "Italic (_..._)",
    "md.bullet": "Bullet",
    "md.bullet.title": "Bullet list",

    // cv editor
    "cv.section.profile": "Profile",
    "cv.field.profile": "About me (CV-specific, separate from short profile)",
    "cv.field.profile.placeholder": "Short profile text...",
    "cv.section.skills": "Skills",
    "cv.skill.addGroup": "+ Add skill group",
    "cv.skill.groupHeadingPlaceholder": "group heading",
    "cv.skill.moveGroupUp": "Move group up",
    "cv.skill.moveGroupDown": "Move group down",
    "cv.skill.removeGroup": "Remove group",
    "cv.skill.addItem": "Add skill",
    "cv.section.sidebarSections": "Sidebar sections",
    "cv.sidebar.addSection": "+ Add sidebar section",
    "cv.sidebar.sectionHeadingPlaceholder": "section heading",
    "cv.sidebar.moveSectionUp": "Move section up",
    "cv.sidebar.moveSectionDown": "Move section down",
    "cv.sidebar.removeSection": "Remove section",
    "cv.sidebar.addRow": "Add row",
    "cv.entry.sectionHeadingPlaceholder": "section heading",
    "cv.entry.moveSectionUp": "Move section up",
    "cv.entry.moveSectionDown": "Move section down",
    "cv.entry.removeSection": "Remove section",
    "cv.entry.addEntry": "+ Add entry",
    "cv.entry.addSection": "+ Add entry section",
    "cv.entry.moveUp": "Move entry up",
    "cv.entry.moveDown": "Move entry down",
    "cv.entry.remove": "× Remove",
    "cv.entry.removeTitle": "Remove entry",
    "cv.entry.period": "Period",
    "cv.entry.period.placeholder": "Sep 2023 – present",
    "cv.entry.title": "Title",
    "cv.entry.title.placeholder": "Role title",
    "cv.entry.place": "Place",
    "cv.entry.place.placeholder": "Organization · City",
    "cv.entry.bullets": "Bullets (one per line)",
    "cv.entry.bullets.placeholder": "First bullet\nSecond bullet",

    // about editor
    "about.section.warum": "warum_software",
    "about.warum.label": "Paragraph",
    "about.warum.placeholder": "What pulled you into software.",
    "about.section.footer": "Closing line",
    "about.footer.label": "Footer (free text)",
    "about.footer.placeholder": "happy to tell you more in person",
    "about.heading.label": "Section heading",
    "about.section.staerken": "stärken (2×2 cards)",
    "about.staerken.add": "+ Add card",
    "about.staerken.removeTitle": "Remove card",
    "about.staerken.title": "Title",
    "about.staerken.titlePlaceholder": "systematic",
    "about.staerken.body": "Body",
    "about.staerken.bodyPlaceholder": "One or two short sentences.",
    "about.section.wasIchBaue": "was_ich_baue",
    "about.section.ausserhalbDesTerminals": "außerhalb_des_terminals",
    "about.item.add": "+ Add item",
    "about.item.removeTitle": "Remove item",
    "about.item.key": "Key (year or category)",
    "about.item.keyPlaceholder": "2025",
    "about.item.title": "Title",
    "about.item.titlePlaceholder": "Project title",
    "about.item.body": "Body",
    "about.item.bodyPlaceholder": "One short sentence.",

    // editor primitives
    "chip.addBtn": "Add",
    "kv.addBtn": "Add row",

    // export dialog
    "export.title": "Export PDF",
    "export.helper":
      "Pick which documents go into the combined PDF. They appear in the order shown.",
    "export.opt.deckblatt": "Cover page",
    "export.opt.anschreiben": "Cover letter",
    "export.opt.lebenslauf": "CV",
    "export.opt.about": "About me",
    "export.cancel": "Cancel",
    "export.export": "Export",
    "export.aria": "Export PDF",
    "export.hostNotMounted": "Export failed: preview host not mounted.",
    "export.failed": "PDF export failed.",
    "export.noPages": "No pages selected for export.",

    // reset dialog
    "reset.title": "Reset",
    "reset.helper":
      "Resets all four documents to their defaults. Pick the language of the seeded content. All current input will be lost.",
    "reset.de": "Reset to German",
    "reset.en": "Reset to English",
    "reset.cancel": "Cancel",

    // app-level alerts
    "app.resetConfirm":
      "Reset will discard the current document set and clear saved data. Continue?",
    "app.load.invalidDoc":
      "File is not a valid application-forge document (version 1).",
    "app.load.invalidJson": "File is not valid JSON.",
    "app.load.readFailed": "Could not read file.",
    "app.load.fallback": "Could not load file.",
  },
} as const satisfies Record<UiLocale, Record<string, string | ((arg: string) => string)>>;

export type StringKey = keyof typeof STRINGS["de"] & keyof typeof STRINGS["en"];
