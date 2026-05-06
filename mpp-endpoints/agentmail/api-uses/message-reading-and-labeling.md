# AgentMail: Message Reading And Labeling API Uses

## What This Endpoint Group Does

This endpoint group lets an agent inspect messages in a specific AgentMail inbox, fetch full message content, retrieve attachment and raw `.eml` download links, and update message labels that represent workflow state. It covers the message-level primitives needed after an inbox already exists: polling or filtering messages, loading a specific message by `message_id`, pulling attachment metadata by `attachment_id`, preserving raw source content, and moving a message through labels such as `unread`, `read`, `processed`, `needs-human-review`, or campaign-specific tags.

The group is MPP-exposed through `https://mpp.api.agentmail.to`, while the official OpenAPI source describes the corresponding direct API paths under `/v0`. The inventory shows empty `payment` metadata for all five endpoints in this group, so no explicit per-call MPP amount is published in the assigned inventory records. This should be treated as a pricing gap, not as proof that the endpoints are free under MPP.

## Endpoints Covered

| Endpoint ID | Method | MPP path | Direct API path | Purpose | Key fields | MPP cost metadata |
| --- | --- | --- | --- | --- | --- | --- |
| `endp_a5ccb2f6c6ebe7fd245f` | `GET` | `/v0/inboxes/:inbox_id/messages` | `/v0/inboxes/{inbox_id}/messages` | List messages in one inbox. | Inputs: `inbox_id`, `limit`, `page_token`, `labels`, `before`, `after`, `ascending`, `include_spam`, `include_blocked`, `include_trash`. Outputs: `count`, `limit`, `next_page_token`, `messages[]`. | `{}` in inventory; no amount/currency. |
| `endp_677309d51a1b3f557017` | `GET` | `/v0/inboxes/:inbox_id/messages/:message_id` | `/v0/inboxes/{inbox_id}/messages/{message_id}` | Get one full message. | Inputs: `inbox_id`, `message_id`. Outputs include `thread_id`, `labels`, `timestamp`, `from`, `reply_to`, `to`, `cc`, `bcc`, `subject`, `preview`, `text`, `html`, `extracted_text`, `extracted_html`, `attachments`, `headers`, `size`. | `{}` in inventory; no amount/currency. |
| `endp_0e8cce7a6d31b401a88d` | `GET` | `/v0/inboxes/:inbox_id/messages/:message_id/attachments/:attachment_id` | `/v0/inboxes/{inbox_id}/messages/{message_id}/attachments/{attachment_id}` | Get an attachment download descriptor for a message. | Inputs: `inbox_id`, `message_id`, `attachment_id`. Outputs: `attachment_id`, `filename`, `size`, `content_type`, `content_disposition`, `content_id`, `download_url`, `expires_at`. | `{}` in inventory; no amount/currency. |
| `endp_cce8556e501b4891c0f4` | `GET` | `/v0/inboxes/:inbox_id/messages/:message_id/raw` | `/v0/inboxes/{inbox_id}/messages/{message_id}/raw` | Get a raw message download descriptor. | Inputs: `inbox_id`, `message_id`. Outputs: `message_id`, `size`, `download_url`, `expires_at` for the raw `.eml`. | `{}` in inventory; no amount/currency. |
| `endp_efb473682248d52bdc30` | `PATCH` | `/v0/inboxes/:inbox_id/messages/:message_id` | `/v0/inboxes/{inbox_id}/messages/{message_id}` | Add and remove message labels. | Inputs: `inbox_id`, `message_id`, JSON body `add_labels`, `remove_labels`. Outputs: `message_id`, `labels`. | `{}` in inventory; no amount/currency. |

## Field Notes

### Inputs

The shared identifiers are `inbox_id` and, for item-level operations, `message_id`. Attachment retrieval additionally requires `attachment_id`. These identifiers bind reads and label updates to a single inbox-scoped message; the public troubleshooting docs note that accessing resources outside the authenticated organization can return `403`.

`GET /v0/inboxes/:inbox_id/messages` supports message discovery and queue-style processing. Besides pagination fields `limit` and `page_token`, the endpoint accepts `labels` for filtering, temporal filters `before` and `after`, sort direction `ascending`, and inclusion flags `include_spam`, `include_blocked`, and `include_trash`. These fields are important because AgentMail uses labels instead of a dedicated mark-as-read endpoint.

