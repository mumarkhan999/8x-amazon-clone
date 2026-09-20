# amazon.clone

A from-scratch, Amazon-style storefront built as an 8x take-home (24-hour
budget). Not a pixel clone — browse, search, cart, checkout with real
Stripe test-mode payments, and order history, built with product judgment
about what a 24-hour build should and shouldn't include.

## Stack

- **Next.js 16 (App Router, TypeScript, Tailwind v4)** — one deploy target
  for both frontend (`src/app/**/page.tsx`) and backend
  (`src/app/api/**/route.ts`).
- **Neon** (serverless Postgres) via `drizzle-orm`, HTTP driver — no
  connection-pool exhaustion risk under serverless functions.
- **Auth.js (NextAuth v5)** — Credentials provider, bcrypt-hashed
  passwords, JWT sessions. `src/proxy.ts` (Next 16 renamed `middleware.ts`
  to `proxy.ts`) does an optimistic redirect for `/checkout`, `/orders`,
  `/account`; every page/action under those also re-checks the session
  server-side (`src/lib/dal.ts`) since Proxy is not a substitute for real
  authorization.
- **Stripe Checkout (test mode)** — real hosted payment UI, no fake
  "Order Placed" button. Use card `4242 4242 4242 4242`, any future
  expiry, any CVC.

## Scope decisions (stated explicitly, not accidental)

- **Cart is client-side only** (React context + `localStorage`), not a
  `cart_items` DB table. It's synced to the server only at checkout,
  where line-item prices are re-validated against the DB (never trusted
  from the client). This sidesteps guest-cart/login-merge complexity
  that wasn't worth building in 24 hours — the trade-off is a cart that
  doesn't follow you across devices.
- **No real product images** — `picsum.photos` placeholder photography,
  not real Amazon product photos (licensing/trademark risk) and not a
  real image-upload pipeline (out of scope for a seller-less clone).
- **No seller/marketplace features, no user-submitted reviews, no
  recommendation engine.** This is a single-catalog storefront: browse →
  PDP → cart → checkout → orders.
- **Payment confirmation** is authoritative via a Stripe webhook
  (`/api/webhooks/stripe`), with a self-healing check on the order
  confirmation page (`/order/confirmed`) that reconciles directly with
  Stripe if the webhook hasn't landed yet — so the live demo doesn't
  depend on webhook delivery timing looking right on first click.

## Local setup

1. **Install dependencies**: `npm install`
2. **Create a `.env.local`** from `.env.example` and fill in:
   - `DATABASE_URL` — from a free [Neon](https://neon.tech) project.
   - `AUTH_SECRET` — generate with `openssl rand -base64 32`.
   - `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — **test
     mode** keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys).
   - `STRIPE_WEBHOOK_SECRET` — from `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
     (Stripe CLI) for local dev, or the deployed webhook endpoint's
     signing secret in production.
3. **Push the schema**: `npm run db:push`
4. **Seed the catalog**: `npm run db:seed`
5. **Run the dev server**: `npm run dev` → http://localhost:3000

## Deploying

1. Push this repo to GitHub, import it in Vercel.
2. Add the same env vars from `.env.local` to the Vercel project
   (Production + Preview), using **live-looking test-mode** Stripe keys
   — never live Stripe keys for this project.
3. In the Stripe dashboard, add a webhook endpoint pointing at
   `https://<your-deployment>/api/webhooks/stripe` for the
   `checkout.session.completed` event, and set `STRIPE_WEBHOOK_SECRET`
   to its signing secret.
4. Run `npm run db:seed` once (locally, pointed at the same
   `DATABASE_URL` as production) to populate the live catalog.

## Agent logs

`.agent-logs/` contains a verbatim, hook-captured transcript of every
prompt/response pair from the AI sessions that built this project. See
`CAPTURE-TEST.md` for how the capture hooks were set up and verified.
