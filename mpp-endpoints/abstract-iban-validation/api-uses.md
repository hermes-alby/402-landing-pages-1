# IBAN Validation API Uses

## Service Summary

IBAN Validation is an MPP-wrapped AbstractAPI service for checking whether an International Bank Account Number is valid. It accepts one `iban` string and, in the captured provider docs, returns the submitted `iban` and Boolean `is_valid`. The direct provider path requires an AbstractAPI account/API key and plan credits; the MPP route offers transactional access through Locus/Tempo payment.

The service is most useful as an early data-quality and payment-readiness gate. It can stop malformed IBANs before they reach payout, direct-debit, supplier, refund, invoice, support, or ERP workflows. It should not be treated as account ownership verification or a guarantee that a payment will settle.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| IBAN Validation And Payment Precheck | 1 | Validate an IBAN before payment, payout, onboarding, refund, vendor, or records workflows rely on it. | [api-uses/iban-validation-and-payment-precheck.md](api-uses/iban-validation-and-payment-precheck.md) |

## Highest-Value Uses

- Precheck marketplace, payroll, affiliate, or supplier payout IBANs before storing them as payment destinations.
- Validate IBANs during SEPA direct debit or recurring billing setup so users can correct mistakes immediately.
- QA invoice and vendor-bank details before payment batches are submitted.
- Reduce refund and reimbursement delays by catching malformed customer IBANs at intake.
- Improve CRM, ERP, and vendor-master data hygiene before migrations, audits, or payment-run launches.
- Help support teams triage payment failures by separating bad IBAN data from processor, compliance, or bank-acceptance issues.

## Personal Use Opportunities

An individual can check an IBAN before sending it to an employer, client, marketplace, subscription provider, or refund processor. The practical benefit is catching a typo before it causes a failed payment, delayed reimbursement, or support exchange.

Personal use should still treat the IBAN as sensitive financial data. The endpoint can indicate validity, but the captured docs do not show account ownership, account status, beneficiary name, or bank acceptance details.

## Business Use Opportunities

Businesses get the most value at intake points where a bad IBAN creates downstream cost: payout onboarding, supplier setup, SEPA mandate collection, invoice ingestion, refund processing, and vendor-master maintenance. The single `is_valid` output supports low-friction branching: continue, ask for correction, queue manual review, or block payment setup until the data is fixed.

The MPP model is useful for sporadic or agent-driven checks that do not justify a direct AbstractAPI subscription. Sustained high-volume usage may fit direct provider plans better because they include bundled request quotas and request-per-second limits.

## Endpoint Group Summaries

### IBAN Validation And Payment Precheck

The single endpoint, `POST /abstract-iban-validation/validate`, accepts `iban` and returns whether the submitted IBAN is valid according to the captured provider docs. Its core job is to convert a raw bank-account identifier into a simple decision signal before the surrounding workflow spends operational effort or initiates payment setup. Full details: [api-uses/iban-validation-and-payment-precheck.md](api-uses/iban-validation-and-payment-precheck.md).

## Field And Data Themes

The request surface is one financial identifier:

- `iban`: the International Bank Account Number to validate. Provider docs say whitespace is accepted.

The documented response surface is narrow:

- `iban`: the submitted IBAN.
- `is_valid`: a Boolean validity result.

MPP payment metadata is also relevant for automation:

- Tempo payment amount `6000`, 6 decimals, estimated by Locus docs as `$0.006` per validation.
