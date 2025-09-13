import React from "react";
import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  LayoutGrid,
  Rows3,
  Sparkles,
  Download,
  Image as ImageIcon,
  Palette,
  Upload,
  Share2,
  ShieldCheck,
  Wand2,
  PencilRuler,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// ------------------------------------------------------------
// RateCraft Landing Page
// - drop this file anywhere (e.g., src/pages/LandingPage.tsx)
// - requires Tailwind + shadcn/ui + framer-motion + lucide-react
// - change hrefs for the primary CTA buttons to match your app route
// ------------------------------------------------------------

const items = [
  { name: "Recording", unit: "per hour", rate: 1000 },
  { name: "Mixing", unit: "per track", rate: 10000 },
  { name: "Mastering", unit: "per track", rate: 5000 },
];

function PreviewCard({ title = "RateCraft", accent = "#4F46E5", currency = "₹" }: { title?: string; accent?: string; currency?: string }) {
  const accentLight = `${accent}16`;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accentLight})` }} />
      <div className="flex items-center justify-between gap-4 px-8 py-6">
        <div className="min-w-0">
          <div className="text-xl font-semibold tracking-tight" style={{ color: accent }}>{title}</div>
          <div className="text-xs text-neutral-500">Rate Card</div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md bg-neutral-50 ring-1 ring-neutral-200">
          <BadgeIndianRupee className="h-5 w-5 text-neutral-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 px-8 pb-8 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.name} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white/90 p-4 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{it.name}</div>
              <div className="truncate text-xs text-neutral-500">{it.unit}</div>
            </div>
            <div className="ml-4 shrink-0 text-sm font-semibold" style={{ color: accent }}>{currency}{it.rate.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between gap-4 bg-neutral-50 px-8 py-4 text-xs text-neutral-500">
        <span>Prices are inclusive of basic edits. Taxes extra.</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-neutral-50">
      {/* Background FX */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(closest-side, #4F46E5, transparent)" }} />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(closest-side, #F59E0B, transparent)" }} />
        <div className="absolute bottom-[-15%] left-[20%] h-96 w-96 rounded-full opacity-10 blur-3xl" style={{ background: "radial-gradient(closest-side, #22C55E, transparent)" }} />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="inline-flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">
              <BadgeIndianRupee className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold tracking-tight">RateCraft</span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            <Button variant="ghost" asChild>
              <a href="#features">Features</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#preview">Preview</a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#faq">FAQ</a>
            </Button>
            <Button className="ml-2" asChild>
              {/* TODO: change /app to your actual app route */}
              <a href="/app">Open App</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="mx-auto max-w-7xl px-6 pt-14 pb-10 sm:pt-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs text-indigo-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" /> Build beautiful rate cards — fast
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Design. Preview. <span className="text-indigo-600">Export</span>.
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-600">
              RateCraft turns your services into polished, shareable rate cards. Choose a template, tweak the brand accents, drop your logo, and export to PNG or PDF in seconds.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button size="lg" className="gap-2" asChild>
                <a href="/app"><Wand2 className="h-4 w-4" /> Open RateCraft</a>
              </Button>
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <a href="#preview"><LayoutGrid className="h-4 w-4" /> See it in action</a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <Badge variant="secondary" className="gap-1"><Download className="h-3.5 w-3.5" /> PNG/PDF export</Badge>
              <Badge variant="secondary" className="gap-1"><Palette className="h-3.5 w-3.5" /> Accent & brand</Badge>
              <Badge variant="secondary" className="gap-1"><Rows3 className="h-3.5 w-3.5" /> Grid • Rows • Billboard</Badge>
            </div>
          </div>

          {/* Animated mock preview */}
          <div className="relative">
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}>
              <PreviewCard />
            </motion.div>
            <motion.div className="absolute -left-6 -top-6 hidden rounded-2xl border border-indigo-200 bg-white/80 p-2 shadow-lg backdrop-blur md:block" initial={{ opacity: 0, y: 12, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: -4 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center gap-2 text-xs text-slate-600"><Upload className="h-3.5 w-3.5" /> Upload logo</div>
            </motion.div>
            <motion.div className="absolute -right-6 -bottom-6 hidden rounded-2xl border border-amber-200 bg-white/80 p-2 shadow-lg backdrop-blur md:block" initial={{ opacity: 0, y: 12, rotate: 6 }} animate={{ opacity: 1, y: 0, rotate: 6 }} transition={{ delay: 0.55 }}>
              <div className="flex items-center gap-2 text-xs text-slate-600"><PencilRuler className="h-3.5 w-3.5" /> Pick template</div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Logos / trust strip */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm sm:grid-cols-4">
          <div className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Local-first saving</div>
          <div className="inline-flex items-center gap-2"><Share2 className="h-4 w-4" /> Share-ready exports</div>
          <div className="inline-flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Optional item images</div>
          <div className="inline-flex items-center gap-2"><BadgeIndianRupee className="h-4 w-4" /> Currency picker</div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Everything you need to price with confidence</h2>
          <p className="mt-3 text-slate-600">Thoughtful defaults, smart controls, and clean exports. No design degree required.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: LayoutGrid, title: "Three templates", desc: "Grid, Rows, and Billboard — switch anytime." },
            { icon: Palette, title: "Brand accents", desc: "Color picker + live preview, logo upload, and title." },
            { icon: Download, title: "PNG & PDF export", desc: "High-res PNG and A4-friendly PDF in one click." },
            { icon: BadgeIndianRupee, title: "Currency select", desc: "INR, USD, EUR, GBP, JPY, AUD, CAD — or custom." },
            { icon: Rows3, title: "Smart layout", desc: "Cozy / compact density for tight print areas." },
            { icon: Wand2, title: "Local autosave", desc: "Your settings and items stay put between sessions." },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-slate-200">
              <CardHeader className="pb-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-slate-600">{desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Inline preview */}
      <section id="preview" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Make a rate card in under a minute</h3>
            <p className="mt-2 max-w-prose text-slate-600">Pick a template, add your services, and export. Grid for catalog-style, Rows for a neat list, Billboard for a hero + list layout.</p>
            <div className="mt-6 flex items-center gap-2">
              <Button asChild><a href="/app">Try RateCraft now</a></Button>
              <Button variant="outline" asChild><a href="#faq">Got questions?</a></Button>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <PreviewCard />
          </motion.div>
        </div>
      </section>

      {/* Callout / CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-br from-white via-indigo-50 to-white p-6 sm:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-200/60 blur-3xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-[1.1fr_auto]">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-900">Your services, crystal clear</h3>
              <p className="mt-2 max-w-prose text-slate-600">Stop sending messy spreadsheets. Share a clean, branded rate card that clients can understand at a glance.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="lg" asChild><a href="/app">Open RateCraft</a></Button>
              <Button size="lg" variant="outline" asChild><a href="#features">Explore features</a></Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pb-20">
        <h3 className="text-2xl font-semibold tracking-tight text-slate-900">FAQ</h3>
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="1">
            <AccordionTrigger>Do I need design skills?</AccordionTrigger>
            <AccordionContent>Nope. Pick a template, choose an accent, add items — RateCraft handles spacing, layout, and typography for you.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>What file formats can I export?</AccordionTrigger>
            <AccordionContent>High-quality PNG and PDF. PDF exports are sized to match your current preview for crisp printing.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>Where is my data stored?</AccordionTrigger>
            <AccordionContent>Locally in your browser (localStorage). Nothing is uploaded unless you choose to share the generated files.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="4">
            <AccordionTrigger>Does it support different currencies?</AccordionTrigger>
            <AccordionContent>Yes. Built-in symbols for INR, USD, EUR, GBP, JPY, AUD, and CAD — or set a custom symbol.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500">
        <div className="inline-flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-indigo-600 text-white"><BadgeIndianRupee className="h-4 w-4" /></span>
          <span className="font-semibold text-slate-800">RateCraft</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="inline-flex items-center gap-3">
          <a className="hover:text-slate-700" href="#features">Features</a>
          <a className="hover:text-slate-700" href="#preview">Preview</a>
          <a className="hover:text-slate-700" href="#faq">FAQ</a>
        </div>
      </footer>
    </div>
  );
}
