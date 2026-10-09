# Sweet Argan website

Customer-facing Next.js storefront for Sweet Argan. It is independently deployable and owns its package, environment, assets, routes, UI, services, and tests.

## Routes

Home, `/shop`, `/category/[slug]`, `/product/[slug]`, `/cart`, `/checkout`, `/order/[publicOrderCode]/confirmation`, `/order-tracking`, `/about`, `/contact`, `/shipping`, `/privacy`, and `/terms`.

The cart persists locally. Checkout sends product and variant IDs plus quantities; trusted Supabase code retrieves prices, checks inventory, calculates totals, creates snapshots, and creates the private confirmation session. Confirmation buttons are deterministic; exact confirmation words are accepted and ambiguous messages are routed to review.

## Development

```powershell
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. `CATALOG_PREVIEW=true` is safe only for local design review without a Supabase URL; it uses clearly marked sample content and disables checkout.

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` before deployment.

Customer-facing e-commerce website. This application will eventually host the public shopping experience.

## Current scope

Folder architecture and independent TypeScript tooling only. No UI, routes,
business features, authentication, database integration, checkout, or order
logic have been implemented. A framework, runtime, and deployment configuration
will be chosen during implementation. This is a foundation, not a deployable application.

## Independence

This application owns its package.json, package-lock.json, node_modules,
configuration, environment files, and source. Run commands from this folder.
Do not import code from the sibling application or use a root workspace,
shared package, shared configuration, or shared environment file.

## Setup

Use a maintained Node.js release compatible with the installed TypeScript version,
and npm.

    npm ci
    npm run typecheck

Copy .env.example to .env when configuration is needed. The initial scaffold
requires no environment variables and does not load environment files.
There are intentionally no development-server or build scripts yet.

## Folder responsibilities

| Path | Purpose |
| --- | --- |
| public/assets/ | Static assets served unchanged by the future runtime. |
| src/app/ | Future application entry point, pages, and route composition. |
| src/components/ | Reusable presentation components within this application. |
| src/features/ | Future domain modules, created only when features are implemented. |
| src/layouts/ | Page shells and layout composition. |
| src/services/api/ | Future HTTP client, request adapters, and API integrations. |
| src/hooks/ | Reusable application hooks if the chosen framework uses them. |
| src/lib/ | Third-party library setup and application-local adapters. |
| src/utils/ | Small, pure utility functions. |
| src/types/ | Application-wide types; index.d.ts is an empty tooling placeholder. |
| src/constants/ | Static application constants, excluding secrets. |
| src/styles/ | Global styles and design tokens. |
| src/assets/ | Assets imported and processed by the future build tool. |

Empty directories use .gitkeep so Git preserves them. Remove a placeholder when
adding real files to that directory. Keep feature-specific components, services,
and types inside their future feature folder; promote code to common folders
only when it is reused within this application.

## Configuration

- package.json: private, independent package with a pinned TypeScript dependency.
- package-lock.json: reproducible dependency installation for this application.
- tsconfig.json: strict browser-oriented type checking without emitted files.
- .editorconfig: consistent file formatting.
- .gitignore: excludes dependencies, build output, logs, and local environment files.
- .env.example: documents future environment configuration without credentials.

TypeScript configuration reference: https://www.typescriptlang.org/tsconfig/

The configuration assumes a future browser bundler. Add framework-specific JSX,
environment typing, and runtime configuration when a framework is chosen.
Keep server configuration separate if server-side code is introduced.
