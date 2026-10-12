# Rewire SEO pass — 2026-10-11

Scope: US-wide small business. Technical fixes + four service pages. Nothing here is live until you upload it.

## Files to upload (repo root)
- `index.html` (replaces current; includes the intro/video work, hero stats removed, SEO head, links to service pages)
- `services/` (4 new pages: process-optimization, business-intelligence, automation-engineering, technology-transformation)
- `sitemap.xml` (replaces current; real URLs, no `#` fragments)
- `og-image.png` (1200x630 share image)
- `site.webmanifest`
- Keep your existing favicon files; the pages now link to them. Also keep `script.js` (latest) and `Hero_Video.mp4`.

## What changed
| Area | Change |
|---|---|
| Title / description | Homepage title 59 chars, description under 155, plain language, no keyword stuffing |
| Share image | og:image now `og-image.png` (true 1200x630). Old tag pointed at a 416x368 logo declared as 1200x630 |
| Favicons | Head now links favicon.ico, 16/32 PNG, apple-touch-icon, manifest. None were linked before |
| Schema | Organization rebuilt: @id, logo ImageObject, US areaServed, contactPoint, offer URLs. Removed guessed priceRange and empty sameAs |
| Service pages | One H1, unique title/description, ~500 words, FAQ, Service + BreadcrumbList + FAQPage JSON-LD, links to related services and /#contact |
| Internal links | Homepage "Explore" links and footer now point to the service pages |
| Sitemap | 5 URLs, lastmod 2026-10-11 |
| Hero stats | Removed (you said they weren't real); replaced with non-numeric statements of how we work |
| Footer | "Rewiring operations since 2020" -> "Rewiring operations" (unverified claim; restore only if true) |

## Verified (local headless Chromium)
- All 5 pages load, 1 H1 each, JSON-LD parses, no console errors, no horizontal scroll at 1366px and 390px, all internal links resolve.
- Titles ≤60 chars, descriptions ≤155 chars.
- Not verified: live Google indexing, Cloudflare clean-URL behavior (expected: `/services/x` serves `x.html`), the existing `_headers`/CSP (not seen; check it doesn't block anything new), your real favicon images (only filenames seen).

## Needs Andres (manual, in order)
1. Upload files above and deploy.
2. Google Search Console: add the domain property, verify via DNS TXT in Cloudflare, submit `https://www.rewiretransform.com/sitemap.xml`, then request indexing for the 4 service URLs.
3. Pick one host: canonical is `www`. In Cloudflare add a 301 from `rewiretransform.com` to `www.rewiretransform.com`.
4. Claim a Google Business Profile as a service-area business and a LinkedIn company page; add both URLs to `sameAs` in the schema.
5. Add a "Site by Rewire" link on client sites you're allowed to (Chéri, Italgres, JCQ). Real backlinks matter most for a new domain.
6. Restrict the Web3Forms key to your domain.
7. Confirm the Business Diagnostic is a real offer at the terms the FAQ describes; attorney/accountant should confirm any pricing language.

## Realistic timeline
Brand-name searches ("Rewire Business Transformation") can appear within days to weeks of indexing. Non-brand terms like "process optimization for small business" are competitive and typically take months, driven by backlinks and fresh content. Next best step: 2-3 articles answering questions your buyers search.
