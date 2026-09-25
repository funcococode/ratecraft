import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Brand";
import { ScaledCard } from "@/components/card/ScaledCard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PRESETS } from "@/lib/presets";
import { cloneWithNewIds, makeCard, makeSection } from "@/lib/factory";
import { parseLine } from "@/lib/parse";
import { store } from "@/lib/store";
import { PALETTES, TEMPLATES } from "@/lib/themes";
import type { RateCard, TemplateId } from "@/lib/types";

const preset = (id: string) => PRESETS.find((p) => p.id === id)!.build();

const DEMO_NOTES = `Recording, 1500, per hour
Mixing — ₹8,000 per track
Mastering 3500 / track
Full production from 25000 per song`;

const DEMO_LOOKS: Record<TemplateId, { palette: string; fontPair: string }> = {
  grid: { palette: "ivory", fontPair: "editorial" },
  list: { palette: "sage", fontPair: "classic" },
  menu: { palette: "blush", fontPair: "elegant" },
  billboard: { palette: "noir", fontPair: "bold" },
  tiers: { palette: "sand", fontPair: "warm" },
  minimal: { palette: "snow", fontPair: "modern" },
};

function NotesDemo() {
  const navigate = useNavigate();
  const [name, setName] = useState("Night Owl Studios");
  const [notes, setNotes] = useState(DEMO_NOTES);
  const [template, setTemplate] = useState<TemplateId>("grid");

  const card = useMemo(() => {
    const items = notes
      .split("\n")
      .slice(0, 8)
      .map(parseLine)
      .filter((i): i is NonNullable<typeof i> => !!i && !!i.name);
    // "from 25000" in free text → a "from" price
    items.forEach((i) => {
      if (/^from\b/i.test(i.unit)) {
        i.mode = "from";
        i.unit = i.unit.replace(/^from\s*/i, "");
      }
      if (/\bfrom$/i.test(i.name)) {
        i.mode = "from";
        i.name = i.name.replace(/\s*from$/i, "");
      }
    });
    const look = DEMO_LOOKS[template];
    const pal = PALETTES.find((p) => p.id === look.palette)!;
    return makeCard({
      id: "demo",
      info: { eyebrow: "Rate card", title: name || "Your business", tagline: "" },
      design: { template, palette: pal.id, accent: pal.accent, fontPair: look.fontPair, align: template === "menu" ? "center" : "left" },
      sections: [makeSection({ title: "", items })],
    });
  }, [name, notes, template]);

  function openInApp() {
    const id = store.create(cloneWithNewIds(card));
    navigate(`/app/${id}`);
  }

  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div aria-hidden className="absolute -bottom-48 -left-40 size-[480px] rounded-full bg-vermilion/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="eyebrow flex items-center gap-2 !text-paper/60">
            <span className="size-1.5 rounded-full bg-vermilion" /> Try it right here
          </div>
          <h2 className="font-display mt-4 text-5xl leading-[0.95] sm:text-6xl">
            From scribbled notes to a <em className="text-vermilion">proper</em> rate card.
          </h2>
          <p className="mt-5 max-w-md text-paper/70">Type your prices the way you'd jot them down. RateCraft figures out the rest — edit the notes below and watch the card update.</p>

          <div className="mt-8 overflow-hidden rounded-2xl bg-paper/[0.06] ring-1 ring-paper/10">
            <div className="flex items-center gap-1.5 border-b border-paper/10 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-paper/20" />
              <span className="size-2.5 rounded-full bg-paper/20" />
              <span className="size-2.5 rounded-full bg-paper/20" />
              <span className="ml-2 font-mono text-[11px] text-paper/40">notes.txt</span>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Business name"
              placeholder="Your business name"
              className="font-display w-full bg-transparent px-4 pt-3 text-2xl text-paper outline-none placeholder:text-paper/30"
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              aria-label="Your prices, one per line"
              rows={5}
              spellCheck={false}
              className="block w-full resize-none bg-transparent px-4 pt-2 pb-4 font-mono text-[13px] leading-6 text-paper/85 outline-none placeholder:text-paper/30"
              placeholder="Service, price, unit — one per line"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Template">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                role="radio"
                aria-checked={template === t.id}
                onClick={() => setTemplate(t.id)}
                className={
                  "rounded-full px-3.5 py-1.5 text-sm transition " +
                  (template === t.id ? "bg-paper text-ink" : "text-paper/70 ring-1 ring-paper/15 hover:text-paper hover:ring-paper/40")
                }
              >
                {t.name}
              </button>
            ))}
          </div>

          <Button onClick={openInApp} size="lg" className="mt-8 h-12 rounded-full bg-vermilion px-6 text-[15px] text-white hover:bg-vermilion-2">
            Keep editing this card <ArrowRight />
          </Button>
        </div>

        <motion.div
          key={template}
          initial={{ opacity: 0.4, y: 10, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-[14px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)]"
        >
          <ScaledCard card={card} />
        </motion.div>
      </div>
    </section>
  );
}

