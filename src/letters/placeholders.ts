// {firma} / {company} placeholders in letter subject and body are replaced
// with the letter's company field at render time. writing the placeholder
// instead of the name makes duplicated letters immune to the classic
// "old company name still in the text" mistake

export function applyPlaceholders(text: string, company: string): string {
  return text.replaceAll("{firma}", company).replaceAll("{company}", company);
}
