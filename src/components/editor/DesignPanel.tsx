import { memo, useState, useEffect } from "react";
import { AlignCenter, AlignLeft, Check, Square, SquareDashed, Circle } from "lucide-react";
import { ScaledCard } from "@/components/card/ScaledCard";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Field, PanelSection, Segmented } from "./fields";
import { ACCENT_SWATCHES, FONT_PAIRS, PALETTES, TEMPLATES, isHex } from "@/lib/themes";
import { cn } from "@/lib/utils";
import type { RateCard, TemplateId } from "@/lib/types";
import type { Update } from "./ContentPanel";

const TemplateThumb = memo(function TemplateThumb({ card, template }: { card: RateCard; template: TemplateId }) {
  return <ScaledCard card={{ ...card, design: { ...card.design, template } }} clip={0.78} />;
});

export function DesignPanel({ card, update }: { card: RateCard; update: Update }) {
  const d = card.design;
  const set = <K extends keyof RateCard["design"]>(k: K, v: RateCard["design"][K], coalesce?: string) =>
    update((draft) => void (draft.design[k] = v), coalesce);

  const [hex, setHex] = useState(d.accent);
  useEffect(() => setHex(d.accent), [d.accent]);

  return (
    <div>
      <PanelSection title="Template">
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() =>
                update((draft) => {
                  if (t.id === "menu") draft.design.align = "center";
                  else if (draft.design.template === "menu") draft.design.align = "left";
                  draft.design.template = t.id;
                })
              }
              className={cn(
                "group rounded-xl border p-1.5 text-left transition",
                d.template === t.id ? "border-ink bg-paper-2 ring-1 ring-ink" : "border-line hover:border-ink/30",
              )}
            >
              <div className="pointer-events-none overflow-hidden rounded-lg ring-1 ring-ink/5">
                <TemplateThumb card={card} template={t.id} />
              </div>
              <div className="flex items-center justify-between px-1 pt-1.5 pb-0.5">
                <span className="text-[13px] font-medium">{t.name}</span>
                {d.template === t.id && <Check className="size-3.5" />}
              </div>
              <div className="px-1 text-[11px] leading-tight text-mute">{t.blurb}</div>
            </button>
          ))}
        </div>
      </PanelSection>

      <PanelSection title="Theme">
        <div className="grid grid-cols-4 gap-2">
          {PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() =>
                update((draft) => {
                  draft.design.palette = p.id;
                  draft.design.accent = p.accent;
                })
              }
              className={cn("group flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition", d.palette === p.id ? "bg-paper-2" : "hover:bg-paper-2/60")}
              title={p.name}
            >
              <span
                className={cn("relative grid size-11 place-items-center overflow-hidden rounded-full ring-1 ring-ink/10", d.palette === p.id && "ring-2 ring-ink ring-offset-2 ring-offset-surface")}
                style={{ background: p.paper }}
              >
                <span className="absolute right-0 bottom-0 h-1/2 w-1/2" style={{ background: p.surface }} />
                <span className="relative size-3.5 rounded-full" style={{ background: p.accent }} />
              </span>
              <span className="text-[11px] text-mute">{p.name}</span>
            </button>
          ))}
        </div>

        <Field label="Accent colour">
          <div className="flex flex-wrap items-center gap-1.5">
            {ACCENT_SWATCHES.map((c) => (
              <button
                key={c}
                onClick={() => set("accent", c)}
                className={cn("size-7 rounded-full ring-1 ring-ink/10 transition hover:scale-110", d.accent.toLowerCase() === c.toLowerCase() && "ring-2 ring-ink ring-offset-2 ring-offset-surface")}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
            <label className="relative grid size-7 cursor-pointer place-items-center overflow-hidden rounded-full ring-1 ring-ink/10" title="Custom colour" style={{ background: "conic-gradient(from 0deg, #f43f5e, #f59e0b, #84cc16, #06b6d4, #6366f1, #d946ef, #f43f5e)" }}>
              <input type="color" value={d.accent} onChange={(e) => set("accent", e.target.value, "accent")} className="absolute inset-0 cursor-pointer opacity-0" />
            </label>
            <input
              value={hex}
              onChange={(e) => {
                setHex(e.target.value);
                if (isHex(e.target.value)) set("accent", e.target.value, "accent");
              }}
              className="ml-auto h-8 w-[5.5rem] rounded-md border border-input bg-card px-2 font-mono text-xs uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              aria-label="Accent hex"
            />
          </div>
        </Field>
      </PanelSection>

      <PanelSection title="Typography">
        <div className="grid grid-cols-2 gap-2">
          {FONT_PAIRS.map((f) => (
            <button
              key={f.id}
              onClick={() => set("fontPair", f.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition",
                d.fontPair === f.id ? "border-ink bg-paper-2 ring-1 ring-ink" : "border-line hover:border-ink/30",
              )}
            >
              <span className="text-[28px] leading-none" style={{ fontFamily: f.display, fontWeight: f.displayWeight, letterSpacing: f.displayTracking }}>
                Aa
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium">{f.name}</span>
                <span className="block truncate text-[11px] text-mute">{f.display.split(",")[0].replace(/'/g, "").replace(" Variable", "")}</span>
              </span>
            </button>
          ))}
        </div>
        <Field label="Title size" hint={`${Math.round(d.titleScale * 100)}%`}>
          <Slider min={0.7} max={1.5} step={0.05} value={[d.titleScale]} onValueChange={([v]) => set("titleScale", v, "titleScale")} />
        </Field>
        <Field label="Price size" hint={`${Math.round(d.priceScale * 100)}%`}>
          <Slider min={0.7} max={1.6} step={0.05} value={[d.priceScale]} onValueChange={([v]) => set("priceScale", v, "priceScale")} />
        </Field>
      </PanelSection>

      <PanelSection title="Layout">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Spacing">
            <Segmented value={d.density} onChange={(v) => set("density", v)} options={[{ value: "cozy", label: "Airy" }, { value: "compact", label: "Compact" }]} />
          </Field>
          <Field label="Alignment">
            <Segmented
              value={d.align}
              onChange={(v) => set("align", v)}
              options={[
                { value: "left", label: <AlignLeft />, title: "Left" },
                { value: "center", label: <AlignCenter />, title: "Centered" },
              ]}
            />
          </Field>
          <Field label="Corners">
            <Segmented
              value={d.radius}
              onChange={(v) => set("radius", v)}
              options={[
                { value: "sharp", label: <Square />, title: "Sharp" },
                { value: "soft", label: <SquareDashed />, title: "Soft" },
                { value: "round", label: <Circle />, title: "Round" },
              ]}
            />
          </Field>
          <Field label="Columns" hint={d.template === "grid" ? undefined : "Studio only"}>
            <Segmented value={d.columns} onChange={(v) => set("columns", v)} options={[{ value: 2, label: "2" }, { value: 3, label: "3" }]} className={d.template !== "grid" ? "opacity-50" : ""} />
          </Field>
        </div>
        <label className="flex items-center justify-between gap-3 text-[13px]">
          <span>
            <span className="font-medium">Show item images</span>
            <span className="block text-[11.5px] text-mute">Hide them without deleting</span>
          </span>
          <Switch checked={d.showImages} onCheckedChange={(v) => set("showImages", v)} />
        </label>
        <label className="flex items-center justify-between gap-3 text-[13px]">
          <span>
            <span className="font-medium">Show date</span>
            <span className="block text-[11.5px] text-mute">Month & year in the footer</span>
          </span>
          <Switch checked={d.showDate} onCheckedChange={(v) => set("showDate", v)} />
        </label>
      </PanelSection>
    </div>
  );
}
