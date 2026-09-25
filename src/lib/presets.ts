import { makeCard, makeItem as i, makeSection as s } from "./factory";
import type { RateCard } from "./types";

export interface Preset {
  id: string;
  name: string;
  blurb: string;
  build: () => RateCard;
}

export const PRESETS: Preset[] = [
  {
    id: "studio",
    name: "Music studio",
    blurb: "Recording, mixing & mastering",
    build: () =>
      makeCard({
        info: { eyebrow: "Rate card · 2026", title: "Night Owl Studios", tagline: "Recording · Mixing · Mastering", intro: "A warm, treated room for artists who care about sound. Every session includes an engineer and a coffee that's actually good." },
        design: { template: "grid", palette: "ivory", accent: "#C2410C", fontPair: "editorial" },
        sections: [
          s({
            title: "Studio time",
            items: [
              i({ name: "Recording session", description: "Engineer included", unit: "per hour", price: 1500 }),
              i({ name: "Half-day block", description: "4 hours, flexible start", unit: "per block", price: 5000, originalPrice: 6000, badge: "Save 15%" }),
            ],
          }),
          s({
            title: "Post-production",
            items: [
              i({ name: "Mixing", description: "Up to 3 revisions", unit: "per track", price: 8000, badge: "Popular" }),
              i({ name: "Mastering", description: "Streaming + CD masters", unit: "per track", price: 3500 }),
              i({ name: "Full production", description: "Arrangement to master", unit: "per song", mode: "from", price: 25000 }),
            ],
          }),
        ],
        contact: { email: "hello@nightowl.studio", instagram: "@nightowlstudios" },
        footer: { note: "50% advance to confirm a booking. Taxes extra." },
      }),
  },
  {
    id: "photo",
    name: "Photography",
    blurb: "Packages with inclusions",
    build: () =>
      makeCard({
        info: { eyebrow: "Packages", title: "Frame & Field", tagline: "Portraits, brands and small weddings", intro: "" },
        design: { template: "tiers", palette: "sand", accent: "#8A5A2B", fontPair: "warm" },
        sections: [
          s({
            title: "Portrait sessions",
            items: [
              i({ name: "Mini", unit: "per session", price: 6000, description: "45 minutes\n1 location\n15 edited images" }),
              i({ name: "Signature", unit: "per session", price: 12000, badge: "Most booked", description: "2 hours\n2 locations\n40 edited images\nOnline gallery" }),
              i({ name: "Editorial", unit: "per day", mode: "from", price: 30000, description: "Full day\nStyling support\n100+ edited images\nUsage licence" }),
            ],
          }),
        ],
        contact: { website: "frameandfield.in", phone: "+91 98765 43210" },
        footer: { note: "Travel outside city limits billed at cost." },
      }),
  },
  {
    id: "salon",
    name: "Salon & beauty",
    blurb: "Menu-style service list",
    build: () =>
      makeCard({
        info: { eyebrow: "Service menu", title: "Maison Belle", tagline: "Hair · Skin · Nails", intro: "" },
        design: { template: "menu", palette: "blush", accent: "#B83A57", fontPair: "elegant", align: "center" },
        sections: [
          s({ title: "Hair", items: [i({ name: "Signature cut & style", unit: "", price: 1800 }), i({ name: "Global colour", unit: "", mode: "from", price: 4500 }), i({ name: "Keratin treatment", unit: "", mode: "range", price: 6000, priceMax: 9000 })] }),
          s({ title: "Skin", items: [i({ name: "Hydra facial", description: "Cleanse, exfoliate, hydrate", unit: "", price: 3500 }), i({ name: "Express glow", unit: "", price: 1500 })] }),
          s({ title: "Nails", items: [i({ name: "Gel manicure", unit: "", price: 1200 }), i({ name: "Nail art", unit: "per nail", mode: "from", price: 150 })] }),
        ],
        footer: { note: "Prices inclusive of GST. Please arrive 10 minutes early." },
      }),
  },
  {
    id: "freelance",
    name: "Freelance design",
    blurb: "Bold spotlight layout",
    build: () =>
      makeCard({
        info: { eyebrow: "Rates 2026", title: "Studio Ampersand", tagline: "Independent brand & web design", intro: "I help small teams look as good as the work they do. Fixed scopes, clear timelines, no surprises." },
        currency: { symbol: "$", code: "USD", locale: "en-US" },
        design: { template: "billboard", palette: "noir", accent: "#D4FF3A", fontPair: "bold" },
        sections: [
          s({
            title: "Brand",
            items: [i({ name: "Logo & identity", description: "Mark, type, colour, mini guidelines", unit: "project", mode: "from", price: 2400 }), i({ name: "Brand refresh", unit: "project", price: 1200 })],
          }),
          s({
            title: "Web",
            items: [i({ name: "Landing page", description: "Design + build in Framer", unit: "project", price: 3000, badge: "Popular" }), i({ name: "Design retainer", unit: "per month", price: 1800 })],
          }),
        ],
        contact: { email: "hi@ampersand.studio", website: "ampersand.studio" },
        footer: { note: "50% upfront, 50% on delivery." },
      }),
  },
  {
    id: "cafe",
    name: "Café menu",
    blurb: "Two-column ledger",
    build: () =>
      makeCard({
        info: { eyebrow: "Menu", title: "Tiny Kettle", tagline: "Coffee · Tea · Bakes", intro: "" },
        design: { template: "list", palette: "sage", accent: "#2F6B4F", fontPair: "classic" },
        sections: [
          s({ title: "Coffee", items: [i({ name: "Espresso", price: 140 }), i({ name: "Flat white", price: 220 }), i({ name: "Cold brew", description: "18-hour steep", price: 260, badge: "New" })] }),
          s({ title: "Bakes", items: [i({ name: "Butter croissant", price: 180 }), i({ name: "Banana bread", description: "With salted butter", price: 160 })] }),
        ],
        footer: { note: "All prices inclusive of taxes." },
      }),
  },
  {
    id: "consult",
    name: "Consulting",
    blurb: "Minimal, number-first",
    build: () =>
      makeCard({
        info: { eyebrow: "Engagements", title: "Northstar Advisory", tagline: "Product & growth strategy", intro: "" },
        currency: { symbol: "€", code: "EUR", locale: "de-DE", position: "after" },
        design: { template: "minimal", palette: "snow", accent: "#2F3BE0", fontPair: "modern" },
        sections: [
          s({
            title: "",
            items: [
              i({ name: "Strategy call", description: "90 minutes, recorded", unit: "per call", price: 450 }),
              i({ name: "Growth audit", description: "Two-week deep dive", unit: "fixed", price: 6500 }),
              i({ name: "Fractional lead", description: "2 days a week", unit: "per month", price: 9000 }),
              i({ name: "Workshops", unit: "per day", mode: "quote" }),
            ],
          }),
        ],
        contact: { email: "team@northstar.eu" },
      }),
  },
];

export const blankCard = () =>
  makeCard({
    info: { title: "Your business name", tagline: "What you do, in a line" },
    sections: [
      s({
        title: "Services",
        items: [i({ name: "First service", unit: "per hour", price: 1000 }), i({ name: "Second service", unit: "per project", price: 5000 })],
      }),
    ],
  });
