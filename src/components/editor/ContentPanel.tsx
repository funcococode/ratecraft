import { useEffect, useRef, useState } from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ClipboardPaste,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  MoreHorizontal,
  Plus,
  Trash2,
  FolderInput,
  TextCursorInput,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, ImagePicker, NumberInput, PanelSection, Segmented } from "./fields";
import { BulkAddDialog } from "./BulkAddDialog";
import { makeItem, makeSection, uid } from "@/lib/factory";
import { priceLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CurrencyFormat, Item, PriceMode, RateCard, Section } from "@/lib/types";

export type Update = (recipe: (d: RateCard) => void, coalesce?: string) => void;

interface Props {
  card: RateCard;
  update: Update;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
}

const UNIT_SUGGESTIONS = ["per hour", "per day", "per session", "per project", "per track", "per song", "per month", "per person", "per page", "per word", "per post"];

export function ContentPanel({ card, update, selectedItemId, setSelectedItemId }: Props) {
  const [bulkFor, setBulkFor] = useState<string | null>(null);
  const tiers = card.design.template === "tiers";

  function addSection() {
    const s = makeSection({ title: "New section" });
    const it = makeItem({ name: "New item", price: 0 });
    s.items.push(it);
    update((d) => void d.sections.push(s));
    setSelectedItemId(it.id);
  }

  return (
    <div>
      <PanelSection title="Header">
        <Field label="Business or card title" htmlFor="f-title">
          <Input id="f-title" value={card.info.title} onChange={(e) => update((d) => void (d.info.title = e.target.value), "title")} placeholder="Night Owl Studios" className="font-medium" />
        </Field>
        <Field label="Tagline" htmlFor="f-tag">
          <Input id="f-tag" value={card.info.tagline} onChange={(e) => update((d) => void (d.info.tagline = e.target.value), "tagline")} placeholder="Recording · Mixing · Mastering" />
        </Field>
        <Field label="Label" hint="small text above the title" htmlFor="f-eyebrow">
          <Input id="f-eyebrow" value={card.info.eyebrow} onChange={(e) => update((d) => void (d.info.eyebrow = e.target.value), "eyebrow")} placeholder="Rate card" />
        </Field>
        <Field label="Intro" hint="optional" htmlFor="f-intro">
          <Textarea id="f-intro" rows={2} value={card.info.intro} onChange={(e) => update((d) => void (d.info.intro = e.target.value), "intro")} placeholder="A sentence or two about what you offer." />
        </Field>
        <Field label="Logo">
          <ImagePicker value={card.info.logo} onChange={(v) => update((d) => void (d.info.logo = v))} maxSize={480} label="Upload logo" />
        </Field>
      </PanelSection>

      <div className="px-5 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="eyebrow">Sections & items</h3>
          <span className="hidden text-[11.5px] text-mute sm:inline">Tip: click an item in the preview to edit it</span>
        </div>
      </div>

      <div className="grid gap-4 px-3 pb-6 sm:px-5">
        {card.sections.map((s, si) => (
          <SectionBlock
            key={s.id}
            section={s}
            index={si}
            total={card.sections.length}
            allSections={card.sections}
            update={update}
            tiers={tiers}
            currency={card.currency}
            selectedItemId={selectedItemId}
            setSelectedItemId={setSelectedItemId}
            onBulk={() => setBulkFor(s.id)}
          />
        ))}
        <Button variant="outline" className="h-11 border-dashed bg-transparent" onClick={addSection}>
          <Plus /> Add section
        </Button>
      </div>

      <datalist id="unit-suggestions">
        {UNIT_SUGGESTIONS.map((u) => (
          <option key={u} value={u} />
        ))}
      </datalist>
      <datalist id="badge-suggestions">
        {["Popular", "Best value", "New", "Limited", "Most booked"].map((u) => (
          <option key={u} value={u} />
        ))}
      </datalist>
      <BulkAddDialog
        open={!!bulkFor}
        onOpenChange={(o) => !o && setBulkFor(null)}
        onAdd={(items) => {
          const target = bulkFor;
          update((d) => {
            const s = d.sections.find((x) => x.id === target);
            if (s) s.items.push(...items);
          });
          setBulkFor(null);
        }}
      />
    </div>
  );
}

