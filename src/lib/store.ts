import { useSyncExternalStore } from "react";
import { cloneWithNewIds, makeCard, makeItem, makeSection, normalizeCard } from "./factory";
import type { RateCard, TemplateId } from "./types";

const KEY = "ratecraft:v2";
const HISTORY_LIMIT = 80;
const COALESCE_MS = 900;

interface State {
  cards: RateCard[];
}

type Listener = () => void;

// ── persistence ─────────────────────────────────────────────────────────────
function safeGet(k: string): string | null {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}

function migrateLegacy(): RateCard[] {
  // v1 stored a single card across many "rcc-*" keys.
  const rawItems = safeGet("rcc-items");
  const title = safeGet("rcc-title");
  if (!rawItems && !title) return [];
  let items: { name: string; unit: string; rate: number; image?: string }[] = [];
  try {
    items = rawItems ? JSON.parse(rawItems) : [];
  } catch {
    items = [];
  }
  const tpl = safeGet("rcc-template");
  const template: TemplateId = tpl === "rows" ? "list" : tpl === "billboard" ? "billboard" : "grid";
  const font = safeGet("rcc-font");
  const accent = safeGet("rcc-accent");
  return [
    makeCard({
      info: { title: title || "My rate card", logo: safeGet("rcc-logo") || undefined },
      currency: { symbol: safeGet("rcc-currency") || "₹" },
      design: {
        template,
        density: safeGet("rcc-density") === "compact" ? "compact" : "cozy",
        fontPair: font === "serif" ? "classic" : font === "mono" ? "mono" : "modern",
        accent: accent && /^#[0-9a-f]{6}$/i.test(accent) ? accent : undefined,
        palette: "snow",
      },
      footer: { note: safeGet("rcc-note") || "" },
      sections: [
        makeSection({
          title: "Services",
          items: items.map((x) => makeItem({ name: x.name, unit: x.unit, price: Number(x.rate) || 0, image: x.image })),
        }),
      ],
    }),
  ];
}

function load(): State {
  const raw = safeGet(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { cards?: unknown[] };
      const cards = (parsed.cards ?? []).map(normalizeCard).filter((c): c is RateCard => !!c);
      return { cards };
    } catch {
      /* fall through */
    }
  }
  return { cards: migrateLegacy() };
}

let state: State = typeof window === "undefined" ? { cards: [] } : load();
const listeners = new Set<Listener>();
const errorListeners = new Set<(msg: string) => void>();
let saveTimer: number | undefined;
let lastSavedAt = Date.now();

function persistNow() {
  window.clearTimeout(saveTimer);
  saveTimer = undefined;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    lastSavedAt = Date.now();
  } catch (e) {
    const quota = e instanceof DOMException && (e.name === "QuotaExceededError" || e.code === 22);
    errorListeners.forEach((l) =>
      l(quota ? "Browser storage is full — remove a few images or delete old cards." : "Couldn't save changes to this browser."),
    );
  }
  emit();
}

function schedulePersist() {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(persistNow, 350);
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => saveTimer && persistNow());
  // Keep multiple tabs in sync.
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      state = load();
      emit();
    }
  });
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: State) {
  state = next;
  schedulePersist();
  emit();
}

// ── history (per card, in memory) ───────────────────────────────────────────
interface History {
  past: RateCard[];
  future: RateCard[];
  lastKey?: string;
  lastAt: number;
}
const histories = new Map<string, History>();
const hist = (id: string) => {
  let h = histories.get(id);
  if (!h) {
    h = { past: [], future: [], lastAt: 0 };
    histories.set(id, h);
  }
  return h;
};

// ── public API ──────────────────────────────────────────────────────────────
let lastDeleted: { card: RateCard; index: number } | null = null;

export const store = {
  getState: () => state,
  subscribe(l: Listener) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  onError(l: (msg: string) => void) {
    errorListeners.add(l);
    return () => {
      errorListeners.delete(l);
    };
  },
  isSaving: () => saveTimer !== undefined,
  lastSavedAt: () => lastSavedAt,

  get(id: string) {
    return state.cards.find((c) => c.id === id);
  },

  add(card: RateCard) {
    commit({ cards: [card, ...state.cards] });
    return card.id;
  },

  create(card: RateCard = makeCard()) {
    return store.add(card);
  },

  duplicate(id: string) {
    const src = store.get(id);
    if (!src) return null;
    const copy = cloneWithNewIds(src);
    copy.info.title = `${src.info.title} (copy)`;
    const idx = state.cards.findIndex((c) => c.id === id);
    const cards = [...state.cards];
    cards.splice(idx, 0, copy);
    commit({ cards });
    return copy.id;
  },

  remove(id: string) {
    const index = state.cards.findIndex((c) => c.id === id);
    if (index < 0) return;
    lastDeleted = { card: state.cards[index], index };
    histories.delete(id);
    commit({ cards: state.cards.filter((c) => c.id !== id) });
  },

  undoRemove() {
    if (!lastDeleted) return;
    const cards = [...state.cards];
    cards.splice(Math.min(lastDeleted.index, cards.length), 0, lastDeleted.card);
    lastDeleted = null;
    commit({ cards });
  },

  /**
   * Update a card with a mutating recipe applied to a clone.
   * Pass `coalesce` so rapid edits to the same field become a single undo step.
   */
  update(id: string, recipe: (draft: RateCard) => void, opts: { coalesce?: string } = {}) {
    const idx = state.cards.findIndex((c) => c.id === id);
    if (idx < 0) return;
    const prev = state.cards[idx];
    const draft = structuredClone(prev);
    recipe(draft);
    draft.updatedAt = Date.now();

    const h = hist(id);
    const now = Date.now();
    const merge = opts.coalesce && opts.coalesce === h.lastKey && now - h.lastAt < COALESCE_MS;
    if (!merge) {
      h.past.push(prev);
      if (h.past.length > HISTORY_LIMIT) h.past.shift();
    }
    h.future = [];
    h.lastKey = opts.coalesce;
    h.lastAt = now;

    const cards = [...state.cards];
    cards[idx] = draft;
    commit({ cards });
  },

  undo(id: string) {
    const h = hist(id);
    const prev = h.past.pop();
    const cur = store.get(id);
    if (!prev || !cur) return;
    h.future.push(cur);
    h.lastKey = undefined;
    commit({ cards: state.cards.map((c) => (c.id === id ? prev : c)) });
  },

  redo(id: string) {
    const h = hist(id);
    const next = h.future.pop();
    const cur = store.get(id);
    if (!next || !cur) return;
    h.past.push(cur);
    h.lastKey = undefined;
    commit({ cards: state.cards.map((c) => (c.id === id ? next : c)) });
  },

  canUndo: (id: string) => (histories.get(id)?.past.length ?? 0) > 0,
  canRedo: (id: string) => (histories.get(id)?.future.length ?? 0) > 0,

  flush: persistNow,
};

export function useCards() {
  return useSyncExternalStore(store.subscribe, () => state.cards, () => state.cards);
}

export function useCard(id: string | undefined) {
  return useSyncExternalStore(
    store.subscribe,
    () => (id ? state.cards.find((c) => c.id === id) : undefined),
    () => undefined,
  );
}

/** Re-render on any store change (for undo/redo availability, save status). */
export function useStoreVersion() {
  return useSyncExternalStore(
    store.subscribe,
    () => state,
    () => state,
  );
}
