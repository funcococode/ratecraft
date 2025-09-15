import { type RefObject, type CSSProperties } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { Item } from "@/lib/helpers";
import { currencySafe } from "@/lib/helpers";

interface PreviewProps {
  template: "cards" | "rows" | "billboard";
  density: "cozy" | "compact";
  items: Item[];
  currency: string;
  accent: string;
  logo?: string;
  title: string;
  note: string;
  previewRef: RefObject<HTMLDivElement | null>;
  font: "sans" | "serif" | "mono";
  titleSize: number;
  priceSize: number;
  align: "left" | "center" | "right";
}

export function Preview({ template, density, items, currency, accent, logo, title, note, previewRef, font, titleSize, priceSize, align }: PreviewProps) {
  const accentLight = `${accent}16`;
  const accentSoft = `${accent}10`;
  const pad = density === "compact" ? "p-3" : "p-5";
  const img = density === "compact" ? "h-10 w-10" : "h-14 w-14";
  const fontClass = font === "serif" ? "font-serif" : font === "mono" ? "font-mono" : "font-sans";
  const textAlignStyle: CSSProperties = { textAlign: align };

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-sm text-neutral-500">
        <span>Preview</span>
      </div>
      <div className="grid place-items-center">
        <div ref={previewRef} className={`relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl ${fontClass}`} style={{ width: 900, maxWidth: "100%" }}>
          <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accentLight})` }} />
          <div className="flex items-center justify-between gap-4 px-8 py-6">
            <div className="min-w-0" style={textAlignStyle}>
              <div className="font-semibold tracking-tight" style={{ color: accent, fontSize: titleSize }}>{title || "Service Title"}</div>
              <div className="text-xs text-neutral-500">Rate Card</div>
            </div>
            {logo ? (
              <img src={logo} alt="Logo" className="h-12 w-auto rounded-md ring-1 ring-neutral-200" />
            ) : (
              <div className="grid h-12 w-12 place-items-center rounded-md bg-neutral-50 ring-1 ring-neutral-200">
                <ImageIcon className="h-5 w-5 text-neutral-400" />
              </div>
            )}
          </div>

          {template === "cards" && (
            <div className="grid grid-cols-1 gap-4 px-8 pb-8 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <div key={it.id} className={`group relative rounded-2xl border ${pad} ring-1 ring-transparent transition-shadow hover:shadow-lg`} style={{ borderColor: accentSoft }}>
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={{ background: accent }} />
                  <div className="flex items-center gap-3">
                    {it.image ? (
                      <img src={it.image} className={`${img} flex-none rounded-xl object-cover ring-1 ring-neutral-200`} />
                    ) : (
                      <div className={`grid ${img} flex-none place-items-center rounded-xl bg-neutral-50 ring-1 ring-neutral-200`}>
                        <ImageIcon className="h-5 w-5 text-neutral-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{it.name}</div>
                      <div className="truncate text-xs text-neutral-500">{it.unit}</div>
                    </div>
                  </div>
                  <div className="mt-3 font-semibold" style={{ color: accent, fontSize: priceSize, ...textAlignStyle }}>
                    {currencySafe(currency)}{it.rate.toLocaleString()}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">Add items to see them here.</div>
              )}
            </div>
          )}

          {template === "rows" && (
            <div className="px-8 pb-8">
              <div className="overflow-hidden rounded-2xl border border-neutral-200">
                <div className="grid grid-cols-[1fr_auto] bg-neutral-50 px-4 py-3 text-xs font-medium text-neutral-600">
                  <div>Item</div>
                  <div>Price</div>
                </div>
                <div className="divide-y divide-neutral-100">
                  {items.map((it) => (
                    <div key={it.id} className={`grid grid-cols-[1fr_auto] items-center ${pad}`}>
                      <div className="flex min-w-0 items-center gap-3">
                        {it.image ? (
                          <img src={it.image} className={`${img} flex-none rounded-lg object-cover ring-1 ring-neutral-200`} />
                        ) : (
                          <div className={`grid ${img} flex-none place-items-center rounded-lg bg-neutral-50 ring-1 ring-neutral-200`}>
                            <ImageIcon className="h-5 w-5 text-neutral-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{it.name}</div>
                          <div className="truncate text-xs text-neutral-500">{it.unit}</div>
                        </div>
                      </div>
                      <div className="font-semibold" style={{ color: accent, fontSize: priceSize, ...textAlignStyle }}>{currencySafe(currency)}{it.rate.toLocaleString()}</div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="p-8 text-center text-neutral-500">Add items to see them here.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {template === "billboard" && (
            <div className="grid gap-6 px-8 pb-8 md:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl border bg-[var(--acc-soft)] p-6" style={{ borderColor: accentSoft, ["--acc-soft" as string]: accentSoft }}>
                <div className="text-sm uppercase tracking-wide text-neutral-500">What we do</div>
                <div className="mt-2 font-semibold leading-tight" style={{ color: accent, fontSize: titleSize }}>{title || "Service Title"}</div>
                <p className="mt-3 text-sm text-neutral-600">Choose what fits your project. Transparent pricing, fast turnaround, and friendly revisions.</p>
              </div>
              <div className="grid gap-4">
                {items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      {it.image ? (
                        <img src={it.image} className={`${img} flex-none rounded-lg object-cover ring-1 ring-neutral-200`} />
                      ) : (
                        <div className={`grid ${img} flex-none place-items-center rounded-lg bg-neutral-50 ring-1 ring-neutral-200`}>
                          <ImageIcon className="h-5 w-5 text-neutral-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{it.name}</div>
                        <div className="truncate text-xs text-neutral-500">{it.unit}</div>
                      </div>
                    </div>
                    <div className="font-semibold" style={{ color: accent, fontSize: priceSize, ...textAlignStyle }}>{currencySafe(currency)}{it.rate.toLocaleString()}</div>
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">Add items to see them here.</div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 bg-neutral-50 px-8 py-4 text-xs text-neutral-500">
            <span>{note}</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
