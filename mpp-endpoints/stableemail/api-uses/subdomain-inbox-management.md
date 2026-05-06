# StableEmail: Subdomain Inbox Management API Uses

## What This Endpoint Group Does

This group manages per-address inboxes under a purchased custom subdomain and reads or deletes retained messages in those inboxes. It supports more structured inbound routing than a single catch-all because each local part can have its own forwarding and retention settings.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/subdomain/inbox/create` | Create a per-address inbox | `subdomain`, `localPart`, `forwardTo` | `success`, `inbox`, `retainMessages`, `messageLimit` |
| POST | `/api/subdomain/inbox/list` | List subdomain inboxes | `subdomain` | `inboxes[].localPart`, `address`, `forwardTo`, `retainMessages`, `active`, `messageCount`, `unreadCount` |
| POST | `/api/subdomain/inbox/update` | Update forwarding or retention | `subdomain`, `localPart`, `forwardTo`, `retainMessages` | `success`, `inbox`, `forwardTo`, `retainMessages` |
| POST | `/api/subdomain/inbox/delete` | Delete an inbox and its messages | `subdomain`, `localPart` | `success`, `deleted`, `messagesDeleted` |
| POST | `/api/subdomain/inbox/messages` | List retained messages | `subdomain`, `localPart`, `cursor`, `limit` | `success`, `messages`, `nextCursor`, `messageCount`, `messageLimit`, `warning` |
| POST | `/api/subdomain/inbox/messages/read` | Read one retained message | `messageId` | `message.id`, `from`, `to`, `subject`, `date`, `text`, `html`, `attachments`, `receivedAt` |
| POST | `/api/subdomain/inbox/messages/delete` | Delete one retained message | `messageId` | `success`, `deleted` |

## Field Notes

### Inputs

`subdomain` and `localPart` identify each inbox. `forwardTo` is optional at creation and can be removed with `null` on update. `retainMessages` controls API-readable storage. Message listing accepts `cursor` and `limit`; reads and deletes use `messageId`.

### Outputs

Inbox listing returns operational counts through `messageCount` and `unreadCount`. Message listing returns capacity fields `messageCount`, `messageLimit`, and optional `warning`; reads return full message content and attachment metadata. Deleting an inbox returns `messagesDeleted`, which is useful for cleanup accounting.

### Important Constraints Or Gaps

Subdomain inbox creation costs $0.25. Each custom subdomain is capped at 100 inboxes, and each inbox has a 500-message limit. Message list/read calls cost $0.001 each. Management and delete endpoints are free but require SIWX proof from the subdomain owner. The docs say unmatched addresses go to the subdomain catch-all if configured, otherwise they are silently dropped.

## Use Cases

### Alias-Per-Counterparty Routing

A person can create one local part per vendor, marketplace, or project, such as `bank@myname.stableemail.dev` or `travel@myname.stableemail.dev`. `localPart`, `forwardTo`, and `retainMessages` let each alias decide whether to forward to a human mailbox, stay programmatic, or do both.

A business can create structured addresses for customers, suppliers, campaigns, or products. The list endpoint's `messageCount` and `unreadCount` fields expose which aliases are active without reading every message. The 100-inbox cap means this is better for curated aliases than unlimited tracking-address generation.

### Programmatic Support Intake

For a small team, each support queue can have a dedicated address under the custom subdomain. The message list and read endpoints provide sender, subject, timestamps, body text/html, and attachments metadata for ticket creation.

The business value is cleaner routing: `localPart` identifies the queue, `unreadCount` measures backlog, and `messageCount` plus `warning` highlight inboxes approaching capacity. The missing features are webhooks, search, labels, and delivery of attachment content.

### Campaign Reply Capture

A person or business can create one inbox per campaign or experiment and retain messages for later analysis. The caller can list messages with cursors, read selected bodies, and delete messages after analysis.

For business use, this supports lead response analysis, event RSVPs, partner onboarding, or product-launch feedback. The `messageLimit` and `warning` fields are important because losing capacity could silently degrade capture. Since the docs do not document bounce or spam handling, this should not be treated as a bulk campaign platform.

### Data Minimization For Custom-Domain Mail

After a message is processed, the free delete endpoint removes it by `messageId`. Deleting an entire local-part inbox returns `messagesDeleted`, giving a useful cleanup count.

Businesses can use this for privacy-sensitive aliases where retained messages should be short-lived. The docs state inbox deletion cascades to DB and S3, but they do not define backups, logs, or retention windows, so deletion should be treated as operational cleanup rather than a full legal erasure guarantee.

### Multi-Agent Mailbox Ownership

A subdomain owner can maintain multiple inboxes for different agents or workflows while centralizing ownership at the subdomain wallet. Each local part can have its own forwarding and retention choice.

For a business, this supports scoped automation: one agent monitors `orders@...`, another monitors `support@...`, and a finance workflow monitors `receipts@...`. The open question is whether authorized signers can manage these inboxes or only send from the subdomain; the docs specifically say the owner manages subdomain inboxes.
