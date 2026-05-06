# VAT: VAT Rate Category Lookup API Uses

## What This Endpoint Group Does

This group returns VAT category and rate reference data for a country. It helps a workflow discover which category names and rates are available before calculating VAT or reviewing whether a transaction used the expected rate.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/abstract-vat/categories` | List VAT categories and rates for a country. | `country_code` | Array records with `country_code`, `rate`, `category`, `description` |

## Field Notes

### Inputs

The endpoint requires a `country_code`, documented as an ISO 3166-1 alpha-2 country code. The overview docs list supported countries for VAT endpoints, including many EU countries plus Northern Ireland (`XI`).

### Outputs

The provider docs show a JSON array of category objects. Each object includes the country code, VAT `rate`, category name, and description. Examples include standard and reduced-rate categories such as books or picture art.

### Important Constraints Or Gaps

The wrapper OpenAPI does not publish a 200 response schema. Provider examples show `rate` as a string such as `0.190`, so downstream systems should parse carefully if numeric math is needed. The docs do not publish an update cadence, effective date, or expiry date for category data.

## Use Cases

### Product Tax Category Mapping

An ecommerce catalog or billing system can fetch categories for each selling country and map product categories to returned VAT categories. The `category` and `description` fields help a human tax or finance operator choose candidate mappings, while `rate` shows the financial impact.

For a small shop, this can support a lightweight product tax checklist before launch. For a larger business, it can seed internal mapping tables that later feed the calculation endpoint. The endpoint does not decide legal eligibility; it supplies country reference data that a business must interpret.

### Checkout Category Selector

A checkout or admin tool can use the categories endpoint to populate country-specific VAT category options. After a user selects a category, the system can pass that `vat_category` into the calculation endpoint and keep the category description for audit context.

This is valuable when agents or operators need to create invoices for unusual goods and cannot rely on a fixed global category list. The main limitation is that the docs do not expose effective dates, so the UI should avoid presenting the data as legal guidance without internal review.

### Tax Rate Drift Review

Finance teams can periodically snapshot categories by country and compare current `rate`, `category`, and `description` values against prior snapshots. Differences can trigger review of product mappings, invoice templates, and checkout tax behavior.

This is useful for businesses operating across several EU jurisdictions. The endpoint output gives the basic reference-data fields needed to detect changes, but the docs do not provide change reasons or official effective dates, so any detected drift should be reviewed against tax authority or adviser sources.

### Pre-Calculation Validation For Agents

An agent that needs to calculate VAT can first call categories for the target country, inspect category names and descriptions, and only pass a `vat_category` to the calculation endpoint when a matching category is found. If no match exists, it can fall back to standard-rate calculation or ask for human input.

This reduces bad assumptions in autonomous workflows. It also lets an agent explain which category and rate it used. The workflow should record the category response or retrieval date because the endpoint does not return its own timestamp.
