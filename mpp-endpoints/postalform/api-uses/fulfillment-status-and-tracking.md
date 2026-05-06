# PostalForm: Fulfillment Status And Tracking API Uses

## What This Endpoint Group Does

This endpoint polls an MPP machine order by canonical `order_id` or aliased `request_id`. It lets an agent or back-office system observe whether payment settled, where the order is in PostalForm's fulfillment process, what mailpiece was created, and where to inspect completed orders or bulk campaign status.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/machine/mpp/orders/:id` | Poll MPP order status and fulfillment. | `id` path parameter, using `order_id` or aliased `request_id` | `payment_status`, `is_paid`, `current_step`, `price_usd`, `machine_payment`, `order_complete_url`, optional `campaign_url` |

## Field Notes

### Inputs

The only documented input is the `id` path parameter. OpenAPI describes it as a UUID and says it can be the canonical `order_id` or an aliased `request_id` returned by create or validate.

### Outputs

The status response includes payment and fulfillment fields: `status`, `payment_status`, `is_paid`, `current_step`, `payment_intent_id`, `payment_channel`, `price_usd`, `currency`, and `machine_payment`. It also includes normalized `mailpiece_type`, `postcard_size`, `postcard_guidelines_url`, `order_complete_url`, and optional `campaign_url` for bulk campaigns.

### Important Constraints Or Gaps

The public schema does not enumerate all status values or SLA expectations. The docs describe row-level bulk delivery events as available through `campaign_url`, not through this API response. This endpoint is read-only, but polling still exposes potentially sensitive order and payment state.

## Use Cases

### Confirm Payment Settlement Before Telling A User The Letter Is On Its Way

A personal agent that pays through MPP can poll until `payment_status` becomes `paid` and `is_paid` is true before confirming the order to the user. The `current_step` field helps distinguish "payment accepted but finalization pending" from later fulfillment progress.

For a business, this prevents premature downstream actions. A collections workflow can wait for payment settlement and a meaningful fulfillment step before marking a notice as mailed in the internal account record.

### Operational Fulfillment Tracking

An individual sending an important document can use `current_step` and `order_complete_url` to know whether the order is still processing, complete, or needs attention. The response fields allow the agent to produce concise status updates without exposing payment implementation details.

Businesses can integrate these fields into back-office queues. For example, support teams can see whether a notice is stuck before `letter_created`, finance can reconcile `price_usd` and `payment_intent_id`, and operations can surface exceptions when status stops progressing.

### Bulk Campaign Follow-Through

For a neighborhood group, nonprofit, or small business mailing a CSV campaign, polling can confirm that the campaign order exists and return `campaign_url` for deeper row-level tracking. The agent can hand the dashboard link to a human coordinator once payment and campaign creation are complete.

For larger businesses, `campaign_url` is a practical bridge from API automation to human QA and operations. The API response does not expose row-level delivery events directly, so systems that need per-recipient analytics would have to use the dashboard or another PostalForm surface if one becomes available.

### Audit Trail For Machine Payments

Individuals may want a simple proof trail showing what was paid and what happened next. Status fields such as `price_usd`, `currency`, `machine_payment.protocol`, `machine_payment.method`, `machine_payment.settlement_reference`, and `machine_payment.settled_at` can be stored with the user's instruction and generated PDF reference.

For businesses, those same fields support finance reconciliation and incident review. If a job appears unpaid or duplicated, the team can compare `order_id`, the original `request_id`, `payment_intent_id`, and settlement reference before retrying or issuing support requests.

### Postcard And Mailpiece Verification After Creation

A person sending postcards can poll and verify that `mailpiece_type` is `postcard`, that `postcard_size` matches the intended size, and that PostalForm returned a postcard guidelines URL. This helps catch mismatches between the user's intent and the actual order metadata.

Marketing or customer-success teams can use this as a post-create control in campaign automation. If a postcard campaign comes back as a letter or lacks expected postcard metadata, the workflow can flag the job for review before assuming the campaign is production-ready.
