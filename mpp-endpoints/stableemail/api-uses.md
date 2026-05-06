# StableEmail API Uses

## Service Summary

StableEmail is a Merit Systems, first-party, MPP-native email service for accountless sending, forwarding inboxes, retained-message access, and custom `*.stableemail.dev` subdomains. It replaces API keys and subscriptions with per-operation x402/MPP payments for sends, inbox rentals, subdomain purchases, inbox creation, top-ups, and message reads/lists. Free management operations still use SIWX wallet proof for ownership.

The strongest use cases are low-volume email automation where sender identity, reply capture, and accountless payment matter more than a full email-provider control plane.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Email Sending And Delivery | 3 | Send through the shared relay, a custom subdomain address, or a purchased inbox address. | [`api-uses/email-sending-and-delivery.md`](api-uses/email-sending-and-delivery.md) |
| Custom Subdomain Management | 4 | Buy and verify a subdomain, configure catch-all forwarding, and delegate signer wallets. | [`api-uses/custom-subdomain-management.md`](api-uses/custom-subdomain-management.md) |
| StableEmail Inbox Lifecycle | 7 | Buy, renew, inspect, update, and cancel `username@stableemail.dev` inboxes. | [`api-uses/stableemail-inbox-lifecycle.md`](api-uses/stableemail-inbox-lifecycle.md) |
| StableEmail Inbox Message Access | 3 | List, read, and delete retained messages for a hosted StableEmail inbox. | [`api-uses/stableemail-inbox-message-access.md`](api-uses/stableemail-inbox-message-access.md) |
| Subdomain Inbox Management | 7 | Create, list, update, delete, and read per-address inboxes under a custom subdomain. | [`api-uses/subdomain-inbox-management.md`](api-uses/subdomain-inbox-management.md) |

## Highest-Value Uses

- Accountless transactional email for agents that need to send a small number of concrete messages without storing API keys or subscribing to a provider.
- Programmatic inboxes that can receive confirmations, receipts, replies, or workflow inputs, then expose message summaries and full content through paid message APIs.
- Wallet-governed custom subdomain email where the owner can delegate sender authority to signer wallets instead of sharing credentials.
- Alias-based inbound routing under a custom subdomain, with per-local-part forwarding, retention, message counts, unread counts, and cleanup.
- Budget-aware email workflows where each send, message read, inbox renewal, or mailbox creation has an explicit per-request USDC cost.

## Personal Use Opportunities

A person can use StableEmail as a pay-as-needed mail utility: send a one-off note, buy a temporary forwarding address, receive a verification or receipt into a programmatic inbox, or create custom aliases under a personal subdomain. The useful fields are simple and operational: `to`, `cc`, `subject`, `html`, `text`, `replyTo`, `messageId`, `expiresAt`, `daysRemaining`, `fromEmail`, `receivedAt`, and `read`.

The strongest personal pattern is a temporary or task-specific inbox with retention enabled. The user can receive messages, read selected content, and delete old messages without maintaining a full email account. The caveat is privacy and sensitivity: Merit privacy terms indicate that messages, recipient details, wallet/payment metadata, request parameters, logs, and operational data may be processed.

## Business Use Opportunities

Businesses can use StableEmail for low-volume operational email where setting up a traditional provider account would be disproportionate: support experiments, paid-agent notifications, vendor-specific aliases, campaign reply capture, project mailboxes, or branded subdomain sending. Custom subdomain signer management is particularly useful for teams because wallet access can be delegated and revoked without central API-key sharing.

StableEmail is not documented as a bulk marketing or deliverability analytics platform. It lacks published OpenAPI schemas, bounce/complaint events, suppression lists, webhooks, rate limits, idempotency keys, and recipient-level delivery status. Merit terms also prohibit spam, phishing, deceptive outreach, impersonation, harmful content, and unlawful personal-data use.

## Endpoint Group Summaries

### Email Sending And Delivery

The three sending endpoints support shared relay email, custom subdomain email, and hosted inbox-address email. They accept recipient arrays, optional `cc`, subject, `html` or `text`, and optional `replyTo`; only the shared relay documents attachments. The group is best for concrete low-volume outbound messages and agent-triggered notifications. Full details: [`api-uses/email-sending-and-delivery.md`](api-uses/email-sending-and-delivery.md).

### Custom Subdomain Management

Custom subdomain endpoints create the branded identity layer. They purchase a subdomain, expose DNS/SES verification booleans, configure catch-all forwarding, and manage up to 50 authorized signer wallets. This is the access-control layer for branded sending and subdomain inboxes. Full details: [`api-uses/custom-subdomain-management.md`](api-uses/custom-subdomain-management.md).

### StableEmail Inbox Lifecycle

Hosted inbox lifecycle endpoints buy 30-day inboxes, top them up for 30/90/365 days, inspect owner/retention/expiry state, update forwarding or retention, and cancel with a pro-rata refund when applicable. The key fields are `expiresAt`, `daysRemaining`, `daysAdded`, `retainMessages`, `active`, and `refund`. Full details: [`api-uses/stableemail-inbox-lifecycle.md`](api-uses/stableemail-inbox-lifecycle.md).

### StableEmail Inbox Message Access

Hosted inbox message endpoints list, read, and delete retained messages. List responses expose sender, subject, receipt time, and read state; read responses expose full `text`/`html` bodies and attachment metadata. This is the API layer that turns a paid inbox into a programmatic mailbox. Full details: [`api-uses/stableemail-inbox-message-access.md`](api-uses/stableemail-inbox-message-access.md).

### Subdomain Inbox Management

Subdomain inbox endpoints create and operate many per-address mailboxes under a purchased subdomain. They provide per-inbox forwarding and retention settings, counts, unread counts, message capacity warnings, full message reads, and deletion paths. This group is the best fit for structured aliases, support queues, campaign-specific addresses, and cleanup workflows. Full details: [`api-uses/subdomain-inbox-management.md`](api-uses/subdomain-inbox-management.md).

## Field And Data Themes

- Email identity fields: `from`, `username`, `subdomain`, `localPart`, `inbox`, `address`.
- Recipient and routing fields: `to`, `cc`, `replyTo`, `forwardTo`, `catchAllForwardTo`.
- Content fields: `subject`, `html`, `text`, `attachments[].filename`, `attachments[].contentType`, shared-relay `attachments[].content`.
- Message triage fields: `messageId`, `messages[].id`, `fromEmail`, `receivedAt`, `read`, `nextCursor`.
- Ownership and authorization fields: `ownerWallet`, `walletAddress`, `signers`, `signerCount`.
- Lifecycle and capacity fields: `expiresAt`, `daysRemaining`, `daysOwned`, `daysAdded`, `active`, `messageCount`, `unreadCount`, `messageLimit`, `warning`, `messagesDeleted`.
- Money fields: $0.02 shared relay sends, $0.005 custom/inbox sends, $5 subdomain purchase, $1/$2.50/$8 inbox top-ups, $0.25 subdomain inbox creation, $0.001 message list/read operations, and refund amount/currency/network/transaction hash.
