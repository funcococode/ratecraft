import {  AnimatePresence, Reorder } from "framer-motion";
import { Upload, Image as ImageIcon, LayoutGrid, Rows3, Sparkles, Save, RotateCcw, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Item } from "@/lib/helpers";
import { CURRENCIES, onSelectItemImage, onSelectLogo, addItem, updateItem} from "@/lib/helpers";
import ItemCard from "./item";

interface ToolbarProps {
  title: string; setTitle: (v: string) => void;
  currency: string; setCurrency: (v: string) => void;
  accent: string; setAccent: (v: string) => void;
  logo?: string; setLogo: (v?: string) => void;
  form: { name: string; unit: string; rate: string; image?: string };
  setForm: (v: { name: string; unit: string; rate: string; image?: string } | ((prev: { name: string; unit: string; rate: string; image?: string }) => { name: string; unit: string; rate: string; image?: string })) => void;
  items: Item[]; setItems: (updater: (items: Item[]) => Item[]) => void;
  editingId: string | null; setEditingId: (v: string | null) => void;
  template: "cards" | "rows" | "billboard"; setTemplate: (v: "cards" | "rows" | "billboard") => void;
  density: "cozy" | "compact"; setDensity: (v: "cozy" | "compact") => void;
  note: string; setNote: (v: string) => void;
  accentSoft: string;
  font: "sans" | "serif" | "mono"; setFont: (v: "sans" | "serif" | "mono") => void;
  titleSize: number; setTitleSize: (v: number) => void;
  priceSize: number; setPriceSize: (v: number) => void;
  align: "left" | "center" | "right"; setAlign: (v: "left" | "center" | "right") => void;
}

