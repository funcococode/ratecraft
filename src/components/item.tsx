// ItemCard.tsx
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { editItem, removeItem, type Item } from "@/lib/helpers";

type Props = {
  it: Item;
  // ✅ we need this for delete to actually update the array
  setItems: (updater: (items: Item[]) => Item[]) => void;
  setEditingId: (id: string | null) => void;
  setForm: (form: { name: string; unit: string; rate: string; image?: string }) => void;
  resetForm: () => void;
  editingId: string | null;
  currency: string;
};

export default function ItemCard({
  it,
  setItems,
  setEditingId,
  setForm,
  resetForm,
  editingId,
  currency,
}: Props) {
  // Only drag when the user grabs the handle (not when clicking buttons)
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={it.id}
      id={it.id}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white/80 p-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Drag handle */}
        <button
          onPointerDown={(e) => controls.start(e)}
          className="grid h-8 w-6 place-items-center rounded-md text-neutral-400 hover:text-neutral-600"
          aria-label="Drag to reorder"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {it.image ? (
          <img
            src={it.image}
            alt=""
            className="h-10 w-10 flex-none rounded-lg object-cover ring-1 ring-neutral-200"
          />
        ) : (
          <div className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-neutral-50 ring-1 ring-neutral-200">
            <ImageIcon className="h-5 w-5 text-neutral-400" />
          </div>
        )}

        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{it.name}</div>
          <div className="truncate text-xs text-neutral-500">
            {currency}
            {it.rate.toLocaleString()}{" "}
            <span className="text-neutral-400">{it.unit}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 aspect-square"
          onClick={() => editItem(it, setEditingId, setForm)}
        >
          {/* ⬇️ smaller edit icon */}
          <Pencil className="w-3 h-3" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="w-8 h-8 aspect-square"
          onClick={() =>
            // ✅ pass real setItems so removeItem can mutate the list
            removeItem(it.id, setItems, editingId, setEditingId, resetForm)
          }
        >
          {/* ⬇️ smaller trash icon */}
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Reorder.Item>
  );
}
