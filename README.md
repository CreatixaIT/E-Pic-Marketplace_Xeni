# E-pic — Marketplace Frontend (Milestone 1)

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
  seller/page.tsx       become a seller
  about/page.tsx        about
components/
  layout/               logo, site header (nav), site footer, page header
  ui/                   button, badge, container, section, reveal
  home/                 hero, featured stores, discovery, seller CTA
  stores/               store card, store grid
  products/             product card, product grid
  immersive/            ambient backdrop, storefront stage (CSS/motion, no WebGL)
lib/
  commerce/
    types.ts            Money, Store, Product, Cart, CommerceProvider
    mock-provider.ts    in-memory placeholder data
    xeni-provider.ts    placeholder — throws until implemented
    index.ts            getCommerceProvider() — the only entry point
  utils.ts              cn(), formatMoney()
config/
  site.ts               name, tagline, navigation
  commerce.ts           which provider is active
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
server; only interactive or animated pieces (`site-header`, `hero`, `reveal`,
`ambient-backdrop`, `storefront-stage`) are client components. That keeps the
JS payload small and leaves room for real async data sources later.

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

## Assumptions

- Content, stores, products, prices and stats are placeholders; no real brand
  data was available.
- The Xeni contract is unknown, so `xeni-provider.ts` throws on every method.
  No endpoints, auth scheme or payload shapes were invented.
- The cart is a read-only preview rendered from mock data. Quantity editing and
  checkout would be fake backend behaviour, so they are deliberately absent —
  the checkout area states this.
- "Explore" and "Stores" in the navigation both point to `/explore`; a separate
  per-store route (`/stores/[slug]`) is a later milestone, and the provider
  already exposes `getStoreBySlug` for it.
- "Become a Seller" links to `/seller`. The eventual redirect into Xeni seller
  onboarding is not implemented.
- Dark theme only, as the premium direction; no light-mode variant yet.
