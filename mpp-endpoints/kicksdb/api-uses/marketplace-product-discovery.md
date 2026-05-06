# KicksDB: Marketplace Product Discovery API Uses

## What This Endpoint Group Does

This group searches and retrieves product records from individual KicksDB source indexes: StockX, GOAT, Shopify shops, SNKRS, Kream, and Novelship. It is the discovery and enrichment layer for finding product IDs, slugs, SKUs, brands, names, release dates, images, variants, availability, shops, and source-specific prices before a workflow moves into sales-history, unified matching, batch pricing, or real-time checks.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /v3/stockx/products | Get products from StockX | display[traits], display[variants], display[identifiers], display[prices], display[statistics], query | $schema, data, meta |
| GET | /v3/stockx/products/:id | Get a product from StockX | display[traits], display[variants], display[identifiers], display[prices], display[statistics], id | $schema, data, meta |
| GET | /v3/goat/products | Get products from GOAT | query, slugs, sku, page, limit, filters | $schema, data, meta |
| GET | /v3/goat/products/:id | Get a product from GOAT | id, market | $schema, data, meta |
| GET | /v3/shopify/products | Get products from Shopify | query, shop_name, filters, sort, page, limit | $schema, data, meta |
| GET | /v3/shopify/products/:id | Get a product from Shopify | id | $schema, data, meta |
| GET | /v3/shopify/shops | Get all Shopify shops | none documented | $schema, data, meta |
| GET | /v3/snkrs/products | Get products from SNKRS | query, filters, sort | $schema, data, meta |
| GET | /v3/kream/products | Get products from Kream | query, filters, currency, sort | $schema, data, meta |
| GET | /v3/kream/products/:id | Get a product from Kream | id, currency | $schema, data, meta |
| GET | /v3/novelship/products | Get products from Novelship | query, filters, currency, limit | $schema, data, meta |

## Field Notes

### Inputs

The main inputs are query, filters, sort, page, limit, source-specific IDs or slugs, shop_name, StockX market, and optional StockX display relation toggles. The filter recipe says these search endpoints use Meilisearch-style filters and documents source-specific filterable fields such as brand, sku, product_type, release_date, prices, shop_name, country_code, and status depending on the source.

### Outputs

Outputs center on product identity and merchandising fields: id, slug, sku, brand, name or title, model, colorway, category, product_type, release_date, images, variants, sizes, shop names, and source-specific price/availability structures. Kream exposes useful market fields such as lowest_ask, highest_bid, converted prices, and total_sales in nested variants.

### Important Constraints Or Gaps

The source freshness guide matters for product discovery. StockX and GOAT market data can be hours to a day old depending on market, Shopify stores may be up to 3 days old, and Kream is beta with at-least-weekly refresh. Some OpenAPI schemas intentionally leave flexible objects for source-specific nested price, size, or product data.

## Use Cases

### Release And Assortment Research

A collector can search query=air jordan 1 and filter by brand, product_type, release_date, or country_code to find candidate releases across StockX, GOAT, SNKRS, Kream, and Novelship before deciding what to watch or buy. The returned SKU, slug, release date, images, and product type let the person distinguish similar colorways and avoid comparing the wrong product.

A retailer or marketplace analyst can use the same fields to size a product category: count how many relevant products exist by brand, release season, product type, and shop, then pull detail endpoints for variants and images. That supports buying, catalog QA, and merchandising decisions before deeper price or sales-history analysis.

### Catalog Enrichment For Stores And Marketplaces

A Shopify operator or resale tool can enrich its internal catalog by resolving SKUs or titles against StockX, GOAT, Kream, SNKRS, and Novelship search endpoints. Product fields such as brand, model, colorway, release_date, images, category, and product_type can fill missing catalog attributes and improve search, product pages, and recommendations.

For a business, the value is less manual catalog normalization. KicksDB provides source-specific identifiers and product metadata that can be joined to inventory records, but the workflow should preserve match confidence and source because product naming and SKU conventions vary.

### Source Coverage And Shop Selection

The Shopify shop list endpoint returns shop names, URLs, and product totals. A person looking for niche stores can identify which shops KicksDB tracks and then search only that shop_name for products of interest.

A business can use the same endpoint to decide which Shopify sources to include in a competitive-pricing monitor. The total field helps distinguish broad sources from specialty stores, while the sources guide warns that Shopify data is not always fresh and many shops update Monday, Wednesday, and Friday.

### Size And Availability Screening

Kream and other product detail responses include variant structures with size and availability/price fields. A buyer can check whether a model appears available in the relevant size before spending on a real-time lookup or marketplace visit.

A reseller can pre-screen many candidate products for available variants and current visible price bands, then reserve real-time endpoints for a smaller shortlist where timing and exact asks matter. This reduces paid real-time calls and keeps bulk work on standard search/detail endpoints.

### Regional Market Comparison Setup

StockX inputs include market values, and the sources guide documents supported currencies and maximum latency by market. A user can collect product IDs in one market and repeat queries for supported markets to prepare regional comparison tables.

Businesses can use this to identify where a SKU appears attractive for sourcing or where market coverage is missing. The docs warn that StockX website market/currency behavior can differ from KicksDB's API market handling, so downstream reporting should label source market and currency explicitly.
