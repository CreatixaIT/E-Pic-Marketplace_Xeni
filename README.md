# E-pic — Marketplace Frontend (Milestone 2)

A premium marketplace frontend where every brand gets its own storefront world.
This milestone is the **frontend foundation only**: no Xeni, no Supabase, no
payment gateway, no external backend of any kind.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS v4
- Framer Motion (subtle motion only)
- Lucide React (icons)

No other runtime dependencies.

## Project structure

```
app/
  layout.tsx            root layout: header, footer, metadata, cart badge
  page.tsx              homepage
  explore/page.tsx      store + product directory
  cart/page.tsx         read-only cart preview
  seller/page.tsx       open your store
  about/page.tsx        about
  stores/[slug]/page.tsx  minimal storefront destination (full build: later)
components/
  layout/               logo, site header (nav), site footer, page header
  ui/                   button, badge, container, section, reveal, dropdown
  home/                 promo hero, product discovery, curated collections,
                        store worlds, seller CTA
  preferences/          theme selector, language selector
  stores/               store card, store grid, store world card
  products/             product card, product grid
  immersive/            ambient backdrop, slide ambience (CSS/motion, no WebGL)
lib/
  commerce/
    types.ts            Money, Store, Product, Cart, Category, PromoSlide,
                        CommerceProvider
    mock-provider.ts    in-memory placeholder data
    xeni-provider.ts    placeholder — throws until implemented
    index.ts            getCommerceProvider() — the only entry point
  i18n/                 dictionary type + en/bn dictionaries + interpolate()
  preferences/          server.ts (cookie → theme/locale/dictionary), client.ts
  utils.ts              cn(), formatMoney(locale)
config/
  site.ts               name, tagline, navigation (translation keys)
  commerce.ts           which provider is active
  themes.ts             theme ids, labels, default, cookie name
  i18n.ts               locale ids, direction, Intl tags, active/future flags
types/
  index.ts              shared UI types (routes, nav links, card content)
```

## Architectural decisions

**One seam to the backend.** Every data read goes through
`getCommerceProvider()`, which returns an object satisfying the
`CommerceProvider` interface. Components receive plain data as props and never
fetch anything themselves, so replacing the mock provider with Xeni is a
config change (`NEXT_PUBLIC_COMMERCE_PROVIDER`) plus one new file — no component
edits.

**Server components by default.** Pages fetch through the provider on the
server; only interactive or animated pieces (`site-header`, `promo-hero`,
`product-discovery`, `curated-collections`, `reveal`, `dropdown`) are client
components. That keeps the JS payload small and leaves room for real async data sources later.

**Money as minor units.** Prices are `{ amount: number; currency }` in cents,
formatted once in `formatMoney()`. Avoids float drift and makes multi-currency
support a data problem rather than a UI problem.

**Content lives in config/data, not JSX.** Navigation, categories, benefits and
mock catalogue entries are typed arrays. UI components render whatever they are
handed.

**Immersive without 3D.** The "enter their worlds" idea is expressed with
gradient fields and parallaxed cards driven by Framer Motion — no canvas, WebGL
or 3D dependency. All motion respects `prefers-reduced-motion`.

**Route safety.** Internal links are typed against a `Route` union, so a typo in
a `href` fails typechecking rather than shipping a broken link.

**Theme preference (Milestone 2).** Five curated themes (Midnight default,
Pearl, Ocean, Forest, Sunset). Each is a block of CSS custom properties in
`app/globals.css` keyed by `[data-theme="…"]`, mapped into Tailwind utilities
once via `@theme inline` — components use `bg-surface`, `text-muted`,
`border-border` and never hardcode a palette. The choice is stored in the
`epic-theme` cookie, read on the server in the root layout and rendered as
`<html data-theme>`, so the first painted HTML already carries the right theme
(no flash, no account, no client-side hydration guess).

**Internationalisation (Milestone 2).** No i18n dependency. `config/i18n.ts`
declares every locale with its direction and Intl tag; English and Bangla are
`active`, Malay/Chinese/Urdu/Arabic are declared but inactive, and Urdu/Arabic
already carry `dir: "rtl"`. Dictionaries in `lib/i18n/dictionaries/` implement a
single `Dictionary` type, so a missing or renamed key is a type error. The
locale lives in the `epic-locale` cookie, is resolved server-side alongside the
theme, and drives `<html lang>`, `<html dir>` and `Intl.NumberFormat` currency
formatting. Layout uses logical properties (`ms-*`, `ps-*`, `start-*`) so RTL is
a data switch rather than a rewrite.

## Assumptions

- Content, stores, products, prices and stats are placeholders; no real brand
  data was available.
- The Xeni contract is unknown, so `xeni-provider.ts` throws on every method.
  No endpoints, auth scheme or payload shapes were invented.
- The cart is a read-only preview rendered from mock data. Quantity editing and
  checkout would be fake backend behaviour, so they are deliberately absent —
  the checkout area states this.
- "Explore" and "Stores" in the navigation both point to `/explore`.
  `/stores/[slug]` exists only so "Enter Store" is never a broken link: it
  renders the store's identity and its catalogue. The branded storefront
  experience is a later milestone.
- "Open Your Store" links to `/seller`. The eventual redirect into Xeni seller
  onboarding is not implemented.
- Only global navigation, footer and homepage copy are translated. Interior
  pages (`/about`, `/seller`, `/cart`, `/explore`) and mock catalogue content
  stay in English rather than being machine-translated.
- Category filtering and collection tabs run client-side over data the server
  already fetched through the provider; paginated/server-side filtering belongs
  with the real backend.
- Product imagery is gradient placeholders — no asset pipeline yet.
