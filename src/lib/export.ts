import { toCanvas } from "html-to-image";
import { slugify } from "./format";
import { getPalette } from "./themes";
import type { RateCard } from "./types";

export type ExportKind = "png" | "square" | "story" | "pdf-a4" | "pdf-fit" | "copy" | "json";

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

async function capture(node: HTMLElement, background: string, pixelRatio = 2): Promise<HTMLCanvasElement> {
  await document.fonts?.ready;
  node.setAttribute("data-exporting", "");
  await nextFrame();
  try {
    return await toCanvas(node, {
      pixelRatio,
      cacheBust: true,
      backgroundColor: background,
    });
  } finally {
    node.removeAttribute("data-exporting");
  }
}

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  if (href.startsWith("blob:")) setTimeout(() => URL.revokeObjectURL(href), 4000);
}

const canvasToBlob = (c: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => c.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), "image/png"));

function compose(src: HTMLCanvasElement, w: number, h: number, bg: string, pad: number) {
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const scale = Math.min((w - pad * 2) / src.width, (h - pad * 2) / src.height);
  const dw = src.width * scale;
  const dh = src.height * scale;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, (w - dw) / 2, (h - dh) / 2, dw, dh);
  return out;
}

/** Slightly darker/lighter backdrop for social formats so the card reads as an object. */
function backdrop(paper: string, dark: boolean) {
  return dark ? "#050505" : mix(paper, "#000000", 0.06);
}

function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("");
}

export async function exportCard(kind: ExportKind, node: HTMLElement | null, card: RateCard): Promise<string> {
  const name = slugify(card.info.title);
  const pal = getPalette(card.design.palette);

  if (kind === "json") {
    const blob = new Blob([JSON.stringify({ app: "ratecraft", version: 2, card }, null, 2)], { type: "application/json" });
    download(URL.createObjectURL(blob), `${name}.ratecraft.json`);
    return "Card data downloaded";
  }
  if (!node) throw new Error("Preview isn't ready yet");

  if (kind === "png") {
    const c = await capture(node, pal.paper, 2);
    download(URL.createObjectURL(await canvasToBlob(c)), `${name}.png`);
    return "PNG downloaded";
  }

  if (kind === "copy") {
    const blob = capture(node, pal.paper, 2).then(canvasToBlob);
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") throw new Error("Your browser can't copy images — try PNG instead");
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return "Image copied to clipboard";
  }

  if (kind === "square" || kind === "story") {
    const c = await capture(node, pal.paper, 3);
    const [w, h] = kind === "square" ? [1080, 1080] : [1080, 1920];
    const out = compose(c, w, h, backdrop(pal.paper, pal.dark), kind === "square" ? 56 : 64);
    download(URL.createObjectURL(await canvasToBlob(out)), `${name}-${kind}.png`);
    return kind === "square" ? "Square post downloaded" : "Story downloaded";
  }

  const { jsPDF } = await import("jspdf");
  const c = await capture(node, pal.paper, 2);

  if (kind === "pdf-fit") {
    const w = c.width / 2;
    const h = c.height / 2;
    const pdf = new jsPDF({ orientation: w >= h ? "landscape" : "portrait", unit: "px", format: [w, h], hotfixes: ["px_scaling"] });
    pdf.addImage(c.toDataURL("image/png"), "PNG", 0, 0, w, h, undefined, "FAST");
    pdf.save(`${name}.pdf`);
    return "PDF downloaded";
  }

  // A4, split across pages when the card is tall.
  const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 28;
  const contentW = pageW - margin * 2;
  const scale = contentW / c.width;
  const sliceH = Math.floor((pageH - margin * 2) / scale);
  let y = 0;
  let page = 0;
  while (y < c.height) {
    const h = Math.min(sliceH, c.height - y);
    const slice = document.createElement("canvas");
    slice.width = c.width;
    slice.height = h;
    slice.getContext("2d")!.drawImage(c, 0, y, c.width, h, 0, 0, c.width, h);
    if (page > 0) pdf.addPage();
    pdf.setFillColor(pal.paper);
    pdf.rect(0, 0, pageW, pageH, "F");
    pdf.addImage(slice.toDataURL("image/png"), "PNG", margin, margin, contentW, h * scale, undefined, "FAST");
    y += h;
    page++;
  }
  pdf.save(`${name}-a4.pdf`);
  return "A4 PDF downloaded";
}

export async function readCardFile(file: File): Promise<unknown> {
  const text = await file.text();
  const data = JSON.parse(text);
  return data && typeof data === "object" && "card" in data ? (data as { card: unknown }).card : data;
}
