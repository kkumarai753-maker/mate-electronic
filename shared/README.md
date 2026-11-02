# Demo catalog contract

`catalog.json` is the single source of truth for the Python API and the statically exportable Next.js storefront. It contains 8 suggested collections and 16 representative products. It is **not a verified inventory list** for the physical shop.

Every product has `id`, `slug`, `name`, `category`, `brand`, numeric `price` in INR, `image`, `images`, `description`, string-to-string `specs`, optional `badge`, and boolean `featured` / `trending` flags. Category IDs match product `category` values. IDs and slugs are stable string identifiers suitable for the demo cart boundary.

- `Mate Select`, `Luma Demo`, and `Core Demo` are fictional labels used to demonstrate brand filtering. They do not claim stock availability or an authorised partnership.
- Prices and specifications are illustrative; confirm all real purchasing details with the shop.
- Product graphics represent the stated category and are not photographs of real stock.
- Images resolve to bundled `/assets/` files. `images` is a gallery array. Products have one representative product image plus a generic specification checklist; no alternate model photographs are invented.
- No fake customer reviews, ratings, sales counts, historic prices or stock quantities are supplied.
