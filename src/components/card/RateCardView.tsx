import { forwardRef, type CSSProperties, type ReactNode } from "react";
import { AtSign, Globe, Mail, MapPin, Phone } from "lucide-react";
import type { CurrencyFormat, Item, RateCard, Section } from "@/lib/types";
import { getFontPair, getPalette, readableOn } from "@/lib/themes";
import { priceParts } from "@/lib/format";
import "./card.css";

export interface RateCardViewProps {
  card: RateCard;
  width?: number;
  /** When provided, items become clickable (editor mode). */
  onSelectItem?: (sectionId: string, itemId: string) => void;
  selectedItemId?: string | null;
  className?: string;
}

const RADIUS = { sharp: 0, soft: 12, round: 22 } as const;

export const RateCardView = forwardRef<HTMLDivElement, RateCardViewProps>(function RateCardView(
  { card, width = 880, onSelectItem, selectedItemId, className },
  ref,
) {
  const { design } = card;
  const pal = getPalette(design.palette);
  const font = getFontPair(design.fontPair);
  const accent = design.accent || pal.accent;
  const editable = !!onSelectItem;

  const style = {
    width,
    "--paper": pal.paper,
    "--surface": pal.surface,
    "--ink": pal.ink,
    "--muted": pal.muted,
    "--line": pal.line,
    "--accent": accent,
    "--on-accent": readableOn(accent),
    "--display": font.display,
    "--body": font.body,
    "--dw": font.displayWeight,
    "--dt": font.displayTracking,
    "--ts": design.titleScale,
    "--ps": design.priceScale,
    "--r": `${RADIUS[design.radius]}px`,
    "--pad": design.density === "compact" ? 0.72 : 1,
    "--cols": design.columns,
  } as CSSProperties;

  const sections = card.sections
    .map((s) => ({ ...s, items: s.items.filter((i) => !i.hidden) }))
    .filter((s) => s.items.length > 0 || (editable && s.title));

  const ctx: Ctx = { card, cur: card.currency, onSelectItem, selectedItemId, showImages: design.showImages, editable };

  const body = (() => {
    switch (design.template) {
      case "list":
        return <ListBody sections={sections} ctx={ctx} />;
      case "menu":
        return <MenuBody sections={sections} ctx={ctx} />;
      case "tiers":
        return <TiersBody sections={sections} ctx={ctx} />;
      case "minimal":
        return <MinimalBody sections={sections} ctx={ctx} />;
      case "billboard":
        return <ListBody sections={sections} ctx={ctx} compact />;
      default:
        return <GridBody sections={sections} ctx={ctx} />;
    }
  })();

  const empty = sections.every((s) => s.items.length === 0);

  return (
    <div
      ref={ref}
      className={`rc ${className ?? ""}`}
      data-template={design.template}
      data-align={design.template === "menu" ? "center" : design.align}
      data-dark={pal.dark ? "" : undefined}
      style={style}
    >
      {design.template === "billboard" ? (
        <div className="rc-bb">
          <aside className="rc-bb-panel">
            <BillboardPanel card={card} />
          </aside>
          <div className="rc-bb-main">{empty ? <Empty editable={editable} /> : body}</div>
        </div>
      ) : (
        <>
          <Header card={card} />
          <main className="rc-body">{empty ? <Empty editable={editable} /> : body}</main>
        </>
      )}
      <FooterBar card={card} hideContact={design.template === "billboard"} />
    </div>
  );
});

interface Ctx {
  card: RateCard;
  cur: CurrencyFormat;
  onSelectItem?: (sectionId: string, itemId: string) => void;
  selectedItemId?: string | null;
  showImages: boolean;
  editable: boolean;
}

// ── shared bits ─────────────────────────────────────────────────────────────
function Empty({ editable }: { editable: boolean }) {
  return <div className="rc-empty">{editable ? "Add an item on the left and it will appear here." : "No items yet."}</div>;
}

function Header({ card }: { card: RateCard }) {
  const { info, design } = card;
  const menu = design.template === "menu";
  return (
    <header className="rc-header">
      {menu && info.logo && <img className="rc-logo rc-logo-center" src={info.logo} alt="" />}
      <div className="rc-header-top">
        {info.eyebrow && (
          <div className="rc-eyebrow">
            {!menu && <span className="rc-dot" />}
            {info.eyebrow}
          </div>
        )}
        {!menu && info.logo && <img className="rc-logo" src={info.logo} alt="" />}
      </div>
      <h1 className="rc-title">{info.title || "Untitled"}</h1>
      {menu && <Ornament />}
      {info.tagline && <p className="rc-tagline">{info.tagline}</p>}
      {info.intro && <p className="rc-intro">{info.intro}</p>}
    </header>
  );
}

