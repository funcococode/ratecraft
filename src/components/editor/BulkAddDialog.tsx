import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseLine } from "@/lib/parse";
import type { Item } from "@/lib/types";

const SAMPLE = `Recording, 1500, per hour
Mixing — ₹8,000 / track
Mastering	3500	per track`;

export function BulkAddDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (o: boolean) => void; onAdd: (items: Item[]) => void }) {
  const [text, setText] = useState("");
  const items = useMemo(() => text.split("\n").map(parseLine).filter((x): x is Item => !!x), [text]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setText("");
      }}
    >
      <DialogContent className="max-w-xl">
        <div>
          <DialogTitle>Paste a list</DialogTitle>
          <DialogDescription className="mt-2">One item per line — name, price and unit. Copying rows straight out of Excel or Google Sheets works too.</DialogDescription>
        </div>
        <Textarea autoFocus rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder={SAMPLE} className="font-mono text-[13px]" />
        {items.length > 0 && (
          <div className="max-h-48 overflow-auto rounded-lg border border-line bg-card scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-paper-2 text-left text-xs text-mute">
                <tr>
                  <th className="px-3 py-1.5 font-medium">Name</th>
                  <th className="px-3 py-1.5 text-right font-medium">Price</th>
                  <th className="px-3 py-1.5 font-medium">Unit</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id} className="border-t border-line/70">
                    <td className="px-3 py-1.5">{it.name}</td>
                    <td className="px-3 py-1.5 text-right tabular-nums">{it.price?.toLocaleString() ?? "—"}</td>
                    <td className="px-3 py-1.5 text-mute">{it.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!items.length} onClick={() => (onAdd(items), setText(""))}>
            Add {items.length || ""} item{items.length === 1 ? "" : "s"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
