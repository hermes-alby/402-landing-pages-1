# KicksDB: Real-Time Market Intelligence API Uses

## What This Endpoint Group Does

This group requests current marketplace data from StockX, GOAT, and Alias when timing matters. It covers real-time product search/detail, StockX asks, StockX related products, StockX and GOAT sales, GOAT offers, and Alias recent orders. These endpoints carry higher MPP payment amounts than standard endpoints and should be reserved for targeted checks rather than broad catalog crawling.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /v3/realtime/stockx/products | Get products from StockX in real-time | query, page, currency, country | $schema, data, meta |
| GET | /v3/realtime/stockx/products/:id | Get a product from StockX in real-time | id, currency, country | $schema, data, meta |
| GET | /v3/realtime/stockx/products/:id/asks | Get asks for a product from StockX in real-time | id, type, currency, country, is_variant | $schema, data, meta |
| GET | /v3/realtime/stockx/products/:id/sales | Get sales for a product from StockX in real-time | id, is_variant, currency, country, offset, viewer_context | $schema, data, meta |
| GET | /v3/realtime/stockx/products/:id/related | Get related products for a product from StockX in real-time | id, currency, country, market | $schema, data, meta |
| GET | /v3/realtime/goat/products | Get products from Goat in real-time | query | $schema, data, meta |
| GET | /v3/realtime/goat/products/:id | Get a product from GOAT in real-time | id | $schema, data, meta |
| GET | /v3/realtime/goat/products/:id/offers | Get offers for a product from GOAT in real-time | id, currency, country | $schema, data, meta |
| GET | /v3/realtime/goat/products/:id/sales | Get sales for a product from GOAT in real-time | id, offset, currency, country | $schema, data, meta |
| GET | /v3/realtime/alias/products/:id/recent-orders | Get recent orders for a product from Alias in real-time | id, size, region_id, condition, packaging_condition, consigned | $schema, data, meta |

## Field Notes

### Inputs

Inputs include query, product id or slug, currency, country, viewer_context, offset, and variant-specific selectors such as is_variant. StockX viewer_context supports BUYER and SELLER.

### Outputs

The OpenAPI documents response envelopes for product, asks, offers, sales, related products, and recent orders, but several real-time schemas expose generic data and meta fields without detailed nested properties. The practical output themes are current product state, asks/bids/offers, sales/order records, related products, and market/currency context.

### Important Constraints Or Gaps

The docs say Real-Time API is limited to paying users and rate-limited to 1 request per second, and they recommend it for single requests rather than bulk requests. Many detailed nested response fields are not publicly specified in the OpenAPI snapshot. This research did not call any real-time paid endpoint.

## Use Cases

### Last-Mile Purchase Check

A collector can use standard search and historical sales first, then call a real-time StockX or GOAT detail/ask/offer endpoint immediately before buying. The real-time fields help confirm that the current ask, offer, or product state has not moved since the last standard refresh.

For a business, this last-mile check can sit before an automated purchase recommendation or repricing action. Because real-time requests are costlier and rate-limited, they should be triggered only for candidates that already pass cheaper filters.

### Live Repricing For High-Value Inventory

A seller can run real-time checks on a small set of valuable SKUs before updating list prices. Current asks, offers, and sales context can prevent repricing from stale data when markets move quickly around releases or restocks.

A store can automate a queue: standard catalog and sales-history jobs identify candidates, then real-time endpoints validate current market conditions before a human approves price changes. This respects the docs' warning against bulk real-time use.

### Drop And Restock Monitoring

During a release window, a user can search GOAT or StockX in real time and inspect product records or related products as new listings appear. That supports decisions about whether to buy now, watch a related colorway, or wait for more inventory.

Businesses can use this for event-driven monitoring of launch-day products. The workflow should budget calls carefully because the documented upstream limit is 1 request per second and the MPP feed prices these endpoints higher than standard lookups.

### Spread And Liquidity Review

Real-time asks/offers plus real-time sales let a reseller evaluate spread and liquidity before committing capital. If asks are high but recent sales are sparse or lower, the product may be a poor purchase despite apparent listing prices.

The key value is combining current listing signals with actual transaction/order signals. Where OpenAPI response fields are generic, the implementation should treat nested real-time fields as schema-drift-prone and preserve raw responses if a paid call is ever authorized in a future task.

### Related Product Discovery In Moving Markets

The StockX related-products real-time endpoint can reveal substitute products around the same model or release. A buyer who misses one item can inspect related products while the market is active.

A business can use related products to expand recommendations or hedge inventory decisions. This is stronger when joined back to standard product metadata and sales-history endpoints for context, because real-time related data alone may not explain long-term demand.

### Alias Recent Order Monitoring

Alias recent orders can give a current signal for reseller-facing order activity on a product. A seller can use it to understand whether recent order flow supports changing their ask or prioritizing fulfillment.

For a business, Alias recent orders can be one input into a liquidity score alongside StockX/GOAT sales and asks. Exact nested fields were not publicly documented in the retrieved OpenAPI, so downstream automation should start conservatively.
