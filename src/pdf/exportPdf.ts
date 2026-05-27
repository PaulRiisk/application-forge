// pdf export: snapshot each chosen preview with html2canvas, combine the
// resulting pages into one jsPDF document, save with a derived filename
// html2canvas is a transitive dep via html2pdf.js; we pull it in directly
// so we can drive the multi-page combine ourselves

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// turn a free-text name into a safe filename slug
export function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "application";
}

export type ExportPage = {
  element: HTMLElement;
  key: string;
};

// render one element to a canvas at 2x dpi for crisp A4 output
async function snapshot(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    // chase the actual rendered size, not a clipped viewport
    windowWidth: el.scrollWidth,
    windowHeight: el.scrollHeight,
  });
}

// build a multi-page A4 pdf and trigger a download
export async function exportApplicationPdf(
  pages: ExportPage[],
  filename: string,
): Promise<void> {
  if (pages.length === 0) {
    throw new Error("No pages selected for export.");
  }

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = 210;
  const pageHeight = 297;

  for (let i = 0; i < pages.length; i++) {
    const canvas = await snapshot(pages[i].element);
    const img = canvas.toDataURL("image/jpeg", 0.98);
    if (i > 0) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);
  }

  // download via our own anchor so the browser keeps the file (no auto-open
  // in adobe etc.). pdf.save() does the same thing internally but some browser
  // setups intercept its <a> with their pdf viewer plugin
  const blob = pdf.output("blob");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // revoke after a tick so the browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
