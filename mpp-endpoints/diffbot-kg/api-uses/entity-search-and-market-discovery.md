# Diffbot KG: Entity Search And Market Discovery API Uses

## What This Endpoint Group Does

This endpoint group searches the Diffbot Knowledge Graph with DQL. A caller supplies a structured query, optional pagination and field filters, and receives matching entity records or facet result rows. It is useful when the user does not already know the exact entity they want and needs to discover candidates, count market segments, or retrieve a curated slice of the public-web entity graph.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/diffbot-kg/search` | Search the KG using DQL and return matching entities or facets. | `query`, `type`, `from`, `size`, `filter`, `jsonmode`, `nonCanonicalFacts` | `hits`, `results`, `kgversion`, `diffbot_type`, `facet`, `data[].entity`, `data[].score`, facet `count`/`value`/bounds |

## Field Notes

### Inputs

The essential input is `query`, a DQL string such as `type:Organization locations.city.name:"San Francisco" nbEmployees>5000`. The wrapper also exposes `type`, `from`, `size`, `filter`, `jsonmode`, and `nonCanonicalFacts`. Official upstream DQL supports more parameters, including export formats, column export specs, article clustering, and reports, but those are not listed in the MPP wrapper docs.

### Outputs

The upstream DQL schema returns response metadata (`version`, `hits`, `results`, `kgversion`, `diffbot_type`, `facet`) and a `data` array. `data[].entity` contains the entity object when the query returns records. Facet queries can instead return fields such as `callbackQuery`, `count`, `value`, `uri`, `upperBound`, and `lowerBound`.

### Important Constraints Or Gaps

The wrapper docs do not publish a detailed 200 response schema. Entity fields are intentionally generic because the returned object depends on entity type and filters. Diffbot credit documentation says Knowledge Graph entity downloads cost 25 credits per record, facet result downloads cost 100 credits, and zero-result KG searches do not consume credits in native Diffbot billing. The MPP wrapper publishes dynamic estimated pricing of `$0.03-$1.50 (25 credits/entity)`.

## Use Cases

### Target Account Discovery For Sales And Partnerships

A sales team can query for organizations that match an ideal customer profile, such as industry, location, employee range, and other public-web attributes, then request a filtered response containing names, domains, locations, employee counts, and origins. A person doing independent consulting could use the same flow to find a shortlist of likely clients in a city or niche. The useful fields are `query`, `size`, `filter`, `hits`, `data[].score`, and `data[].entity` identifiers such as `name`, `diffbotUri`, and `origins`.

The output supports lead routing, account prioritization, territory planning, and manual review queues. The main caveat is that KG entity fields vary by type and source coverage; the caller should filter to fields they actually need and avoid assuming every organization has every attribute.

### Market Mapping And Segment Sizing

An analyst can use DQL to define a market segment, then inspect `hits` or facet rows to understand rough market size, locations, industry distributions, or employee-size buckets. A personal user evaluating a job market or relocation path could search for employers in a region and compare the number of organizations that fit size and category constraints.

Facet-oriented responses matter here because `data[].count`, `value`, `uri`, `upperBound`, and `lowerBound` can turn a query into a summarized market view instead of a raw list. Diffbot docs note a native 100-credit cost for downloaded facet query results, and upstream DQL constrains `from+size <= 10000` for facet queries.

### News And Public-Web Monitoring Seeds

Because the Knowledge Graph can include articles and other public-web entities, a user can search for recent or relevant content around companies, topics, or locations and use the returned entities as a seed list for monitoring. A business can build a watchlist for competitive intelligence, supplier changes, or target-account news; an individual investor or researcher can collect public articles tied to a sector without scraping sites directly.

The value comes from DQL filtering plus returned `entity` data and `entity_ctx` context. Article-specific options such as clustering and deduplication are documented upstream but not in the MPP wrapper, so this use case should stay within wrapper-documented fields unless testing confirms passthrough support.

### Investment And M&A Target Screening

An investor or corporate development team can search for organizations by geography, size, industry labels, and other KG facts to create a first-pass universe of possible acquisition targets or comparable companies. A solo founder or operator could use the same pattern to find peer companies before entering a market.

The fields that matter are `query`, `filter`, `size`, `hits`, and returned company entity facts such as names, employee counts, locations, domains, and source origins when present. The endpoint does not provide valuation, financial diligence, or proprietary transaction data by itself; it supplies public-web entity discovery that needs downstream validation.

### Recruiting Market Research

A recruiting team can query organizations and people-related entities to understand where relevant talent may be concentrated, or to identify companies with public signals related to a role or technology area. A job seeker could query companies in a desired city and size range before building a target-employer list.

The endpoint helps structure broad discovery: `hits` gives scale, `data[].entity` gives candidate companies or people, and `filter` can reduce the response to fields needed for a spreadsheet or matching pipeline. Personal data use should be handled carefully, especially when people entities are involved; the output is public-web-derived, but matching and outreach decisions still need review.

### Data QA For Existing Knowledge Graph Workflows

Teams already using public-web entity data can run DQL checks to compare expected segments against Diffbot KG counts or spot missing categories in internal taxonomies. A data analyst can use `filter` and `jsonmode` to retrieve origin/context fields for a sample and decide whether internal enrichment rules need adjustment.

This use case is valuable because the endpoint exposes both counts and detailed entity records. It does not guarantee a complete schema for every entity type; entity-specific field availability must be sampled and tracked in the consuming pipeline.
