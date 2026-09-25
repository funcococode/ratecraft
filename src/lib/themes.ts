import type { TemplateId } from "./types";

export interface Palette {
  id: string;
  name: string;
  paper: string;
  surface: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  dark: boolean;
}

export const PALETTES: Palette[] = [
  { id: "ivory", name: "Ivory", paper: "#F7F3EA", surface: "#FFFDF8", ink: "#1B1A17", muted: "#6F695C", line: "#E4DCCB", accent: "#C2410C", dark: false },
  { id: "snow", name: "Snow", paper: "#FFFFFF", surface: "#F6F6F4", ink: "#111111", muted: "#6B6B6B", line: "#E7E7E4", accent: "#2F3BE0", dark: false },
  { id: "sand", name: "Sand", paper: "#EFE6D6", surface: "#F8F1E4", ink: "#2A2419", muted: "#7B6E57", line: "#DACAAE", accent: "#8A5A2B", dark: false },
  { id: "sage", name: "Sage", paper: "#E9EEE6", surface: "#F5F8F3", ink: "#1E2A22", muted: "#5E6E62", line: "#CFD9CC", accent: "#2F6B4F", dark: false },
  { id: "blush", name: "Blush", paper: "#F8ECE8", surface: "#FDF6F4", ink: "#2B1D1D", muted: "#82625F", line: "#EBD3CD", accent: "#B83A57", dark: false },
  { id: "ocean", name: "Ocean", paper: "#EAF1F6", surface: "#F6FAFD", ink: "#0F2233", muted: "#586D7F", line: "#CFDDE8", accent: "#0E6BA8", dark: false },
  { id: "midnight", name: "Midnight", paper: "#111827", surface: "#18223A", ink: "#F3F4F6", muted: "#9CA3AF", line: "#29344A", accent: "#FBBF24", dark: true },
  { id: "noir", name: "Noir", paper: "#0E0E0E", surface: "#181818", ink: "#F5F5F0", muted: "#8E8E86", line: "#2A2A2A", accent: "#D4FF3A", dark: true },
];

export const getPalette = (id: string) => PALETTES.find((p) => p.id === id) ?? PALETTES[0];

export interface FontPair {
  id: string;
  name: string;
  display: string;
  body: string;
  displayWeight: number;
  /** tighter letter-spacing for grotesks */
  displayTracking: string;
}

const SANS_FALLBACK = "ui-sans-serif, system-ui, sans-serif";
const SERIF_FALLBACK = "ui-serif, Georgia, serif";
const MONO_FALLBACK = "ui-monospace, SFMono-Regular, monospace";

export const FONT_PAIRS: FontPair[] = [
  { id: "editorial", name: "Editorial", display: `'Instrument Serif', ${SERIF_FALLBACK}`, body: `'Inter Variable', ${SANS_FALLBACK}`, displayWeight: 400, displayTracking: "-0.01em" },
  { id: "classic", name: "Classic", display: `'Playfair Display', ${SERIF_FALLBACK}`, body: `'DM Sans Variable', ${SANS_FALLBACK}`, displayWeight: 600, displayTracking: "-0.01em" },
  { id: "warm", name: "Warm", display: `'Fraunces Variable', ${SERIF_FALLBACK}`, body: `'DM Sans Variable', ${SANS_FALLBACK}`, displayWeight: 500, displayTracking: "-0.02em" },
  { id: "elegant", name: "Elegant", display: `'Cormorant Garamond', ${SERIF_FALLBACK}`, body: `'Inter Variable', ${SANS_FALLBACK}`, displayWeight: 600, displayTracking: "0" },
  { id: "modern", name: "Modern", display: `'Space Grotesk Variable', ${SANS_FALLBACK}`, body: `'Inter Variable', ${SANS_FALLBACK}`, displayWeight: 600, displayTracking: "-0.03em" },
  { id: "bold", name: "Bold", display: `'Bricolage Grotesque Variable', ${SANS_FALLBACK}`, body: `'Inter Variable', ${SANS_FALLBACK}`, displayWeight: 700, displayTracking: "-0.035em" },
  { id: "mono", name: "Technical", display: `'JetBrains Mono Variable', ${MONO_FALLBACK}`, body: `'Inter Variable', ${SANS_FALLBACK}`, displayWeight: 600, displayTracking: "-0.04em" },
];

export const getFontPair = (id: string) => FONT_PAIRS.find((f) => f.id === id) ?? FONT_PAIRS[0];

export const TEMPLATES: { id: TemplateId; name: string; blurb: string }[] = [
  { id: "grid", name: "Studio", blurb: "Tiles in a tidy grid" },
  { id: "list", name: "Ledger", blurb: "Clean rows, dotted leaders" },
  { id: "menu", name: "Menu", blurb: "Centered, café-style" },
  { id: "billboard", name: "Spotlight", blurb: "Bold brand panel + list" },
  { id: "tiers", name: "Tiers", blurb: "Pricing plans side by side" },
  { id: "minimal", name: "Minimal", blurb: "Big numbers, lots of air" },
];

export const ACCENT_SWATCHES = ["#C2410C", "#D9481C", "#B83A57", "#7C3AED", "#2F3BE0", "#0E6BA8", "#2F6B4F", "#8A5A2B", "#1B1A17", "#FBBF24", "#D4FF3A"];

export const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "AED", symbol: "AED ", name: "UAE Dirham", locale: "en-AE" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
] as const;

/** Pick black or white text for a given background colour. */
export function readableOn(hex: string): string {
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c.slice(0, 6);
  const n = parseInt(full, 16);
  if (Number.isNaN(n)) return "#ffffff";
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.45 ? "#111111" : "#ffffff";
}

export const isHex = (v: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());
