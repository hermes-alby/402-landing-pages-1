# KicksDB: Historical Sales And Trends API Uses

## What This Endpoint Group Does

This group returns StockX and GOAT historical sales records and daily sales aggregates. It is the demand and price-movement layer: instead of asking what a product is listed for now, these endpoints show what buyers actually paid, when, in which size or location where documented, and how daily average sale amounts and order counts changed over time.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /v3/stockx/products/:id/sales | Get sales history for a product from StockX | id, variant_id, market, limit, page | $schema, data, meta |
| GET | /v3/stockx/products/:id/sales/daily | Get daily sales data for a product from StockX | id, market, limit, page | $schema, data, meta |
| GET | /v3/goat/products/:id/sales | Get sales data for a product from GOAT | id, limit, page | $schema, data, meta |
| GET | /v3/goat/products/:id/sales/daily | Get daily sales data for a product from GOAT | id, limit, page | $schema, data, meta |

## Field Notes

### Inputs

Inputs are product IDs, optional StockX variant_id, market, limit, and page. GOAT sales require a product ID path parameter. StockX daily and raw sales descriptions say only US and DE are available for those endpoints, although the OpenAPI market enum lists broader market values.

### Outputs

Raw GOAT sales expose amount, currency, location, product_id, purchased_at, size_us, and sale type. Daily aggregate responses expose avg_amount, orders, date, and product_id. StockX sales schemas similarly expose variant sale and daily product sale records through response envelopes.

### Important Constraints Or Gaps

The OpenAPI documents paid access for these history endpoints. Historical retention length is not explicit in the retrieved KicksDB docs for these endpoints. No live paid sales endpoint was called, so examples and edge cases such as empty histories, missing sizes, or currency conversion behavior remain unverified.

## Use Cases

### Buy Timing For Collectors

A collector can pull daily sales aggregates for a product they want and compare avg_amount and orders over recent days. If average sale price is drifting downward while order count remains healthy, they might wait; if orders rise and price accelerates, they may buy sooner.

The raw sales records add size and location context. A buyer looking for a specific US size can avoid relying on a broad product average that may be distorted by rare sizes or regional sales.

### Resale Acquisition Scoring

A reseller can rank candidate SKUs by realized sale prices, order volume, and recent price movement. Products with enough orders, stable avg_amount, and a spread between current available ask and recent sale average can be promoted into a sourcing list.

For a business, this supports rule-based purchasing: only review products where daily order count crosses a threshold, recent average sales exceed target margin, and the relevant market is supported. The endpoint fields are directly tied to demand and price, not just catalog popularity.

### Markdown Detection And Repricing Review

A store can compare its own inventory price to recent marketplace avg_amount and individual sales amount. If market sale averages fall below the store's asking price for several days, the product can be flagged for repricing or promotion.

The daily aggregate form is efficient for trend detection, while raw sales can validate whether the trend is broad or driven by a few unusual transactions. Missing or sparse orders should be treated as low confidence.

### Demand Forecasting For Drops And Restocks

Teams tracking restocks can use daily order counts after a release to estimate demand decay. A product with sustained orders and resilient avg_amount may deserve replenishment or marketing attention; a product with falling order count and price may be lower priority.

The workflow should join sales endpoints with product discovery fields such as SKU, release date, brand, category, and images. The sales endpoints alone do not provide enough merchandising context for a complete forecast.

### Market-Specific Risk Checks

StockX sales endpoint descriptions note market constraints, and GOAT sales include location fields in the schema. A reseller can compare whether apparent profit exists only in a market they cannot serve or source from.

A business can use these fields to avoid treating global-looking demand as local demand. Reports should segment by market/currency where available and document the API's market limitations.
