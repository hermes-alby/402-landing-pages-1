# Martin Estate Winery: Compliant Agent Purchasing API Uses

## What This Endpoint Group Does

This endpoint group centers on `POST /purchase`, the regulated commerce operation. It accepts the selected `product_id`, quantity, buyer email, shipping address, optional resume `order_id`, and optional `gift_note`. It then gates the transaction through AgentScore identity and compliance checks before issuing a dynamic 402 payment challenge with exact pricing and accepted payment methods.

This research did not call the endpoint. The field notes below come from public OpenAPI, `llms.txt`, and well-known metadata.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/purchase` | Start or resume an identity-gated wine purchase and obtain a dynamic payment challenge after compliance passes | `product_id`, `quantity`, `email`, `shipping`, optional `order_id`, optional `gift_note`, `X-Operator-Token` or `X-Wallet-Address` | 403 verification/compliance bodies, 402 payment challenge with `pricing`, `accepted_methods`, `identity_mode`, signer data, concrete `how_to_pay` commands, and warnings; 200 order completion after successful payment |

## Field Notes

### Inputs

The core purchase body requires `product_id`, `quantity`, `email`, and `shipping`. Quantity is limited to 1-12. Shipping requires `name`, `address_1`, `city`, `state`, and `zip`, with optional `address_2` and default `country` of US. `order_id` resumes a pending order after identity verification. `gift_note` is optional, max 300 characters, plain text only, preserves newlines, and should be omitted for non-gift orders.

Identity can be supplied as `X-Operator-Token` or `X-Wallet-Address`. Operator tokens work with every rail and are required for Stripe SPT/card. Wallet identity requires the claimed wallet to sign the payment and only works with signature-bearing rails such as Tempo MPP and x402.

### Outputs

A first-encounter or fixable identity response can include `verify_url`, `session_id`, `poll_url`, `poll_secret`, `agent_instructions`, and `agent_memory`. Compliance-denied responses can include `decision`, `reasons`, and `next_steps`. Wallet signer failures can include `claimed_operator`, `actual_signer_operator`, `expected_signer`, `actual_signer`, and `linked_wallets`.

After compliance passes, a 402 response can include `payment_required`, `accepts`, `accepted_methods`, `amount_usd`, `currency`, `pricing.subtotal`, `pricing.tax`, `pricing.tax_rate`, `pricing.tax_state`, `pricing.total`, `identity_mode`, `required_signer`, `linked_wallets`, `signer_constraint`, `how_to_pay`, `agent_instructions`, `agent_memory`, and `warnings`.

### Important Constraints Or Gaps

Wine purchases require KYC, age 21 or older, US jurisdiction, and sanctions clearance. Shipping is US-only and blocks AK, DE, HI, MI, MS, NH, ND, RI, SD, UT, and VA. Payment amount is dynamic; the runtime 402 challenge is authoritative. The static OpenAPI 200 response does not define the completed order schema, and shipping charge fields are not documented before runtime.

## Use Cases

### Compliant Personal Wine Purchase

A personal shopping agent can combine a catalog-selected `product_id` with the buyer's desired `quantity`, `email`, and `shipping` address, then use the 403/402 flow to guide the buyer through identity verification and exact payment. The valuable fields are the compliance recovery fields (`verify_url`, `poll_url`, `agent_instructions`) and the 402 `pricing` block, which gives subtotal, tax, tax state, and total before the agent pays.

This workflow is useful because it keeps regulated alcohol purchase steps explicit and auditable. It is also constrained: the buyer must be 21 or older, pass KYC/sanctions checks, ship to an allowed US state, and approve a payment rail. Agents should never improvise around denial reasons or attempt manual USDC transfers outside the payment handshake.

### Agent-Mediated Gift Order With Printed Note

For birthday, client appreciation, or holiday gifting, an agent can ask whether the order is a gift and, only if confirmed, include `gift_note` with an opening and signature. A personal buyer gets a more complete gift workflow; a business gifting team can preserve approved note text in the purchase request while still leaving identity, shipping, tax, and payment to the compliant flow.

The field-level value is the structured `gift_note` rule set: max 300 characters, plain text only, no HTML or markdown, and preserved line breaks. The limitation is important: gift intent does not relax alcohol compliance, shipping state restrictions, payment requirements, or recipient logistics.

### Corporate Gifting Compliance Preflight

A business can use the purchase schema as a preflight checklist before any endpoint call: product id selected from catalog, quantity within 1-12, recipient name/address present, state not in the blocked list, buyer email present, and gift note sanitized. This helps prevent an agent from sending malformed or obviously non-compliant purchase attempts.

The API fields make the preflight concrete because the shipping address and quantity constraints are explicit. The preflight still cannot guarantee final approval; AgentScore identity, age, US jurisdiction, sanctions status, tax, and exact total are only resolved during the official flow.

### Payment Rail Selection For Agent Commerce

The 402 response can advertise Tempo MPP, x402 Base, x402 Solana, and Stripe SPT options, along with concrete `how_to_pay` commands. A developer building an agent wallet can use `identity_mode`, `required_signer`, `linked_wallets`, and `signer_constraint` to decide whether wallet-auth or operator-token identity is viable for a specific user.

This is valuable for businesses testing agent-commerce UX because the endpoint exposes real signer-binding errors such as `wallet_signer_mismatch` and `wallet_auth_requires_wallet_signing`. The caveat is that this research did not generate a live 402 challenge; implementers must treat the runtime response as authoritative.

### Recovering A Pending Identity Flow

When a buyer starts a purchase without an identity credential, the response can include `order_id`, `verify_url`, `session_id`, `poll_secret`, and `poll_url`. An agent can persist the pending `order_id`, present the verification link, poll for completion, and retry `POST /purchase` with `X-Operator-Token` and the original order id.

For a person, this avoids losing purchase context while completing KYC. For a business, it enables a supportable handoff between product selection, user identity verification, and payment. The agent must protect secrets, persist only safe memory patterns, and avoid repeated or unauthorized polling outside the documented flow.
