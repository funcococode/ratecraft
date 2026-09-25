import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Eye, Loader2, Minus, PenLine, Plus, Redo2, Share2, Undo2 } from "lucide-react";
import { LogoMark } from "@/components/Brand";
import { Tip } from "@/components/Tip";
import { Button } from "@/components/ui/button";
import { RateCardView } from "@/components/card/RateCardView";
import { ContentPanel, type Update } from "@/components/editor/ContentPanel";
import { DesignPanel } from "@/components/editor/DesignPanel";
import { DetailsPanel } from "@/components/editor/DetailsPanel";
import { ExportMenu } from "@/components/editor/ExportMenu";
import { ShareDialog } from "@/components/editor/ShareDialog";
import { store, useCard } from "@/lib/store";
import { exportCard } from "@/lib/export";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type Tab = "content" | "design" | "details";
const TABS: { id: Tab; label: string }[] = [
  { id: "content", label: "Content" },
  { id: "design", label: "Design" },
  { id: "details", label: "Details" },
];
const CARD_WIDTH = 880;

export default function EditorPage() {
  const { cardId } = useParams();
  const card = useCard(cardId);
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("content");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const saving = useSyncExternalStore(store.subscribe, store.isSaving);
  const canUndo = useSyncExternalStore(store.subscribe, () => (cardId ? store.canUndo(cardId) : false));
  const canRedo = useSyncExternalStore(store.subscribe, () => (cardId ? store.canRedo(cardId) : false));

  const update: Update = useCallback((recipe, coalesce) => cardId && store.update(cardId, recipe, { coalesce }), [cardId]);

  useEffect(() => {
    if (card) document.title = `${card.info.title || "Untitled"} · RateCraft`;
    return () => {
      document.title = "RateCraft — beautiful rate cards in minutes";
    };
  }, [card?.info.title, card]);

  useEffect(() => {
    if (!cardId) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) {
        e.preventDefault();
        store.undo(cardId);
      } else if ((k === "z" && e.shiftKey) || k === "y") {
        e.preventDefault();
        store.redo(cardId);
      } else if (k === "s") {
        e.preventDefault();
        store.flush();
        toast("Saved in this browser");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cardId]);

  if (!card) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <div className="eyebrow">Hmm</div>
          <h1 className="font-display mt-2 text-5xl">That card isn't here</h1>
          <p className="mx-auto mt-3 max-w-sm text-mute">Cards are saved in the browser they were made in. It may have been deleted, or created on another device.</p>
          <Button className="mt-6" asChild>
            <Link to="/app">Go to your cards</Link>
          </Button>
        </div>
      </div>
    );
  }

  const selectFromPreview = (_sectionId: string, itemId: string) => {
    setTab("content");
    setSelectedItemId(itemId);
    setMobileView("edit");
  };

  function deleteCard() {
    if (!card) return;
    const title = card.info.title;
    store.remove(card.id);
    navigate("/app");
    toast(`Deleted “${title}”`, { action: { label: "Undo", onClick: () => store.undoRemove() } });
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {/* Top bar */}
      <header className="z-20 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-paper/90 px-2 backdrop-blur sm:px-3">
        <Tip label="All cards">
          <Link to="/app" className="flex items-center gap-1.5 rounded-lg p-1.5 text-mute transition hover:bg-paper-2 hover:text-ink">
            <ArrowLeft className="size-4" />
            <LogoMark className="size-7" />
          </Link>
        </Tip>
        <div className="mx-1 h-6 w-px bg-line" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{card.info.title || "Untitled"}</div>
          <div className="flex items-center gap-1 truncate text-[11px] whitespace-nowrap text-mute">
            {saving ? (
              <>
                <Loader2 className="size-3 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Check className="size-3" /> Saved<span className="hidden sm:inline"> in this browser</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <Tip label="Undo (⌘Z)">
            <Button variant="ghost" size="icon" disabled={!canUndo} onClick={() => store.undo(card.id)} aria-label="Undo">
              <Undo2 />
            </Button>
          </Tip>
          <Tip label="Redo (⇧⌘Z)">
            <Button variant="ghost" size="icon" disabled={!canRedo} onClick={() => store.redo(card.id)} aria-label="Redo">
              <Redo2 />
            </Button>
          </Tip>
        </div>
        <Button variant="outline" onClick={() => setShareOpen(true)} className="bg-transparent">
          <Share2 /> <span className="hidden sm:inline">Share</span>
        </Button>
        <ExportMenu card={card} nodeRef={cardRef} />
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Editor panel */}
        <aside
          className={cn(
            "flex w-full shrink-0 flex-col border-r border-line bg-surface lg:w-[420px]",
            mobileView === "preview" && "hidden lg:flex",
          )}
        >
          <div role="tablist" className="flex shrink-0 gap-1 border-b border-line px-3 pt-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative px-3 pt-1.5 pb-2.5 text-sm font-medium transition",
                  tab === t.id ? "text-ink" : "text-mute hover:text-ink",
                )}
              >
                {t.label}
                {tab === t.id && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-ink" />}
              </button>
            ))}
          </div>
          <div key={tab} className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pb-24 lg:pb-8">
            {tab === "content" && <ContentPanel card={card} update={update} selectedItemId={selectedItemId} setSelectedItemId={setSelectedItemId} />}
            {tab === "design" && <DesignPanel card={card} update={update} />}
            {tab === "details" && (
              <DetailsPanel
                card={card}
                update={update}
                onDuplicate={() => {
                  const id = store.duplicate(card.id);
                  if (id) {
                    navigate(`/app/${id}`);
                    toast("Duplicated — you're now editing the copy");
                  }
                }}
                onExportJson={() => exportCard("json", null, card).then((m) => toast(m))}
                onDelete={deleteCard}
              />
            )}
          </div>
        </aside>

        {/* Canvas */}
        <Canvas className={cn(mobileView === "edit" && "hidden lg:flex")} onBackgroundClick={() => setSelectedItemId(null)}>
          <RateCardView ref={cardRef} card={card} width={CARD_WIDTH} onSelectItem={selectFromPreview} selectedItemId={selectedItemId} className="shadow-[0_30px_80px_-30px_rgba(23,21,15,0.35),0_0_0_1px_rgba(23,21,15,0.06)]" />
        </Canvas>

        {/* Mobile switcher */}
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center lg:hidden">
          <div className="flex gap-1 rounded-full bg-ink p-1 shadow-2xl shadow-ink/30">
            {(["edit", "preview"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setMobileView(v)}
                className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition", mobileView === v ? "bg-paper text-ink" : "text-paper/70")}
              >
                {v === "edit" ? <PenLine className="size-4" /> : <Eye className="size-4" />}
                {v === "edit" ? "Edit" : "Preview"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ShareDialog card={card} open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}

function Canvas({ children, className, onBackgroundClick }: { children: React.ReactNode; className?: string; onBackgroundClick: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number | "fit">("fit");
  const [fit, setFit] = useState(1);
  const [h, setH] = useState(0);

  useLayoutEffect(() => {
    const w = wrap.current;
    const i = inner.current;
    if (!w || !i) return;
    const ro = new ResizeObserver(() => {
      const pad = w.clientWidth < 640 ? 24 : 96;
      setFit(Math.min(1, Math.max(0.2, (w.clientWidth - pad) / CARD_WIDTH)));
      setH(i.offsetHeight);
    });
    ro.observe(w);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  const scale = zoom === "fit" ? fit : zoom;
  const step = (d: number) => setZoom(Math.min(2, Math.max(0.25, Math.round(((zoom === "fit" ? fit : zoom) + d) * 20) / 20)));

  return (
    <div className={cn("relative flex min-w-0 flex-1 flex-col bg-paper-2/70", className)}>
      <div ref={wrap} className="paper-grain scrollbar-thin min-h-0 flex-1 overflow-auto" onClick={onBackgroundClick}>
        <div className="min-h-full w-max min-w-full px-3 pt-6 pb-28 sm:px-12 sm:pt-12 lg:pb-16">
          <div style={{ width: CARD_WIDTH * scale, height: h * scale }} className="mx-auto">
            <div ref={inner} style={{ width: CARD_WIDTH, transform: `scale(${scale})`, transformOrigin: "top left" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute right-4 bottom-4 hidden items-center gap-0.5 rounded-full border border-line bg-surface/95 p-1 text-xs shadow-lg shadow-ink/5 backdrop-blur lg:flex">
        <button className="grid size-7 place-items-center rounded-full text-mute hover:bg-paper-2 hover:text-ink" onClick={() => step(-0.1)} aria-label="Zoom out">
          <Minus className="size-3.5" />
        </button>
        <button className="min-w-14 rounded-full px-2 py-1 font-medium tabular-nums hover:bg-paper-2" onClick={() => setZoom(zoom === "fit" ? 1 : "fit")} title="Toggle fit / 100%">
          {zoom === "fit" ? "Fit" : `${Math.round(scale * 100)}%`}
        </button>
        <button className="grid size-7 place-items-center rounded-full text-mute hover:bg-paper-2 hover:text-ink" onClick={() => step(0.1)} aria-label="Zoom in">
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
