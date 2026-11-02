# Mate Electricals demo API

A separately deployable, stateless Python/FastAPI service. The shared catalog is in `shared/catalog.json`. All brands, product specifications and INR prices are illustrative. No brand partnerships, real inventory, real orders, payments, message delivery or customer-data storage are claimed.

## Run from the repository root

```sh
python -m venv .venv
. .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --no-access-log
```

For a separately hosted deployment, configure the frontend origin and a platform-provided port explicitly:

```sh
CORS_ORIGINS="https://your-storefront.example" \
MATE_WHATSAPP_NUMBER="919322172834" \
uvicorn backend.main:app --host 0.0.0.0 --port "${PORT:-8000}" --no-access-log
```

Set the frontend's `NEXT_PUBLIC_API_URL` to the deployed backend origin before building the frontend. The WhatsApp default shown above is still unverified; configuration does not verify the number. Keep the repository root as the deployment working directory so `shared/catalog.json` is included. Configure HTTPS at the hosting platform.

Set `CORS_ORIGINS` to a comma-separated list of frontend origins. The default permits localhost port 3000. Set `MATE_WHATSAPP_NUMBER` to an international digits-only number when the business contact has been verified. The configured default `919322172834` remains explicitly unverified.

Use `pytest backend/tests -q` from the repository root. Interactive API docs are at `/docs`.

## Routes and request contracts

- `GET /health`
- `GET /api/categories` → `{categories, demo}`
- `GET /api/products` with `q`, `category`, `brand`, `min_price`, `max_price`, `sort=featured|price-asc|price-desc|name` → `{products,count,currency,demo,pricing_notice}`
- `GET /api/products/{slug}` → product or 404
- `POST /api/cart/quote` with `{items:[{product_id,quantity}]}` → server-calculated INR lines, subtotal, total and demo notice
- `POST /api/demo-checkout` with `{items,customer:{full_name,mobile,email,address,city,state,pin_code},demo_acknowledged:true}` → a demo-only confirmation reference and independently calculated totals; no customer details are echoed or retained
- `POST /api/contact` with `{name,email,phone?,message,demo_acknowledged:true}` → validation-only notice; no message is delivered
- `POST /api/bulk-enquiry` with `{name,company?,phone,requirements,quantity,message?,demo_acknowledged:true}` → encoded WhatsApp link, unverified contact notice; no message is sent automatically

Unknown fields, unknown product IDs, invalid quantities, invalid contacts, invalid PIN codes and inconsistent price ranges are rejected. Cart quantities consolidate across duplicate IDs and cap at 99 per product. Client prices are never accepted.

## Deployment and future commerce

Deploy the entire repository (including `shared/`) to any Python ASGI-compatible host and run the command above. There is no paid API or database requirement. The frontend may bundle the same catalog JSON for a self-contained static presentation and optionally select this API via its configured base URL. A static demo fallback must remain clearly labeled and must not silently claim a successful real backend order.

For a future Shopify implementation, replace the catalog/cart/checkout adapter with Shopify Storefront API operations and real Shopify product IDs. Do not turn this stateless demo confirmation endpoint into an order system without persistence, authentication, stock validation, tax/shipping calculation and a real payment/order workflow. Treat the shared product ID/slug fields as the boundary for that migration.

## Privacy

The API does not persist personal information, send emails, send WhatsApp messages or process payments. Do not enable request-body logging in hosting infrastructure. Checkout and contact validation run in memory only. The demo WhatsApp route returns a link; a visitor must explicitly open WhatsApp and choose whether to send the message externally.
