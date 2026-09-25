import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, FileJson, MoreHorizontal, Plus, Trash2, Upload, PenLine } from "lucide-react";
import { Logo } from "@/components/Brand";
import { ScaledCard } from "@/components/card/ScaledCard";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { store, useCards } from "@/lib/store";
import { PRESETS, blankCard } from "@/lib/presets";
import { cloneWithNewIds, normalizeCard } from "@/lib/factory";
import { exportCard, readCardFile } from "@/lib/export";
import { relativeTime } from "@/lib/format";
import { toast } from "@/lib/toast";
import type { RateCard } from "@/lib/types";

const PRESET_CARDS = PRESETS.map((p) => ({ ...p, card: p.build() }));

export default function LibraryPage() {
  const cards = useCards();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const createFrom = (card: RateCard) => navigate(`/app/${store.create(card)}`);

  async function onImport(file?: File) {
    if (!file) return;
    try {
      const card = normalizeCard(await readCardFile(file));
      if (!card) throw new Error();
      const id = store.add(cloneWithNewIds(card));
      toast(`Imported “${card.info.title}”`);
      navigate(`/app/${id}`);
    } catch {
      toast.error("That file isn't a RateCraft card.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function remove(c: RateCard) {
    store.remove(c.id);
    toast(`Deleted “${c.info.title}”`, { action: { label: "Undo", onClick: () => store.undoRemove() } });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => fileRef.current?.click()}>
              <Upload /> Import
            </Button>
            <Button onClick={() => createFrom(blankCard())}>
              <Plus /> New card
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        {cards.length > 0 && (
          <section className="pt-10 sm:pt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="eyebrow">Library</div>
                <h1 className="font-display mt-1 text-5xl sm:text-6xl">Your rate cards</h1>
              </div>
              <div className="hidden text-sm text-mute sm:block">
                {cards.length} card{cards.length === 1 ? "" : "s"} · saved in this browser
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((c, i) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="group relative"
                >
                  <Link
                    to={`/app/${c.id}`}
                    className="block overflow-hidden rounded-2xl border border-line bg-paper-2/60 p-3 transition hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-xl hover:shadow-ink/5"
                  >
                    <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-ink/5">
                      <ScaledCard card={c} clip={0.72} />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-1 pt-3 pb-0.5">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{c.info.title || "Untitled"}</div>
                        <div className="text-xs text-mute">
                          {c.sections.reduce((n, s) => n + s.items.length, 0)} items · edited {relativeTime(c.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute right-5 bottom-5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-mute hover:bg-paper-2" aria-label="Card actions">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => navigate(`/app/${c.id}`)}>
                          <PenLine /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            store.duplicate(c.id);
                            toast("Card duplicated");
                          }}
                        >
                          <Copy /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => exportCard("json", null, c).then((m) => toast(m))}>
                          <FileJson /> Download data (.json)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem destructive onSelect={() => remove(c)}>
                          <Trash2 /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className={cards.length ? "pt-20" : "pt-14 sm:pt-20"}>
          {cards.length === 0 ? (
            <div className="max-w-2xl">
              <div className="eyebrow">Start here</div>
              <h1 className="font-display mt-1 text-5xl leading-[0.95] sm:text-7xl">
                Pick a starting point.
                <br />
                <span className="text-mute italic">Make it yours.</span>
              </h1>
              <p className="mt-5 max-w-lg text-mute">
                Every template is fully editable — swap the layout, colours and fonts any time. Your cards are saved in this browser automatically.
              </p>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="eyebrow">Templates</div>
                <h2 className="font-display mt-1 text-4xl sm:text-5xl">Start something new</h2>
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => createFrom(blankCard())}
              className="group flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line text-mute transition hover:border-ink/30 hover:bg-paper-2/50 hover:text-ink"
            >
              <span className="grid size-12 place-items-center rounded-full bg-paper-2 transition group-hover:bg-ink group-hover:text-paper">
                <Plus className="size-5" />
              </span>
              <span className="font-medium">Blank card</span>
              <span className="text-xs">Start from scratch</span>
            </button>
            {PRESET_CARDS.map((p) => (
              <button
                key={p.id}
                onClick={() => createFrom(cloneWithNewIds(p.card))}
                className="group block overflow-hidden rounded-2xl border border-line bg-paper-2/60 p-3 text-left transition hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-xl hover:shadow-ink/5"
              >
                <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-ink/5">
                  <ScaledCard card={p.card} clip={0.72} />
                </div>
                <div className="flex items-center justify-between px-1 pt-3 pb-0.5">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-mute">{p.blurb}</div>
                  </div>
                  <span className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-paper opacity-0 transition group-hover:opacity-100">Use</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
