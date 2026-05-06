# Prospect Butcher API Uses

## Service Summary

Prospect Butcher Co is a Brooklyn butcher and sandwich shop. Its MPP service exposes an agent-compatible sandwich ordering flow at `https://agents.prospectbutcher.shop`. The public catalog lists one paid MPP endpoint, `GET /buy/:slug`, which purchases a selected sandwich after the user supplies quantity, name, email, and optionally pickup-window or charity-donation details.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Sandwich Preorder Purchase | 1 | Convert a selected sandwich slug and customer details into a paid pickup or donation order with a confirmation code. | [sandwich-preorder-purchase.md](api-uses/sandwich-preorder-purchase.md) |

## Highest-Value Uses

The highest-value use is a tightly scoped local pickup assistant: browse the free menu, confirm the user's exact sandwich, quantity, name, email, pickup details, and payment approval, then use the paid buy endpoint to obtain a pickup code. The endpoint is useful because it returns the operational artifact the customer needs at the counter.

The second strongest use is small team or concierge ordering. A coordinator can collect choices, group them into quantities per sandwich slug, pay with explicit approval, and hand off `pickupCode`, `item`, `quantity`, and `total` fields for pickup and reconciliation.

The `charity=true` flag also creates a narrow but distinctive donation use case: a person or business can buy sandwiches for donation instead of pickup. The endpoint can confirm purchase, though it does not document nonprofit, tax, or recipient details.

## Personal Use Opportunities

A person near Prospect Butcher's Brooklyn locations can delegate lunch ordering after confirming the selected sandwich and pickup plan. The useful fields are `slug`, `qty`, `name`, `email`, `pickupWindowId`, and the returned pickup code.

A user who cannot pick up food can choose the charity mode, using `charity=true` to turn the sandwich purchase into a donation. The agent should still preserve the receipt and confirmation fields because the docs do not describe additional donation reporting.

## Business Use Opportunities

Small offices, event hosts, and concierge services can use the endpoint for limited sandwich runs where each order is reducible to sandwich slug and quantity. `order.total`, `order.quantity`, `order.item`, and `pickupCode` support reimbursement, pickup delegation, and simple audit trails.

Product teams studying agent commerce can use the service as a concrete example of an HTTP 402 retail purchase. It demonstrates a public discovery step, payment-gated fulfillment step, and final real-world pickup handoff.

## Endpoint Group Summaries

### Sandwich Preorder Purchase

This group covers the single paid endpoint, `GET /buy/:slug`. It accepts a sandwich slug, quantity, customer name, email, optional pickup window id, and optional charity flag. Before payment it returns an MPP 402 challenge; after payment the docs show an order confirmation with order id, pickup code, item, quantity, total, and pickup instructions. See [api-uses/sandwich-preorder-purchase.md](api-uses/sandwich-preorder-purchase.md).

## Field And Data Themes

The API's core identifiers are `slug`, `pickupWindowId`, `orderId`, and `pickupCode`. Its personal data fields are intentionally small: customer `name` and `email`. Money and quantity are represented through `qty`, menu prices, dynamic payment amount, and the confirmation `total`. Location and timing are indirectly represented by pickup windows, but the captured `/menu` response had no pickup windows, making live availability a key dependency.