const FEATURES = [
  { t: "Sections, not spreadsheets", d: "Group services into sections. Add descriptions, “from” prices, ranges, on-request items, discounts and badges like Popular." },
  { t: "Six layouts, one click apart", d: "Studio tiles, a Ledger list, a café Menu, a bold Spotlight, pricing Tiers and a number-first Minimal. Switch any time — nothing is lost." },
  { t: "Themes & type that feel designed", d: "Eight palettes, any accent colour, and seven hand-picked font pairings. Tune spacing, corners and sizes until it's unmistakably yours." },
  { t: "Export for wherever clients are", d: "Crisp PNGs, printable A4 PDFs, Instagram-ready square posts and stories — or copy the image straight to your clipboard." },
  { t: "Share a live link", d: "Send a read-only link that opens a beautiful version of your card. Viewers can download it or remix it into their own." },
  { t: "All your cards, autosaved", d: "Keep a card per client, season or service line. Everything saves in your browser as you type — with undo, duplicate and JSON backups." },
];

const FAQ = [
  { q: "Is RateCraft really free?", a: "Yes. No account, no watermark, no paywall. Make as many cards as you like." },
  { q: "Where is my data stored?", a: "In your own browser (localStorage). Nothing is uploaded to a server. Download a .json backup from any card if you want to move it to another device." },
  { q: "How do share links work without an account?", a: "The card itself is compressed into the link. Anyone who opens it sees a read-only copy. Images aren't included in links to keep them short — use PNG or PDF export to share the full design." },
  { q: "Can I paste my existing price list?", a: "Yes — use “Paste list” in any section. It understands lines like “Mixing, 8000, per track” and rows copied from Excel or Google Sheets." },
  { q: "What currencies are supported?", a: "Rupee, Dollar, Euro, Pound, Dirham and more — or type any symbol. Choose Indian (1,00,000) or international (100,000) number grouping." },
];

function Fan() {
  const cards = useMemo(() => [preset("salon"), preset("studio"), preset("freelance")], []);
  const pose = [
    { rotate: -8, x: "-20%", y: -10, z: 1 },
    { rotate: -1, x: "0%", y: 40, z: 3 },
    { rotate: 7, x: "21%", y: 0, z: 2 },
  ];
  return (
    <div className="relative mx-auto aspect-[1/0.92] w-full max-w-[640px]">
      {cards.map((c, i) => (
        <motion.div
          key={c.id}
          className="absolute top-0 left-[12%] w-[76%] overflow-hidden rounded-[14px] shadow-[0_40px_80px_-30px_rgba(23,21,15,0.45),0_0_0_1px_rgba(23,21,15,0.06)]"
          style={{ zIndex: pose[i].z }}
          initial={{ opacity: 0, y: 60, rotate: 0 }}
          animate={{ opacity: 1, y: pose[i].y, rotate: pose[i].rotate, x: pose[i].x }}
          transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScaledCard card={c} clip={i === 1 ? 1.02 : 0.95} />
        </motion.div>
      ))}
    </div>
  );
}

