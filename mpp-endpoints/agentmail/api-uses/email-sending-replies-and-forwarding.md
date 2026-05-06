# AgentMail: Email Sending, Replies, And Forwarding API Uses

## What This Endpoint Group Does

This endpoint group is AgentMail's paid outbound-message surface in the MPP manifest. It lets an agent send a new message from a specific `inbox_id`, reply to an existing `message_id`, reply to all original conversation participants, or forward an existing message to new recipients. New sends create a `thread_id`; replies and reply-all operations add a new `message_id` to the existing conversation thread; forwards route an existing message onward while still returning the new outbound message and thread identifiers.

All four endpoints are `POST` operations and all four are marked as MPP paid charge endpoints in the inventory. Each costs `0.01` token units using the Tempo payment metadata from the mpp-dev feed (`amount: "10000"`, `decimals: 6`, currency `0x20c000000000000000000000b9537d11c60e8b50`). The direct OpenAPI operations require a bearer `Authorization` header, while the MPP path is exposed under `https://mpp.api.agentmail.to` and uses MPP negotiation through `mppx`.

## Endpoints Covered

| Endpoint ID | Operation | Method | MPP path | Required path fields | Request body schema | Success output | MPP cost |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `endp_b4bf8cad5064bd90f569` | Send Message | `POST` | `/v0/inboxes/:inbox_id/messages/send` | `inbox_id` | `type_messages:SendMessageRequest` | `message_id`, `thread_id` | `0.01` token units |
| `endp_d438c44b58bd45e87d6e` | Reply To Message | `POST` | `/v0/inboxes/:inbox_id/messages/:message_id/reply` | `inbox_id`, `message_id` | `type_messages:ReplyToMessageRequest` | `message_id`, `thread_id` | `0.01` token units |
| `endp_da32965be43d207b70b5` | Reply All Message | `POST` | `/v0/inboxes/:inbox_id/messages/:message_id/reply-all` | `inbox_id`, `message_id` | `type_messages:ReplyAllMessageRequest` | `message_id`, `thread_id` | `0.01` token units |
| `endp_0e4020130b4cd7d0f357` | Forward Message | `POST` | `/v0/inboxes/:inbox_id/messages/:message_id/forward` | `inbox_id`, `message_id` | `type_messages:SendMessageRequest` | `message_id`, `thread_id` | `0.01` token units |

## Field Notes

### Inputs

`inbox_id` is always required and identifies the inbox sending the outbound email. For `reply`, `reply-all`, and `forward`, `message_id` is also required and identifies the existing message being continued or routed onward.

`send` and `forward` use `SendMessageRequest`. The documented request fields are `labels`, `reply_to`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, `attachments`, and `headers`. Address fields resolve to the `Addresses` schema, which accepts either a string or an array of strings. `headers` is an object whose additional properties are strings. `labels` is an array of strings.

`reply` uses `ReplyToMessageRequest`. It keeps `labels`, `reply_to`, `to`, `cc`, `bcc`, `text`, `html`, `attachments`, and `headers`, and adds `reply_all` as a boolean. It does not expose `subject` in this schema, because it is anchored to an existing `message_id`.

`reply-all` uses `ReplyAllMessageRequest`. It exposes `labels`, `reply_to`, `text`, `html`, `attachments`, and `headers`, but does not expose `to`, `cc`, `bcc`, or `subject`; recipients are implied by the original message context rather than supplied directly in the request body.

Outgoing `attachments` are arrays of `SendAttachment` objects with optional `filename`, `content_type`, `content_disposition`, `content_id`, `content`, and `url`. `content_disposition` is the only enum in this group and can be `inline` or `attachment`. The docs say outgoing file content should be Base64 encoded; the OpenAPI schema describes `content` as a string and also includes a `url` field.

### Outputs

Every endpoint has the same `200` response schema, `type_messages:SendMessageResponse`, with required `message_id` and `thread_id` string fields. The inventory also records common error shapes: `400` returns `name` and `errors`; `403` and `404` return `name` and `message`.

The broader docs describe a sent message as a `Message` object and mention message fields such as sender, recipients, subject, body, attachments, and labels, but the OpenAPI response for these four MPP-covered operations only commits to `message_id` and `thread_id`. Clients that need full message state should follow up through message or thread read endpoints rather than assuming these send operations return the full message record.

### Important Constraints Or Gaps

Each send or reply supports a maximum of 50 recipients across `to`, `cc`, and `bcc`. This matters for `send`, `forward`, and `reply` when explicit recipient fields are supplied; `reply-all` derives recipients from the existing message and does not expose recipient override fields in its body.

The docs recommend sending both `text` and `html` for readability and deliverability, even though the OpenAPI schemas do not mark either field as required. They also note that `messages.send` is not idempotent via `client_id`; duplicate-send prevention must be handled in application state, with labels or the draft workflow for critical messages.

Deliverability and policy checks can block sends. AgentMail may return `403` when a recipient has previously bounced, been rejected, or filed a spam complaint. Send allow/block lists can also constrain which addresses or domains an agent can contact. The retrieved public sources do not give an MPP-specific error schema for payment negotiation failures, quota exhaustion after payment negotiation, or how subscription sending limits map onto MPP pay-per-request use.

The public docs publish plan sending limits of 3,000 emails/month on Free, 10,000 on Developer, 150,000 on Startup, and custom on Enterprise, plus `429 Too Many Requests` with `Retry-After` for API-key rate limiting. The service research notes that the public snapshots do not state how those limits apply to MPP usage.

## Use Cases

1. Customer-support agent replies from a dedicated support inbox. The agent reads an inbound message, uses the latest `message_id`, sends `text` and `html` through `/reply`, and stores the returned `message_id` and `thread_id` for audit and follow-up tracking.

2. Sales or recruiting outreach starts new conversations with labels. A workflow sends from a campaign-specific `inbox_id` through `/messages/send`, supplies `to`, `subject`, `text`, `html`, and labels such as `outreach` or `follow-up`, then uses the returned `thread_id` to correlate later replies.

3. Human-in-the-loop oversight without holding the email. An autonomous agent sends routine email while adding a manager in `cc` or `bcc`; the relevant request fields are `cc`, `bcc`, `headers`, and `labels`, and the cost is a predictable `0.01` token units per outbound message.

4. Group-thread response where everyone should stay copied. The agent calls `/reply-all` with only the source `message_id`, response body fields, optional labels, and optional attachments, relying on AgentMail to derive the recipient set from the original conversation.

5. Escalation or routing through forwarding. A triage agent forwards an existing `message_id` to a specialist or external partner using `/forward` with `to`, optional `cc`/`bcc`, optional `subject`, and explanatory `text` or `html`.

6. Attachment-bearing transactional communication. A billing or reporting agent sends or replies with a Base64-encoded attachment, setting `attachments[].filename`, `attachments[].content_type`, and optionally `attachments[].content_disposition` to distinguish inline content from file attachments.

7. Safety-bounded autonomous sending. A system combines send allow/block lists with `to`, `cc`, and `bcc` fields, keeping recipient choice constrained while still letting agents send low-risk routine responses through paid MPP requests.

8. Duplicate-reply prevention in agent loops. A message-processing worker checks labels such as `unreplied` before calling `/reply`, then records the returned `message_id` and applies follow-up labels through separate message update endpoints so retries do not produce repeated outbound email.
