# Martin Estate Winery: Order Tracking And Payment Status API Uses

## What This Endpoint Group Does

This endpoint group supports post-purchase observability. `GET /orders/{id}` returns full order details including product, shipping, and payment status for the identity that placed the order. `GET /orders/{id}/status` returns the lightweight payment status object `{ order_id, payment_status }` and is documented as accepting any valid identity.

This research did not call either endpoint because doing so would require an order id from a purchase flow.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/orders/{id}` | Retrieve full order detail | `id`, `X-Operator-Token` or `X-Wallet-Address` matching the order identity | Product, shipping, payment status, with full schema not documented |
| GET | `/orders/{id}/status` | Retrieve lightweight payment status | `id`, `X-Operator-Token` or `X-Wallet-Address` | `order_id`, `payment_status` |

## Field Notes

### Inputs

Both endpoints require an order `id` path parameter. The order detail endpoint requires the identity header to match the identity used to place the order. The status endpoint is documented as accepting any valid identity.

### Outputs

The status endpoint is the clearest response: `order_id` and `payment_status`. The full order endpoint is described in prose as returning product, shipping, and payment status, but the OpenAPI does not publish a concrete JSON schema.

### Important Constraints Or Gaps

No order can exist without the regulated purchase flow, and this research did not create one. The allowed `payment_status` values are not documented. The docs do not state whether fulfillment or shipment tracking fields are returned.

## Use Cases

### Buyer Confirmation After Agent Payment

After an agent completes a purchase, a buyer can ask for confirmation that the order's payment state is resolved. `GET /orders/{id}/status` is enough for a quick check because it returns `order_id` and `payment_status` without requiring the heavier full order detail payload.

This is useful for reducing uncertainty after an automated payment flow, especially because the docs warn against manual transfers and exact-amount mismatches. The endpoint does not replace an email receipt, fulfillment update, or shipping carrier tracking unless those fields are present in undocumented full order details.

### Customer Support Triage

A support operator or concierge service can use `GET /orders/{id}` when a user asks what was ordered or where it is being sent. Product, shipping, and payment status fields let the operator determine whether the issue is product selection, destination, or payment state.

The value is in tying customer support to the original identity-bound order rather than relying only on free-form user messages. The limitation is schema uncertainty: without a documented sample, downstream systems should tolerate missing or renamed fields.

### Payment Retry Or Recovery Decisions

If a payment flow is interrupted, the lightweight status endpoint can help determine whether the order is already paid, still pending, or in another state before retrying. A personal agent can avoid duplicate attempts; a business workflow can route unresolved payments to human review.

The exact decision logic depends on `payment_status` values, which are not enumerated in public docs. Implementers should treat unknown statuses conservatively and avoid creating a new purchase until the current order state is understood.

### Audit Trail For Regulated Agent Commerce

Order lookup can support an internal audit trail for agent-mediated alcohol commerce: which product was purchased, which shipping destination was used, and what payment state resulted. This matters for businesses using agents in regulated retail contexts because post-purchase records need to be inspectable.

The endpoint group does not expose the underlying identity verification evidence, KYC result details, or sanctions-screening artifacts in the public docs. Audit systems should record the agent's own consent, instruction, and payment logs alongside order lookup results.