function TemplateGallery() {
  const base = useMemo(() => preset("studio"), []);
  const palettes = ["ivory", "noir", "blush", "sage", "sand", "snow"];
  const fonts = ["editorial", "bold", "elegant", "classic", "warm", "modern"];
  const cards: { id: TemplateId; card: RateCard }[] = TEMPLATES.map((t, i) => {
    const pal = PALETTES.find((p) => p.id === palettes[i])!;
    return {
      id: t.id,
      card: {
        ...base,
        design: { ...base.design, template: t.id, palette: pal.id, accent: pal.accent, fontPair: fonts[i], align: t.id === "menu" ? "center" : "left" },
        sections: t.id === "tiers" ? preset("photo").sections : base.sections,
      },
    };
  });
  return (
    <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ id, card }, i) => {
        const t = TEMPLATES.find((x) => x.id === id)!;
        return (
          <motion.div key={id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}>
            <div className="overflow-hidden rounded-xl shadow-[0_24px_50px_-28px_rgba(23,21,15,0.4),0_0_0_1px_rgba(23,21,15,0.06)] transition duration-500 hover:-translate-y-1">
              <ScaledCard card={card} clip={0.9} />
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-xs text-vermilion">0{i + 1}</span>
              <h3 className="font-display text-3xl">{t.name}</h3>
              <span className="text-sm text-mute">{t.blurb}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-transparent bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-1">
            <a href="#templates" className="hidden rounded-md px-3 py-2 text-sm text-ink-2 hover:text-ink md:block">
              Templates
            </a>
            <a href="#features" className="hidden rounded-md px-3 py-2 text-sm text-ink-2 hover:text-ink md:block">
              Features
            </a>
            <a href="#faq" className="hidden rounded-md px-3 py-2 text-sm text-ink-2 hover:text-ink md:block">
              FAQ
            </a>
            <Button asChild className="ml-2 rounded-full px-5">
              <Link to="/app">
                Open app <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 sm:pt-16 lg:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-vermilion" /> Free · No sign-up · Made for independents
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-display mt-6 text-[64px] leading-[0.9] sm:text-[96px] lg:text-[112px]"
            >
              Price your work like it's <em className="text-vermilion">worth&nbsp;it.</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
              RateCraft turns your services into a rate card clients actually read. Pick a layout, make it on-brand, then export it or send a link — in about the time it takes to make chai.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-12 rounded-full px-7 text-[15px]">
                <Link to="/app">
                  Make your rate card <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-12 rounded-full px-5 text-[15px]">
                <a href="#templates">See the templates</a>
              </Button>
            </motion.div>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["6", "layouts"],
                ["8", "themes"],
                ["0", "sign-ups"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-4xl">{n}</div>
                  <div className="text-xs text-mute">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <Fan />
        </div>
      </header>

      {/* Live demo */}
      <NotesDemo />

      {/* Templates */}
      <section id="templates" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <div className="eyebrow">Templates</div>
            <h2 className="font-display mt-3 text-5xl leading-[0.95] sm:text-7xl">
              Same prices.
              <br />
              <em className="text-mute">Six ways to say them.</em>
            </h2>
          </div>
          <p className="max-w-md text-ink-2 lg:justify-self-end">
            Every layout below is the same card — just a different template, theme and type pairing. Yours can switch between them in a click.
          </p>
        </div>
        <TemplateGallery />
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="eyebrow">What's inside</div>
              <h2 className="font-display mt-3 text-5xl leading-[0.95] sm:text-6xl">Everything a price list should have been all along.</h2>
              <Button asChild variant="outline" className="mt-8 rounded-full bg-transparent px-5">
                <Link to="/app">
                  Try it now <ArrowUpRight />
                </Link>
              </Button>
            </div>
            <ol className="divide-y divide-line border-y border-line">
              {FEATURES.map((f, i) => (
                <motion.li
                  key={f.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-[3rem_1fr] gap-4 py-8 sm:grid-cols-[4.5rem_1fr]"
                >
                  <span className="font-mono text-sm text-vermilion">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-3xl sm:text-[34px]">{f.t}</h3>
                    <p className="mt-2 max-w-xl text-ink-2">{f.d}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="eyebrow">How it works</div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {[
            ["Add your services", "Type them in, or paste a list from your notes or a spreadsheet."],
            ["Make it yours", "Choose a layout, theme and fonts. Add your logo and contact details."],
            ["Send it", "Export a PNG, PDF or Instagram story — or share a live link."],
          ].map(([t, d], i) => (
            <div key={t} className="border-t-2 border-ink pt-6">
              <div className="font-display text-7xl leading-none text-vermilion">{i + 1}</div>
              <h3 className="mt-6 text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-ink-2">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto grid max-w-7xl scroll-mt-20 gap-10 px-4 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="eyebrow">FAQ</div>
          <h2 className="font-display mt-3 text-5xl sm:text-6xl">Good questions.</h2>
        </div>
        <Accordion type="single" collapsible className="border-t border-line">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={String(i)} className="border-line">
              <AccordionTrigger className="py-5 text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-relaxed text-ink-2">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="px-4 pb-6 sm:px-6">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-ink px-6 py-20 text-paper sm:px-16 sm:py-28">
          <div aria-hidden className="absolute -top-40 -right-40 size-[420px] rounded-full bg-vermilion/30 blur-[100px]" />
          <div className="relative max-w-3xl">
            <h2 className="font-display text-5xl leading-[0.95] sm:text-8xl">
              Your next client is waiting for a <em className="text-vermilion">number.</em>
            </h2>
            <Button asChild size="lg" className="mt-10 h-12 rounded-full bg-paper px-7 text-[15px] text-ink hover:bg-paper/90">
              <Link to="/app">
                Make your rate card — free <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-10 text-sm text-mute sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-5">
          <a href="#templates" className="hover:text-ink">
            Templates
          </a>
          <a href="#features" className="hover:text-ink">
            Features
          </a>
          <a href="#faq" className="hover:text-ink">
            FAQ
          </a>
          <Link to="/app" className="hover:text-ink">
            Open app
          </Link>
        </div>
      </footer>
    </div>
  );
}
