# Doma: Domain Registration API Uses

## What This Endpoint Group Does

The Domain Registration endpoint group covers Doma's single MPP-exposed registration flow: `POST https://mpp.doma.xyz/register`. It accepts a full domain name, an EVM buyer address, and ICANN-style registrant contact details, then uses the Interstellar registrar flow to check availability, price the registration dynamically, issue an HTTP 402 MPP/Tempo payment challenge, and complete registration after a valid payment credential is supplied.

The value of the endpoint is operational compression. A caller can turn a desired domain string plus verified buyer/contact data into a paid, tokenized domain assigned to a wallet, without separately operating registrar credentials, availability lookup, price lookup, stablecoin payment, voucher handling, and Doma tokenization steps. The response gives both business evidence (`success`, `domain`, `order.amount`, `order.registrantContact`) and on-chain/payment evidence (`txHash`, `network`, `paymentContract`, `voucherAmount`, `order.voucher`, `order.voucherSignature`) that downstream systems can reconcile.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `https://mpp.doma.xyz/register` | Register a supported domain through a dynamic-price MPP/Tempo flow and assign the tokenized domain to an EVM buyer address. | `domain`, `buyerAddress`, `contact.firstName`, `contact.lastName`, `contact.email`, `contact.phone`, `contact.phoneCountryCode`, `contact.street`, `contact.city`, `contact.state`, `contact.postalCode`, `contact.countryCode`, optional `contact.organization`, optional fax fields, `Content-Type`, MPP `Authorization` credential on retry. | `success`, `domain`, `network`, `txHash`, `paymentContract`, `voucherAmount`, `order.domain`, `order.amount`, `order.buyerAddress`, `order.registrantContact`, `order.voucher`, `order.voucherSignature`. |

## Field Notes

### Inputs

`domain` is the acquisition target and must include the TLD. It is the central workflow key for brand clearance, budget approval, availability conflict handling, and later portfolio indexing.

`buyerAddress` is the destination wallet for the tokenized domain. It determines where the resulting asset should appear for Doma management, bridging, listing, DNS setup, or later claiming flows.

`contact` is registrant identity and address data. Required fields cover person name, email, phone, phone country code, street, city, state, postal code, and country code; `organization`, `fax`, and `faxCountryCode` are optional. These fields are sensitive personal or company data and should be collected only with consent and appropriate retention controls.

The first request is ordinary JSON with `Content-Type: application/json`; payment authorization is supplied only on the MPP retry after the HTTP 402 challenge. The endpoint should not be probed casually because the intended successful path pays and mutates registrar/on-chain state.

### Outputs

`success`, `domain`, and `network` let a caller confirm that the registration completed for the intended name and environment. `txHash` and `paymentContract` give an auditable blockchain reference for operations, finance, support, and incident review.

`order.amount` and `voucherAmount` expose the priced order in human and payment-unit forms. These fields support budget reconciliation, cost allocation, and detection of price drift between approval and settlement.

`order.buyerAddress` and `order.registrantContact` echo the registration owner context. They are useful for internal audit trails and customer support, but also create privacy obligations because they contain wallet and registrant identity data.

`order.voucher` and `order.voucherSignature` are payment/order evidence from the dynamic-price flow. They can help prove which domain, buyer, amount, and registrant details were bound into the paid order, subject to the public docs' limited schema detail.

### Important Constraints Or Gaps

This is a paid, mutating registration workflow. No research workflow should call production `/register`, sign payment credentials, pay invoices, create accounts, or submit real availability/registration queries without explicit approval.

Pricing is dynamic and varies by domain/TLD. The MPP skill says the server looks up the real USD price from Interstellar, so callers need quote review, budget caps, and retry logic for changed prices.

Supported TLD scope is unclear. The MPP skill lists `com`, `xyz`, `ai`, `io`, `net`, `cash`, `live`, and `fyi`, while official supported-TLD docs list a much broader set.

The upstream Interstellar API path, OpenAPI schema, registration term, renewal defaults, DNS defaults, WHOIS/privacy behavior, refund handling, voucher schema, error body schema, and quote expiration policy are not documented in the local public snapshots.

Official Doma APIs generally require an `Api-Key` header and have a 10 rps limit, but the MPP `/register` skill documents MPP payment authorization rather than an API key requirement. Treat API-key scope as unresolved.

Domain registration has rights, abuse, and compliance risk. Doma and Interstellar terms place responsibility on users for lawful use, wallet security, transaction review, trademark/non-infringement, anti-phishing, anti-impersonation, and other abuse controls.

## Use Cases

### Agent-Assisted Personal Domain Purchase

An individual could use this endpoint through a trusted wallet-enabled assistant to register a personal site, portfolio, project, or creator domain in one payment-gated flow. The assistant would gather the desired `domain`, confirm the buyer's EVM `buyerAddress`, collect registrant contact fields, present the dynamic `order.amount`, and proceed only after explicit payment approval. The result gives the user a `txHash`, `network`, and `order.buyerAddress` to confirm that the asset landed in the right wallet for later Doma management.

