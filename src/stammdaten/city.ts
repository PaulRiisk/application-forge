// city derived from the stammdaten contact list, shared by the deckblatt
// ("bei Company · City") and the anschreiben date line ("City, 27. mai 2026").
// one matcher for both so renaming the label can't desync the two previews

import type { ContactRow } from "../types";

const LOCATION_LABELS = ["location", "ort", "standort", "city", "stadt"];

export function findCity(contact: ContactRow[]): string {
  const row = contact.find((r) => {
    const label = r.label.toLowerCase();
    return LOCATION_LABELS.some((l) => label.includes(l));
  });
  return row?.value.split(",")[0]?.trim() ?? "";
}
