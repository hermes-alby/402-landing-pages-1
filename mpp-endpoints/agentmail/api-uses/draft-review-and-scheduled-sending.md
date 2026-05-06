# AgentMail: Draft Review And Scheduled Sending API Uses

## What This Endpoint Group Does

This endpoint group covers AgentMail draft workflows: creating an unsent email in an inbox, reviewing or updating its recipients and content, scheduling it with `send_at`, canceling it by deleting the draft, sending it into a real message, and inspecting draft attachments. It includes inbox-scoped mutation endpoints plus organization-wide and pod-scoped read endpoints for review dashboards.

The core resource is `Draft`. A full draft response can include `inbox_id`, `draft_id`, `client_id`, `labels`, `reply_to`, `to`, `cc`, `bcc`, `subject`, `preview`, `text`, `html`, `attachments`, `in_reply_to`, `references`, `send_status`, `send_at`, `updated_at`, and `created_at`. Scheduled sends are represented by the `send_at` timestamp and `send_status` enum values `scheduled`, `sending`, and `failed`.

MPP inventory cost coverage is uneven by operation. The manifest marks create draft and send draft as paid Tempo charges of `amount: 10000`, `decimals: 6`, or `amount_units: 0.01`. List, get, update, delete, and attachment lookup endpoints in this group have no payment object in the inventory, so they are best treated as unpriced or unspecified rather than confirmed free.

## Endpoints Covered

| Endpoint ID | Method | MPP path | Scope | Purpose | MPP cost in inventory |
| --- | --- | --- | --- | --- | --- |
| `endp_c3e9a9428ff2f372916b` | GET | `/v0/inboxes/:inbox_id/drafts` | Inbox | List drafts for one sender inbox with pagination, label filtering, time filters, and sort order. | Not specified |
| `endp_6d5a2ad29344e57b9d73` | GET | `/v0/inboxes/:inbox_id/drafts/:draft_id` | Inbox | Get one full draft by `inbox_id` and `draft_id`. | Not specified |
| `endp_e2f073ba9c04634723fe` | GET | `/v0/inboxes/:inbox_id/drafts/:draft_id/attachments/:attachment_id` | Inbox | Get draft attachment metadata and a temporary `download_url`. | Not specified |
| `endp_d6eb08dc9c1e497074ab` | POST | `/v0/inboxes/:inbox_id/drafts` | Inbox | Create a draft with recipients, content, attachments, thread linkage, schedule time, labels, and `client_id`. | `0.01` token units |
| `endp_85dc147aba989b115dec` | PATCH | `/v0/inboxes/:inbox_id/drafts/:draft_id` | Inbox | Update recipient fields, subject/body fields, reply-to, or `send_at`. | Not specified |
| `endp_aebbee782068350e841b` | DELETE | `/v0/inboxes/:inbox_id/drafts/:draft_id` | Inbox | Delete a draft; for scheduled drafts this is the documented cancellation path. | Not specified |
| `endp_d237b36e4ad50cafa2a1` | POST | `/v0/inboxes/:inbox_id/drafts/:draft_id/send` | Inbox | Send the draft and return `message_id` and `thread_id`; optional label changes can be applied. | `0.01` token units |
| `endp_727a3510c5d8569a82d7` | GET | `/v0/drafts` | Organization | List drafts across the organization for central review. | Not specified |
| `endp_5cf6431714894156822c` | GET | `/v0/drafts/:draft_id` | Organization | Get a draft by `draft_id` without providing an inbox path parameter. | Not specified |
| `endp_e1b6feac00087a967634` | GET | `/v0/drafts/:draft_id/attachments/:attachment_id` | Organization | Get draft attachment metadata and a temporary `download_url`. | Not specified |
| `endp_fe7f67c3041a3024e90d` | GET | `/v0/pods/:pod_id/drafts` | Pod | List drafts across all inboxes isolated inside one pod. | Not specified |
| `endp_bf996fccf18554c6f356` | GET | `/v0/pods/:pod_id/drafts/:draft_id` | Pod | Get a pod-contained draft by `pod_id` and `draft_id`. | Not specified |
| `endp_20329dd8b7e0e53337ea` | GET | `/v0/pods/:pod_id/drafts/:draft_id/attachments/:attachment_id` | Pod | Get draft attachment metadata and a temporary `download_url` inside a pod. | Not specified |

## Field Notes

### Inputs

Create draft accepts `inbox_id` in the path and an optional JSON body with `labels`, `reply_to`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, `attachments`, `in_reply_to`, `send_at`, and `client_id`. Recipient fields are arrays of email address strings, with display-name address format supported by the schema descriptions.

`attachments` on create are an array of objects. Inventory/OpenAPI fields include `filename`, `content_type`, `content_disposition`, `content_id`, `content`, and `url`; `content_disposition` is limited to `inline` or `attachment`, and `content` is Base64 encoded. The public docs do not state a draft attachment size limit in the retrieved sources.

Update draft is narrower than create draft. It accepts `reply_to`, `to`, `cc`, `bcc`, `subject`, `text`, `html`, and `send_at`, but the inventory does not show update-body fields for `attachments`, `labels`, `client_id`, or `in_reply_to`. That matters for builders: attach files and set idempotency/thread linkage when creating the draft, then use update mainly for review edits and rescheduling.

