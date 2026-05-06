# Diffbot: Commerce And Listing Extraction API Uses

## What This Endpoint Group Does

This endpoint group turns public commerce and listing pages into structured records. The Product endpoint is for a single product detail URL and returns product-centered fields such as title, price, availability, identifiers, brand, category, images, breadcrumbs, and optional discussion/review context. The List endpoint is for repeated-item pages such as category pages, search results, directories, indexes, job boards, or event lists; it returns extracted objects whose fields depend on the detected item type.

Both endpoints accept the same MPP wrapper body shape: a required `url`, optional `fields` for extra metadata such as `links`, `meta`, `querystring`, `breadcrumb`, and `quotes`, optional `timeout`, and optional `discussion`. The wrapper OpenAPI only documents successful and payment-required status descriptions, not a full 200 response schema, so output-field reasoning here uses the local endpoint inventory plus Diffbot's public ontology/reference snapshots.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/diffbot/product` | Extract ecommerce product data from one public product page. | `url` required; optional `fields`, `timeout`, `discussion`. | `objects[].title`, `offerPrice`, `regularPrice`, `offerPriceDetails`, `regularPriceDetails`, `availability`, `brand`, `sku`, `gtin`, `upc`, `mpn`, `isbn`, `productId`, `gs1Code`, `category`, `breadcrumb`, `images`, `pageUrl`, `resolvedPageUrl`, `crawlTimestamp`, optional `discussion`. |
| POST | `/diffbot/list` | Extract repeated structured items from a listing, search-result, category, index, or directory page. | `url` required; optional `fields`, `timeout`, `discussion`. | `objects[]` with item fields that vary by detected item type; commerce listings may include product-like fields such as `title`, `offerPrice`, `regularPrice`, `availability`, `brand`, `sku`, `category`, `images`, `pageUrl`, and `resolvedPageUrl`; non-commerce lists may include article, image, video, event, or job fields. |

## Field Notes

### Inputs

`url` is the controlling input. For `/diffbot/product`, the URL should be a product detail page. For `/diffbot/list`, it should be a page whose main content is repeated items, such as a category page, search result, marketplace listing, or directory page.

`fields` is a comma-separated string for extra return fields. The wrapper inventory records the documented enum values as `links`, `extlinks`, `meta`, `querystring`, `breadcrumb`, and `quotes`. For commerce work, `breadcrumb` is especially useful because it can provide source-site category context; `links`, `extlinks`, `meta`, and `querystring` can help preserve provenance and routing context.

`timeout` is a number in milliseconds, with `30000` documented as the default example. `discussion` is a boolean to request comment/discussion extraction; the Locus field description says "default true for article", so its exact default and value on product/list pages should be treated as wrapper-specific until verified.

### Outputs

Product outputs center on identity, price, availability, catalog context, media, and provenance. Key identity fields are `id`, `diffbotUri`, `pageUrl`, `resolvedPageUrl`, `sku`, `gtin`, `upc`, `mpn`, `isbn`, `productId`, and `gs1Code`. Key commercial fields are `offerPrice`, `regularPrice`, `shippingAmount`, `saveAmount`, and the `PriceDetails` variants `offerPriceDetails`, `regularPriceDetails`, and `saveAmountDetails`, which can carry amount text and currency details when present. Product context fields include `title`, `text`, `brand`, `category`, `breadcrumb`, `productOrigin`, `language`, and `images`. `availability` is documented as a boolean in the ontology.

List outputs are intentionally less fixed. The endpoint extracts repeated page items, so a commerce listing may return product-like objects while another listing may return articles, images, videos, events, or job posts. For commerce and marketplace use, downstream code should inspect `objects[].type` and preserve raw objects before normalizing to a product schema.

### Important Constraints Or Gaps

The MPP endpoints are paid per request. The local inventory records estimated cost as `$0.004` and OpenAPI `x-payment-info.amount` as `4200` using the Tempo currency address `0x20c000000000000000000000b9537d11c60e8b50`. This research did not call paid endpoints or settle payments.

The MPP OpenAPI documents request bodies and `200`/`402` statuses but does not publish detailed 200 response schemas. Response fields are derived from Diffbot public ontology and reference snapshots, and Diffbot notes ontology fields are not guaranteed to exist in every record.

Price fields may be strings or structured `PriceDetails`; currency, locale formatting, sale-price semantics, and availability wording can vary by source site. Treat these as extracted facts requiring normalization and validation before automated pricing decisions.

