# Martin Estate Winery: Wine Catalog Browsing API Uses

## What This Endpoint Group Does

This endpoint group lets an agent see which Martin Estate wines are currently exposed through the MPP API and inspect a selected product before purchase. It is the safe, public discovery layer: product ids, slugs, prices, vintage, varietal, category, product descriptions, image URLs, inventory, and per-order quantity caps can be collected without entering checkout, creating an account, performing identity verification, or paying.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/catalog` | List currently purchasable MPP wines | Optional `category` query | `products[]` with `id`, `name`, `slug`, `vintage`, `varietal`, `category`, `price`, `price_cents`, `description`, `image_url`, `in_stock`, `stock_quantity`, `max_quantity_per_order` |
| GET | `/catalog/{slug}` | Retrieve one wine by MPP slug | `slug` path parameter | `product` with the same core product fields and stock quantity |

## Field Notes

### Inputs

`category` can narrow the catalog to `estate-collection`, `library-selections`, or `gifts-large-formats`, although the 2026-05-05 catalog snapshot returned Estate Collection products only. `slug` retrieves a single MPP product record such as `rose-2022`.

### Outputs

The most useful fields are `id` for later purchase requests, `slug` for product detail lookup, `price`/`price_cents` for price comparison, `stock_quantity` and `in_stock` for availability, `max_quantity_per_order` for planning bottle counts, and `description`/`image_url` for buyer-facing recommendations.

### Important Constraints Or Gaps

The OpenAPI file does not define catalog response schemas, so response fields were derived from saved public GET snapshots. The MPP catalog is smaller than the provider's broader Commerce7 storefront snapshots. The `Test Wine` SKU is explicitly described as a payment-testing product and should not be treated as a real shipped wine offer.

## Use Cases

### Personal Wine Selection Before Checkout

A buyer-facing agent can retrieve `GET /catalog`, compare the visible Rose, Bacchanal, Estate Cabernet, and Reserve Cabernet by `price`, `vintage`, `varietal`, `description`, and `stock_quantity`, then present a shortlist before any identity or payment step. The output supports decisions like "buy one bottle now," "choose a lower-priced bottle," or "avoid a product with low stock."

The useful enrichment is concrete: the agent gets the purchase-ready `id`, human-readable tasting notes, bottle cap through `max_quantity_per_order`, and product imagery. The buyer still must be 21 or older, in an allowed US jurisdiction, and willing to complete AgentScore identity verification before purchase.

### Corporate Or Concierge Gift Shortlisting

A corporate gifting coordinator or concierge can use catalog fields to shortlist wines for a recipient without creating a cart. `price_cents` enables budget checks, `max_quantity_per_order` bounds the number of bottles that can be sent in one order, and `description` provides copy for human approval.

This is valuable for teams that need to decide whether a regulated alcohol gift is even feasible before asking an agent to start the purchase flow. The catalog does not validate recipient age, buyer identity, state restrictions, shipping cost, or tax, so it should be used only as a pre-check before the compliant purchase endpoint.

### Inventory-Aware Agent Recommendations

An agent can monitor public catalog availability and keep recommendations grounded in current `in_stock` and `stock_quantity` values. For a personal buyer, this avoids recommending a wine that is unavailable. For a hospitality or concierge business, it helps decide whether to offer Martin Estate as an option for a client request.

The endpoint does not expose historical stock movement or reservation windows, so this is a current-snapshot workflow rather than demand forecasting. If inventory changes between recommendation and purchase, the purchase endpoint and runtime payment flow remain authoritative.

### Product Data Enrichment For Wine Content

The `description`, `vintage`, `varietal`, `image_url`, and price fields can enrich a private wine list, shopping memo, client itinerary, or gift proposal. A person can ask an agent for a concise comparison of visible SKUs; a business can embed approved product context in an internal request workflow.

The API is useful here because it returns product copy and purchase identifiers in one small JSON surface. It is not a complete wine database: appellation, alcohol percentage, critic scores, cellar-window data, and full Commerce7 variant metadata are not present in the MPP response.
