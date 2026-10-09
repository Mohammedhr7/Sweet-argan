# Sweet Argan commerce platform

Two independently deployable Next.js applications for Sweet Argan:

- `website/` — customer storefront, guest checkout, private confirmation links, cart, tracking, SEO, and local preview catalogue.
- `admin/` — protected operations dashboard for orders, products, categories, customers, content, uploads, and realtime order updates.

They share only the Supabase backend. They do not share source files, package manifests, configuration, environment files, or runtime state.

## Current delivery

The storefront and dashboard are implemented with Next.js App Router, React, TypeScript, Tailwind CSS, Supabase SSR, React Hook Form, and Zod. The live project at `wpcqqpzkavciiugwvqsn` has the core tables, RLS policies, storage buckets, realtime orders publication, and trusted checkout/confirmation functions applied. It currently has no catalogue or commercial settings, so the public shop is empty and checkout stays closed until the business approves products, prices, delivery terms, and legal copy.

Brand discovery is documented in [admin/docs/BRAND-REVIEW.md](admin/docs/BRAND-REVIEW.md). It records the verified Instagram profile details and separates candidate imagery from facts that still require client approval.

## Requirements

Node.js 22.20 or newer and npm. Use separate terminals:

```powershell
cd website
npm install
npm run dev
```

```powershell
cd admin
npm install
npm run dev
```

The default URLs are `http://localhost:3000` and `http://localhost:3001`.

## Environment

Copy each `.env.example` to `.env.local`. Configure `NEXT_PUBLIC_SUPABASE_URL` and the Supabase publishable key in both applications. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only; it is required by website order and tracking route handlers. Never commit `.env.local`.

Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADMIN_URL`, and `NEXT_PUBLIC_WEBSITE_URL` for the deployed domains. Set a random `RATE_LIMIT_SECRET` of at least 32 bytes in both server environments. The website preview catalogue is only used when `CATALOG_PREVIEW=true` and no Supabase URL is configured.

## Database and storage

The versioned SQL source is in `admin/supabase/migrations/` and should be applied in filename order to a fresh Supabase project. It contains stricter constraints and complete transactional functions than the compact bootstrap already applied to the supplied project. The first-admin workflow is deliberate: create the user in Supabase Auth, then insert their UUID into `public.profiles` with role `admin` or `super_admin` from the SQL editor. Public signup is not implemented.

Create and verify these storage buckets: `products`, `categories`, and `site-content`. Product and category images must be approved brand assets, use supported image types, and stay under the upload limit. The admin upload route converts them to WebP.

Before opening checkout, configure the `shipping` and `site_content` settings from the admin panel, insert approved categories and products, and confirm the delivery amount, phone number, policies, and client-approved imagery. Seed data intentionally stays out of Supabase so invented products and prices cannot go live.

## Security decisions

Prices and totals are recalculated by the server-side Supabase function. Public order numbers are paired with an HTTP-only token cookie; order numbers alone do not expose order data. Confirmation accepts exact words only; ambiguous text goes to review. Admin routes require Supabase Auth and an admin profile. RLS prevents public customer/order reads and direct public writes. Uploads are type- and size-checked. Rate limiting uses a server-only HMAC identity.

## Checks

Run these from each application:

```powershell
npm run typecheck
npm run lint
npm test
npm run build
```

The admin tests run a disposable PGlite database and cover price tampering, idempotency, stock races, confirmation classification, RLS, admin transitions, and rate limits. The website tests cover Moroccan phone validation, checkout payload boundaries, and exact confirmation words.

## Deployment

Deploy `website/` and `admin/` as separate Vercel projects. Set each project’s root directory independently, add its own environment variables, and use `www.sweetargan.ma` and `admin.sweetargan.ma` (or the approved equivalent). Do not deploy the admin under the public site domain. Add the Supabase project URL to both Vercel projects and keep the service-role key only in server environment variables.

## Remaining launch work

The implementation is ready for catalogue and operational configuration. Before commercial launch, verify the full migration set against the final Supabase project, create the first admin, add approved catalogue data, approve shipping/legal content, test a real delivery address and phone flow, configure a scheduled reservation-expiry job, and complete a production-domain browser review. Official WhatsApp Cloud API templates, online payments, promotions, and richer reporting remain optional V2 work.

## Catalog caching

Catalog routes on the website use `dynamic = 'force-dynamic'` because products, categories, prices, and image paths are operational data managed in Supabase. Admin mutations call `revalidatePath` for the affected dashboard and product routes. This keeps catalog edits visible on the next request without disabling caching for unrelated static pages.