The List endpoint's schema varies by detected item type. It is valuable for broad discovery, but it is weaker than `/diffbot/product` when the workflow requires a strict product-detail schema.

Neither endpoint provides documented per-field confidence, per-field freshness beyond crawl/request context, source licensing rights, exact nullability, or wrapper-specific failure/error body details in the reviewed local sources.

## Use Cases

### Competitive Price And Availability Checks

A shopper can compare a short list of product URLs by extracting `title`, `brand`, `offerPrice`, `regularPrice`, `shippingAmount`, `saveAmount`, `availability`, `images`, and `pageUrl` into a small comparison table. A retailer or ecommerce analyst can use the same fields to monitor competitor product pages and flag when a rival lowers an `offerPrice`, changes stock status, or shifts a product into a different visible category.

The useful automation is not just "scrape the page"; it is converting inconsistent product pages into comparable records. Price outputs still need currency and locale normalization, and any automated repricing should verify that the URL still represents the same SKU or product identifier before acting.

### Marketplace Catalog Normalization

A business that receives supplier or marketplace URLs can use `/diffbot/product` to prefill catalog records with `title`, `brand`, `sku`, `gtin`, `upc`, `mpn`, `isbn`, `category`, `breadcrumb`, `text`, and `images`. An individual reseller could use the same workflow to create draft inventory records from public product pages before manually checking condition, shipping constraints, and compliance.

The key value is reducing manual data entry while preserving identifiers and source URLs for review. The main limitation is that some identifier fields may be missing, deprecated, or source-specific, and the ontology explicitly warns that fields are not guaranteed in every record.

### Category And Search Result Discovery

The `/diffbot/list` endpoint can structure category pages, search result pages, product grids, and directories into `objects[]` rather than forcing a user to hand-copy item names and links. A person could monitor a niche marketplace category for newly listed items. A business could discover candidate products from retailer category pages, then send promising item URLs through `/diffbot/product` for richer price, identifier, and availability fields.

This is strongest as a two-step workflow: list extraction for discovery, product extraction for detail. The List endpoint may return mixed or type-specific objects, so downstream code should check `objects[].type`, retain raw records, and route only product-like items into commerce normalization.

### Assortment And Merchandising Audits

Retail, brand, or channel teams can use product outputs such as `brand`, `category`, `breadcrumb`, `title`, `images`, `offerPrice`, `regularPrice`, and `availability` to audit whether products appear in the expected category and whether page content reflects the intended assortment. A smaller seller can use the same fields to confirm that their own listings still show the correct title, image set, category path, and sale price.

The returned fields support decisions like fixing product copy, escalating missing imagery, reviewing category placement, or investigating availability mismatches. This use case depends on page freshness and on the source site exposing the relevant data publicly.

### Review And Discussion Signal Collection

When `discussion` returns product discussion or review context, fields under `objects[].discussion` can provide post counts, participant counts, post text, authors, dates, sentiment, tags, and images. A consumer might use this to summarize public buyer feedback before purchase. A brand or marketplace operator could use it to triage products that have high discussion volume, negative sentiment, or recurring complaint terms.

This should be treated as optional enrichment, not a guaranteed product field. The wrapper does not document exact nested `discussion` behavior for product/list pages, and extracting user-generated content may raise privacy, terms-of-service, and content retention concerns.

### Product Image And Content QA

`images`, `title`, `text`, `brand`, `category`, and `breadcrumb` let a team check whether public product pages contain expected merchandising assets and descriptive content. An individual seller can use the same fields to detect stale or missing images on their own listings, while a business can sample partner pages for brand compliance or incomplete PDP content.

The endpoint does not provide image rights or licensing metadata, so image URLs should be used for QA and review unless the caller separately has rights to reuse them. Missing `images` should be handled as an extraction or page-design signal rather than immediate proof that the source page has no imagery.

### Product Identifier Reconciliation

Fields such as `sku`, `gtin`, `upc`, `mpn`, `isbn`, `gs1Code`, `productId`, `brand`, and `title` can help reconcile records across vendor feeds, retailer pages, and internal product catalogs. A person managing a small inventory can use extracted identifiers to reduce duplicate entries; a business can use them to map competitor listings or supplier pages to an internal canonical product.

This is high value when identifiers are present and stable. It is weaker when sites omit identifiers, use marketplace-specific SKUs, or publish ambiguous product titles. Automated matching should combine identifiers with title, brand, category, image, and manual review thresholds.
