# Stripe Climate API Uses

## Service Summary

Stripe Climate funds permanent carbon removal. The broader Stripe product includes Climate Commitments and Climate Orders, but the assigned MPP service exposes a narrower first-party machine-payment wrapper: create a contribution by posting an amount, satisfy a `402 Payment Required` challenge, and receive a contribution confirmation.

The strongest API-use opportunity is controlled, low-friction climate funding from agents and apps. The endpoint is best for explicit micro-contributions and payment-flow demos, not for supplier selection, carbon accounting, certificate management, or delivery tracking.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Climate Contributions | 1 | Machine-payable Stripe Climate contributions with amount input, payment challenge, contribution id, and impact estimate. | [`api-uses/climate-contributions.md`](api-uses/climate-contributions.md) |

## Highest-Value Uses

- Let an agent make user-approved micro-contributions to permanent carbon removal and store `amount`, `contribution_id`, and `impact` as a simple receipt.
- Add budget-capped climate contributions to internal workflows, customer actions, or team milestones without building a full Stripe Climate Orders integration.
- Use the endpoint as a concrete MPP/x402 integration test because the public docs show the initial request, 402 challenge, payment retry, and successful response shape.

## Personal Use Opportunities

- Create a monthly contribution allowance that an agent can spend only after explicit approval.
- Record lightweight contribution receipts in a personal ledger or sustainability journal.
- Trigger small contributions after personally meaningful events, while keeping the exact `amount` visible before payment.

## Business Use Opportunities

- Attach opt-in climate contributions to product usage, checkout, onboarding, or completed support workflows.
- Build internal budget controls around machine-paid contributions, using the `amount` and `contribution_id` fields for reconciliation.
- Demonstrate machine-payment infrastructure with a low-minimum, easy-to-explain endpoint before applying the same pattern to more complex paid APIs.

## Endpoint Group Summaries

### Climate Contributions

The `POST /api/contribute` group accepts an integer `amount`, returns a 402 payment challenge for unpaid requests, and returns `amount`, `contribution_id`, and `impact` after payment credentials are supplied. It supports contribution execution and receipt logging, but does not expose structured Climate Orders fields such as product, supplier, delivery year, beneficiary, certificate, status, or cancellation state.

Full details: [`api-uses/climate-contributions.md`](api-uses/climate-contributions.md)

## Field And Data Themes

- Payment control: `amount`, dynamic `$0.01+` price hint, `WWW-Authenticate`, and `Authorization: Payment proof=...`.
- Receipt identifiers: `contribution_id` and echoed `amount`.
- Impact communication: unstructured `impact` text estimating funded permanent carbon removal.
- Missing Climate Orders details: no supplier, project, product, delivery year, certificate, delivery status, cancellation, or refund fields are documented on the MPP wrapper.