export function Toolbar(props: ToolbarProps) {
  const { title, setTitle, currency, setCurrency, accent, setAccent, logo, setLogo, form, setForm, items, setItems, editingId, setEditingId, template, setTemplate, density, setDensity, note, setNote, font, setFont, titleSize, setTitleSize, priceSize, setPriceSize, align, setAlign } = props;

  const resetForm = () => setForm({ name: "", unit: "per unit", rate: "", image: undefined });

  return (
    <section className="h-fit">
      <Card className="sticky top-[76px] rounded-2xl border-neutral-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Designer</CardTitle>
          <div className="text-xs text-neutral-500">Brand • Items • Layout</div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="brand" className="w-full ">
            <TabsList className="grid grid-cols-4 mb-4 border w-full">
              <TabsTrigger value="brand">Brand</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="brand" className="space-y-4">
              <div className="grid gap-3">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your Service Title" />
              </div>

              <div className="grid gap-3">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Currency</Label>
                <div className="flex items-center gap-2">
                  <Select value={currency} onValueChange={(v) => setCurrency(v)}>
                    <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select currency" /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.symbol}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Accent</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-9 w-12 cursor-pointer rounded" title="Accent color" />
                  <Input readOnly value={accent} className="w-28" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Logo</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="gap-2" asChild>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <Upload className="h-4 w-4" /> Upload
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; await onSelectLogo(f, setLogo); }} />
                    </label>
                  </Button>
                  {logo && (
                    <Button variant="ghost" onClick={() => setLogo(undefined)} className="h-9">Remove</Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="items" className="space-y-4 ">
              <div className="grid gap-4">
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">Add Item</div>
                <div className="grid grid-cols-1 gap-4">
                  <Button variant="outline" className="justify-start gap-2" asChild>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <ImageIcon className="h-4 w-4" /> Image
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; await onSelectItemImage(f, setForm); }} />
                    </label>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={form.name} onChange={(e) => setForm((f: { name: string; unit: string; rate: string; image?: string }) => ({ ...f, name: e.target.value }))} placeholder="Item name" />
                    <Input value={form.unit} onChange={(e) => setForm((f: { name: string; unit: string; rate: string; image?: string }) => ({ ...f, unit: e.target.value }))} placeholder="Unit (per hour)" />
                  </div>
                  <Input type="number" value={form.rate} min={0} onChange={(e) => setForm((f: { name: string; unit: string; rate: string; image?: string }) => ({ ...f, rate: e.target.value }))} placeholder="Rate (numeric)" />
                  <div className="flex items-center gap-2">
                    {editingId ? (
                      <>
                        <Button onClick={() => updateItem(editingId, form, setItems, setEditingId, resetForm)} className="gap-2"><Save className="h-4 w-4" /> Save</Button>
                        <Button variant="outline" onClick={() => { setEditingId(null); resetForm(); }}>Cancel</Button>
                      </>
                    ) : (
                      <Button onClick={() => addItem(form, setItems, resetForm)} className="gap-2">
                        Add Item
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetForm}><RotateCcw className="h-4 w-4" /> Clear</Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">Items</div>
                  <AnimatePresence initial={false}>
                    <Reorder.Group
                      axis="y"
                      values={items.map((i) => i.id)}
                      onReorder={(newOrderIds) =>
                        setItems((prev) => {
                          const map = new Map(prev.map((i) => [i.id, i]));
                          return newOrderIds.map((id) => map.get(id)!).filter(Boolean);
                        })
                      }
                      className="space-y-2"
                    >
                      {items.map((it) => (
                        <ItemCard
                          key={it.id}
                          it={it}
                          setItems={setItems}         // ✅ required for delete
                          setEditingId={setEditingId}
                          setForm={setForm}
                          resetForm={resetForm}
                          editingId={editingId}
                          currency={currency}
                        />
                      ))}
                    </Reorder.Group>
                  </AnimatePresence>
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">No items yet. Add your first one above.</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="text-[11px] uppercase tracking-wide text-neutral-500">Template</div>
              <div className="grid grid-cols-3 gap-2">
                <Button variant={template === "cards" ? "default" : "outline"} onClick={() => setTemplate("cards")} className="justify-center gap-2"><LayoutGrid className="h-4 w-4" /> Cards</Button>
                <Button variant={template === "rows" ? "default" : "outline"} onClick={() => setTemplate("rows")} className="justify-center gap-2"><Rows3 className="h-4 w-4" /> Rows</Button>
                <Button variant={template === "billboard" ? "default" : "outline"} onClick={() => setTemplate("billboard")} className="justify-center gap-2"><Sparkles className="h-4 w-4" /> Billboard</Button>
              </div>
              <div className="text-[11px] uppercase tracking-wide text-neutral-500">Density</div>
              <div className="inline-flex rounded-xl border border-neutral-200 bg-white text-sm overflow-hidden">
                {["cozy", "compact"].map((d) => (
                  <button key={d} onClick={() => setDensity(d as 'cozy' | 'compact')} className={`px-3 py-2 capitalize ${density === d ? "bg-neutral-100" : "hover:bg-neutral-50"}`}>
                    {d}
                  </button>
                ))}
              </div>

              <Separator />
              <div className="grid gap-3">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Font</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant={font === "sans" ? "default" : "outline"} onClick={() => setFont("sans")} className="justify-center">Sans</Button>
                  <Button variant={font === "serif" ? "default" : "outline"} onClick={() => setFont("serif")} className="justify-center">Serif</Button>
                  <Button variant={font === "mono" ? "default" : "outline"} onClick={() => setFont("mono")} className="justify-center">Mono</Button>
                </div>
              </div>

              <div className="grid gap-3">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Title size</Label>
                <Select value={String(titleSize)} onValueChange={(v) => setTitleSize(Number(v))}>
                  <SelectTrigger className="w-[220px]"><SelectValue placeholder="Title size" /></SelectTrigger>
                  <SelectContent>
                    {[18,20,24,28,32,36].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}px</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Price size</Label>
                <Select value={String(priceSize)} onValueChange={(v) => setPriceSize(Number(v))}>
                  <SelectTrigger className="w-[220px]"><SelectValue placeholder="Price size" /></SelectTrigger>
                  <SelectContent>
                    {[16,18,20,24,28,32].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n}px</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Alignment</Label>
                <div className="inline-flex overflow-hidden rounded-xl border border-neutral-200 bg-white text-sm">
                  <button onClick={() => setAlign("left")} className={`px-3 py-2 ${align === 'left' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`} title="Align left"><AlignLeft className="h-4 w-4" /></button>
                  <button onClick={() => setAlign("center")} className={`px-3 py-2 border-x ${align === 'center' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`} title="Align center"><AlignCenter className="h-4 w-4" /></button>
                  <button onClick={() => setAlign("right")} className={`px-3 py-2 ${align === 'right' ? 'bg-neutral-100' : 'hover:bg-neutral-50'}`} title="Align right"><AlignRight className="h-4 w-4" /></button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-2">
              <Label className="text-[11px] uppercase tracking-wide text-neutral-500">Footer note</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Add a footnote or disclaimer" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
