# Diffbot KG API Uses

## Service Summary

Diffbot KG wraps Diffbot's Knowledge Graph for paid MPP access. It lets a caller search the public-web entity graph with DQL or enrich known person/company records from partial identifiers. The highest-value use is structured public-web entity data without setting up a Diffbot account, API token, monthly plan, or native credit workflow.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Entity Search And Market Discovery | 1 | DQL search for organizations, people, articles, facets, and market segments. | [api-uses/entity-search-and-market-discovery.md](api-uses/entity-search-and-market-discovery.md) |
| Person And Company Record Enrichment | 1 | Enrich known people or organizations from names, domains, emails, roles, and locations. | [api-uses/person-and-company-record-enrichment.md](api-uses/person-and-company-record-enrichment.md) |

## Highest-Value Uses

The strongest use is account and market discovery: query the Knowledge Graph for organizations matching a target profile, retrieve only useful fields, and route the results into sales, research, investment, or partnership workflows. The second strongest use is enrichment: attach canonical entity records, source origins, and confidence scores to existing CRM, spreadsheet, recruiting, vendor, or research rows.

MPP is most attractive for occasional or workflow-triggered calls where a user wants granular access rather than Diffbot's direct monthly plan and credit model. Sustained high-volume usage may fit direct Diffbot plans better, but MPP improves the access shape for agents and one-off enrichment.

## Personal Use Opportunities

A person can build a target-employer list by searching for companies in a region and size range, enrich a small spreadsheet of companies or public contacts, or monitor public-web article/entity results for a niche research topic. The useful fields are DQL `query`, `filter`, `hits`, returned `entity` identifiers, Enhance `score`, and `origins` for traceability.

Personal workflows should stay conservative around people data. Public-web enrichment still requires judgment, especially for hiring, outreach, or profiling.

## Business Use Opportunities

Businesses can use Search for target account discovery, market sizing, news-monitoring seeds, M&A target screening, recruiting market research, and data QA. They can use Enhance for CRM enrichment, account deduplication, vendor and partner data hygiene, recruiting profile enrichment, and freshness checks on high-value records.

The endpoint outputs support decisions such as which accounts to route, which segments to size, which records to merge, which vendors need review, and which stale profiles deserve refresh. They do not replace due diligence, identity verification, compliance review, or proprietary financial data.

## Endpoint Group Summaries

### Entity Search And Market Discovery

`POST /diffbot-kg/search` accepts DQL query inputs and returns KG metadata plus result rows containing entity objects or facet buckets. It is best for discovering entities the user does not already know, estimating segment size, and producing public-web-backed candidate lists. See [api-uses/entity-search-and-market-discovery.md](api-uses/entity-search-and-market-discovery.md).

### Person And Company Record Enrichment

`POST /diffbot-kg/enhance` accepts partial person or organization identifiers and returns matches with confidence scores and entity records. It is best for attaching structured Knowledge Graph data to existing records in CRMs, spreadsheets, vendor databases, recruiting systems, or research pipelines. See [api-uses/person-and-company-record-enrichment.md](api-uses/person-and-company-record-enrichment.md).

## Field And Data Themes

Search centers on `query`, `size`, `filter`, `jsonmode`, `hits`, `results`, `data[].entity`, and facet fields such as `count`, `value`, and bounds. Enhance centers on `type`, `name`, `url`, `email`, `employer`, `title`, `location`, `refresh`, `threshold`, `data[].score`, `data[].entity`, `request_ctx`, `refreshInfo`, and `searchInfo`.

Across both endpoints, `entity.id`, `diffbotUri`, `name`, aliases, origins, source context, locations, employee counts, and other entity-type-specific facts are the practical data themes. The official schemas intentionally treat the entity object as generic, so consumers should filter and validate fields per workflow.