function Ornament() {
  return (
    <div className="rc-ornament" aria-hidden>
      <span />
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
      </svg>
      <span />
    </div>
  );
}

function BillboardPanel({ card }: { card: RateCard }) {
  const { info } = card;
  return (
    <>
      <div className="rc-bb-top">
        {info.eyebrow && <div className="rc-eyebrow">{info.eyebrow}</div>}
        {info.logo && <img className="rc-logo" src={info.logo} alt="" />}
      </div>
      <h1 className="rc-title">{info.title || "Untitled"}</h1>
      {info.tagline && <p className="rc-tagline">{info.tagline}</p>}
      {info.intro && <p className="rc-intro">{info.intro}</p>}
      <div className="rc-bb-spacer" />
      <ContactList card={card} />
    </>
  );
}

function ContactList({ card }: { card: RateCard }) {
  const c = card.contact;
  const rows: [ReactNode, string][] = [
    [<Mail key="m" />, c.email],
    [<Phone key="p" />, c.phone],
    [<Globe key="g" />, c.website],
    [<AtSign key="a" />, c.instagram],
    [<MapPin key="l" />, c.location],
  ];
  const visible = rows.filter(([, v]) => v.trim());
  if (!visible.length) return null;
  return (
    <ul className="rc-contact">
      {visible.map(([icon, v]) => (
        <li key={v}>
          {icon}
          <span>{v}</span>
        </li>
      ))}
    </ul>
  );
}

function FooterBar({ card, hideContact }: { card: RateCard; hideContact?: boolean }) {
  const { footer, design } = card;
  const valid = footer.validUntil ? new Date(footer.validUntil + "T00:00:00") : null;
  const dateText = valid && !Number.isNaN(valid.getTime())
    ? `Valid until ${valid.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}`
    : design.showDate
      ? new Date(card.updatedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })
      : "";
  const contact = hideContact ? null : <ContactList card={card} />;
  if (!footer.note && !dateText && !contact) return null;
  return (
    <footer className="rc-footer">
      <div className="rc-footer-main">
        {footer.note && <p className="rc-note">{footer.note}</p>}
        {contact}
      </div>
      {dateText && <div className="rc-date">{dateText}</div>}
    </footer>
  );
}

function Price({ it, cur, className = "" }: { it: Item; cur: CurrencyFormat; className?: string }) {
  const p = priceParts(it, cur);
  return (
    <span className={`rc-price ${className}`}>
      {p.prefix && <span className="rc-price-prefix">{p.prefix} </span>}
      <span className={it.mode === "quote" || it.price == null ? "rc-price-quote" : "rc-price-main"}>{p.main}</span>
      {p.strike && <s className="rc-strike">{p.strike}</s>}
    </span>
  );
}

function Badge({ text }: { text: string }) {
  return text ? <span className="rc-badge">{text}</span> : null;
}

function Thumb({ it, ctx, size = "md" }: { it: Item; ctx: Ctx; size?: "sm" | "md" }) {
  if (!ctx.showImages || !it.image) return null;
  return <img className={`rc-thumb rc-thumb-${size}`} src={it.image} alt="" />;
}

function itemProps(ctx: Ctx, s: Section, it: Item) {
  if (!ctx.onSelectItem) return {};
  return {
    "data-item-id": it.id,
    className: ctx.selectedItemId === it.id ? "rc-selectable rc-selected" : "rc-selectable",
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      ctx.onSelectItem?.(s.id, it.id);
    },
  };
}

function SectionHead({ s }: { s: Section }) {
  if (!s.title && !s.description) return null;
  return (
    <div className="rc-section-head">
      {s.title && <h2 className="rc-section-title">{s.title}</h2>}
      {s.description && <p className="rc-section-desc">{s.description}</p>}
    </div>
  );
}

function Desc({ text }: { text: string }) {
  return text ? <p className="rc-desc">{text}</p> : null;
}

