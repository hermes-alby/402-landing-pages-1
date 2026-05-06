# KicksDB: StockX Batch Pricing API Uses

## What This Endpoint Group Does

This group contains the single StockX batch-pricing endpoint. It accepts up to 50 product IDs or SKUs in one JSON body and returns available StockX price records, with an option to include size conversion tables. It is best suited for checking known products in bulk after product discovery has already produced reliable StockX IDs or SKUs.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | /v3/stockx/prices | Get prices in batch from StockX | $schema, market, product_ids, show_sizes, skus | $schema, data, meta |

## Field Notes

### Inputs

The request body includes market, product_ids, skus, and show_sizes. The OpenAPI says at least one of skus or product_ids is required, and each array has a maximum of 50 items. market defaults to US and supports the KicksDB StockX market enum.

### Outputs

The response is a list of StockX price output records. The OpenAPI schemas include price and variant concepts such as product identifiers, variant prices, currency/market context, and optional shoe size conversion structures when requested.

### Important Constraints Or Gaps

The OpenAPI states that when prices are not available, the variant is omitted from the response. That means a client should compare requested IDs/SKUs against returned records to detect missing data instead of assuming a missing item means zero price. This task did not call the endpoint because it is a paid data endpoint.

## Use Cases

### Portfolio Price Refresh For Resellers

A reseller with a watchlist of known StockX product IDs or SKUs can batch 50 items per request and refresh current price signals. The returned prices let them decide which listings need attention, which products have moved into a target buy range, and which items no longer justify monitoring.

For a business, batching is valuable because the workflow starts from internal inventory records, not open-ended search. The endpoint can be scheduled after catalog matching and before repricing rules, with missing returned variants flagged for manual review.

### Inventory Repricing Queue

A store can submit SKUs from its inventory and compare returned StockX prices with internal cost, target margin, and current list price. Items where market price falls below threshold can be queued for markdown; items where market price rises can be reviewed for upward repricing.

The useful fields are product/SKU identifiers, variant/size price records, currency, market, and optional size conversions. The omission behavior for unavailable prices is important: absent results should become a data-quality state, not a price of zero.

### Size-Specific Purchase Decisions

Collectors and sellers often care about a specific size, not the product average. With show_sizes, a workflow can map returned sizes into regional sizing conventions and avoid buying a size whose marketplace price is unattractive even when the general product looks promising.

A business can use this for size curve planning: identify which sizes carry premiums, which sizes are thinly priced, and which sizes should be excluded from automated purchase recommendations.

### Market-Aware Arbitrage Screening

The market input lets a user request pricing in supported StockX markets. A reseller can compare a shortlist across markets and focus on products where the target market's price covers sourcing cost, shipping, fees, and risk.

The workflow still needs external cost and fee data. KicksDB provides market price signals, but it does not decide profitability by itself.
