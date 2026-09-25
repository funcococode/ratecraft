import type { CurrencyFormat, Item } from "./types";

export function formatMoney(n: number, cur: CurrencyFormat): string {
  let num: string;
  try {
    num = new Intl.NumberFormat(cur.locale || "en-IN", {
      minimumFractionDigits: cur.decimals,
      maximumFractionDigits: cur.decimals,
    }).format(n);
  } catch {
    num = n.toFixed(cur.decimals);
  }
  const sym = cur.symbol ?? "";
  if (!sym) return num;
  return cur.position === "after" ? `${num}${sym.startsWith(" ") ? sym : ` ${sym.trim()}`}` : `${sym}${num}`;
}

export interface PriceParts {
  prefix?: string;
  main: string;
  strike?: string;
}

export function priceParts(it: Item, cur: CurrencyFormat): PriceParts {
  if (it.mode === "quote" || it.price == null) return { main: "On request" };
  const main = formatMoney(it.price, cur);
  const strike = it.originalPrice != null && it.originalPrice > it.price ? formatMoney(it.originalPrice, cur) : undefined;
  if (it.mode === "from") return { prefix: "from", main, strike };
  if (it.mode === "range" && it.priceMax != null && it.priceMax > it.price) {
    return { main: `${main}–${formatMoney(it.priceMax, cur).replace(cur.position === "before" ? cur.symbol : "", "")}`, strike };
  }
  return { main, strike };
}

export function priceLabel(it: Item, cur: CurrencyFormat): string {
  const p = priceParts(it, cur);
  return [p.prefix, p.main].filter(Boolean).join(" ");
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export const slugify = (s: string) =>
  (s || "rate-card")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "rate-card";
