# StableEmail: Email Sending And Delivery API Uses

## What This Endpoint Group Does

This group sends outbound email through three sender identities: the shared `relay@stableemail.dev` address, a purchased custom subdomain address, or a purchased `username@stableemail.dev` inbox address. The common fields are recipient arrays, optional `cc`, `subject`, `html`, `text`, and `replyTo`; the returned fields are `success`, `messageId`, and the final `from` address.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/send` | Send from shared relay | `to`, `cc`, `subject`, `html`, `text`, `replyTo`, `attachments` | `success`, `messageId`, `from` |
| POST | `/api/subdomain/send` | Send from a custom subdomain address | `from`, `to`, `cc`, `subject`, `html`, `text`, `replyTo` | `success`, `messageId`, `from` |
| POST | `/api/inbox/send` | Send from a purchased inbox address | `username`, `to`, `cc`, `subject`, `html`, `text`, `replyTo` | `success`, `messageId`, `from` |

## Field Notes

### Inputs

`html` or `text` is required for every send. The refreshed `llms.txt` documents `cc` on all send examples. The shared relay endpoint is the only send endpoint that documents `attachments`, with max 5 attachments, base64 content, MIME `contentType`, `filename`, and about a 3.75 MB decoded limit. Calendar invites can use `text/calendar; method=REQUEST`.

### Outputs

The response is intentionally small: a boolean `success`, a `messageId`, and the `from` address that was used. It does not expose delivery status, bounce reason, complaint data, open/click tracking, or recipient-level status.

### Important Constraints Or Gaps

Shared relay sends cost $0.02. Custom subdomain sends and inbox sends cost $0.005. Custom subdomain sends require the payer wallet to be the owner or authorized signer. Inbox sends require the payer wallet to own the inbox. Merit terms prohibit spam, phishing, deceptive outreach, impersonation, harmful content, and unlawful personal-data use.

## Use Cases

### Accountless Transactional Notifications

A person can send a one-off notification, invoice note, calendar invite, or file-backed message without creating a SaaS account or storing an API key. The useful fields are `to`, optional `cc`, `subject`, `html` or `text`, and optional shared-relay `attachments`; `messageId` gives the caller a minimal delivery record for logs or receipts.

A business can use the same pattern for low-volume workflow alerts where a full email provider account is not worth the setup: procurement approvals, paid research summaries, build notifications, or one-off customer updates. The output is not enough for deliverability analytics, so critical high-volume or compliance-heavy campaigns would still need a provider that exposes bounces, suppression lists, and audit tooling.

### Branded Agent Email From A Project Subdomain

A project that has purchased a StableEmail subdomain can send from `name@project.stableemail.dev` instead of the shared relay. The `from` field lets the caller choose a role address, while signer authorization lets a team delegate sending to selected wallets without sharing a central secret.

For a business, this is useful when multiple agents need clear sender identity: support triage, DAO operations, investor updates, or customer success notes. The returned `from` and `messageId` can be written into an audit log alongside the paying wallet, but the docs do not expose a full compliance-grade message event trail.

### Inbox-Centered Reply Loops

When a user buys `username@stableemail.dev`, `POST /api/inbox/send` lets the same address send outbound mail and receive replies through the inbox message APIs. That matters for personal workflows such as temporary project communication, receipts, or agent-mediated correspondence where replies should be available programmatically.

For a business, inbox-address sending is useful for role-specific workflows like `billing@stableemail.dev` style aliases during an experiment. The `replyTo` field can route human replies elsewhere, while `retainMessages` on the inbox can support programmatic reply processing. The missing piece is documented threading or conversation IDs; callers must correlate via sender, subject, timestamps, and message bodies.

### Paid Email From Autonomous Workflows

An agent can decide whether a send is worth $0.005 or $0.02 per message and only pay when the final recipient, body, and sender identity are known. This is stronger than a prepaid email bucket for occasional automation because the action and cost are coupled to a single request.

For teams, this supports budgeted automations: send only the escalation email after a monitoring threshold is crossed, or send only the customer note after a paid research task completes. The limitation is that the API itself does not publish idempotency keys or retry semantics, so agent clients should avoid blind retries that could duplicate messages or payments.
