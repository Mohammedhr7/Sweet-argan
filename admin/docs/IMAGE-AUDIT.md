# Sweet Argan image audit

Audit date: 2026-10-02.

## Findings

| Asset | Native size | Classification | Decision |
| --- | ---: | --- | --- |
| `logo.jpg` | 150×150 | Brand mark, small but usable | Keep for the navigation mark only |
| `creams.jpg` | 640×431 | Product packshot, limited resolution | Keep in the small Instagram section; remove from hero and product fallback |
| `collection.jpg` | 480×640 | Product/lifestyle image, limited resolution | Keep only as a small social reference; remove from large story imagery |
| `deodorant.jpg` | 480×640 | Product packshot, limited resolution | Keep only in the small social section |
| `ritual.jpg` | 480×640 | Product/lifestyle image, limited resolution | Keep only as a small social reference |
| `charcoal-soap.jpg` | 640×613 | Product packshot, acceptable for a card | Use only after the image is imported to Supabase Storage |

The local Instagram assets are never used as the website’s large hero or promotional banner. The hero and story areas now use calm editorial blocks until an approved, sufficiently large Supabase Storage image is selected. Product cards use a neutral packshot treatment and a reusable fallback image. The social section is intentionally the only place where the smaller Instagram references remain.

## Runtime image rules

- Product and gallery images come from `product_images.image_url`, which must be a Supabase Storage public URL.
- `StorefrontImage` provides a consistent Next Image wrapper with responsive sizing, quality control, and an error fallback.
- Product cards use `object-contain` with cream padding so inconsistent packshot backgrounds do not crop labels.
- Large editorial areas stay neutral until a reviewed image meets the required dimensions.

## Replacement workflow

Admin users can upload a replacement through the product editor. Saving the product rewrites the ordered `product_images` records, so the first image is the primary image. The upload route converts approved JPG, PNG, or WebP files to WebP and stores them in the `products` Supabase bucket.
