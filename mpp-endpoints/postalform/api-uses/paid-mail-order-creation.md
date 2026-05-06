# PostalForm: Paid Mail Order Creation API Uses

## What This Endpoint Group Does

This endpoint is the payable MPP action. A client submits the same mailing payload used for validation, receives an HTTP 402 MPP challenge, pays with exactly one supported method, and retries the exact same request body with `Authorization: Payment ...`. After successful settlement, PostalForm returns order state and begins or finalizes print-and-mail fulfillment.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/machine/mpp/orders` | Create or reuse a paid MPP machine order for a letter, postcard, or bulk campaign. | Full `MachineOrderRequest`; `Authorization: Payment ...` on paid retry | `order_id`, `status`, `payment_status`, `is_paid`, `current_step`, `price_usd`, `machine_payment`, `campaign_url`, 402 challenge fields |

## Field Notes

### Inputs

The request body is the full mailing order: buyer fields, PDF reference, sender address, recipient or bulk campaign fields, print options, mail class, Certified Mail flag, and postcard fields. The paid retry must reuse the exact same JSON body and `request_id`; otherwise the server can reject the request as payload drift.

The payment-specific input is the `Authorization` header on retry. PostalForm documents two MPP payment instruments: Tempo and Stripe Shared Payment Tokens. For Stripe, the agent must serialize the selected challenge plus `{ "spt": "..." }` into one MPP credential; a bare `spt_...` is not accepted.

### Outputs

On unpaid create, the endpoint returns `402` with `order_id`, `request_id`, `supported_methods`, payment guidance, and one or more `WWW-Authenticate: Payment ...` challenges. On successful paid retry, the endpoint returns `MachineOrder` fields such as `order_id`, `status`, `payment_status`, `is_paid`, `current_step`, `payment_intent_id`, `payment_channel`, `price_usd`, `currency`, `machine_payment`, postcard metadata, and optional `campaign_url`.

### Important Constraints Or Gaps

This artifact did not call the create endpoint because it would create a payment challenge or mail order. The exact MPP challenge header structure is documented in prose and examples rather than fully modeled in OpenAPI response headers. The create endpoint's OpenAPI payment metadata gives a `$3.40` to `$200.00` range, so agents should validate first for an exact quote.

## Use Cases

### Autonomous Certified Or Priority Mail For Important Personal Documents

A person could authorize an agent to send a time-sensitive letter, such as a rent dispute notice, cancellation letter, reimbursement packet, or administrative appeal. The agent can create the order only after validation, choose options like `mail_class` and `certified`, and then satisfy the MPP challenge within the user's approved spending cap.

The value is not just payment automation. The returned `order_id`, `payment_status`, `price_usd`, and `machine_payment` metadata create a receipt trail that the agent can store with the original request. Important limitation: PostalForm's API sends physical mail, so users need to verify recipient data and content before authorizing payment.

### Accounts Receivable And Collections Notices

A business can use the paid create endpoint to turn approved receivables events into physical mail. For example, after internal review, a workflow could create first notices, final reminders, or formal demand letters using `recipient_name`, address fields, `pdf`, `mail_class`, and `certified`.

The response gives finance and operations systems a concrete `order_id`, `payment_status`, `current_step`, `price_usd`, and settlement metadata. That enables reconciliation between a customer account, the generated document, the payment used to mail it, and later fulfillment polling. Missing dependency: the endpoint does not itself produce legal content or decide compliance requirements; the business must provide approved templates and policies.

### Bulk Customer Communications With Agent Payment

Organizations can send a CSV-backed campaign by including `bulk.csv_content`, `bulk.content_mode`, and `template_text` or `template_html`. Examples include service-change notices, account updates, nonprofit donor letters, school communications, or local-government reminders.

The create endpoint matters because it can convert an approved campaign into paid fulfillment without sending a human through checkout. The `campaign_url` output links to the campaign dashboard for row-level status and tracking after creation. The automation should use validation first to check `bulk.recipient_count` and quote before accepting the cost of a multi-recipient mailing.

### Triggered Direct Mail From Digital Workflows

A CRM, billing system, or support platform can trigger physical mail when digital channels fail or when a postal letter has higher response value. Inputs such as `recipient_address_manual`, `mail_class`, `color`, `double_sided`, and `pdf` let the workflow tailor the communication without a separate print vendor integration.

For personal use, the same pattern can power an assistant that sends postcards or letters from events in a task list. For businesses, the endpoint bridges digital automation and physical fulfillment while preserving payment and idempotency controls through `request_id`, `price_usd`, and `machine_payment.settlement_reference`.

### Postcard Campaign Execution

An individual can send postcards for invitations, announcements, or reminders by setting `mailpiece_type: "postcard"` and a supported `postcard_size`. The endpoint handles the same payment flow and returns normalized postcard metadata so the agent can confirm the mailpiece was treated as intended.

For marketing teams, paid postcard creation is useful for small, fast campaigns that do not justify a separate print procurement workflow. The returned `campaign_url` for bulk postcards can become the operational handoff point. The prerequisite is strict adherence to PostalForm's postcard PDF guidelines; the API expects a fully composed two-page PDF and does not replace creative QA.

### Payment-Safe Order Retry After Network Failure

Agents often retry after network errors. PostalForm's create flow gives a concrete retry pattern: keep the same `request_id`, exact JSON body, and canonical `order_id`, then retry payment or poll instead of creating a new order.

For businesses, this supports robust job queues. The queue can store the `request_id`, `order_id`, `payment_status`, and `machine_payment` fields, then resume safely after a timeout. This reduces duplicate mailings, duplicate charges, and inconsistent fulfillment state.
