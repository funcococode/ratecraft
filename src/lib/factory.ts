import type { CardDesign, Item, RateCard, Section } from "./types";

export const uid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
    : Math.random().toString(36).slice(2, 14));

/** Drop undefined keys so they don't clobber defaults when spread. */
function defined<T extends object>(p: T): T {
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) as T;
}

export function makeItem(p: Partial<Item> = {}): Item {
  return {
    id: uid(),
    name: "",
    description: "",
    unit: "",
    mode: "fixed",
    price: null,
    priceMax: null,
    originalPrice: null,
    badge: "",
    ...defined(p),
  };
}

export function makeSection(p: Partial<Section> = {}): Section {
  return { id: uid(), title: "", description: "", items: [], ...defined(p) };
}

export const DEFAULT_DESIGN: CardDesign = {
  template: "grid",
  palette: "ivory",
  accent: "#C2410C",
  fontPair: "editorial",
  density: "cozy",
  align: "left",
  radius: "soft",
  columns: 2,
  titleScale: 1,
  priceScale: 1,
  showImages: true,
  showDate: true,
};

type CardInput = Partial<Omit<RateCard, "design" | "info" | "currency" | "contact" | "footer">> & {
  design?: Partial<RateCard["design"]>;
  info?: Partial<RateCard["info"]>;
  currency?: Partial<RateCard["currency"]>;
  contact?: Partial<RateCard["contact"]>;
  footer?: Partial<RateCard["footer"]>;
};

export function makeCard(p: CardInput = {}): RateCard {
  const now = Date.now();
  return {
    id: p.id ?? uid(),
    version: 2,
    createdAt: p.createdAt ?? now,
    updatedAt: p.updatedAt ?? now,
    info: { eyebrow: "Rate card", title: "Untitled rate card", tagline: "", intro: "", ...defined(p.info ?? {}) },
    currency: { symbol: "₹", code: "INR", position: "before", decimals: 0, locale: "en-IN", ...defined(p.currency ?? {}) },
    sections: p.sections ?? [makeSection({ title: "Services", items: [] })],
    design: { ...DEFAULT_DESIGN, ...defined(p.design ?? {}) },
    contact: { email: "", phone: "", website: "", instagram: "", location: "", ...defined(p.contact ?? {}) },
    footer: { note: "", validUntil: "", ...defined(p.footer ?? {}) },
  };
}

/** Deep-clone a card with fresh ids (for duplicate / import). */
export function cloneWithNewIds(card: RateCard, overrides: Partial<RateCard> = {}): RateCard {
  const now = Date.now();
  const c: RateCard = structuredClone(card);
  c.id = uid();
  c.createdAt = now;
  c.updatedAt = now;
  c.sections = c.sections.map((s) => ({ ...s, id: uid(), items: s.items.map((i) => ({ ...i, id: uid() })) }));
  return { ...c, ...overrides };
}

/** Coerce unknown JSON (imports, shared links, old versions) into a valid card. */
export function normalizeCard(raw: unknown): RateCard | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<RateCard>;
  if (!Array.isArray(r.sections)) return null;
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return makeCard({
    id: typeof r.id === "string" ? r.id : undefined,
    createdAt: num(r.createdAt) ?? undefined,
    updatedAt: num(r.updatedAt) ?? undefined,
    info: r.info,
    currency: r.currency,
    design: r.design,
    contact: r.contact,
    footer: r.footer,
    sections: r.sections.map((s) =>
      makeSection({
        id: typeof s?.id === "string" ? s.id : undefined,
        title: str(s?.title),
        description: str(s?.description),
        items: Array.isArray(s?.items)
          ? s.items.map((i) =>
              makeItem({
                id: typeof i?.id === "string" ? i.id : undefined,
                name: str(i?.name),
                description: str(i?.description),
                unit: str(i?.unit),
                mode: (["fixed", "from", "range", "quote"] as const).includes(i?.mode) ? i.mode : "fixed",
                price: num(i?.price),
                priceMax: num(i?.priceMax),
                originalPrice: num(i?.originalPrice),
                badge: str(i?.badge),
                image: typeof i?.image === "string" ? i.image : undefined,
                hidden: !!i?.hidden,
              }),
            )
          : [],
      }),
    ),
  });
}
