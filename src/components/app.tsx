import { useEffect, useMemo, useRef, useState } from "react";
import { Download, RotateCcw, BadgeIndianRupee } from "lucide-react";
import { Toolbar } from "@/components/toolbar";
import { Preview } from "@/components/preview";
import type { Item } from "@/lib/helpers";
import { downloadPDF, downloadPNG } from "@/lib/helpers";

export default function MainApp() {
  const [title, setTitle] = useState<string>(() => localStorage.getItem("rcc-title") || "Your Service Title");
  const [currency, setCurrency] = useState<string>(() => localStorage.getItem("rcc-currency") || "₹");
  const [accent, setAccent] = useState<string>(() => localStorage.getItem("rcc-accent") || "#111827");
  const [logo, setLogo] = useState<string | undefined>(() => localStorage.getItem("rcc-logo") || undefined);
  const [items, setItems] = useState<Item[]>(() => {
    try { const raw = localStorage.getItem("rcc-items"); if (raw) return JSON.parse(raw) as Item[]; } catch {
        // noop
    }
    return [];
  });
  const [exporting, setExporting] = useState(false);
  const [template, setTemplate] = useState<"cards" | "rows" | "billboard">(() => (localStorage.getItem("rcc-template") as 'cards' | 'rows' | 'billboard') || "cards");
  const [density, setDensity] = useState<"cozy" | "compact">(() => (localStorage.getItem("rcc-density") as 'cozy' | 'compact') || "cozy");
  const [note, setNote] = useState<string>(() => localStorage.getItem("rcc-note") || "Prices are inclusive of basic edits. Taxes extra.");
  const [form, setForm] = useState<{ name: string; unit: string; rate: string; image?: string }>({ name: "", unit: "per unit", rate: "", image: undefined });
  // Typography and layout controls
  const [font, setFont] = useState<"sans" | "serif" | "mono">(() => (localStorage.getItem("rcc-font") as "sans" | "serif" | "mono") || "sans");
  const [titleSize, setTitleSize] = useState<number>(() => {
    const v = Number(localStorage.getItem("rcc-titleSize"));
    return Number.isFinite(v) && v > 0 ? v : 24;
  });
  const [priceSize, setPriceSize] = useState<number>(() => {
    const v = Number(localStorage.getItem("rcc-priceSize"));
    return Number.isFinite(v) && v > 0 ? v : 18;
  });
  const [align, setAlign] = useState<"left" | "center" | "right">(() => (localStorage.getItem("rcc-align") as "left" | "center" | "right") || "right");

  useEffect(() => localStorage.setItem("rcc-title", title), [title]);
  useEffect(() => localStorage.setItem("rcc-currency", currency), [currency]);
  useEffect(() => localStorage.setItem("rcc-accent", accent), [accent]);
  useEffect(() => localStorage.setItem("rcc-items", JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem("rcc-template", template), [template]);
  useEffect(() => localStorage.setItem("rcc-density", density), [density]);
  useEffect(() => localStorage.setItem("rcc-note", note), [note]);
  useEffect(() => localStorage.setItem("rcc-font", font), [font]);
  useEffect(() => localStorage.setItem("rcc-titleSize", String(titleSize)), [titleSize]);
  useEffect(() => localStorage.setItem("rcc-priceSize", String(priceSize)), [priceSize]);
  useEffect(() => localStorage.setItem("rcc-align", align), [align]);
  useEffect(() => { if (logo) localStorage.setItem("rcc-logo", logo); else localStorage.removeItem("rcc-logo"); }, [logo]);

  const previewRef = useRef<HTMLDivElement>(null);
  const accentSoft = useMemo(() => `${accent}10`, [accent]);

  function resetAll() {
    setTitle("Your Service Title");
    setCurrency("₹");
    setAccent("#111827");
    setLogo(undefined);
    setItems([]);
    setTemplate("cards");
    setDensity("cozy");
    setNote("Prices are inclusive of basic edits. Taxes extra.");
    setForm({ name: "", unit: "per unit", rate: "", image: undefined });
    setFont("sans");
    setTitleSize(24);
    setPriceSize(18);
    setAlign("right");
    [
      "rcc-title",
      "rcc-currency",
      "rcc-accent",
      "rcc-logo",
      "rcc-items",
      "rcc-template",
      "rcc-density",
      "rcc-note",
      "rcc-font",
      "rcc-titleSize",
      "rcc-priceSize",
      "rcc-align",
    ].forEach(localStorage.removeItem.bind(localStorage));
  }

  return (
    <div className="min-h-screen w-full bg-neutral-100/70 text-neutral-900">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-neutral-100 ring-1 ring-neutral-200">
              <BadgeIndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">RateCraft</div>
<div className="text-xs text-neutral-500">Build beautiful rate cards—fast</div>

            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => downloadPNG(previewRef, title, setExporting)} disabled={exporting} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-neutral-50"><Download className="h-4 w-4" /> PNG</button>
            <button onClick={() => downloadPDF(previewRef, title, setExporting)} disabled={exporting} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-neutral-50"><Download className="h-4 w-4" /> PDF</button>
            <button onClick={resetAll} className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm shadow-sm hover:bg-neutral-50"><RotateCcw className="h-4 w-4" /> Reset</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 py-6 lg:grid-cols-[320px_1fr]">
        <Toolbar
          title={title} setTitle={setTitle}
          currency={currency} setCurrency={setCurrency}
          accent={accent} setAccent={setAccent}
          logo={logo} setLogo={setLogo}
          form={form} setForm={setForm}
          items={items} setItems={setItems}
          editingId={null} setEditingId={() => {}}
          template={template} setTemplate={setTemplate}
          density={density} setDensity={setDensity}
          note={note} setNote={setNote}
          accentSoft={accentSoft}
          font={font} setFont={setFont}
          titleSize={titleSize} setTitleSize={setTitleSize}
          priceSize={priceSize} setPriceSize={setPriceSize}
          align={align} setAlign={setAlign}
        />

        <Preview
          template={template}
          density={density}
          items={items}
          currency={currency}
          accent={accent}
          logo={logo}
          title={title}
          note={note}
          previewRef={previewRef}
          font={font}
          titleSize={titleSize}
          priceSize={priceSize}
          align={align}
        />
      </div>
    </div>
  );
}
