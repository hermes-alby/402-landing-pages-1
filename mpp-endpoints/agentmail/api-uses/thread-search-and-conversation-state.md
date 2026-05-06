# AgentMail: Thread Search And Conversation State API Uses

## What This Endpoint Group Does

This endpoint group covers conversation-level access to AgentMail `Thread` resources across three scopes:

- One inbox: `/v0/inboxes/:inbox_id/threads...`
- The whole organization: `/v0/threads...`
- One pod: `/v0/pods/:pod_id/threads...`

AgentMail threads are created automatically from email traffic: a new outbound message starts a thread, and replies are added to the same thread. The list endpoints provide structured thread discovery by scope, pagination, labels, timestamps, sort direction, and optional inclusion of spam, blocked, and trash. The get endpoints return a full thread object, including the ordered `messages` array needed for conversation context. The attachment endpoints resolve an `attachment_id` from a thread into attachment metadata and a downloadable URL. The delete endpoints are also present in this group; they mutate thread state by moving the thread to trash or permanently deleting it.

The group name says "search", but the actual endpoint fields show filter-based retrieval rather than free-text or semantic search. There is no `query`, `sender`, `recipient`, `subject`, or semantic-search parameter in the inventory for these endpoints. The public docs note org-wide semantic search as coming soon.

MPP cost note: every endpoint record in this group has an empty `payment` object in `endpoint-inventory.json`. The public MPP docs say requests can be paid per request through `mppx`, but the inventory does not publish amount, currency, network, or a paid/free flag for these 12 thread endpoints. Treat per-request cost as unknown from public metadata, not as confirmed free.

## Endpoints Covered

| Endpoint ID | Method and MPP path | Scope | Key inputs | Main outputs | MPP cost note |
| --- | --- | --- | --- | --- | --- |
| `endp_fb72b524554abd5a0dc0` | `GET /v0/inboxes/:inbox_id/threads` | Inbox | `inbox_id`; optional `limit`, `page_token`, `labels`, `before`, `after`, `ascending`, `include_spam`, `include_blocked`, `include_trash` | `count`, `limit`, `next_page_token`, `threads[]` as `ThreadItem` summaries | `payment: {}`; no amount published |
| `endp_68d42187245e92e524c3` | `GET /v0/inboxes/:inbox_id/threads/:thread_id` | Inbox | `inbox_id`, `thread_id` | Full `Thread`, including `messages[]` | `payment: {}`; no amount published |
| `endp_a6c2daafb4bfb14dcea0` | `GET /v0/inboxes/:inbox_id/threads/:thread_id/attachments/:attachment_id` | Inbox | `inbox_id`, `thread_id`, `attachment_id` | `AttachmentResponse` with `download_url` and `expires_at` | `payment: {}`; no amount published |
| `endp_26c791a407a8b6e9e610` | `DELETE /v0/inboxes/:inbox_id/threads/:thread_id` | Inbox | `inbox_id`, `thread_id`; optional `permanent` | `200` with no response fields; `404` error has `name`, `message` | `payment: {}`; no amount published |
| `endp_6e4f967169a7c9211026` | `GET /v0/threads` | Organization | Optional `limit`, `page_token`, `labels`, `before`, `after`, `ascending`, `include_spam`, `include_blocked`, `include_trash` | `count`, `limit`, `next_page_token`, `threads[]` as `ThreadItem` summaries across inboxes | `payment: {}`; no amount published |
| `endp_d85cd8cdce8e2758de8a` | `GET /v0/threads/:thread_id` | Organization | `thread_id` | Full `Thread`, including owning `inbox_id` and `messages[]` | `payment: {}`; no amount published |
| `endp_c5198e4d8d0b2010b46f` | `GET /v0/threads/:thread_id/attachments/:attachment_id` | Organization | `thread_id`, `attachment_id` | `AttachmentResponse` with `download_url` and `expires_at` | `payment: {}`; no amount published |
| `endp_463d93b1e2f12e6ee7cd` | `DELETE /v0/threads/:thread_id` | Organization | `thread_id`; optional `permanent` | `200` with no response fields; `404` error has `name`, `message` | `payment: {}`; no amount published |
| `endp_39db4bbac4f67eb9a62a` | `GET /v0/pods/:pod_id/threads` | Pod | `pod_id`; optional `limit`, `page_token`, `labels`, `before`, `after`, `ascending`, `include_spam`, `include_blocked`, `include_trash` | `count`, `limit`, `next_page_token`, `threads[]` as `ThreadItem` summaries for the pod | `payment: {}`; no amount published |
| `endp_ed6e880434ae55fb9f93` | `GET /v0/pods/:pod_id/threads/:thread_id` | Pod | `pod_id`, `thread_id` | Full `Thread`, including `messages[]` | `payment: {}`; no amount published |
| `endp_8c3cebde370c7ce7db6b` | `GET /v0/pods/:pod_id/threads/:thread_id/attachments/:attachment_id` | Pod | `pod_id`, `thread_id`, `attachment_id` | `AttachmentResponse` with `download_url` and `expires_at` | `payment: {}`; no amount published |
| `endp_ad64aeabc084b4384cee` | `DELETE /v0/pods/:pod_id/threads/:thread_id` | Pod | `pod_id`, `thread_id`; optional `permanent` | `200` with no response fields; `404` error has `name`, `message` | `payment: {}`; no amount published |

