// pdf export: snapshot each chosen preview with html2canvas, combine the
// resulting pages into one jsPDF document, save with a derived filename
// html2canvas is a transitive dep via html2pdf.js; we pull it in directly
// so we can drive the multi-page combine ourselves

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export { slugify } from "../util/slugify";

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
    // throw a translation key; the caller resolves it via the locale t()
    throw new Error("export.noPages");
  }

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageWidth = 210;
  const pageHeight = 297;

  let firstPdfPage = true;
  const addPdfPage = (img: string) => {
    if (!firstPdfPage) pdf.addPage();
    firstPdfPage = false;
    pdf.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);
  };

  for (const page of pages) {
    const canvas = await snapshot(page.element);
    // exact A4 content fits one pdf page; overflowing content is sliced into
    // additional A4 pages instead of being squeezed into one (which would
    // distort the whole document vertically)
    const slicePx = Math.round((canvas.width * pageHeight) / pageWidth);
    if (canvas.height <= slicePx * 1.01) {
      addPdfPage(canvas.toDataURL("image/jpeg", 0.98));
      continue;
    }
    const sliceCount = Math.ceil(canvas.height / slicePx);
    for (let s = 0; s < sliceCount; s++) {
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = slicePx;
      const ctx = slice.getContext("2d");
      if (!ctx) throw new Error("export.failed");
      // white base so the partial last slice doesn't turn black in the jpeg
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(
        canvas,
        0,
        s * slicePx,
        canvas.width,
        slicePx,
        0,
        0,
        canvas.width,
        slicePx,
      );
      addPdfPage(slice.toDataURL("image/jpeg", 0.98));
    }
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
