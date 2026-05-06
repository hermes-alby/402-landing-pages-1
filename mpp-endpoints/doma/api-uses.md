# Doma API Uses

## Service Summary

Doma is a protocol and app surface for tokenized domains. In the official docs, Interstellar is the registrar-style surface where domains are bought or reserved, while Doma is the hub for managing tokenized domains across registrars: claiming, listing, offers, bridging, detokenizing, DNS-related management, and portfolio monitoring.

The MPP catalog exposes one Doma endpoint: `POST https://mpp.doma.xyz/register`. It is a paid, mutating domain-registration wrapper. A caller supplies a desired domain, an EVM buyer address, and ICANN-style registrant contact details; the service dynamically prices the domain through Interstellar, issues an HTTP 402 MPP/Tempo payment challenge, and after valid payment returns registration/order evidence.

No paid calls, wallet signatures, availability checks, registrations, account actions, or mutations were performed for this research.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Domain Registration | 1 | Register a supported domain through a dynamic-price MPP/Tempo flow and assign the tokenized domain to an EVM buyer address for later Doma management. | [api-uses/domain-registration.md](api-uses/domain-registration.md) |

## Highest-Value Uses

- Agent-assisted domain purchase with explicit payment approval, where the returned `txHash`, `network`, `order.amount`, and `order.buyerAddress` become the receipt and wallet-routing evidence.
- Brand-protection workflows that register approved product, campaign, creator, or typo-defense names while preserving cost, registrant, wallet, and on-chain audit records.
- Web3 product launch onboarding where a conventional domain is acquired directly into the wallet that will later manage Doma DNS, bridging, listings, or claims.
- Embedded customer provisioning for site builders or startup tooling that need a paid domain-registration action without building a full registrar integration.
- Finance and support reconciliation for paid registrations using `order.amount`, `voucherAmount`, `paymentContract`, `txHash`, and `voucherSignature`.

## Personal Use Opportunities

Individuals can use the endpoint through a trusted wallet-enabled assistant to register a personal site, portfolio, creator project, or Web3 identity domain. The useful workflow is not "search everything"; it is "after a user chooses and approves a name, register it into the correct wallet and produce durable evidence." The returned domain, network, transaction hash, and order details help the user confirm where the asset landed and what was paid.

Personal use still has real risk. The endpoint collects sensitive registrant contact fields, uses dynamic pricing, and can spend funds and mutate registrar/on-chain state. A personal assistant should require explicit approval for the final paid retry, preserve receipts, and avoid registering names that may infringe, impersonate, phish, or otherwise violate third-party rights.

## Business Use Opportunities

Businesses get the most value when the endpoint is wrapped in controls: candidate screening, trademark review, budget thresholds, approved registrant profiles, wallet custody policy, and audit logging. The endpoint fields map well to that control plane: `domain` is the asset, `contact.organization` and contact fields identify the registrant, `buyerAddress` routes ownership, and `order.amount` plus `txHash` support procurement and accounting.

The strongest business opportunities are defensive registration, launch-domain reservation, and customer-facing domain provisioning. In each case, Doma MPP compresses registrar pricing, payment, and tokenized-domain onboarding into one paid HTTP flow, but it does not remove compliance, rights-clearance, refund, renewal, privacy, or support obligations.

## Endpoint Group Summaries

### Domain Registration

This group covers `POST /register`, the only Doma endpoint in the MPP catalog. It accepts `domain`, `buyerAddress`, and a nested `contact` object, then returns success, domain, network, transaction, payment-contract, voucher, and order fields. The group artifact details six concrete uses: personal purchase, defensive registration, Web3 launch onboarding, portfolio acquisition, customer-facing provisioning, and finance/audit reconciliation.

Full details: [api-uses/domain-registration.md](api-uses/domain-registration.md)

## Field And Data Themes

- Identity and compliance data: registrant first/last name, email, phone, address, country code, and optional organization or fax fields.
- Wallet and asset routing: `buyerAddress`, `domain`, `network`, and later Doma management context.
- Payment and accounting data: dynamic amount hint, `order.amount`, `voucherAmount`, Tempo currency address, `paymentContract`, and `voucherSignature`.
- Audit evidence: `success`, `txHash`, `order.domain`, `order.buyerAddress`, and echoed registrant/order details.
- Error handling: documented `400`, `402`, `409`, and `500` statuses cover validation, payment challenge, unavailable domain, and on-chain registration failure.
