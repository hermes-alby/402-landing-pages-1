# StableEmail: StableEmail Inbox Message Access API Uses

## What This Endpoint Group Does

This group lists, reads, and deletes retained inbound messages for a `username@stableemail.dev` inbox. It is useful only when the inbox has `retainMessages: true`, which can be set during purchase or through the inbox update endpoint.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/inbox/messages` | List retained inbox messages | `username`, `cursor`, `limit` | `success`, `messages[].id`, `fromEmail`, `subject`, `receivedAt`, `read`, `nextCursor` |
| POST | `/api/inbox/messages/read` | Read one retained message | `messageId` | `success`, `message.id`, `from`, `to`, `subject`, `date`, `text`, `html`, `attachments`, `receivedAt` |
| POST | `/api/inbox/messages/delete` | Delete one retained message | `messageId` | `success`, `deleted` |

## Field Notes

### Inputs

Listing uses `username`, optional `cursor`, and optional `limit`. Reading and deletion use `messageId`, which is obtained from message listings. Pagination is cursor-based: pass `nextCursor` as the next `cursor`.

### Outputs

List responses provide lightweight triage fields: sender, subject, receipt timestamp, and `read`. Read responses provide full content in `text` and `html`, recipients in `to`, message `date`, attachment metadata, and `receivedAt`. Reading marks the message as read.

### Important Constraints Or Gaps

Listing and reading each cost $0.001. Deletion is free but requires SIWX proof from the inbox owner. The docs do not publish search, sender filtering, unread filtering, bulk deletion, attachment download, or message retention duration.

## Use Cases

### Agent Reply Processing

A personal agent can list messages for a programmatic inbox, read only unread or relevant items, and extract action items from `subject`, `fromEmail`, `text`, or `html`. `messageId` and `read` allow the agent to avoid repeatedly processing the same mail.

For a business, this can power low-volume support or operations triage. A job can list messages, read only new items, classify the body, and route work to a CRM or ticket queue. The API does not provide labels, folders, or search, so any routing state needs to live in the caller's system.

### Verification And Receipt Capture

A person can use a programmatic inbox to receive receipts, confirmation emails, or non-sensitive verification messages and then read the content when needed. The valuable fields are `from`, `to`, `subject`, `date`, `text`, `html`, and attachment metadata.

Businesses can capture operational receipts for paid agent actions and attach the `messageId`, sender, timestamp, and body extract to an audit record. Because the privacy policy covers messages, recipient details, and logs, sensitive or regulated inbox contents should be treated carefully.

### Lightweight Mail Monitoring

The list endpoint can support a simple monitor that checks `receivedAt`, `fromEmail`, `subject`, and `read` for new messages. A person could use this for travel alerts, account notices, or project updates.

A business could monitor a shared inbox for inbound leads or vendor notices and trigger an internal notification when a subject or sender matches a rule. Since listing itself is paid, monitoring frequency should match the value of the inbox, and high-frequency polling may be economically inefficient.

### Retention Cleanup

The delete endpoint removes messages from DB and S3 storage according to the docs. A person can delete old retained emails after extracting what they need.

For a business, deletion can be part of a data-minimization workflow after a message is routed into the system of record. The API does not document bulk deletion or retention policies, so callers need to iterate message IDs and keep their own deletion ledger.
