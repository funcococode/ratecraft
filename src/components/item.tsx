import {motion, AnimatePresence, moveItem } from "framer-motion";
import { ArrowDown, ArrowUp, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { editItem, removeItem, type Item } from "@/lib/helpers";

export default function ItemCard({ it, idx, items, setItems, setEditingId, setForm, resetForm, editingId, currency }: {
  it: Item;
  idx: number;
  items: Item[];
  setItems: (updater: (items: Item[]) => Item[]) => void;
  setEditingId: (id: string | null) => void;
  setForm: (form: any) => void;
  resetForm: () => void;
  editingId: string | null;
  currency: string;
}) {
  return (
                      <motion.div 
                        key={it.id} 
                        initial={{ opacity: 0, y: 8 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -8 }} 
                        transition={{ duration: 0.15 }} 
                        className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white/80 p-3"
                      >
                        
                        <div className="flex min-w-0 items-center gap-3">
                          {it.image ? (
                            <img src={it.image} alt="" className="h-10 w-10 flex-none rounded-lg object-cover ring-1 ring-neutral-200" />
                          ) : (
                            <div className="grid h-10 w-10 flex-none place-items-center rounded-lg bg-neutral-50 ring-1 ring-neutral-200">
                              <ImageIcon className="h-5 w-5 text-neutral-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{it.name}</div>
                            <div className="truncate text-xs text-neutral-500">{currency}{it.rate.toLocaleString()} <span className="text-neutral-400">{it.unit}</span></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="outline" size="icon" className="w-8 h-8 aspect-square" onClick={() => moveItem(it.id, -1, setItems)} disabled={idx === 0}><ArrowUp className="w-2 h-2" /></Button>
                          <Button variant="outline" size="icon" className="w-8 h-8 aspect-square" onClick={() => moveItem(it.id, +1, setItems)} disabled={idx === items.length - 1}><ArrowDown className="w-2 h-2" /></Button>
                          <Button variant="outline" size="icon" className="w-8 h-8 aspect-square" onClick={() => editItem(it, setEditingId, setForm)}><Pencil className="w-2 h-2" /></Button>
                          <Button variant="destructive" size="icon" className="w-8 h-8 aspect-square" onClick={() => removeItem(it.id, setItems, editingId, setEditingId, resetForm)}><Trash2 className="w-2 h-2" /></Button>
                        </div>
                      </motion.div>
  )
}
