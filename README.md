# Nova — considered wardrobe

A production-grade e-commerce storefront for **Nova**, an original fashion label. Built with React,
Vite, TypeScript, Tailwind CSS v4, React Router, Zustand and Framer Motion, in English and Arabic
(full RTL).

## Features

- **Pages:** Landing (home), Shop (filters plus sort), Product details, Cart, Checkout, Wishlist,
  Search, Sign in, Create account, Forgot password, Account, 404.
- **Accounts:** sign up, sign in (with "keep me signed in"), sign out, a 6-digit password-reset
  code that expires after 15 minutes, and an account page with profile, preferences and order
  history. Checkout requires an account: signed-out shoppers are sent to sign in and then
  returned to checkout. See [Demo limitations](#demo-limitations).
- **Currencies:** over 150 currencies. Prices are listed in USD and converted at daily rates from
  [open.er-api.com](https://open.er-api.com) (no API key). A bundled snapshot in
  `src/data/rates.json` is used when offline. Orders record the currency and rate they were paid
  in.
- **Colour variants:** choosing a colour on a product page switches the gallery to that colour's
  photos (`colorImages` in the catalogue). The cart and orders show the chosen colour too. Each
  listed colour has a real matching photo.
- **Shop filters:** category, price (dual-thumb range), size, colour and sort. Filters are stored
  in the URL, so you can share a filtered view and it survives a reload.
- **Cart and wishlist:** stored in `localStorage` with versioned Zustand `persist` stores.
- **Checkout:** client-side validation for email, phone, postal code, card number (Luhn check),
  expiry (must be in the future) and CVC. Fields check on blur and again while you type once
  touched, an error summary appears, focus moves to the first invalid field, and the order is
  confirmed on submit. This is a demo, so no payment is taken; test card `4242 4242 4242 4242`.
- **Catalogue:** 62 products in [`src/data/products.json`](src/data/products.json). Each has
  bilingual names and descriptions, variants (colours and sizes, with sold-out sizes), sale
  prices, ratings and Unsplash photography. The gallery adds focal-point detail crops to each shot.
- **i18n:** typed English and Arabic dictionaries with Arabic plural rules. Switching languages
  updates `<html lang dir>`, and an inline script applies the saved language before first paint
  so the page doesn't flash LTR.
- **Accessibility:** semantic landmarks, a skip link, visible focus states, labelled icon
  buttons, native radio and checkbox groups (so arrow keys work), focus-trapped drawers that close
  on Escape, `aria-live` announcements for bag and wishlist changes, and `prefers-reduced-motion`
  support.
- **Performance:** pages are route-level code-split, the catalogue loads as its own chunk (shown
  as skeleton loaders), images use responsive `srcset`/`sizes` with lazy loading and a fixed
  aspect ratio to avoid layout shift, and hover images are fetched only on first hover.

## Design system

Tokens live in [`src/index.css`](src/index.css) in a Tailwind v4 `@theme` block. The default
Tailwind palette is turned off (`--color-*: initial`), so only Nova's restrained palette is
available:

| Token          | Use                              |
| -------------- | -------------------------------- |
| `paper`/`bone` | Warm off-white surfaces          |
| `ink`          | Text and primary actions         |
| `stone`/`line` | Secondary text, hairline borders |
| `clay`         | The single accent colour         |
| `moss`         | Success                          |
| `danger`       | Validation errors                |

Typography pairs **Bodoni Moda** (display) with **Instrument Sans** (UI). In Arabic it uses
**Amiri** and **IBM Plex Sans Arabic**. The type scale is fluid (`text-display-*`). Layouts use
logical properties (`ms-`, `pe-`, `start-`) so they mirror in RTL.

## Getting started

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:5173
```

## Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Start the Vite dev server                      |
| `pnpm build`        | Type-check (`tsc -b`) and build for production |
| `pnpm preview`      | Serve the production build                     |
| `pnpm lint`         | ESLint, fails on any warning                   |
| `pnpm lint:fix`     | ESLint with autofix                            |
| `pnpm format`       | Format everything with Prettier                |
| `pnpm format:check` | Check formatting                               |
| `pnpm typecheck`    | TypeScript project build, no emit              |

## Project structure

```
src/
├── components/
│   ├── auth/        # Split auth layout and route guards (RequireAuth, GuestOnly)
│   ├── cart/        # Cart line item, free-shipping meter, order totals (shared by drawer, cart, checkout)
│   ├── home/        # Hero, new-arrivals rail, editorial spread, category index, lookbook, newsletter
│   ├── layout/      # Layout (page transitions), header, footer, cart drawer, mobile menu
│   ├── product/     # Product card and grid, gallery, colour/size pickers, wishlist button
│   ├── shop/        # Filter panel, price range, sort and active-filter chips
│   └── ui/          # Design-system primitives: Button, Field, Drawer, Accordion, SmartImage, …
├── data/            # products.json (mock catalogue)
├── hooks/           # useProducts, useShopFilters, useCartDetails, useFocusTrap, DOM helpers
├── i18n/            # en.ts (source of truth, defines the Messages type), ar.ts, useI18n
├── lib/             # Types, constants, catalogue queries, formatting, image URLs, validation
├── pages/           # One file per route
├── store/           # Zustand stores: cart, wishlist, preferences, session, orders, rates (persisted), ui (transient)
├── router.tsx       # Route table with lazy-loaded pages
└── main.tsx
```

## Demo limitations

The store has no backend. Accounts, sessions and orders live in the browser's `localStorage`, so
an account exists only in the browser where it was created. Passwords and reset codes are hashed
with PBKDF2 (Web Crypto) and never stored in plain text, but this does not replace server-side
authentication. With no mail server, the reset code is shown on screen in a "demo inbox" panel.
To go live, replace `src/lib/auth.ts` with a real auth provider; the UI already calls it through
async, error-coded functions.

## Tooling

- **TypeScript** is in `strict` mode with `noUncheckedIndexedAccess`, `noImplicitReturns` and
  `noImplicitOverride`. It's pinned to 6.0 because `typescript-eslint` does not support TS 7 yet.
- **ESLint** (flat config) uses `typescript-eslint` strict and stylistic type-checked rules, plus
  `react-hooks`, `react-refresh`, `jsx-a11y` and `eslint-config-prettier`. It stays on ESLint 9
  because `eslint-plugin-jsx-a11y` doesn't support ESLint 10 yet.
- **Prettier** uses `prettier-plugin-tailwindcss` to sort classes.

## Credits

Product and editorial photography comes from [Unsplash](https://unsplash.com). Nova is a
fictional brand created for this demo.
