# PostalForm: Order Quote And Payload Validation API Uses

## What This Endpoint Group Does

This endpoint validates a proposed PostalForm machine-order payload and returns a quote before any payment attempt. It is the planning and guardrail step for single letters, postcards, and bulk campaigns: an agent can check whether the PDF reference, sender and recipient addresses, bulk CSV, templates, mail class, Certified Mail flag, and postcard settings are acceptable, then compare the quoted price and page counts against user or business rules.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/machine/mpp/orders/validate` | Validate an MPP mailing payload and return a quote without payment side effects. | `request_id`, buyer fields, PDF reference, sender address, recipient or `bulk`, print/mail options, postcard fields | `request_hash`, optional reusable `order_id`, validation `status`, `bulk.recipient_count`, `quote.price_usd`, page counts, mail options, provider |

## Field Notes

### Inputs

The most important inputs are the same fields later used for the paid create call: `request_id`, `buyer_name`, `buyer_email`, `pdf`, `sender_name`, sender address strategy, recipient address strategy or `bulk`, and print options. Address fields require a choice between Loqate Address IDs and manual US address objects. Bulk campaigns replace recipient fields with `bulk.csv_content`, `bulk.content_mode`, and a text/html template or shared PDF depending on mode. Postcards require `mailpiece_type: "postcard"` and `postcard_size`.

### Outputs

The `quote` object is the main decision output. It returns `price_usd`, `full_price_usd`, `currency`, `page_count`, `billable_page_count`, `double_sided`, `color`, `mail_class`, `certified`, `mailpiece_type`, `postcard_size`, and `provider`. Bulk validation can also return `bulk.recipient_count` and `bulk.content_mode`, which lets an agent sanity-check CSV expansion before paying.

### Important Constraints Or Gaps

Validation is public documentation research only in this artifact; no POST validation call was made. The schema does not enumerate every possible validation error code or warning. The docs say validation is recommended before payment and has no payment side effects, but a live validation call still submits a full mailing payload, so production agents should treat it as sensitive user data.

## Use Cases

### Cost Preflight Before An Agent Pays

A person could ask an agent to mail a lease notice, demand letter, or government form and set a maximum spend such as "do not spend more than $10." The agent can validate the order first and compare `quote.price_usd`, `quote.page_count`, `quote.billable_page_count`, `color`, `mail_class`, and `certified` against that cap before starting the paid MPP challenge.

For a business, the same preflight becomes a policy gate. An accounts receivable workflow can require standard black-and-white mail under a budget, escalate any `mail_class: "express"` request, or reject unexpectedly high `billable_page_count` values caused by an accidental long attachment. The quote output turns a physical-mail action into an auditable approval decision instead of an opaque paid side effect.

### Address And Payload Quality Gate

An individual sending important mail can use validation to catch malformed manual addresses, non-US state codes, invalid ZIP formats, or a Loqate `Container` ID before money is spent. The fields that matter are `sender_address_type`, `recipient_address_type`, `*_address_id`, `*_address_manual`, and the structured validation errors returned on `422`.

Businesses can use this as an automated data hygiene checkpoint for CRM or billing records. If a recipient row cannot validate, the workflow can route the record to human review, ask for a missing apartment number, or switch from Loqate ID flow to manual address collection before a paid order is attempted.

### Bulk Campaign Sizing And Merge Sanity Checks

For a personal organizer or local club, bulk validation can confirm that a CSV mailing list actually expands to the expected number of recipients through `bulk.recipient_count` and that the intended `bulk.content_mode` is accepted. That prevents a small announcement from accidentally becoming a much larger mail run.

For businesses, this is especially valuable before customer notices, renewal reminders, collections letters, or direct mail. The workflow can compare `bulk.recipient_count` to an approved campaign size, ensure `template_text` or `template_html` is present for merge-field campaigns, and estimate total cost before paying. Missing dependency: the endpoint does not expose row-level merge preview output, so separate preview or sample-render logic would still be needed for content QA.

### Postcard Production Compliance

A person sending event invitations or thank-you postcards can validate that `mailpiece_type` and `postcard_size` are compatible and capture `postcard_guidelines_url` when the order is a postcard. The quote also confirms the normalized `mailpiece_type`, `postcard_size`, color, and page assumptions.

Marketing teams can use this as a production-readiness check for postcard campaigns. Before paying, the automation can require a supported size (`4x6`, `6x9`, `11x6`), reject missing postcard size fields, and confirm that the PDF is treated as a postcard rather than a letter. The validation endpoint does not visually inspect artwork placement in this artifact; PostalForm's postcard PDF guidelines remain a prerequisite.

### Idempotency And Duplicate Draft Control

Individuals may retry an agent task after a network failure. Validation returns `request_hash`, `status`, and possibly an existing `order_id`, allowing the agent to understand whether it is validating a new order or an existing reusable draft.

For business systems, this is a guardrail against duplicate physical mail. A job queue can store `request_id` and `request_hash`, reject payload drift for the same logical mailing, and generate a fresh `request_id` only when the operator intentionally wants a second mailing. This reduces accidental duplicate notices and helps reconcile quote, payment, and fulfillment records.
