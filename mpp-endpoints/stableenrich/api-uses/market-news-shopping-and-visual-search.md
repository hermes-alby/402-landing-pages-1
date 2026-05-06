# StableEnrich: Market News, Shopping, And Visual Search API Uses

## What This Endpoint Group Does

Use Serper-backed Google News, Shopping, and Lens-style reverse image search for market monitoring, product comparison, and image source discovery.

The Serper endpoints all wrap Google vertical search surfaces and support commercial monitoring rather than deep profile enrichment.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/serper/news` | Serper - Google News search ($0.04) | q, num, gl, hl, location | searchParameters, searchParameters.q, searchParameters.gl, searchParameters.hl, searchParameters.num, searchParameters.type, news, news.position |
| POST | `/api/serper/shopping` | Serper - Google Shopping search ($0.04) | q, num, gl, hl, location | searchParameters, searchParameters.q, searchParameters.gl, searchParameters.hl, searchParameters.num, searchParameters.type, shopping, shopping.position |
| POST | `/api/serper/lens` | Serper - Google Lens reverse image search ($0.2) | url, gl, hl | searchParameters, searchParameters.q, searchParameters.gl, searchParameters.hl, searchParameters.num, searchParameters.type, organic, organic.position |

## Field Notes

### Inputs

- `q`
- `url`
- `num`
- `gl`
- `hl`

### Outputs

- `news results`
- `shopping results`
- `visual matches`
- `titles`
- `links`
- `snippets`
- `prices when returned`
- `images when returned`
- `source domains`

### Important Constraints Or Gaps

- The OpenAPI schema does not enumerate every Serper upstream response field.
- Shopping prices and availability can change quickly and should be treated as point-in-time signals.
- Endpoints in this group cost /api/serper/news: $0.04; /api/serper/shopping: $0.04; /api/serper/lens: $0.2.

## Use Cases

### News Monitoring For Decisions

A person can track news about a company, policy, product, or event with query, country, language, and result count fields, then review titles, links, snippets, and dates when returned. This supports decisions such as whether to buy, travel, apply, or contact someone.

Businesses can monitor competitors, customers, vendors, funding announcements, incidents, or regulatory topics. Because news changes quickly and Serper response fields are not fully enumerated in the OpenAPI snapshot, results should be treated as point-in-time discovery, not a complete archive.

### Product Price And Merchant Comparison

A shopper can use shopping search to compare product titles, merchants, prices, images, and links when returned by the upstream response. Country and language parameters help localize results.

E-commerce, procurement, and pricing teams can use this for spot checks on market prices, listing quality, assortment, and competitor coverage. Shopping prices and availability can change quickly, so automations should record retrieval time and verify before acting.

### Reverse Image Source And Product Discovery

A person can pass a public image URL to Lens search to find visually similar pages, products, or source contexts. This can help identify an item, trace where an image appears, or find alternatives.

Brands and marketplaces can use it for catalog enrichment, counterfeit scouting, creative sourcing, or UGC moderation triage. It requires a public image URL and should not be treated as proof of ownership or infringement without human review.
