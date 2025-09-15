import {type RefObject } from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

export interface Item {
  id: string;
  name: string;
  unit: string;
  rate: number;
  image?: string;
}

export const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "INR — Indian Rupee" },
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "JPY", symbol: "¥", label: "JPY — Japanese Yen" },
  { code: "AUD", symbol: "A$", label: "AUD — Australian Dollar" },
  { code: "CAD", symbol: "C$", label: "CAD — Canadian Dollar" },
] as const;

export const uid = () => Math.random().toString(36).slice(2, 9);
export const currencySafe = (s: string) => (s?.trim() || "₹");

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function dataUrlToObjectUrl(dataUrl: string): Promise<string> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}

// ── Item helpers ─────────────────────────────────────────────────────────────
export async function onSelectItemImage(
  file: File | undefined,
  setForm: (updater: (prev: { name: string; unit: string; rate: string; image?: string }) => { name: string; unit: string; rate: string; image?: string }) => void
) {
  if (!file) {
    setForm((f) => ({ ...f, image: undefined }));
    return;
  }
  const dataUrl = await readFileAsDataURL(file);
  setForm((f) => ({ ...f, image: dataUrl }));
}

export async function onSelectLogo(
  file: File | undefined,
  setLogo: (v: string | undefined) => void
) {
  if (!file) {
    setLogo(undefined);
    return;
  }
  const dataUrl = await readFileAsDataURL(file);
  setLogo(dataUrl);
}

export function addItem(
  form: { name: string; unit: string; rate: string; image?: string },
  setItems: (updater: (prev: Item[]) => Item[]) => void,
  resetForm: () => void
) {
  const rateNum = Number(form.rate);
  if (!form.name.trim() || !form.unit.trim() || !Number.isFinite(rateNum)) return;
  const next: Item = { id: uid(), name: form.name.trim(), unit: form.unit.trim(), rate: rateNum, image: form.image };
  setItems((prev) => [...prev, next]);
  resetForm();
}

export function updateItem(
  editingId: string | null,
  form: { name: string; unit: string; rate: string; image?: string },
  setItems: (updater: (prev: Item[]) => Item[]) => void,
  setEditingId: (v: string | null) => void,
  resetForm: () => void
) {
  if (!editingId) return;
  const rateNum = Number(form.rate);
  if (!form.name.trim() || !form.unit.trim() || !Number.isFinite(rateNum)) return;
  setItems((prev) => prev.map((it) => (it.id === editingId ? { ...it, name: form.name.trim(), unit: form.unit.trim(), rate: rateNum, image: form.image } : it)));
  setEditingId(null);
  resetForm();
}

export function editItem(
  it: Item,
  setEditingId: (v: string | null) => void,
  setForm: (v: { name: string; unit: string; rate: string; image?: string }) => void
) {
  setEditingId(it.id);
  setForm({ name: it.name, unit: it.unit, rate: String(it.rate), image: it.image });
}

export function removeItem(
  id: string,
  setItems: (updater: (prev: Item[]) => Item[]) => void,
  editingId: string | null,
  setEditingId: (v: string | null) => void,
  resetForm: () => void
) {
  setItems((prev) => prev.filter((it) => it.id !== id));
  if (editingId === id) {
    setEditingId(null);
    resetForm();
  }
}

export function moveItem(
  id: string,
  dir: -1 | 1,
  setItems: (updater: (prev: Item[]) => Item[]) => void
) {
  setItems((prev) => {
    const idx = prev.findIndex((x) => x.id === id);
    if (idx < 0) return prev;
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= prev.length) return prev;
    const copy = [...prev];
    const [spliced] = copy.splice(idx, 1);
    copy.splice(nextIdx, 0, spliced);
    return copy;
  });
}

// ── Export helpers ───────────────────────────────────────────────────────────
export async function downloadPNG(
  previewRef: RefObject<HTMLDivElement | null>,
  title: string,
  setExporting: (v: boolean) => void
) {
  if (!previewRef.current) return;
  try {
    setExporting(true);
    const node = previewRef.current;
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" });
    const objectUrl = await dataUrlToObjectUrl(dataUrl);
    triggerDownload(objectUrl, `${title || "rate-card"}.png`);
  } finally {
    setExporting(false);
  }
}

export async function downloadPDF(
  previewRef: RefObject<HTMLDivElement | null>,
  title: string,
  setExporting: (v: boolean) => void
) {
  if (!previewRef.current) return;
  try {
    setExporting(true);
    const node = previewRef.current;
    const rect = node.getBoundingClientRect();
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#ffffff" });
    const pdf = new jsPDF({ orientation: rect.width >= rect.height ? "landscape" : "portrait", unit: "px", format: [rect.width, rect.height] });
    pdf.addImage(dataUrl, "PNG", 0, 0, rect.width, rect.height, undefined, "FAST");
    pdf.save(`${title || "rate-card"}.pdf`);
  } finally {
    setExporting(false);
  }
}