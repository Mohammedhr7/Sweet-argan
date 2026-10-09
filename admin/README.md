# Sweet Argan admin

Private operations dashboard for Sweet Argan. It is independently deployable and owns its authentication boundary, package, environment, assets, routes, UI, services, migrations, and tests.

## Sections

Dashboard metrics, orders and order detail, manual confirmation, fulfillment transitions, internal notes, products, categories, customers, and homepage content/shipping settings. Supabase Auth protects the dashboard; there is no public signup. Only a `profiles` row with an `admin` or `super_admin` role can enter.

## Development

```powershell
npm install
npm run dev
```

Copy `.env.example` to `.env.local`. Set the public Supabase URL and publishable key. Keep privileged credentials server-only. Run the versioned migrations in `supabase/migrations/` against the final Supabase project before using the dashboard.

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. The tests use a disposable database and do not touch Supabase.

Private admin dashboard intended to manage products, orders, customers, and order confirmations. Access protection must be implemented before deployment; this scaffold contains no authentication.

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

## Catalog and image operations

Products are loaded from Supabase, filtered by `status`, and never from local mock arrays. Instagram imports stay draft records with provenance fields. The dashboard exposes status and incomplete-product filters, ordered image editing, Storage upload, and a server-validated publication action. The storefront only queries active products. See [docs/IMAGE-AUDIT.md](docs/IMAGE-AUDIT.md) for the image-quality decisions.