// ── templates ───────────────────────────────────────────────────────────────
function GridBody({ sections, ctx }: { sections: Section[]; ctx: Ctx }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} className="rc-section">
          <SectionHead s={s} />
          <div className="rc-grid">
            {s.items.map((it) => {
              const p = itemProps(ctx, s, it);
              return (
                <article key={it.id} {...p} className={`rc-tile ${p.className ?? ""}`}>
                  <div className="rc-tile-top">
                    <Thumb it={it} ctx={ctx} />
                    <Badge text={it.badge} />
                  </div>
                  <h3 className="rc-name">{it.name || "Untitled item"}</h3>
                  <Desc text={it.description} />
                  <div className="rc-tile-price">
                    <Price it={it} cur={ctx.cur} />
                    {it.unit && <span className="rc-unit">{it.unit}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

function ListBody({ sections, ctx, compact }: { sections: Section[]; ctx: Ctx; compact?: boolean }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} className={`rc-section ${compact ? "rc-section-compact" : ""}`}>
          <SectionHead s={s} />
          <div className="rc-rows">
            {s.items.map((it) => {
              const p = itemProps(ctx, s, it);
              return (
                <div key={it.id} {...p} className={`rc-row ${p.className ?? ""}`}>
                  <Thumb it={it} ctx={ctx} size="sm" />
                  <div className="rc-row-main">
                    <div className="rc-row-line">
                      <h3 className="rc-name">{it.name || "Untitled item"}</h3>
                      <Badge text={it.badge} />
                      <span className="rc-leader" />
                      <Price it={it} cur={ctx.cur} />
                    </div>
                    {(it.description || it.unit) && (
                      <div className="rc-row-sub">
                        <Desc text={it.description} />
                        {it.unit && <span className="rc-unit">{it.unit}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

function MenuBody({ sections, ctx }: { sections: Section[]; ctx: Ctx }) {
  return (
    <div className="rc-menu">
      {sections.map((s) => (
        <section key={s.id} className="rc-section">
          <SectionHead s={s} />
          <div className="rc-rows">
            {s.items.map((it) => {
              const p = itemProps(ctx, s, it);
              return (
                <div key={it.id} {...p} className={`rc-row ${p.className ?? ""}`}>
                  <div className="rc-row-main">
                    <div className="rc-row-line">
                      <h3 className="rc-name">{it.name || "Untitled item"}</h3>
                      <Badge text={it.badge} />
                      <span className="rc-leader" />
                      <Price it={it} cur={ctx.cur} />
                    </div>
                    {(it.description || it.unit) && (
                      <div className="rc-row-sub">
                        <Desc text={it.description} />
                        {it.unit && <span className="rc-unit">{it.unit}</span>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function TiersBody({ sections, ctx }: { sections: Section[]; ctx: Ctx }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} className="rc-section">
          <SectionHead s={s} />
          <div className="rc-tiers" style={{ "--n": Math.min(Math.max(s.items.length, 1), 4) } as CSSProperties}>
            {s.items.map((it) => {
              const p = itemProps(ctx, s, it);
              const features = it.description.split("\n").map((l) => l.trim()).filter(Boolean);
              return (
                <article key={it.id} {...p} className={`rc-tier ${it.badge ? "rc-tier-featured" : ""} ${p.className ?? ""}`}>
                  <div className="rc-tier-top">
                    <h3 className="rc-name">{it.name || "Untitled"}</h3>
                    <Badge text={it.badge} />
                  </div>
                  <Thumb it={it} ctx={ctx} />
                  <div className="rc-tier-price">
                    <Price it={it} cur={ctx.cur} />
                    {it.unit && <span className="rc-unit">{it.unit}</span>}
                  </div>
                  {features.length > 0 && (
                    <ul className="rc-features">
                      {features.map((f, i) => (
                        <li key={i}>
                          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

function MinimalBody({ sections, ctx }: { sections: Section[]; ctx: Ctx }) {
  return (
    <>
      {sections.map((s) => (
        <section key={s.id} className="rc-section">
          <SectionHead s={s} />
          <div className="rc-min">
            {s.items.map((it, idx) => {
              const p = itemProps(ctx, s, it);
              return (
                <article key={it.id} {...p} className={`rc-min-item ${p.className ?? ""}`}>
                  <div className="rc-min-index">{String(idx + 1).padStart(2, "0")}</div>
                  <Price it={it} cur={ctx.cur} className="rc-min-price" />
                  <div className="rc-min-meta">
                    <h3 className="rc-name">{it.name || "Untitled item"}</h3>
                    <Badge text={it.badge} />
                  </div>
                  <Desc text={it.description} />
                  {it.unit && <span className="rc-unit">{it.unit}</span>}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
