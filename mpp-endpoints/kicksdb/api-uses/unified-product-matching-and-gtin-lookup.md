# KicksDB: Unified Product Matching And GTIN Lookup API Uses

## What This Endpoint Group Does

This group resolves products across sources. One endpoint returns matched marketplace products for an identifier such as slug, SKU, or product ID with a similarity threshold. The other looks up GTIN/barcode-related records by identifier, SKU, query, source, and sort order. This is the bridge between source-specific catalogs and cross-market comparison.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /v3/unified/products/:id | Get matching products | identifier, market, similarity | $schema, data, meta |
| GET | /v3/unified/gtin | Get GTINs | identifier, identifier_type, sku, query, source, page | $schema, data, meta |

## Field Notes

### Inputs

Inputs include the path :id on the MPP endpoint, mapped to provider identifier in OpenAPI, plus market and similarity. GTIN lookup accepts identifier, identifier_type, sku, query, source, page, limit, and sort.

### Outputs

Unified matching returns matched product records across sources. GTIN lookup returns structured records with source, source_id, identifier, identifier_type, name, size, sku, slug, color, brand, image, price, updated_at, category, link, release_date, retail_price, product_id, and variant_id.

### Important Constraints Or Gaps

The docs say KicksDB's unified algorithm matches products based on SKU, MPN, GTIN, and other identifiers, but may rarely miss products or create false positives. Any automated workflow should preserve the source, identifier type, and similarity threshold used for the match.

## Use Cases

### Cross-Market Product Matching

A collector can enter a known StockX slug or SKU and retrieve matching products across sources to compare availability and price context. This reduces the chance of searching each marketplace manually and missing a differently named listing.

A business can use the endpoint to build a normalized product graph, joining source-specific product IDs under one internal product record. The similarity input controls the tradeoff between broader recall and stricter match quality.

### Barcode And SKU Enrichment

A retailer with barcode scans can use GTIN lookup to resolve product name, brand, source, size, SKU, image, category, release date, retail price, and marketplace link. That can turn a bare inventory scan into a richer product record.

For a business, this is useful for receiving, catalog cleanup, and product-page enrichment. The workflow should store identifier_type and source because EAN/GTIN availability and source confidence may differ by marketplace.

### Price Comparison Cards

A personal shopping app can combine unified product matching with marketplace discovery to show where a product is available and what source-specific price signals exist. Fields like price, retail_price, source, size, link, and updated_at give the app enough context to explain options.

A business can use the same data for comparison widgets or alerts. It must disclose freshness and matching uncertainty: unified matching is computed, not a guarantee of exact equivalence.

### Duplicate Catalog Detection

A store or data team can use GTIN, SKU, slug, source ID, and product ID to find likely duplicate records in its internal catalog. If multiple internal records resolve to the same GTIN or unified match cluster, they can be queued for merge review.

This is valuable because duplicate products fragment sales analytics and inventory. KicksDB can provide external identifiers that are harder to derive from titles alone.

### Source Confidence Review

Analysts can compare matches returned at different similarity thresholds. If a product only appears at a low threshold or lacks strong identifiers like GTIN/SKU, it can be marked lower confidence before being used in automated pricing.

That workflow is especially important for colorways with similar names or reused model families. The API provides matching candidates, but the business should decide which matches are safe enough for automation.
