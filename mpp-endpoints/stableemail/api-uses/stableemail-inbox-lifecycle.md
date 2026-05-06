# StableEmail: StableEmail Inbox Lifecycle API Uses

## What This Endpoint Group Does

This group buys, renews, inspects, updates, and cancels `username@stableemail.dev` inboxes. An inbox can forward mail to a real address, retain messages for API access, or do both. The lifecycle fields expose ownership, forwarding, retention, expiration, remaining days, active state, and refund details.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/inbox/buy` | Buy a 30-day inbox | `username`, `forwardTo` | `success`, `inbox`, `retainMessages`, `expiresAt`, `daysRemaining` |
| POST | `/api/inbox/topup` | Add 30 days | `username` | `success`, `inbox`, `expiresAt`, `daysRemaining`, `daysAdded` |
| POST | `/api/inbox/topup/quarter` | Add 90 days | `username` | `success`, `inbox`, `expiresAt`, `daysRemaining`, `daysAdded` |
| POST | `/api/inbox/topup/year` | Add 365 days | `username` | `success`, `inbox`, `expiresAt`, `daysRemaining`, `daysAdded` |
| GET | `/api/inbox/status` | Inspect inbox state | `username` query | `inbox`, `ownerWallet`, `forwardTo`, `retainMessages`, `expiresAt`, `daysRemaining`, `daysOwned`, `active`, `pricing` |
| POST | `/api/inbox/update` | Update forwarding or retention | `username`, `forwardTo`, `retainMessages` | `success`, `inbox`, `forwardTo`, `retainMessages` |
| POST | `/api/inbox/cancel` | Cancel and receive pro-rata refund | `username` | `success`, `inbox`, `cancelled`, `refund`, `daysRemaining` |

## Field Notes

### Inputs

`username` is the main inbox identifier and follows 3-30 lowercase alphanumeric plus hyphen rules. `forwardTo` is optional on buy and update. If omitted at purchase, StableEmail creates a programmatic mailbox with `retainMessages` enabled. Update requires at least one of `forwardTo` or `retainMessages`.

### Outputs

Lifecycle responses expose `expiresAt`, `daysRemaining`, and `daysAdded`, which support renewal decisions. Status adds `ownerWallet`, `daysOwned`, `active`, and an abbreviated `pricing` object. Cancellation may return a `refund` object with `amount`, `currency`, `network`, destination wallet, `status`, and `transactionHash`.

### Important Constraints Or Gaps

Inbox purchase costs $1 for 30 days. Top-ups are $1 for 30 days, $2.50 for 90 days, or $8 for 365 days. Anyone can top up any inbox without SIWX. Status, update, and cancel are free but require SIWX proof from the inbox owner. Refunds below $0.01 are waived.

## Use Cases

### Temporary Project Inbox

A person can buy an inbox for a project, forward it to a real address, and let it expire or cancel when no longer needed. `expiresAt`, `daysRemaining`, and `active` tell the user when to renew, while `forwardTo` confirms where mail is going.

A business can create short-lived inboxes for pilots, procurement events, recruiting campaigns, or test environments. The top-up endpoints make renewal explicit and paid only when the inbox is still useful. The risk is that expiration behavior for retained messages is not fully documented.

### Programmatic Mailbox For Agents

Omitting `forwardTo` at purchase creates a programmatic mailbox with retention enabled. That makes the inbox useful for agents that need to receive confirmations, magic-link emails, receipts, or replies and then read them through the message APIs.

For teams, this creates a controlled inbound channel for workflows without exposing a human mailbox. The `retainMessages` flag is the key field: if false, downstream message access will not work. The privacy policy notes that recipient details, messages, request parameters, wallet metadata, logs, and operational records may be processed, which matters for sensitive mail.

### Renewal And Budget Automation

The top-up endpoints expose concrete cost-duration options and return `daysAdded` plus updated `daysRemaining`. A person can use that to renew only the aliases that are still receiving useful mail.

A business can schedule renewal checks: call status with SIWX proof, compare `daysRemaining` to a policy threshold, and choose 30, 90, or 365 days based on importance. Because anyone can top up any inbox, a billing agent can renew operational inboxes without owning them, but status still requires the owner.

### Controlled Cancellation And Refund Tracking

Cancellation returns a structured refund object when applicable. A person can stop paying for an inbox and record `refund.amount`, `refund.currency`, `refund.network`, and `transactionHash` for wallet reconciliation.

For a business, this enables cost cleanup for abandoned experiment inboxes. `daysRemaining` and refund details can feed finance records. General Merit terms caution that refunds are not guaranteed and on-chain payments may be irreversible, so automation should treat refund fields as observed outcomes rather than promises.