`PATCH /v0/inboxes/:inbox_id/messages/:message_id` accepts `add_labels` and `remove_labels`, each typed as either a string or an array of strings. There is no `client_id` or idempotency field on this PATCH schema; clients that retry label updates should make label transitions tolerant of repeated add/remove attempts.

### Outputs

The list endpoint returns `count`, optional `limit`, optional `next_page_token`, and `messages[]` ordered by `timestamp` descending. The `MessageItem` schema includes routing and state fields such as `inbox_id`, `thread_id`, `message_id`, `labels`, `timestamp`, `from`, `to`, optional `cc`/`bcc`, optional `subject`, optional `preview`, optional `attachments`, `in_reply_to`, `references`, `headers`, `size`, `updated_at`, and `created_at`.

The get-message endpoint returns the fuller `Message` schema. In addition to list-style metadata, it includes optional `reply_to`, `text`, `html`, `extracted_text`, and `extracted_html`. The docs recommend using `extracted_text` or `extracted_html` for new reply content because quoted history is stripped, and they warn that `text` and `preview` can be absent when a sender provides HTML-only mail.

Attachment and raw-message endpoints return download descriptors rather than embedding file bytes in the response schema. Attachment responses include metadata plus `download_url` and `expires_at`; raw-message responses include `message_id`, `size`, `download_url`, and `expires_at` for an S3 presigned raw `.eml` URL. Any system preserving source evidence should store the returned descriptor and separately decide whether to fetch and archive the expiring URL content.

The label update endpoint returns only `message_id` and the resulting `labels` array. It does not return full message content, so clients that need the updated full message body must call the get-message endpoint after labeling.

### Important Constraints Or Gaps

Direct AgentMail OpenAPI operations require a bearer `Authorization` header. MPP usage instead uses the MPP-specific base URL and an `mppx` client that negotiates and signs per-request payments. The assigned inventory records preserve both views in their `auth` notes.

All five endpoint records have empty `payment` objects. Other AgentMail MPP records in the same inventory do contain explicit paid amounts, such as message sending at `0.01` token units and inbox creation at `2.0` token units, but this message-reading-and-labeling group does not publish an amount, currency, recipient, or payment intent in the assigned records.

The OpenAPI response inventory lists `404` errors for the read endpoints and `400` validation plus `404` for the PATCH endpoint. Public docs separately mention possible `403` behavior for cross-organization resource access or malformed/missing path parameters, so error handling should not rely only on the listed OpenAPI response table.

Inbound processing is affected by email authentication and filtering. The docs state that explicit SPF, DKIM, and DMARC failures are dropped, while messages with missing authentication can be processed and labeled `unauthenticated`. The list endpoint's `include_spam`, `include_blocked`, and `include_trash` flags also imply that default reads may omit messages carrying those system labels unless explicitly requested.

## Use Cases

1. Process an unread inbox queue: call list messages with `labels=["unread"]`, inspect `message_id`, `from`, `subject`, `preview`, `attachments`, and `timestamp`, then fetch the full message and PATCH labels from `unread` to `read` or `processed`.

2. Build a human escalation queue: classify full messages using `extracted_text` or `extracted_html`, then add `needs-human-review` and `escalation` labels while removing `unreplied` or other active-work labels.

3. Preserve evidence for compliance or debugging: use get-message for normalized fields and get-raw-message for the presigned `.eml` `download_url`, recording `message_id`, `size`, and `expires_at` before the URL expires.

4. Handle inbound attachments safely: list or get a message, read each attachment's `attachment_id`, `filename`, `content_type`, `content_disposition`, `size`, and `content_id`, then call get attachment only for allowed file types and store the returned `download_url` metadata.

5. Route messages by operational labels: filter list results by labels such as `billing-question`, `bug-report`, `campaign-q4`, `spam`, `blocked`, or `unauthenticated`, using `include_spam`, `include_blocked`, and `include_trash` when reviewing filtered or quarantined mail.

6. Maintain duplicate-processing guardrails after webhook delivery: even when a webhook notifies the app, use the label PATCH endpoint to mark the `message_id` as `processed`; on restart, list messages with positive queue labels such as `unread` or `needs-response` to resume work.