## Field Notes

### Inputs

- Scope identifiers are the main routing choice: `inbox_id` for one agent inbox, no scope parameter for organization-wide access, and `pod_id` for tenant or workspace isolation.
- Thread detail and attachment access require `thread_id`; attachment access also requires `attachment_id`.
- List endpoints accept `limit` and `page_token` for pagination, but the retrieved schema does not state numeric defaults or maximums.
- List endpoints accept `labels` as an `array<string>` for workflow state, campaign, triage, unread/read, or other application-defined tags.
- List endpoints accept `before` and `after` as `string:date-time`, plus `ascending` as a boolean. The list response description says thread summaries are ordered by `timestamp` descending.
- List endpoints accept `include_spam`, `include_blocked`, and `include_trash` booleans. Defaults are not stated in the inventory.
- Delete endpoints accept optional `permanent`. The documented behavior is: move a thread to trash by adding a trash label to all messages; if already in trash, delete permanently; `permanent=true` forces permanent deletion.
- Direct AgentMail OpenAPI operations require an `Authorization` bearer header. MPP access uses the MPP-specific base URL and `mppx` payment negotiation instead of a traditional API key.

### Outputs

- List endpoints return `ListThreadsResponse`: `count`, optional `limit`, optional `next_page_token`, and required `threads`.
- `threads[]` items are `ThreadItem` summaries with `inbox_id`, `thread_id`, `labels`, `timestamp`, optional `received_timestamp`, optional `sent_timestamp`, `senders`, `recipients`, optional `subject`, optional `preview`, optional `attachments`, `last_message_id`, `message_count`, `size`, `updated_at`, and `created_at`.
- Get-thread endpoints return a full `Thread` with the same top-level fields as `ThreadItem` plus required `messages`. The `messages` array is ordered by `timestamp` ascending.
- `messages[]` records include required `inbox_id`, `thread_id`, `message_id`, `labels`, `timestamp`, `from`, `to`, `size`, `updated_at`, and `created_at`; optional fields include `reply_to`, `cc`, `bcc`, `subject`, `preview`, `text`, `html`, `extracted_text`, `extracted_html`, `attachments`, `in_reply_to`, `references`, and `headers`.
- Attachment endpoints return `AttachmentResponse`: required `attachment_id`, `size`, `download_url`, and `expires_at`; optional `filename`, `content_type`, `content_disposition`, and `content_id`. `content_disposition` is an enum with `inline` and `attachment`.
- Delete endpoints return `200` with no documented response fields. The common `404` error response has `name` and `message`.

### Important Constraints Or Gaps

