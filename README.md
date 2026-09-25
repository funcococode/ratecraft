# RateCraft

Design polished rate cards and price lists in minutes. No sign-up — everything is saved in the browser.

## Features

- **Multiple cards** — a library of cards with live thumbnails; duplicate, delete (with undo), import/export as JSON.
- **Sections & rich pricing** — group items, add descriptions, badges, images, and fixed / from / range / on-request prices with optional "was" prices for discounts. Paste whole lists from notes or spreadsheets.
- **6 templates** — Studio, Ledger, Menu, Spotlight, Tiers, Minimal.
- **Themes & type** — 8 palettes, any accent colour, 7 font pairings, spacing / alignment / corner / size controls.
- **Export** — high-res PNG, A4 PDF (multi-page), single-page PDF, 1080² post, 1080×1920 story, copy to clipboard.
- **Share links** — the card is compressed into the URL (`/view#…`), so no backend is needed.
- **Editor niceties** — click items in the preview to edit, drag to reorder, undo/redo (⌘Z / ⇧⌘Z), autosave.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Radix UI · Framer Motion · html-to-image · jsPDF · self-hosted Fontsource fonts.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/app` | Card library + templates |
| `/app/:cardId` | Editor |
| `/view#<data>` | Read-only shared card |

`vercel.json` rewrites every path to `index.html` so these client-side routes work when opened directly or refreshed on Vercel.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```
