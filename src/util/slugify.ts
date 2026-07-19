// turn a free-text name into a safe filename slug
// german umlauts are transliterated (ä→ae, …) instead of dropped so
// "Jörg Müller" becomes "joerg-mueller", not "j-rg-m-ller"

const TRANSLIT: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
};

export function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[äöüß]/g, (ch) => TRANSLIT[ch])
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "application";
}