For a small business, the same workflow can turn a marketing or product launch request into a controlled acquisition path without handing staff direct registrar credentials. The contact and organization fields bind the domain to the correct legal or operating entity; `order.amount` and `voucherAmount` feed expense tracking; `txHash` and `voucherSignature` provide support and audit evidence. The main limits are cost freshness, TLD support uncertainty, and privacy obligations around storing registrant contact data.

### Brand Protection and Defensive Registration

A person with a public profile can use the endpoint to defensively acquire obvious variants of a name, project, or creator brand before launching. The useful fields are the candidate `domain`, the buyer wallet, and the echoed `order` details that prove which variant was paid for and assigned. A workflow could stop on `409` for unavailable names, reject unsupported TLDs on `400`, and record completed registrations with `txHash` for future proof of control.

For companies, this becomes a narrowly scoped defensive-registration lane for product names, campaign names, and high-risk typo or TLD variants. Legal or brand teams can pre-screen candidate domains for trademark and abuse risk, approve spend ceilings, and route approved registrations through a service wallet. Returned `order.amount`, `domain`, `buyerAddress`, and `registrantContact` support procurement, legal audit, and portfolio reconciliation. The endpoint should not replace trademark clearance, dispute policy review, abuse screening, or registrar governance, and dynamic prices mean batch jobs need per-domain approval thresholds.

### Web3 Product Launch Domain Onboarding

A developer launching a dApp, protocol, game, or community can register a conventional Web2 domain and have it tokenized to the same wallet that will manage Doma records later. The `buyerAddress` field is the bridge between registration and the Web3 management surface; the success response's `network` and `txHash` tell the launch checklist that the on-chain registration step completed. Afterward, the team can use Doma tooling for nameservers, DNS records, claiming, bridging, or marketplace actions where appropriate.

For a business launch team, the endpoint can sit behind an internal "reserve launch domain" workflow. Product owners submit candidate names and registrant information, finance approves the dynamic `order.amount`, and platform engineering receives `txHash`, `paymentContract`, and `voucherAmount` for reconciliation. The main prerequisites are secure wallet custody, explicit payment approval, agreement on registrant identity, and a policy for testnet versus mainnet because testnet domains do not carry to production.

### Domain Portfolio Acquisition and Tokenized Asset Inventory

A domainer or collector can use the endpoint to acquire supported domains directly into an EVM wallet, keeping acquisition and tokenized-asset tracking aligned. `domain`, `buyerAddress`, `order.amount`, and `txHash` form a compact acquisition record; `network` distinguishes test and production experiments; `order.voucherSignature` can help tie payment evidence to the exact registration order. This makes it easier to compare purchase cost, later listing price, and realized sale results in a Doma-centered portfolio ledger.

For a domain investment business, the same fields support a controlled intake pipeline: candidate scoring happens outside the endpoint, approved candidates are registered through MPP, and completed orders are indexed by domain, wallet, cost, and transaction hash. The returned data enables accounting, tax support, inventory controls, and later marketplace automation using Doma's orderbook, poll API, subgraph, or SDK. Limitations include uncertain TLD coverage, unclear renewal defaults, and the need to handle intellectual-property complaints or abusive-name policies before acquiring names at scale.

### Customer-Facing Domain Provisioning

A builder of website, creator, or startup tooling could use the endpoint to provision a domain for a customer after checkout and identity/contact capture. The app would map customer-provided registrant data into `contact`, use the customer's or platform-controlled `buyerAddress`, request the registration, and show completion only after `success` and `txHash` are returned. `order.registrantContact` and `order.amount` give the platform a support record for "what was registered, for whom, at what cost."

For businesses, this can turn domain registration into an embedded add-on without building a full registrar integration. A SaaS platform could bundle "register and tokenize my domain" into onboarding, then trigger downstream DNS configuration or Doma management instructions after the response arrives. The compliance burden is substantial: the platform must obtain registrant consent, protect personal data, screen names for prohibited or infringing use, handle failed payments and `409` unavailability gracefully, and avoid silently spending customer funds when dynamic price changes.

### Finance, Audit, and Incident Reconciliation

For an individual user, the endpoint response can serve as a receipt-like record for a paid registration: `order.amount` says what was charged, `voucherAmount` reflects the payment unit amount, `paymentContract` identifies the payment contract, and `txHash` anchors the transaction. If the domain does not appear where expected, those fields help support trace whether the issue is wallet mismatch, network mismatch, registrar state, or on-chain execution.

For a company, the same output fields enable procurement controls and incident response. Finance can reconcile Tempo payments against `order.amount`, engineering can link `txHash` to deployment or wallet-management logs, and support can inspect `order.domain`, `buyerAddress`, and `registrantContact` when a customer reports a registration problem. The gaps are important: the documented JSON does not include a first-class timestamp, quote expiration, refund state, renewal term, or complete error schema, so production systems should persist the full HTTP response, MPP receipt metadata when available, and local approval records.
