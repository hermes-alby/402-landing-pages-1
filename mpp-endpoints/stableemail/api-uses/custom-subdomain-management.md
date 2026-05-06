# StableEmail: Custom Subdomain Management API Uses

## What This Endpoint Group Does

This group creates and operates a custom email namespace under `*.stableemail.dev`. It covers purchasing a subdomain, checking DNS/SES verification, configuring catch-all forwarding, and adding or removing authorized signer wallets.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/subdomain/buy` | Purchase a custom subdomain | `subdomain` | `success`, `subdomain`, `dnsStatus` |
| POST | `/api/subdomain/signers` | Add or remove signer wallets | `action`, `subdomain`, `walletAddress` | Not documented |
| POST | `/api/subdomain/update` | Update catch-all forwarding | `subdomain`, `catchAllForwardTo` | Not documented |
| GET | `/api/subdomain/status` | Check owner, signer, DNS, and SES status | `subdomain` query | `subdomain`, `ownerWallet`, `dnsVerified`, `sesVerified`, `signerCount`, `signers` |

## Field Notes

### Inputs

`subdomain` is the central identifier. The docs require 3-30 lowercase alphanumeric or hyphen characters for purchase. `action` is `add` or `remove` for signer management. `walletAddress` delegates or revokes sender authority. `catchAllForwardTo` routes unmatched inbound addresses and can be set to `null` to remove catch-all forwarding.

### Outputs

Purchase returns `dnsStatus: pending`; status later exposes `dnsVerified`, `sesVerified`, `ownerWallet`, `signerCount`, and `signers`. The signer and catch-all update endpoints do not publish response schemas.

### Important Constraints Or Gaps

Subdomain purchase costs $5. DNS verification is documented as taking about 5 minutes. Signers are capped at 50 per subdomain. Management endpoints are free but require SIWX wallet proof from the owner, while status can be checked by the owner or any signer.

## Use Cases

### Wallet-Governed Email Namespace

A person can buy a memorable subdomain and use it as a durable email identity without account registration. The `subdomain`, `ownerWallet`, `dnsVerified`, and `sesVerified` fields tell the user whether the namespace is ready to send, while `signers` shows who can act on it.

A business can treat signer wallets as operational permissions. A support agent wallet can send from `support@team.stableemail.dev`, while a finance agent wallet can send from `billing@team.stableemail.dev`, without sharing API keys. The gap is that the docs do not expose role-level permissions beyond signer inclusion.

### Catch-All Lead And Reply Routing

The catch-all setting lets a user forward mail sent to any unmatched local part on the subdomain. That can support personal aliases such as `merchant-name@myname.stableemail.dev` without creating every inbox upfront.

For a business, catch-all forwarding can capture inbound replies from campaigns, product tests, or partner-specific aliases. The `catchAllForwardTo` value controls where those unmatched messages land. The limitation is that catch-all forwarding does not itself retain structured message data; if programmatic access is needed, create explicit subdomain inboxes instead.

### DNS Readiness Checks Before Sending

After a subdomain purchase, the status endpoint gives `dnsVerified` and `sesVerified` booleans. A user or agent can wait until both are true before sending branded mail, avoiding premature sends that may fail or use an unverified identity.

For teams, this supports deployment automation: buy the subdomain, poll status through an SIWX-capable client, then enable workflows only when verification is complete. The docs do not publish detailed DNS error states, so failure diagnostics may still require manual inspection.

### Delegated Agent Operations

The signer list lets a subdomain owner grant sending authority to up to 50 wallets. This is useful for personal agent setups where a main owner wallet controls the subdomain and short-lived agent wallets perform sends.

Businesses can rotate signer wallets for different automation jobs, revoke compromised wallets, and inspect `signerCount` and `signers` as part of an access review. The missing field is an audit log of when signers were added or removed.
