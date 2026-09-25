export type PriceMode = "fixed" | "from" | "range" | "quote";

export interface Item {
  id: string;
  name: string;
  description: string;
  unit: string;
  mode: PriceMode;
  price: number | null;
  /** Upper bound when mode === "range" */
  priceMax: number | null;
  /** Shown struck-through next to the price (discounts) */
  originalPrice: number | null;
  badge: string;
  image?: string;
  hidden?: boolean;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  items: Item[];
}

export type TemplateId = "grid" | "list" | "menu" | "billboard" | "tiers" | "minimal";
export type Density = "cozy" | "compact";
export type Align = "left" | "center";
export type Radius = "sharp" | "soft" | "round";

export interface CardDesign {
  template: TemplateId;
  palette: string;
  accent: string;
  fontPair: string;
  density: Density;
  align: Align;
  radius: Radius;
  columns: 2 | 3;
  titleScale: number;
  priceScale: number;
  showImages: boolean;
  showDate: boolean;
}

export interface CardInfo {
  eyebrow: string;
  title: string;
  tagline: string;
  intro: string;
  logo?: string;
}

export interface CurrencyFormat {
  symbol: string;
  code: string;
  position: "before" | "after";
  decimals: 0 | 2;
  locale: string;
}

export interface Contact {
  email: string;
  phone: string;
  website: string;
  instagram: string;
  location: string;
}

export interface Footer {
  note: string;
  validUntil: string;
}

export interface RateCard {
  id: string;
  version: 2;
  createdAt: number;
  updatedAt: number;
  info: CardInfo;
  currency: CurrencyFormat;
  sections: Section[];
  design: CardDesign;
  contact: Contact;
  footer: Footer;
}
