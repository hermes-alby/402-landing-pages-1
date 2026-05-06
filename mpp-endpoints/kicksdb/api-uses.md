# KicksDB API Uses

## Service Summary

KicksDB provides sneaker, apparel, and collectible market data across StockX, GOAT, Shopify stores, SNKRS, Kream, Novelship, and related sources. The MPP wrapper exposes 29 endpoints for product discovery, sales history, batch pricing, unified matching, real-time market checks, and one daily CSV export. The strongest use cases are concrete pricing and catalog workflows: deciding when to buy, repricing inventory, enriching product catalogs, comparing marketplaces, and using real-time calls only for final checks where freshness matters.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| [Marketplace Product Discovery](api-uses/marketplace-product-discovery.md) | 11 | Search and retrieve product records from StockX, GOAT, Shopify shops, SNKRS, Kream, and Novelship, including identifiers, brands, names, release metadata, images, variants, availability, and source-specific prices where exposed. | [Full details](api-uses/marketplace-product-discovery.md) |
| [Historical Sales And Trends](api-uses/historical-sales-and-trends.md) | 4 | Retrieve raw and daily aggregated sales histories for StockX and GOAT products to understand resale demand and price movement over time. | [Full details](api-uses/historical-sales-and-trends.md) |
| [StockX Batch Pricing](api-uses/stockx-batch-pricing.md) | 1 | Fetch current StockX prices for up to 50 product IDs or SKUs in one request, including optional size conversion tables. | [Full details](api-uses/stockx-batch-pricing.md) |
| [Unified Product Matching And GTIN Lookup](api-uses/unified-product-matching-and-gtin-lookup.md) | 2 | Resolve products across marketplaces by slug, SKU, product ID, GTIN/barcode, or search query, using KicksDB matching to compare availability and pricing across sources. | [Full details](api-uses/unified-product-matching-and-gtin-lookup.md) |
| [Real-Time Market Intelligence](api-uses/real-time-market-intelligence.md) | 10 | Request current StockX, GOAT, and Alias market data when timing matters: current product data, asks/offers, sales, related StockX products, and recent Alias orders. | [Full details](api-uses/real-time-market-intelligence.md) |
| [Daily Bulk Export](api-uses/daily-bulk-export.md) | 1 | Download the MPP-listed daily CSV snapshot for bulk offline analysis or ingestion. | [Full details](api-uses/daily-bulk-export.md) |

## Highest-Value Uses

- Pre-screen sneaker and streetwear products with standard search/detail endpoints, then spend on real-time checks only for a shortlist where current asks, offers, or orders could change the decision.
- Enrich an internal catalog with SKUs, slugs, images, release dates, brands, product types, variants, and source identifiers from multiple marketplaces.
- Rank resale opportunities using actual StockX/GOAT sales history rather than relying only on current listing prices.
- Batch-refresh known StockX SKUs or product IDs for repricing and watchlist decisions.
- Use unified matching and GTIN lookup to connect marketplace-specific records into a normalized product graph.

## Personal Use Opportunities

Collectors can research comparable products, verify exact SKUs and colorways, watch sales trends before buying, compare marketplace availability, and perform a last-minute real-time price check before purchase. The most useful fields are product identifiers, SKU, release date, image, brand, variant/size, current price signals, historical sale amount, daily average amount, and order count.

## Business Use Opportunities

Resellers, retailers, and data teams can automate catalog enrichment, assortment research, markdown queues, inventory repricing, regional market comparison, source coverage analysis, and bulk dataset ingestion. The business value comes from joining KicksDB outputs to internal inventory, cost, margin, and fulfillment data, then preserving source/freshness context for every decision.

## Endpoint Group Summaries

### Marketplace Product Discovery

Search and detail endpoints across StockX, GOAT, Shopify, SNKRS, Kream, and Novelship provide the product identity and merchandising layer. They are best for catalog enrichment, release research, source coverage review, and building candidate lists before pricing or real-time checks. Full details: [marketplace-product-discovery.md](api-uses/marketplace-product-discovery.md).

### Historical Sales And Trends

StockX and GOAT sales endpoints provide transaction and daily aggregate signals such as sale amount, average amount, orders, size, location, and timestamps. They are best for buy timing, resale scoring, repricing review, and demand forecasting. Full details: [historical-sales-and-trends.md](api-uses/historical-sales-and-trends.md).

### StockX Batch Pricing

The batch pricing endpoint accepts up to 50 product IDs or SKUs and returns available StockX price records. It is best for refreshing known watchlists or inventory SKUs rather than discovering new products. Full details: [stockx-batch-pricing.md](api-uses/stockx-batch-pricing.md).

### Unified Product Matching And GTIN Lookup

Unified matching and GTIN lookup connect source-specific products across marketplaces using identifiers such as slug, SKU, product ID, GTIN/barcode, and source. They are best for normalized product graphs, duplicate detection, barcode enrichment, and marketplace comparison. Full details: [unified-product-matching-and-gtin-lookup.md](api-uses/unified-product-matching-and-gtin-lookup.md).

### Real-Time Market Intelligence

Real-time endpoints cover current StockX, GOAT, and Alias signals for asks, offers, sales, products, related products, and recent orders. They are most valuable as targeted final checks because official docs describe real-time access as paying-user-only, rate-limited to 1 request per second, and not recommended for bulk use. Full details: [real-time-market-intelligence.md](api-uses/real-time-market-intelligence.md).

### Daily Bulk Export

The MPP feed lists a daily CSV snapshot endpoint, but no public OpenAPI schema or CSV column list was found. It may be useful for bulk ingestion and offline analytics if columns are later documented or a paid call is explicitly authorized. Full details: [daily-bulk-export.md](api-uses/daily-bulk-export.md).

## Field And Data Themes

Important identifiers include id, slug, sku, product_id, variant_id, GTIN/barcode identifiers, source_id, and shop_name. Product content fields include brand, title/name, model, colorway, category, product type, images, release date, and tags. Pricing and quantity fields include price, retail price, lowest ask, highest bid, sale amount, average sale amount, orders, rank, weekly orders, and total sales. Freshness and market context are critical: source, market, country, currency, updated timestamp, and source-specific latency determine whether a result is suitable for automated action.
