# VAT: VAT Number Validation API Uses

## What This Endpoint Group Does

This group validates a submitted VAT number and returns a yes/no validity signal plus registered business details when the number is valid. The fields are useful because they connect an identifier supplied by a customer, supplier, or invoice to a registered company name, address, and country code.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/abstract-vat/validate` | Validate a VAT number and return company details. | `vat_number` | `vat_number`, `valid`, `company.name`, `company.address`, `company.country`, `company.code`, example `country.code`, example `country.name` |

## Field Notes

### Inputs

The MPP wrapper accepts a JSON body with required `vat_number`. The original Abstract provider endpoint accepts the same concept as a query parameter, plus the direct-provider `api_key`. The MPP wrapper uses HTTP 402 payment instead of requiring the caller to manage an AbstractAPI key.

### Outputs

The provider docs list `vat_number`, `valid`, `company.name`, `company.address`, `company.country`, and `company.code`. The documented example also includes a top-level `country` object with `code` and `name`. `valid` is the decision field; the company and country fields are the audit trail and enrichment data.

### Important Constraints Or Gaps

The wrapper OpenAPI does not publish a successful response schema, so response fields come from the provider docs. The invalid-number response shape is not fully documented beyond the `valid` boolean. Validation is a compliance aid, not legal or tax advice.

## Use Cases

### Checkout VAT Number Screening

A SaaS, ecommerce, or marketplace checkout can validate a buyer's VAT number before deciding whether to accept it for B2B tax treatment. The workflow submits the provided `vat_number`, checks `valid`, and stores `company.name`, `company.address`, and country fields alongside the order or customer profile.

For a personal buyer managing a small business, the same workflow reduces mistakes when entering VAT details into a vendor checkout. For a business, it reduces manual finance review, catches mistyped or fabricated VAT numbers earlier, and gives support or billing teams a registered company name to compare with the account or invoice entity.

### Invoice And Customer Master Data Cleanup

Finance operations can run VAT numbers collected from customers or vendors through the validation endpoint before importing records into an accounting system. The returned `company.name` and `company.address` help identify mismatches between free-form CRM entries and official VAT records.

This is valuable for cleaning duplicate accounts, detecting stale billing records, and adding a documented validation result to invoice files. The main limitation is that the endpoint does not expose a timestamp or source identifier in the documented response, so teams should record their own validation time.

### Supplier Onboarding Checks

Procurement workflows can validate a supplier's VAT number during onboarding before approving the supplier record. The `valid` flag supports a pass/review decision, while registered company fields help compare the VAT registration with bank-account, contract, or purchase-order information.

For small operators, this can be a simple one-off check before paying an EU supplier. For larger businesses, it can become an automated control that routes mismatches to AP or compliance review instead of silently accepting bad tax identifiers.

### Periodic VAT Record Review

Businesses with recurring EU customers can periodically revalidate stored VAT numbers. The endpoint fields can flag records where `valid` changes or company details no longer match the internal account name and billing address.

The output supports decisions such as requesting updated tax information, pausing reverse-charge handling until details are refreshed, or annotating an account for finance review. The docs do not publish freshness guarantees, so periodic review cadence should be based on internal risk and tax policy.
