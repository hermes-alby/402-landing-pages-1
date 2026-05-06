# Martin Estate Winery API Uses

## Service Summary

Martin Estate Winery sells estate-grown Rutherford, Napa Valley wines. Its MPP service at `https://agents.martinestate.com` exposes a first-party agent-commerce flow: public wine browsing, identity-gated wine purchase, and order/payment-status lookup. The API is valuable less as a generic wine-data API and more as a concrete pattern for regulated physical-goods commerce with AgentScore identity, dynamic 402 pricing, and agent-compatible payment rails.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Wine Catalog Browsing | 2 | Product discovery, current SKU selection, inventory-aware recommendations, and purchase id lookup without checkout. | [wine-catalog-browsing.md](api-uses/wine-catalog-browsing.md) |
| Compliant Agent Purchasing | 1 | Identity-gated purchase preparation, gift notes, compliance recovery, exact 402 payment challenge handling, and payment rail selection. | [compliant-agent-purchasing.md](api-uses/compliant-agent-purchasing.md) |
| Order Tracking And Payment Status | 2 | Post-purchase order detail retrieval and lightweight payment status checks. | [order-tracking-and-payment-status.md](api-uses/order-tracking-and-payment-status.md) |

## Highest-Value Uses

The strongest use is compliant agent-mediated wine purchase: use public catalog fields to pick a SKU, then use the purchase schema and AgentScore flow to verify identity, calculate tax, receive exact dynamic pricing, and pay through Tempo, x402, or Stripe SPT. This is a useful real-world example because alcohol purchases require age, jurisdiction, sanctions, shipping, and payment discipline.

The second strongest use is regulated gifting. The API supports product selection and an optional printed `gift_note`, while preserving explicit compliance boundaries and exact payment challenges.

## Personal Use Opportunities

A buyer can ask an agent to compare visible wines by price, vintage, description, and availability before choosing one. If the buyer proceeds, the agent can use the official purchase flow to handle identity verification, shipping state checks, exact tax/total pricing, and payment.

A buyer can also send a wine gift with a controlled note. The agent should ask first, keep the note plain text under 300 characters, include the buyer's opening and signature in the note itself, and omit the field for non-gift orders.

## Business Use Opportunities

Concierge, hospitality, and corporate gifting workflows can use the catalog endpoints as a pre-check for price, stock, and bottle limits, then route only feasible requests into the compliant purchase flow. Agent-commerce developers can use the purchase endpoint documentation to design wallet-auth versus operator-token flows and handle signer mismatch or verification-required responses.

Customer support teams can use order lookup and payment status endpoints after purchase to determine whether a problem is product, destination, or payment-state related, though the full order schema remains underdocumented.

## Endpoint Group Summaries

### Wine Catalog Browsing

Public GET catalog endpoints provide the current MPP product set, including `id`, `slug`, `price`, `price_cents`, `description`, `image_url`, `stock_quantity`, and `max_quantity_per_order`. These fields are enough for product comparison, gift shortlisting, and pre-purchase feasibility checks. Full details: [wine-catalog-browsing.md](api-uses/wine-catalog-browsing.md).

### Compliant Agent Purchasing

`POST /purchase` combines product id, quantity, buyer email, shipping address, optional gift note, identity headers, AgentScore compliance, and dynamic payment. The endpoint can return verification URLs, polling fields, compliance denials, wallet-signer errors, or a 402 challenge with exact pricing and payment methods. Full details: [compliant-agent-purchasing.md](api-uses/compliant-agent-purchasing.md).

### Order Tracking And Payment Status

The order endpoints are post-purchase observability tools. `GET /orders/{id}` is for full detail, while `GET /orders/{id}/status` returns `order_id` and `payment_status`. They are useful for confirmation, support, and payment recovery decisions, but response schemas are sparse. Full details: [order-tracking-and-payment-status.md](api-uses/order-tracking-and-payment-status.md).

## Field And Data Themes

Product fields drive selection: `id`, `slug`, `name`, `vintage`, `varietal`, `category`, `price`, `price_cents`, `description`, `image_url`, `in_stock`, `stock_quantity`, and `max_quantity_per_order`.

Purchase fields drive compliance and payment: `product_id`, `quantity`, `email`, `shipping`, `order_id`, `gift_note`, `X-Operator-Token`, `X-Wallet-Address`, `verify_url`, `poll_url`, `poll_secret`, `pricing`, `accepted_methods`, `identity_mode`, `required_signer`, and `warnings`.

Order fields are currently limited in public docs: `order_id`, `payment_status`, and prose references to product and shipping details.
