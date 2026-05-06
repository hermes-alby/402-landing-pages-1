# PostalForm API Uses

## Service Summary

PostalForm lets agents create real physical mail orders: letters, postcards, documents, and bulk campaigns. Its cataloged MPP API is a first-party machine-payment surface on `postalform.com`: validate the mailing payload and quote it, create the order through an HTTP 402 payment challenge, then poll fulfillment status.

The most valuable use is not generic mail tracking. It is controlled conversion of digital workflow decisions into paid physical mail, with quote-before-pay, idempotency, payment metadata, and fulfillment state available to the agent.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Order Quote And Payload Validation | 1 | Validate a letter, postcard, or bulk campaign and get a dynamic quote before any payment attempt. | [order-quote-and-payload-validation.md](api-uses/order-quote-and-payload-validation.md) |
| Paid Mail Order Creation | 1 | Create or reuse a machine order, answer the MPP challenge, and initiate print-and-mail fulfillment. | [paid-mail-order-creation.md](api-uses/paid-mail-order-creation.md) |
| Fulfillment Status And Tracking | 1 | Poll payment and fulfillment state, completion URL, and bulk campaign dashboard link. | [fulfillment-status-and-tracking.md](api-uses/fulfillment-status-and-tracking.md) |

## Highest-Value Uses

- Send important personal or business letters only after quote, address, PDF, and payment checks pass.
- Automate accounts receivable, collections, legal-notice, customer-notice, and compliance mail workflows with a paid physical-mail fulfillment step.
- Run small or operational bulk campaigns from CSV data while validating recipient count and cost before payment.
- Bridge digital agents and physical mail while preserving `request_id`, `order_id`, quote, payment, and fulfillment metadata for audit and retry control.
- Support postcard campaigns where an agent can validate size and mailpiece metadata before and after paid creation.

## Personal Use Opportunities

A personal agent can help a user send a physical letter, document packet, or postcard without forcing them through a manual checkout. The agent should validate first, show or enforce the quoted price, confirm addresses and document intent, then use the create endpoint only after explicit payment authorization.

The strongest personal workflows are high-friction tasks: notices to landlords or companies, reimbursement or insurance packets, administrative appeals, cancellation letters, event postcards, and other mail that benefits from a durable physical trail. Status polling lets the agent report whether payment settled and where the order stands.

## Business Use Opportunities

Businesses can integrate PostalForm into systems that already decide when a physical notice should be mailed: CRM, billing, support, receivables, compliance, and campaign tools. Validation can enforce policy before spend; create can turn an approved record into a paid mailing; polling can reconcile payment and fulfillment.

The bulk fields make PostalForm useful for CSV-backed customer communications, but the public MPP status endpoint does not expose row-level campaign data. It returns `campaign_url`, so some operational follow-through may still rely on the PostalForm dashboard.

## Endpoint Group Summaries

### Order Quote And Payload Validation

The validation endpoint is the no-payment planning step. It accepts the full order payload and returns a quote with price, page counts, mail options, provider, and bulk metadata. Use it for cost caps, address and payload checks, bulk recipient-count checks, postcard readiness, and duplicate-draft control. Full details: [api-uses/order-quote-and-payload-validation.md](api-uses/order-quote-and-payload-validation.md).

### Paid Mail Order Creation

The create endpoint is the payable action. It returns a 402 MPP challenge when called without a credential, then accepts a paid retry with the exact same body and `request_id`. It supports single letters, postcards, and bulk campaigns, and returns order/payment metadata after payment. Full details: [api-uses/paid-mail-order-creation.md](api-uses/paid-mail-order-creation.md).

### Fulfillment Status And Tracking

The status endpoint is the read-only follow-up. It accepts an `order_id` or aliased `request_id` and returns payment status, fulfillment step, payment metadata, completion URL, postcard metadata, and optional bulk `campaign_url`. Use it for user updates, finance reconciliation, operational queues, and retry decisions. Full details: [api-uses/fulfillment-status-and-tracking.md](api-uses/fulfillment-status-and-tracking.md).

## Field And Data Themes

- Identity and idempotency: `request_id`, `request_hash`, `order_id`, `payment_intent_id`.
- Buyer and receipt data: `buyer_name`, `buyer_email`.
- Physical addresses: Loqate Address IDs/text or manual US address objects for sender and recipient.
- Content: `pdf` references, `file_name`, bulk CSV, text/html templates, postcard PDFs.
- Print and mail controls: `double_sided`, `color`, `mail_class`, `certified`, `mailpiece_type`, `postcard_size`.
- Money and quantities: `quote.price_usd`, `quote.full_price_usd`, `price_usd`, `page_count`, `billable_page_count`, `bulk.recipient_count`.
- Payment state: `payment_status`, `is_paid`, `payment_channel`, `machine_payment.*`, MPP `supported_methods`.
- Fulfillment state: `status`, `current_step`, `order_complete_url`, `campaign_url`.
