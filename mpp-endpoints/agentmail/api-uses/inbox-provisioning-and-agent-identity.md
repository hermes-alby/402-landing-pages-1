# AgentMail: Inbox Provisioning And Agent Identity API Uses

## What This Endpoint Group Does

This endpoint group manages AgentMail inboxes as durable email identities for agents. It covers organization-level inbox CRUD at `/v0/inboxes` and pod-scoped inbox CRUD at `/v0/pods/:pod_id/inboxes`, so the same identity model can be used either globally or inside a tenant/pod boundary.

The core resource returned by the group is an `Inbox`: required `pod_id`, `inbox_id`, `email`, `updated_at`, and `created_at`, plus optional `display_name` and `client_id`. Creation accepts address-shaping fields (`username`, `domain`), a human-facing sender label (`display_name`), and an idempotency/mapping field (`client_id`). Listing adds fleet controls through `limit`, `page_token`, and `ascending`.

## Endpoints Covered

| Endpoint ID | Method | MPP path | Scope | Main inputs | Main outputs | MPP cost noted in inventory |
| --- | --- | --- | --- | --- | --- | --- |
| `endp_2aa452994c770b58f35b` | `GET` | `/v0/inboxes` | Organization inboxes | Query `limit`, `page_token`, `ascending` | `count`, optional `limit`, optional `next_page_token`, `inboxes[]` | No payment object in inventory |
| `endp_bdb7657d382d3f533ff6` | `GET` | `/v0/inboxes/:inbox_id` | Organization inbox | Path `inbox_id` | `Inbox`; `404` error has `name`, `message` | No payment object in inventory |
| `endp_861e2e75997630968f1f` | `POST` | `/v0/inboxes` | Organization inbox | Body `username`, `domain`, `display_name`, `client_id` | Created `Inbox`; `400` validation error has `name`, `errors` | Paid: `2.0` token units, `tempo`, amount `2000000`, decimals `6` |
| `endp_1b5c8236371157089614` | `PATCH` | `/v0/inboxes/:inbox_id` | Organization inbox | Path `inbox_id`; body required `display_name` | Updated `Inbox`; `404` error has `name`, `message` | No payment object in inventory |
| `endp_6fa99a090844cc95a9a0` | `DELETE` | `/v0/inboxes/:inbox_id` | Organization inbox | Path `inbox_id` | `200` empty success; `404` error has `name`, `message` | No payment object in inventory |
| `endp_16dfc8670d7ac153c92f` | `GET` | `/v0/pods/:pod_id/inboxes` | Pod inboxes | Path `pod_id`; query `limit`, `page_token`, `ascending` | `count`, optional `limit`, optional `next_page_token`, `inboxes[]`; `404` error | No payment object in inventory |
| `endp_47fe2c75202959becdc1` | `GET` | `/v0/pods/:pod_id/inboxes/:inbox_id` | Pod inbox | Path `pod_id`, `inbox_id` | `Inbox`; `404` error has `name`, `message` | No payment object in inventory |
| `endp_4bd5f3f245d6812d441b` | `POST` | `/v0/pods/:pod_id/inboxes` | Pod inbox | Path `pod_id`; body `username`, `domain`, `display_name`, `client_id` | Created `Inbox`; `400` validation error has `name`, `errors` | Paid: `2.0` token units, `tempo`, amount `2000000`, decimals `6` |
| `endp_10cfa95831d492bee7c2` | `PATCH` | `/v0/pods/:pod_id/inboxes/:inbox_id` | Pod inbox | Path `pod_id`, `inbox_id`; body required `display_name` | Updated `Inbox`; `404` error has `name`, `message` | No payment object in inventory |
| `endp_6a5714a40eb6f3e376b0` | `DELETE` | `/v0/pods/:pod_id/inboxes/:inbox_id` | Pod inbox | Path `pod_id`, `inbox_id` | `200` empty success; `404` error has `name`, `message` | No payment object in inventory |