function SectionBlock({
  section: s,
  index,
  total,
  allSections,
  update,
  tiers,
  currency,
  selectedItemId,
  setSelectedItemId,
  onBulk,
}: {
  section: Section;
  index: number;
  total: number;
  allSections: Section[];
  update: Update;
  tiers: boolean;
  currency: CurrencyFormat;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  onBulk: () => void;
}) {
  const [showDesc, setShowDesc] = useState(!!s.description);
  const edit = (fn: (sec: Section) => void, key?: string) =>
    update((d) => {
      const sec = d.sections.find((x) => x.id === s.id);
      if (sec) fn(sec);
    }, key);

  function addItem() {
    const it = makeItem({ name: "", unit: s.items.at(-1)?.unit ?? "", price: null });
    edit((sec) => void sec.items.push(it));
    setSelectedItemId(it.id);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface shadow-[0_1px_0_rgba(23,21,15,0.03)]">
      <div className="flex items-start gap-2 px-4 pt-3.5 pb-2">
        <div className="min-w-0 flex-1">
          <input
            value={s.title}
            onChange={(e) => edit((sec) => void (sec.title = e.target.value), `sec:${s.id}:title`)}
            placeholder="Section title (optional)"
            className="font-display w-full bg-transparent text-[26px] leading-tight outline-none placeholder:text-mute/60"
          />
          {showDesc && (
            <input
              autoFocus={!s.description}
              value={s.description}
              onChange={(e) => edit((sec) => void (sec.description = e.target.value), `sec:${s.id}:desc`)}
              placeholder="Short description"
              className="w-full bg-transparent text-sm text-mute outline-none placeholder:text-mute/50"
            />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="mt-1 size-8 text-mute" aria-label="Section actions">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Section</DropdownMenuLabel>
            {!showDesc && (
              <DropdownMenuItem onSelect={() => setShowDesc(true)}>
                <TextCursorInput /> Add description
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={onBulk}>
              <ClipboardPaste /> Paste a list of items
            </DropdownMenuItem>
            <DropdownMenuItem disabled={index === 0} onSelect={() => update((d) => d.sections.splice(index - 1, 0, d.sections.splice(index, 1)[0]))}>
              <ArrowUp /> Move up
            </DropdownMenuItem>
            <DropdownMenuItem disabled={index === total - 1} onSelect={() => update((d) => d.sections.splice(index + 1, 0, d.sections.splice(index, 1)[0]))}>
              <ArrowDown /> Move down
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                update((d) => {
                  const copy = structuredClone(s);
                  copy.id = uid();
                  copy.items = copy.items.map((i) => ({ ...i, id: uid() }));
                  d.sections.splice(index + 1, 0, copy);
                })
              }
            >
              <Copy /> Duplicate section
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => update((d) => void d.sections.splice(index, 1))}>
              <Trash2 /> Delete section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Reorder.Group
        axis="y"
        values={s.items.map((i) => i.id)}
        onReorder={(ids: string[]) =>
          edit((sec) => {
            const map = new Map(sec.items.map((i) => [i.id, i]));
            sec.items = ids.map((id) => map.get(id)!).filter(Boolean);
          }, `sec:${s.id}:order`)
        }
        className="grid gap-1.5 px-2"
      >
        {s.items.map((it) => (
          <ItemRow
            key={it.id}
            item={it}
            section={s}
            allSections={allSections}
            update={update}
            tiers={tiers}
            currency={currency}
            open={selectedItemId === it.id}
            onToggle={() => setSelectedItemId(selectedItemId === it.id ? null : it.id)}
          />
        ))}
      </Reorder.Group>
      {s.items.length === 0 && <div className="mx-2 rounded-xl border border-dashed border-line px-4 py-5 text-center text-sm text-mute">No items in this section yet.</div>}

      <div className="flex gap-1 p-2">
        <Button variant="ghost" className="flex-1 justify-start text-mute hover:text-ink" onClick={addItem}>
          <Plus /> Add item
        </Button>
        <Button variant="ghost" className="text-mute hover:text-ink" onClick={onBulk} title="Paste many items at once">
          <ClipboardPaste /> <span className="hidden sm:inline">Paste list</span>
        </Button>
      </div>
    </div>
  );
}

const MODES: { value: PriceMode; label: string }[] = [
  { value: "fixed", label: "Fixed" },
  { value: "from", label: "From" },
  { value: "range", label: "Range" },
  { value: "quote", label: "On request" },
];

function ItemRow({
  item: it,
  section,
  allSections,
  update,
  tiers,
  currency,
  open,
  onToggle,
}: {
  item: Item;
  section: Section;
  allSections: Section[];
  update: Update;
  tiers: boolean;
  currency: CurrencyFormat;
  open: boolean;
  onToggle: () => void;
}) {
  const controls = useDragControls();
  const ref = useRef<HTMLLIElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      if (!it.name) nameRef.current?.focus();
    }, 60);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const edit = (fn: (item: Item) => void, key?: string) =>
    update((d) => {
      const item = d.sections.find((x) => x.id === section.id)?.items.find((x) => x.id === it.id);
      if (item) fn(item);
    }, key && `item:${it.id}:${key}`);

  return (
    <Reorder.Item
      ref={ref}
      value={it.id}
      dragListener={false}
      dragControls={controls}
      className={cn("rounded-xl border bg-card transition-colors", open ? "border-ink/20 shadow-md shadow-ink/5" : "border-transparent hover:border-line hover:bg-paper/60")}
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 30px rgba(23,21,15,0.14)" }}
    >
      <div className="flex items-center gap-1 py-1.5 pr-1.5 pl-0.5">
        <button
          onPointerDown={(e) => {
            e.preventDefault();
            controls.start(e);
          }}
          className="grid h-9 w-6 shrink-0 cursor-grab touch-none place-items-center text-mute/60 hover:text-ink active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-4" />
        </button>
        <button onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          {it.image ? (
            <img src={it.image} alt="" className="size-9 shrink-0 rounded-md object-cover ring-1 ring-line" />
          ) : null}
          <div className={cn("min-w-0 flex-1", it.hidden && "opacity-45")}>
            <div className="truncate text-sm font-medium">{it.name || <span className="text-mute">Untitled item</span>}</div>
            <div className="truncate text-xs text-mute">
              <PriceSummary item={it} currency={currency} />
              {it.unit && <span> · {it.unit}</span>}
              {it.badge && <span className="ml-1.5 rounded-full bg-vermilion/10 px-1.5 py-px text-[10.5px] font-semibold text-vermilion">{it.badge}</span>}
            </div>
          </div>
        </button>
        <button
          onClick={() => edit((x) => void (x.hidden = !x.hidden))}
          className="grid size-8 shrink-0 place-items-center rounded-md text-mute hover:bg-paper-2 hover:text-ink"
          title={it.hidden ? "Show on card" : "Hide from card"}
          aria-label={it.hidden ? "Show on card" : "Hide from card"}
        >
          {it.hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
        <button onClick={onToggle} className="grid size-8 shrink-0 place-items-center rounded-md text-mute hover:bg-paper-2 hover:text-ink" aria-label={open ? "Collapse" : "Edit item"}>
          <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="grid gap-3.5 border-t border-line/70 px-3.5 pt-3.5 pb-3">
              <div className="grid grid-cols-[1fr_7.5rem] gap-2.5">
                <Field label="Name" htmlFor={`n-${it.id}`}>
                  <Input ref={nameRef} id={`n-${it.id}`} value={it.name} onChange={(e) => edit((x) => void (x.name = e.target.value), "name")} placeholder="e.g. Mixing" />
                </Field>
                <Field label="Badge" htmlFor={`b-${it.id}`}>
                  <Input id={`b-${it.id}`} value={it.badge} onChange={(e) => edit((x) => void (x.badge = e.target.value), "badge")} placeholder="Popular" list="badge-suggestions" />
                </Field>
              </div>

              <Field label="Pricing">
                <Segmented value={it.mode} onChange={(v) => edit((x) => void (x.mode = v))} options={MODES} />
              </Field>

              {it.mode !== "quote" && (
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label={it.mode === "range" ? "Min price" : it.mode === "from" ? "Starting at" : "Price"} htmlFor={`p-${it.id}`}>
                    <NumberInput id={`p-${it.id}`} value={it.price} onChange={(v) => edit((x) => void (x.price = v), "price")} placeholder="0" />
                  </Field>
                  {it.mode === "range" ? (
                    <Field label="Max price" htmlFor={`pm-${it.id}`}>
                      <NumberInput id={`pm-${it.id}`} value={it.priceMax} onChange={(v) => edit((x) => void (x.priceMax = v), "pmax")} placeholder="0" />
                    </Field>
                  ) : (
                    <Field label="Was" hint="shows a discount" htmlFor={`op-${it.id}`}>
                      <NumberInput id={`op-${it.id}`} value={it.originalPrice} onChange={(v) => edit((x) => void (x.originalPrice = v), "orig")} placeholder="—" />
                    </Field>
                  )}
                </div>
              )}

              <Field label="Unit" htmlFor={`u-${it.id}`}>
                <Input id={`u-${it.id}`} value={it.unit} onChange={(e) => edit((x) => void (x.unit = e.target.value), "unit")} placeholder="per hour" list="unit-suggestions" />
              </Field>

              <Field label={tiers ? "What's included" : "Description"} hint={tiers ? "one per line" : "optional"} htmlFor={`d-${it.id}`}>
                <Textarea
                  id={`d-${it.id}`}
                  rows={tiers ? 4 : 2}
                  value={it.description}
                  onChange={(e) => edit((x) => void (x.description = e.target.value), "desc")}
                  placeholder={tiers ? "2 hours\n40 edited photos\nOnline gallery" : "What's included, turnaround, etc."}
                />
              </Field>

              <Field label="Image">
                <ImagePicker value={it.image} onChange={(v) => edit((x) => void (x.image = v))} />
              </Field>

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-mute"
                    onClick={() =>
                      update((d) => {
                        const sec = d.sections.find((x) => x.id === section.id);
                        const idx = sec?.items.findIndex((x) => x.id === it.id) ?? -1;
                        if (sec && idx >= 0) sec.items.splice(idx + 1, 0, { ...structuredClone(it), id: uid() });
                      })
                    }
                  >
                    <Copy /> Duplicate
                  </Button>
                  {allSections.length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-mute">
                          <FolderInput /> Move
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Move to section</DropdownMenuLabel>
                        {allSections
                          .filter((x) => x.id !== section.id)
                          .map((target) => (
                            <DropdownMenuItem
                              key={target.id}
                              onSelect={() =>
                                update((d) => {
                                  const from = d.sections.find((x) => x.id === section.id);
                                  const to = d.sections.find((x) => x.id === target.id);
                                  const idx = from?.items.findIndex((x) => x.id === it.id) ?? -1;
                                  if (from && to && idx >= 0) to.items.push(from.items.splice(idx, 1)[0]);
                                })
                              }
                            >
                              {target.title || "Untitled section"}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() =>
                    update((d) => {
                      const sec = d.sections.find((x) => x.id === section.id);
                      if (sec) sec.items = sec.items.filter((x) => x.id !== it.id);
                    })
                  }
                >
                  <Trash2 /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}

function PriceSummary({ item, currency }: { item: Item; currency: CurrencyFormat }) {
  const label = priceLabel(item, currency);
  return <span className="tabular-nums">{item.mode !== "quote" && item.price == null ? "No price" : label}</span>;
}
