# Build With Locus: Billing And Credit Control API Uses

## What This Endpoint Group Does

This endpoint group controls the credit side of a Build With Locus workspace: adding Tempo MPP-funded credits, checking whether the workspace can afford active resources, reviewing credit/debit history, and listing billable services with rate breakdowns. It is operationally important because Build With Locus bills deployed services and addons from workspace credits rather than charging per API request.

For Tempo MPP users, the top-up endpoint is the bridge between wallet payment and deployable infrastructure. The other endpoints are read-only checks that let a user or agent decide whether to create resources, delay work, ask for approval, reduce spend, or investigate billing changes before services become delinquent or suspended.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/billing/mpp-top-up` | Add workspace credits through a Tempo MPP payment flow. | `Authorization: Bearer <jwt>`, `X-Mpp-Payment` or `X-Service-Token`, JSON `amount`, optional `tempoAddress`; public docs list a $1-$100 top-up range. | `status` (`success` or `pending_approval`), `creditBalance`, `paymentId`, optional `approvalUrl`. |
| GET | `/v1/billing/balance` | Return the current credit balance and monthly billing summary. | `Authorization: Bearer <jwt>`. | `creditBalance`, `totalServices`, `monthlyTotal`, `billingCycleDay`, `nextBillingDate`, `status`, optional `warnings`. |
| GET | `/v1/billing/transactions` | Return credit/debit ledger history for billing audit and reconciliation. | `Authorization: Bearer <jwt>`, optional query `limit` with examples using `50`. | `transactions` array; individual transaction object fields are not fully published in the reviewed docs. |
| GET | `/v1/billing/services` | Return active billable services and their rate breakdown. | `Authorization: Bearer <jwt>`. | `services` array; individual billable-service object fields are not fully published in the reviewed docs. |

## Field Notes

### Inputs

All four endpoints require a workspace JWT bearer token. The MPP top-up endpoint additionally requires a Tempo MPP payment header for wallet-paid credit addition, or an `X-Service-Token` for service-authenticated calls, plus a JSON `amount`; `tempoAddress` can associate the top-up with a Tempo address. The transaction-history endpoint accepts a `limit` query parameter, with examples using `50`.

The top-up endpoint is not a discovery-only call: submitting it with payment headers can initiate a paid credit flow. Research artifacts should describe it from cached docs and public metadata unless a later task explicitly authorizes payment settlement.

### Outputs

Balance responses expose the operational budget state: `creditBalance`, `totalServices`, `monthlyTotal`, `billingCycleDay`, `nextBillingDate`, and `status`. The documented status enum is `active`, `delinquent`, or `suspended`; onboarding notes also show low-balance `warnings` with a human-readable message and `servicesRemaining`.

Top-up responses indicate whether credits were applied immediately or are waiting for approval through `status`, `paymentId`, updated `creditBalance`, and optional `approvalUrl`. Transaction and billable-service list responses are named in the docs, but the reviewed public materials do not publish stable per-item schemas, so consumers should preserve raw responses and tolerate extra or missing fields.

### Important Constraints Or Gaps

Build With Locus charges active resources from workspace credits: services and Postgres/Redis addons are documented at $0.25/month each. MPP onboarding starts with $0.00 credits, so a Tempo MPP workspace must top up before the first paid resource can be created; the generic billing guide says new workspaces receive $1.00, but the MPP-specific onboarding and pricing artifacts distinguish Tempo MPP as $0.00 initial credit.

Insufficient credits can block resource creation with `402` errors that include `creditBalance` and `requiredAmount` in examples. If a monthly charge fails, billing events can progress through delinquency and suspension; after suspension, services stop receiving traffic until credits are added and the workspace returns to `active`. The exact transaction ledger item schema and billable-service rate object schema remain open gaps because no official OpenAPI spec was found.

## Use Cases

### Personal Deployment Budget Check

A solo developer can call `GET /v1/billing/balance` before pushing a side project or demo to see whether `creditBalance` covers the next service or addon. The useful decision fields are `creditBalance`, `monthlyTotal`, `totalServices`, `nextBillingDate`, and `warnings`; if the balance is below the expected $0.25/month increment, the workflow should pause and request a top-up rather than attempting a deployment that will fail with insufficient credits.

For a personal wallet-funded workflow, this reduces surprise spend and failed deploy loops. The limitation is that the check is only as current as the billing system response, and the MPP top-up path still requires a valid JWT and a payment-capable Tempo client.

### Agent-Controlled Credit Top-Up

An autonomous deployment agent can use the balance endpoint as a pre-flight gate, then prepare a `POST /v1/billing/mpp-top-up` request for a human-approved Tempo MPP payment when credits are too low. The main automation fields are requested `amount`, optional `tempoAddress`, returned `status`, `paymentId`, `creditBalance`, and `approvalUrl`; `pending_approval` should route the user to approve payment, then poll balance until the credit increase is visible.

The business angle is controlled infrastructure funding without handing the agent a broad cloud account or monthly subscription. The cost and compliance boundary is important: the top-up call can spend funds, so production agents should require explicit approval, enforce the $1-$100 documented range, log `paymentId`, and never retry paid submissions blindly.

### Finance And Audit Reconciliation

An operator can combine `GET /v1/billing/transactions` and `GET /v1/billing/services` to reconcile wallet top-ups, monthly resource deductions, and active service counts. Transaction rows support ledger review, while billable services connect charges to deployed resources; together they help answer whether a charge came from new infrastructure, monthly renewal, or a credit addition.

For a business, this supports lightweight cost attribution for prototypes, customer demos, or agent-created environments. The main limitation is schema detail: the public docs name the arrays but do not fully document each object, so reconciliation tooling should store raw rows, display unknown fields, and avoid assuming a fixed ledger taxonomy until live responses are validated.

### Suspension Risk Monitoring

A team can poll `GET /v1/billing/balance` on a schedule and alert when `status` becomes `delinquent`, `warnings` appear, or `creditBalance` no longer covers the next monthly charge. This can drive internal notifications, pause noncritical deployments, or trigger a top-up approval workflow before services stop receiving traffic.

The practical value is uptime protection for low-cost hosted services where a missed $0.25/month renewal can still interrupt a customer-facing app. Webhook billing events are documented elsewhere as a stronger push-based option, but within this endpoint group the safe fallback is polling balance and using the top-up endpoint only after spend approval.

### Resource Cleanup And Spend Reduction

When `monthlyTotal` or `totalServices` grows unexpectedly, a user can inspect `GET /v1/billing/services` to identify which deployed services are contributing to recurring charges, then decide whether to scale down, delete stale environments, or consolidate demos. The group does not perform cleanup itself, but it provides the cost visibility needed before taking actions through the project, service, or addon endpoints.

This is useful for agencies and internal platform teams that let multiple users or agents create temporary infrastructure. The constraint is that service cleanup may require coordination with deployment owners, customer commitments, or data-retention policies, and the exact billable-service fields are not fully documented in the reviewed source material.
