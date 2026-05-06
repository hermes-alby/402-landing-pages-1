# VAT: VAT Price Calculation API Uses

## What This Endpoint Group Does

This group calculates VAT amounts for a transaction using an amount, country, and optional reduced-rate category. It can compute totals when the input amount excludes VAT, and it can reverse-calculate the base amount and VAT amount when the input already includes VAT.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/abstract-vat/calculate` | Calculate VAT-compliant transaction amounts for a country and optional category. | `amount`, `country_code`, optional `is_vat_incl`, optional `vat_category` | `amount_excl_vat`, `vat_amount`, `amount_incl_vat`, `vat_rate`, `vat_category`, `country_code`, `country_name` |

## Field Notes

### Inputs

`amount` and `country_code` are required. `is_vat_incl` is optional and defaults to false in the provider docs; when true, it supports reverse calculation from a VAT-inclusive total. `vat_category` is optional and can request a reduced rate for qualifying categories.

### Outputs

The endpoint returns the monetary fields needed for invoice or checkout math: amount excluding VAT, VAT amount, and amount including VAT. It also returns the rate, category, country code, and country name so downstream systems can explain which tax basis was applied.

### Important Constraints Or Gaps

The wrapper OpenAPI lacks a 200 response schema. The provider docs do not state monetary rounding rules, decimal precision, or supported currencies because the input is just an amount. The `vat_category` should be chosen carefully; eligibility depends on country-specific rules and the categories endpoint is the practical discovery source.

## Use Cases

### Checkout Tax Total Calculation

An ecommerce or SaaS checkout can call the calculation endpoint after it knows the customer's VAT country and taxable amount. The workflow sends `amount` and `country_code`, optionally includes `vat_category`, then displays or records `amount_excl_vat`, `vat_amount`, `amount_incl_vat`, and `vat_rate`.

For an individual selling digital goods or services, this avoids hand-calculating VAT by country. For a business, it makes checkout totals auditable and gives finance systems the fields they need for invoice line items and tax reporting. The missing rounding rules mean teams should define their own final rounding policy before charging or posting accounting entries.

### VAT-Inclusive Receipt Breakdown

When a vendor invoice or receipt already includes VAT, a workflow can set `is_vat_incl` to true to split the total into base amount and VAT amount. The returned `amount_excl_vat` and `vat_amount` can populate expense, reimbursement, or bookkeeping records.

This is useful for a freelancer categorizing EU receipts and for businesses ingesting invoices from many suppliers. It reduces manual spreadsheet work and produces a consistent breakdown. The workflow still needs to verify that the right `country_code` and category were chosen.

### Quote And Contract Pricing Review

Sales or procurement tools can compare quoted prices across EU countries by calculating VAT-inclusive totals from the same base `amount`. The returned `vat_rate` and `country_name` make it clear why the final amount differs by jurisdiction.

For personal budgeting, this helps estimate the real cost of a cross-border purchase. For businesses, it helps produce more accurate quotes, avoid margin surprises, and decide whether to show VAT-inclusive or VAT-exclusive pricing in a proposal.

### Reduced-Rate Product Handling

Catalog or invoicing systems can pass `vat_category` for goods that may qualify for reduced VAT rates, such as country-specific categories returned by the categories endpoint. The returned `vat_rate`, `vat_category`, and monetary totals let the system apply a category-specific tax treatment and preserve the reason for it.

The value is strongest when product taxonomy is already mapped to VAT categories. Without that mapping, the endpoint cannot decide whether a product legally qualifies for a reduced rate; it only calculates from the category supplied.
