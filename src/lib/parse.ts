import { makeItem } from "./factory";
import type { Item } from "./types";

const NUM = /(?:^|[^\w.])((?:\d{1,3}(?:[,\s]\d{2,3})+|\d+)(?:\.\d+)?)\s*(k)?\b/gi;

function toNumber(s: string, k?: string) {
  const n = Number(s.replace(/[,\s]/g, ""));
  return Number.isFinite(n) ? n * (k ? 1000 : 1) : null;
}

const clean = (s: string) => s.replace(/[₹$€£¥]|\b(?:rs\.?|inr|usd|eur|gbp)(?![a-z])/gi, "").replace(/^[\s,;:|/–—-]+|[\s,;:|/–—-]+$/g, "").trim();

/** Parse "Name, 1500, per hour" / "Name — ₹1,500 / hour" / spreadsheet rows. */
export function parseLine(line: string): Item | null {
  const raw = line.trim();
  if (!raw) return null;

  const cols = raw.includes("\t") ? raw.split("\t") : raw.includes("|") ? raw.split("|") : null;
  if (cols && cols.length > 1) {
    const c = cols.map((x) => x.trim());
    const pi = c.findIndex((x, i) => i > 0 && /\d/.test(x) && toNumber(x.replace(/[^\d.,]/g, "")) != null);
    const price = pi > 0 ? toNumber(c[pi].replace(/[^\d.,]/g, "")) : null;
    const rest = c.filter((_, i) => i !== 0 && i !== pi).filter(Boolean);
    return makeItem({ name: c[0], price, unit: rest[0] ?? "", description: rest.slice(1).join(" · ") });
  }

  // Free text: take the first number that follows the name.
  NUM.lastIndex = 0;
  const m = NUM.exec(raw);
  if (!m) return makeItem({ name: clean(raw), mode: "quote" });
  const start = m.index + m[0].indexOf(m[1]);
  const name = clean(raw.slice(0, start));
  const unit = clean(raw.slice(start + m[1].length + (m[2]?.length ?? 0)));
  return makeItem({
    name: name || "Untitled item",
    price: toNumber(m[1], m[2]),
    unit: unit && !/^per\b/i.test(unit) && unit.length < 16 ? `per ${unit}` : unit,
  });
}