Send draft takes `inbox_id` and `draft_id` in the path. Its body schema only shows optional `add_labels` and `remove_labels`, each as a string or array of strings. It does not accept recipient or content fields; review edits must happen through PATCH before send.

List endpoints support `limit`, `page_token`, `labels`, `before`, `after`, and `ascending`, with the scope determined by path: inbox (`inbox_id`), organization (no scope path parameter), or pod (`pod_id`). Attachment lookup endpoints require `draft_id` and `attachment_id`, plus either `inbox_id`, `pod_id`, or neither for organization scope.

### Outputs

List endpoints return `count`, optional `limit`, optional `next_page_token`, and `drafts`. Draft list items include the same operational fields needed for triage, including recipients, `subject`, `preview`, `attachments`, `in_reply_to`, `send_status`, `send_at`, and `updated_at`.

Get/create/update draft responses return full `Draft` objects with body fields (`text`, `html`), content summary (`preview`), addressing fields, `client_id`, `references`, and timestamps. `labels` is required in the response schema, making it a useful state carrier for review queues and scheduled draft filters.

Send draft returns `message_id` and `thread_id`. The docs state that sending converts the draft into a message and deletes the draft, so downstream workflows should persist those IDs and should not expect the same `draft_id` to remain sendable.

Draft attachment lookup returns an `AttachmentResponse` with `attachment_id`, optional `filename`, required `size`, optional `content_type`, optional `content_disposition`, optional `content_id`, required `download_url`, and required `expires_at`.

### Important Constraints Or Gaps

`send_at` must be an ISO 8601 datetime string in the public docs. Creating or updating a draft with `send_at` schedules it; the draft is automatically labeled `scheduled`, and `send_status` becomes `scheduled`. Canceling a scheduled send is done by deleting the draft. Rescheduling is done by updating `send_at`.

The documented `send_status` values are `scheduled`, `sending`, and `failed`. A failed scheduled send can be retried by updating `send_at` to a new time.

Draft creation supports `client_id`, and AgentMail documents `client_id` as the idempotency mechanism for create operations including drafts. This is the strongest duplicate-send guard in this group: create with a deterministic `client_id`, review the resulting draft, then send it once. After a successful send, the draft is deleted, so a repeated send against the same `draft_id` should fail rather than duplicate the outbound email.

The group includes no pod-scoped create/update/delete/send endpoints in the MPP inventory. Pod support here is read-only: list pod drafts, get a pod draft, and get pod draft attachment metadata. Creating and sending drafts is represented only under inbox-scoped paths.

The MPP manifest exposes paid costs only for create draft and send draft. It does not publish costs for read/update/delete/attachment operations in this group, and the public AgentMail docs do not provide a comprehensive MPP price table in the retrieved sources.

The direct OpenAPI spec documents Bearer authentication, while MPP access is through the MPP base URL and payment negotiation. This artifact did not call endpoints, sign payments, create drafts, send messages, or mutate data.

## Use Cases

1. Human approval queue for high-risk agent emails: create drafts with `to`, `cc`, `bcc`, `reply_to`, `subject`, `text`, `html`, and `attachments`; list by organization with `/v0/drafts`; review full bodies with `/v0/drafts/:draft_id`; then send only approved drafts through `/v0/inboxes/:inbox_id/drafts/:draft_id/send`.

2. Business-hours scheduled outreach: create a draft with `send_at`, verify `send_status: scheduled`, and list later using `labels=scheduled`. If timing changes, PATCH `send_at`; if the message should not go out, DELETE the draft.

3. Duplicate-safe transactional email: create each order confirmation or account notification draft with a deterministic `client_id`, then send the resulting `draft_id` after validation. This uses create idempotency and the one-time send/delete behavior to reduce accidental duplicate outbound mail.

4. Conditional follow-up automation: after an initial message, create a follow-up draft with `in_reply_to`, `subject`, `text` or `html`, and a future `send_at`. Store the `draft_id` in labels on the related thread; if a reply arrives before `send_at`, delete the draft to cancel the follow-up.

5. Multi-tenant supervisor review: for each customer pod, call `/v0/pods/:pod_id/drafts` to show only drafts inside that tenant boundary. Use `draft_id`, `inbox_id`, `subject`, `preview`, `send_at`, and `updated_at` to prioritize review without exposing drafts from other pods.

6. Attachment compliance review before send: create drafts with Base64 or URL-backed attachments, then inspect returned attachment metadata (`filename`, `size`, `content_type`, `content_disposition`, `content_id`). Reviewers can fetch the attachment record and use `download_url` before approving the draft.

7. Failed scheduled-send recovery: list drafts filtered by `labels=scheduled`, inspect `send_status`, and for `failed` drafts update `send_at` to a new future timestamp after fixing recipient/content issues.

8. Central stale-draft cleanup: use organization-wide `/v0/drafts` with `before`, `after`, `ascending`, `limit`, and `page_token` to find old or abandoned drafts, inspect the full draft where needed, and delete drafts that should no longer be sent.
