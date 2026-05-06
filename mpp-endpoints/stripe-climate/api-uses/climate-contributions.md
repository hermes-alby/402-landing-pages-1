# Stripe Climate: Climate Contributions API Uses

## What This Endpoint Group Does

This endpoint group lets an agent or application contribute a specified amount to Stripe Climate through a machine-payment flow. The client posts an `amount`, receives a `402 Payment Required` challenge if unpaid, retries with MPP payment credentials, and receives a confirmation containing the contribution amount, a contribution identifier, and a human-readable estimate of funded permanent carbon removal.

The endpoint is useful when the decision is "should this workflow fund a small amount of permanent carbon removal now?" It is not a full Climate Orders interface for selecting suppliers, reserving tons, tracking delivery, or retrieving certificates.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/api/contribute` | Create a paid Stripe Climate contribution after a 402 payment challenge is satisfied. | JSON `amount`; `Authorization: Payment proof=...` on retry. | `amount`, `contribution_id`, `impact`; unpaid requests return `WWW-Authenticate` payment challenge. |

## Field Notes

### Inputs

- `amount`: required integer. The wrapper homepage says this is a specified amount in USDC cents; the MPP catalog record says dynamic Stripe USD pricing with amount hint `$0.01+`.
- `Content-Type`: `application/json` in the public example.
- `Authorization`: payment proof header on retry after the initial `402 Payment Required` challenge.

### Outputs

- `WWW-Authenticate`: challenge header on unpaid requests.
- `amount`: echoed contribution amount in the successful response.
- `contribution_id`: confirmation identifier. The example value looks like a Stripe PaymentIntent ID, but the wrapper does not formally define it.
- `impact`: text estimating funded permanent carbon removal, for example kilograms of removal.

### Important Constraints Or Gaps

- Paid calls were not made, so the successful schema is based on the public example.
- The endpoint does not document exact validation, idempotency, maximum amount, refund, or repeated-payment behavior.
- The response does not expose supplier, project, delivery year, certificate, beneficiary, order-status, or structured metric-ton fields.
- Stripe states that contributions are not tax deductible because Stripe is not a registered charity, and that funds go toward carbon removal projects minus third-party fees.
- The broader Stripe Climate Orders API can track products and delivery, but this MPP contribution endpoint does not expose those controls.

## Use Cases

### Agent-Approved Micro-Contributions

A personal agent can ask for permission to contribute a small amount when a user completes a meaningful task, such as shipping a project, booking travel, or closing a personal carbon-budget period. The only input needed is `amount`, and the output gives a `contribution_id` plus an `impact` string that can be recorded in a personal ledger or journal.

For a business, the same pattern can attach small, explicit climate contributions to internal milestones, customer activations, or usage-based events. The value is operational simplicity: the workflow can stop at the 402 challenge for user or budget approval, then store the confirmation fields after payment. The limitation is that the endpoint does not return structured supplier allocation or auditable carbon-credit certificate data.

### Budget-Capped Sustainability Automation

An individual could set a monthly allowance, then let an agent make one or more contributions until the allowance is exhausted. The request `amount` is the budget-control field; the returned `amount` and `contribution_id` support reconciliation, while `impact` gives a plain-language result for the user's records.

A company can use the same endpoint for departmental sustainability budgets where every contribution is deliberately small and tied to a machine-action log. Because the static docs do not define idempotency keys or replay protection, the calling system should keep its own transaction ledger and require explicit approval before every paid retry.

### Checkout Or Usage Add-On Contributions

A consumer application could offer users an opt-in contribution at moments where intent is already clear, such as after a purchase, subscription renewal, or digital-service usage threshold. The application would calculate an `amount`, initiate the MPP flow, and display the returned `impact` text as confirmation.

For businesses, this can be a lightweight alternative to building a complete Stripe Climate Orders integration when the only goal is collecting small contributions. It is less appropriate for regulated carbon-neutral claims because the endpoint does not return product, supplier, delivery, retirement, or certificate fields.

### Internal Tooling For Machine-Payment Demos

Developers testing MPP or x402 flows need endpoints that are easy to understand and low minimum. Stripe Climate's contribution endpoint is a practical demo target because the initial request, 402 challenge, payment retry, and 200 confirmation are all shown on the public homepage.

For a business building machine-payment infrastructure, this endpoint can validate approval screens, wallet funding checks, payment-proof handling, accounting logs, and customer-facing receipts without integrating a high-risk data or compute service. The safety condition remains important: demo systems should not automatically retry with payment credentials unless the user or operator has authorized spend.

### Impact Receipts For Personal Or Team Records

A person can store the successful response as a simple receipt: `amount`, `contribution_id`, and `impact`. That is enough for a lightweight personal note, calendar recap, or monthly contribution summary.

A team can attach the same fields to internal reports that show when an agent made an approved contribution. The output is not enough for formal environmental accounting because `impact` is unstructured text and the endpoint does not expose verified delivery, project allocation, or certificate fields.
