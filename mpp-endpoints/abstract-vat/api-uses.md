# VAT API Uses

## Service Summary

The `abstract-vat` MPP service wraps AbstractAPI's VAT Validation and Rates API for paid, per-request access. It covers three practical VAT jobs: validate a VAT number, calculate transaction VAT totals, and look up country-specific VAT categories and rates.

The service is most useful when an agent or internal tool needs occasional EU VAT checks without creating an AbstractAPI account, managing provider API keys, or committing to a monthly plan. It is not a full tax-compliance system; it supplies data fields that checkout, invoicing, finance, and procurement workflows can use.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| VAT Number Validation | 1 | Validate a VAT number and retrieve registered company/country details for checkout, billing, supplier, or customer-record review. | [`api-uses/vat-number-validation.md`](api-uses/vat-number-validation.md) |
| VAT Price Calculation | 1 | Calculate VAT-exclusive amount, VAT amount, VAT-inclusive amount, and VAT rate from amount/country/category inputs. | [`api-uses/vat-price-calculation.md`](api-uses/vat-price-calculation.md) |
| VAT Rate Category Lookup | 1 | Discover country-specific VAT category names, descriptions, and rates before calculating or reviewing VAT. | [`api-uses/vat-rate-category-lookup.md`](api-uses/vat-rate-category-lookup.md) |

## Highest-Value Uses

- Validate customer VAT numbers at checkout and store registered company details with billing records.
- Clean up invoice, supplier, and customer master data by comparing stored names and addresses with returned VAT registration details.
- Calculate VAT-inclusive and VAT-exclusive amounts for EU checkout, quoting, expense, or invoice workflows.
- Map country-specific reduced-rate categories before passing `vat_category` into the calculation endpoint.
- Periodically snapshot category/rate reference data and trigger finance review when rates or descriptions change.

## Personal Use Opportunities

- Check a VAT number before entering it into a vendor checkout or invoice.
- Split a VAT-inclusive receipt into base amount and VAT amount for bookkeeping or reimbursement.
- Estimate the VAT-inclusive cost of a purchase in a specific EU country.
- Look up country-specific categories when deciding whether a purchase might use a reduced VAT rate.

## Business Use Opportunities

- Add VAT validation to account signup, checkout, procurement onboarding, and invoice intake.
- Route invalid or mismatched VAT records to finance review before applying B2B tax handling.
- Generate invoice line totals from returned `amount_excl_vat`, `vat_amount`, and `amount_incl_vat`.
- Build product-tax mapping tables from country category/rate records.
- Let agents perform bounded, paid VAT checks without persistent provider credentials.

## Endpoint Group Summaries

### VAT Number Validation

`POST /abstract-vat/validate` accepts `vat_number` and returns a validity decision plus documented company and country details. The most valuable workflow is screening customer or supplier VAT identifiers before accepting them into billing, accounting, procurement, or compliance records.

Full details: [`api-uses/vat-number-validation.md`](api-uses/vat-number-validation.md)

### VAT Price Calculation

`POST /abstract-vat/calculate` accepts `amount`, `country_code`, optional `is_vat_incl`, and optional `vat_category`. It returns the calculated base amount, VAT amount, inclusive total, rate, category, country code, and country name. This is the operational math endpoint for checkout, quotes, invoices, and receipt breakdowns.

Full details: [`api-uses/vat-price-calculation.md`](api-uses/vat-price-calculation.md)

### VAT Rate Category Lookup

`POST /abstract-vat/categories` accepts `country_code` and returns category/rate records with `country_code`, `rate`, `category`, and `description`. This is the reference-data endpoint for choosing category inputs and reviewing tax mapping assumptions.

Full details: [`api-uses/vat-rate-category-lookup.md`](api-uses/vat-rate-category-lookup.md)

## Field And Data Themes

- Identity fields: `vat_number`, `valid`, `company.name`, `company.address`, `company.country`, `company.code`.
- Country fields: `country_code`, `country_name`, provider example `country.code`, provider example `country.name`.
- Money and rate fields: `amount`, `amount_excl_vat`, `vat_amount`, `amount_incl_vat`, `vat_rate`, category `rate`.
- Category fields: `vat_category`, `category`, `description`.
- Payment fields: all three MPP endpoints carry a per-request payment amount of `6000` with `decimals: 6`, plus Locus docs estimate `$0.006`.
