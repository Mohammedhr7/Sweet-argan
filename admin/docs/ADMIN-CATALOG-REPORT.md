# Admin setup and catalog import report

Verified on 2026-10-03 in Supabase project `wpcqqpzkavciiugwvqsn`.

## Live changes

- Created the admin profile for the existing Auth account `admin@sweetargan.com`, role `admin`.
- Uploaded five selected Instagram product photographs to the `products` Storage bucket. All five public image URLs return HTTP 200 and image/jpeg.
- Created four inactive categories and five unpublished draft products, each with one image.
- Confirmed anonymous database access returns zero visible products.
- Applied migration `202610030006_catalog_save_status.sql`. Saves now keep status and visibility consistent and validate publication in the same transaction. Existing archived products stay archived when saved unpublished.
- Saved the repeatable import SQL in `catalog-import.sql`. It preserves existing products and category edits, and adds an image only if none exists.

## Import results

The earlier inspection covered ten visible Instagram feed/reel items. Five distinct products were selected; five were inserted, zero existing-product duplicates were found, and all five need commercial review. Product names were identified; the bundle composition remains unverified.

| Product | Category | Images | Status | Missing information |
| --- | --- | ---: | --- | --- |
| Savon de charbon | Savons | 1 | Draft | Price, inventory, SKU, descriptions |
| Déodorant musc | Soins du corps | 1 | Draft | Price, inventory, SKU, descriptions |
| Déodorant oud | Soins du corps | 1 | Draft | Price, inventory, SKU, descriptions |
| Huile de bronzage | Huiles de soin | 1 | Draft | Price, inventory, SKU, descriptions |
| Pack Timomouchin | Coffrets | 1 | Draft | Price, inventory, SKU, contents, descriptions |

Price and stock are stored as zero because the existing schema requires numeric values. These are incomplete draft values, not verified prices or inventory counts. Comparison prices, ingredients, usage instructions, benefits, SEO, and other unverified information remain empty. Categories remain inactive pending review.

## Code changes

- Product editor shows a completion checklist and saves current edits before publishing.
- Product save migration fixes conflicts with the draft/active/archived consistency constraint.
- Storefront catalog queries omit import source metadata.
- Reusable storefront images show a neutral loading background, handle failed images, and reset correctly when the source changes.
- Earlier image audit and large-image replacements are documented in `IMAGE-AUDIT.md`.

## Verification

- Website and admin TypeScript, lint, and production builds passed.
- Ten admin database tests passed, including draft saving, invalid publication rollback, publication, active price changes, image preservation after rejected publication, archived status preservation, RLS, and order transactions.
- Live Supabase profile, catalog rows, image URLs, and anonymous draft visibility verified.
- Opening `/products` without an app session redirects to `/login?reason=session`.

## Remaining interactive checks

The admin sign-in page is open at http://localhost:3001. A user sign-in is still needed to verify the authenticated browser session, dashboard, product/category editor flows, image upload through the admin UI, and realtime order updates end to end. Storage dashboard upload and database tests do not prove those browser flows. No incomplete product was published for testing.
