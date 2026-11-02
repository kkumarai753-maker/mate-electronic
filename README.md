# MATE ELECTRICALS — premium e-commerce demo

A multi-page Next.js storefront for an electrical and lighting retailer in Hingna, Nagpur, with a separately deployable Python/FastAPI demonstration API. This is an owner-presentation demo: product prices, specifications and fictional demo brand labels are illustrative. It does not take payments, place real orders or require a database.

## What is included

- Home page with a product slider, category shopping, featured collections and project enquiry sections.
- Shop catalog with live search, category/brand/price filters and sorting; eight collection pages and sixteen product pages.
- Product galleries, quantity controls, local cart, wishlist and a demo checkout confirmation.
- About, Contact, Categories and Bulk Enquiry pages, including encoded WhatsApp enquiry links.
- Original SVG ME monogram and wordmark variants, responsive layouts, bundled imagery and local-storage persistence for product IDs and quantities.

## Run the frontend

From the repository root, use Node.js 20.9 or later:

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. React and Next.js handle the interface; the frontend uses TypeScript, Tailwind CSS and Lucide icons.

```sh
npm run typecheck
npm run build
# After building:
npm run test:e2e
python -m pytest backend/tests -q
```

`next.config.ts` enables `output: 'export'`, trailing slashes and unoptimized local images. The build creates a complete static website in **`out/`**, including the generated product and collection routes. To review that production output locally:

```sh
python -m http.server 3000 --directory out
```

`npm start` serves the static export on port 3000 using the Python standard-library HTTP server. `next start` is not the production server for this static-export configuration. Deploy `out/` to a static host, or import the root project into Vercel using the Next.js preset and `npm run build`. All catalog routes are pre-generated; no Next.js server is required by the demo.

## Optional Python API

The storefront works without an API for a self-contained presentation. Leave `NEXT_PUBLIC_API_URL` unset to use the clearly labeled **Browser demo** adapter in `lib/api.ts`.

To use Python-backed calculations and form validation, run the separate service from the repository root:

```sh
python -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
CORS_ORIGINS="http://localhost:3000" uvicorn backend.main:app --host 0.0.0.0 --port 8000 --no-access-log
```

Create `.env.local` from `.env.example`, set `NEXT_PUBLIC_API_URL=http://localhost:8000`, then restart development or rebuild the static frontend. Public Next.js environment values are embedded at build time.

The configured API handles trusted cart price calculations, checkout validation, contact-form validation and encoded bulk enquiry links. Catalog pages still use the shared bundled JSON so the presentation remains statically exportable. `backend/README.md` documents all endpoints, payloads, CORS and ASGI deployment settings.

**The hosted Sites deployment contains the static frontend only. It does not run or deploy Python.** Deploy the API separately to an ASGI-compatible host, allow the exact frontend origin through `CORS_ORIGINS`, set `NEXT_PUBLIC_API_URL` to that HTTPS backend origin and rebuild the frontend to connect them. An API failure is reported as an error; the application does not silently claim a successful backend checkout.

Run API checks with:

```sh
python -m pytest backend/tests -q
```

## Demo behavior and privacy

Checkout validates customer fields and shows a reference beginning with `DEMO-`. It does not collect payment or submit a real order. Contact forms validate inputs but do not deliver email. Form fields are held in memory; the demo does not persist customer names, phone numbers, email addresses or addresses. Cart and wishlist storage contains only product identifiers and quantities. The Python API is stateless and does not retain customer submissions.

WhatsApp links prepare an encoded message. Opening the link and choosing to send it is a separate action by the visitor, outside the application. The contact number remains prominently marked unverified. No WhatsApp message is sent automatically.

## Content, contacts and imagery

- Business name: **MATE ELECTRICALS**. Location supplied by the user: Hingna, Nagpur, Maharashtra, India.
- WhatsApp: **9322172834**; mobile: **8668649168**. Both were supplied as extracted from photographs and remain **unverified**. Confirm them with the owner before production use. Frontend configuration is in `lib/catalog.ts`; the API WhatsApp destination is configurable through `MATE_WHATSAPP_NUMBER`.
- The shop-location link was supplied by the user. It is linked externally; the website does not claim an independently verified address or use a fabricated live map.
- Actual shop photographs are **not available in the supplied workspace**. The only available attachments are the NEXORA and TECHVERSE design-reference screenshots. They are not presented as Mate Electricals store photos. Gallery spaces remain honest about that limitation.
- Product SVGs are original illustrations. `public/assets/hero.png` and `interior.png` are generated illustrative campaign/interior visuals, not verified product or store photography. Preserve this distinction if replacing content. `public/assets/SOURCES.md` records provenance.
- Do not infer actual brands, stock, safety certifications, partnerships, reviews or business history from this demonstration.

## Brand assets

SVG assets are in `public/brand/`:

- `horizontal-light.svg`: horizontal logo for light backgrounds.
- `horizontal-dark.svg`: horizontal logo for dark backgrounds.
- `monogram.svg` and `monogram-dark.svg`: compact ME identities.
- `favicon.svg`: compact browser mark with a navy background for legibility.

The wordmark and monogram variants use transparent SVG backgrounds. The favicon deliberately uses a filled background.

## Project structure

```text
app/                 Next.js routes and responsive global styles
components/          Shared storefront and form components
lib/catalog.ts       Typed catalog and business configuration
lib/api.ts           Browser-demo / Python-API adapter boundary
shared/catalog.json  Shared category/product source of truth
public/assets/       Bundled product and campaign imagery
public/brand/        Original SVG logo variants and favicon
backend/             FastAPI service, tests and deployment notes
out/                 Generated static export (not tracked)
```

`shared/catalog.json` defines categories and products with stable IDs/slugs, INR prices, matching images, specifications and featured/trending flags. See `shared/README.md` for the schema and demo-label rules. Update that file once and rebuild to keep the storefront and Python calculations aligned.

For a future Shopify implementation, replace the catalog/cart/checkout adapter with Shopify Storefront API operations and map demo IDs to real Shopify product/variant IDs. A real launch also needs verified catalog content and contacts, real inventory, tax/shipping rules, order persistence and payment/checkout integration. No Shopify connection or production commerce capability is claimed by this demo.

## Browser verification

`npm run test:e2e` runs the Playwright suite against the static build. Install a browser with `npx playwright install chromium` on a fresh machine. The configuration uses system Chromium when available. Tests cover routes, local image loading, navigation, filters, sorting, cart totals, persistence, wishlist moves, checkout validation, no personal-data storage, WhatsApp encoding, and mobile overflow.