- No endpoint in this group has a request body. All control is through path, query, and auth/payment context.
- The public docs describe threads as automatically managed; there is no create-thread endpoint here.
- The inventory supports filtering by labels and timestamps but does not expose keyword, subject, participant, body, or semantic query fields. Semantic org-wide thread search is documented as planned, not present in these endpoint fields.
- The group contains mutating `DELETE` operations. Under the repo's default research safety rules, do not call them unless a later task explicitly approves mutations.
- The direct OpenAPI docs and MPP docs have different auth models: bearer token for direct API, wallet-backed payment negotiation for MPP. The public sources do not fully document MPP-specific quota, retry, or failure semantics for these endpoints.
- The inventory gives no MPP amount for these 12 endpoints. Budgeting systems cannot calculate thread-list, thread-get, attachment, or delete costs from the current public metadata.
- Attachment behavior has a source mismatch to track: the narrative docs say attachment retrieval returns the raw file bytes, while the OpenAPI/inventory records for these thread attachment endpoints return JSON metadata containing `download_url` and `expires_at`.
- The attachment schemas expose file size and expiring download URLs, but retrieved sources do not state max attachment size, retention period, or the duration of `download_url` validity.
- Delete responses have no body, so clients need separate verification if they must confirm trash/permanent state after deletion.

## Use Cases

1. Inbox triage queue for one agent.
   Use `GET /v0/inboxes/:inbox_id/threads` with `labels` such as `unread`, `needs-reply`, or `billing-question`, plus `after` to bound recency. Rank or route by `timestamp`, `senders`, `recipients`, `subject`, `preview`, `last_message_id`, and `message_count`, then call the inbox-scoped get-thread endpoint to load `messages[]` before composing a reply through a separate send/reply endpoint.

2. Organization-wide supervisor dashboard.
   Use `GET /v0/threads` with pagination to monitor conversations across all inboxes. `inbox_id`, `senders`, `recipients`, `labels`, `message_count`, `size`, `received_timestamp`, and `sent_timestamp` let a supervisor agent detect stale conversations, high-volume threads, unanswered inbound messages, and cross-inbox workload distribution without first enumerating every inbox.

3. Pod-scoped customer support review.
   Use `GET /v0/pods/:pod_id/threads` and `GET /v0/pods/:pod_id/threads/:thread_id` when each pod maps to a tenant, customer, or isolated workspace. The `pod_id` path keeps the query limited to that tenant's resources, while thread fields like `labels`, `subject`, `preview`, and `messages[]` provide enough context for routing to a specialized support or account team.

4. Attachment intake and document processing.
   List or fetch a thread, inspect `thread.attachments` or `messages[].attachments` for `attachment_id`, `filename`, `content_type`, `content_disposition`, and `size`, then use the matching attachment endpoint for the scope. The response's `download_url` and `expires_at` support short-lived processing pipelines for invoices, reports, receipts, CSVs, or other files.

5. Campaign follow-up state.
   Filter threads by campaign and workflow labels such as `q4-campaign` and `follow-up`. Use `sent_timestamp`, `received_timestamp`, `last_message_id`, `message_count`, and `preview` to decide whether a lead replied, whether a thread needs another touch, or whether it should move to human review. The actual state transition would be done through label update endpoints outside this group.

6. Conversation-context bundle for an AI agent.
   After receiving an event or selecting a thread summary, call the get-thread endpoint to load `messages[]` in ascending timestamp order. `text`, `html`, `extracted_text`, `extracted_html`, `headers`, `in_reply_to`, and `references` give the agent the chronological context and email-header links needed to summarize the conversation and identify the last message for a reply workflow.

7. Trash review and approved cleanup.
   Use list endpoints with `include_trash=true` to review deleted-looking conversations by scope. Only with explicit mutation approval, use the delete endpoints: default behavior moves a thread to trash or permanently deletes it if already trashed, while `permanent=true` forces permanent deletion. Because the delete response has no body, follow-up verification should use a list/get read if allowed.