## Field Notes

### Inputs

- `username` is optional on create. If omitted, the API generates the address username.
- `domain` is optional on create. It must be a verified domain and defaults to `agentmail.to`.
- `display_name` is optional on create, but required on update. The schema describes it as the sender display label in the form `Display Name <username@domain.com>`.
- `client_id` is optional on create and is the important field for stable agent identity provisioning. AgentMail docs describe `client_id` as idempotency for create operations: repeated creates with the same successfully completed `client_id` return the original resource instead of creating a duplicate.
- `inbox_id` selects one inbox for get, update, and delete. Pod-scoped endpoints also require `pod_id`, making the inbox identity explicitly tenant-bound.
- `limit`, `page_token`, and `ascending` are list-only query fields. Inventory says list responses are ordered by `created_at` descending unless the caller changes temporal order with `ascending`.

### Outputs

- Single-resource reads, creates, and updates return the `Inbox` object: required `pod_id`, `inbox_id`, `email`, `updated_at`, and `created_at`; optional `display_name` and `client_id`.
- List endpoints return `count`, optional `limit`, optional `next_page_token`, and `inboxes[]`, where each array entry is an `Inbox`.
- Delete endpoints return `200` with no response body in the OpenAPI/inventory record.
- Not-found responses use `ErrorResponse` with `name` and `message`. Create validation failures use `ValidationErrorResponse` with `name` and `errors`.

### Important Constraints Or Gaps

- The two create endpoints are the only paid endpoints in this group according to the inventory. Each create is marked as a `tempo` charge of `2.0` token units. The read, update, and delete records have no payment object.
- Public MPP docs explain the MPP base URL and wallet-backed per-request payment negotiation, but the retrieved docs do not provide a comprehensive public MPP price table beyond the inventory values.
- Direct OpenAPI operations require a bearer `Authorization` header, while MPP usage routes through `https://mpp.api.agentmail.to` with an `mppx` client. The exact MPP authentication/payment failure shapes are not fully described in the public snapshots.
- The create schema does not expose username format rules, domain verification lookup fields, uniqueness conflict semantics, or whether a repeated `client_id` request through MPP is charged again.
- Delete responses do not state whether deletion is hard deletion, soft deletion, or whether related messages/threads remain accessible elsewhere.
- Plan limits in public docs include inbox counts by plan, but how those limits apply to MPP pay-per-request access is not stated.

## Use Cases

1. Provision one stable inbox per autonomous agent. Use `POST /v0/inboxes` with a deterministic `client_id` such as an internal agent ID, optional `username`, and optional `display_name`; persist the returned `inbox_id` and `email`.
2. Bootstrap tenant-isolated inboxes inside pods. Use `POST /v0/pods/:pod_id/inboxes` so customer or workspace agents receive addresses under the relevant `pod_id`; list with `GET /v0/pods/:pod_id/inboxes` during reconciliation.
3. Build a restart-safe agent setup routine. On startup, create with `client_id`, then rely on the returned `Inbox` fields to bind the agent process to the same `email` and `inbox_id` across retries.
4. Run fleet inventory and pagination jobs. Use `GET /v0/inboxes` or the pod-scoped list endpoint with `limit`, `page_token`, and `ascending` to scan inbox identity records and detect missing local mappings.
5. Rename sender identity without changing the mailbox address. Use `PATCH` with required `display_name` when an agent's public-facing role changes, while preserving `inbox_id`, `email`, and `client_id`.
6. Decommission retired agent identities. Use `DELETE` by `inbox_id`, or by `pod_id` plus `inbox_id` for tenant-scoped resources, and handle `404` as an already-missing or inaccessible inbox case.
7. Create verified-domain agent addresses. Pass `username` and a verified `domain` to create branded sender addresses; fall back to the default `agentmail.to` domain when no custom verified domain is available.
