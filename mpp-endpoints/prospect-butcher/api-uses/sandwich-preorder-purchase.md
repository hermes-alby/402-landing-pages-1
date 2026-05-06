# Prospect Butcher: Sandwich Preorder Purchase API Uses

## What This Endpoint Group Does

This endpoint group covers the paid step of Prospect Butcher's agent-compatible sandwich ordering flow. A user or agent selects a sandwich slug from the free menu, supplies quantity plus customer name and email, optionally supplies a pickup window id or charity donation flag, and receives an MPP payment challenge. After payment, the documented flow returns an order confirmation and pickup code.

The group is narrow but concrete: it turns a decision about a specific sandwich into a paid, real-world pickup or donation order.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/buy/:slug` | Purchase a sandwich through MPP after menu selection | `slug`, `qty`, `name`, `email`, `pickupWindowId`, `charity` | 402 payment challenge; after payment, `orderId`, `pickupCode`, `item`, `quantity`, `total`, pickup instructions |

## Field Notes

### Inputs

`slug` identifies the sandwich and should come from `/menu`. The captured menu included eight slugs: turkey bacon jam, PBC roast beef, chicken salad, Korean BBQ, boudinwich, chopped liver, housemade ham, and rolled beef.

`qty` controls the number of sandwiches. The docs say it defaults to 1. `name` and `email` are required before purchase; email is specifically required for the receipt. `pickupWindowId` is documented as recommended and sourced from `/menu`, but the captured menu had `pickup_windows: []`, which makes pickup availability a live operational dependency. `charity=true` changes the order from pickup to donation.

### Outputs

Before payment, the endpoint returns an HTTP 402 payment challenge. The local docs say the service can present Tempo wallet and Stripe SPT payment methods, while the public MPP catalog snapshot records Stripe USD dynamic charge metadata.

After payment, the documented confirmation includes `order.orderId`, `order.pickupCode`, `order.name`, `order.item`, `order.quantity`, `order.total`, optional `order.pricing_note`, `pickup.code`, and `pickup.instructions`. These outputs let an agent hand the user a pickup code and summarize what was bought.

### Important Constraints Or Gaps

The endpoint performs a real purchase after payment. Any personal or business workflow should require explicit approval before paying and should verify the selected slug, quantity, contact email, and pickup or charity mode.

No OpenAPI spec was found. The exact 402 challenge body, receipt headers, invalid-slug errors, out-of-stock behavior, tax/fee handling, refund/cancellation flow, and final sandwich-specific confirmation schema are not fully documented. The captured `/menu` response had no pickup windows, so time/location scheduling cannot be assumed from the endpoint alone.

## Use Cases

### Personal Lunch Pickup Without A Marketplace Cart

A local customer could ask an agent to check the public menu, choose a sandwich, confirm quantity, name, email, and pickup preference, then present the `/buy/:slug` URL for explicit payment approval. The endpoint fields make the handoff simple: `slug` and `qty` capture the order, `name` and `email` satisfy fulfillment and receipt needs, and the final `pickupCode` gives the customer exactly what to show at the counter.

The value is reducing a small food order to a verified purchase URL and confirmation code, without navigating ChowNow or another marketplace flow. The limitation is that the agent still needs current menu and pickup-window context from `/menu`, and it must not pay unless the human has approved the exact purchase.

### Office Or Team Sandwich Run

A workplace coordinator could collect sandwich choices from several people, map each choice to menu slugs, and place one or more paid orders with quantities grouped by sandwich. The endpoint's `qty`, `order.quantity`, `order.item`, and `order.total` fields support a clean reconciliation step: the coordinator can tell the team what was ordered, how many of each sandwich were bought, and what pickup code will retrieve the food.

This is useful for small office lunches near Prospect Butcher's Brooklyn locations. It is not a full catering API: there are no documented line-item arrays, delivery fields, dietary filters, large-order lead times, or batch order endpoint. The workflow is strongest when the team order can be reduced to a few sandwich slug and quantity purchases.

### Charity Donation Orders

The documented `charity=true` query parameter lets a user buy a sandwich as a donation instead of picking it up. A personal agent could offer this when the user wants to support the community but cannot visit the shop. A business could use the same flow for small local giving campaigns, such as donating a fixed number of sandwiches during an event.

The important fields are the sandwich `slug`, `qty`, donor `name` and `email`, and the final confirmation code or receipt details. The main caveat is that the docs do not define the charity recipient, fulfillment reporting, donation receipt treatment, or tax-deductibility. The endpoint can confirm that the paid order was placed, but it does not provide nonprofit compliance data.

### Agent Purchase Receipt And Pickup Handoff

After payment, the endpoint is documented to return a pickup code and instructions. A personal assistant or concierge workflow could store `orderId`, `pickupCode`, `item`, `quantity`, `total`, and `pickup.instructions`, then send the human a concise pickup message. The same fields can be used by a small business assistant to reconcile employee reimbursements or confirm that an errand has reached the paid-order state.

This is valuable because the output fields are operational, not just conversational. A pickup code is the durable artifact the user needs at the store. The gap is that the captured response example does not prove whether current sandwich confirmations always include pickup location and time, so a reliable workflow should preserve the original chosen pickup window and location alongside the endpoint response.

### Food-Retail MPP Proof Of Concept

Developers and product teams evaluating agent commerce can use the Prospect Butcher flow as a concrete example of itemized retail purchasing over HTTP 402. The endpoint combines a public menu, a per-item dynamic price, required customer contact fields, and a final order confirmation code. That makes it useful for studying where agent purchase flows need human approval, receipt storage, and fulfillment handoff.

The business value is not broad automation of restaurant operations; the API surface is too narrow for inventory management or marketplace analytics. Its value is demonstrating that a small retail purchase can be exposed as a payment-gated endpoint while keeping menu discovery public and payment explicit.
