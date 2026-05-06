# AgentMail: API Key Access Control API Uses

## What This Endpoint Group Does

This endpoint group manages AgentMail API keys at the organization and pod scopes. It covers listing keys, creating new keys with optional fine-grained permissions, and deleting keys by API-key ID. The organization-level paths operate across the account's AgentMail organization, while the pod-level paths add a required `pod_id` path parameter so the resulting key and key listing are constrained to one pod.

The key control model is field-driven: `permissions` is an optional whitelist object on create. If it is omitted, the key has full access within its scope. If it is present, only permission booleans explicitly set to `true` are granted, and omitted or `false` permissions are denied. Public docs also state that effective access is the intersection of the key's scope and its permissions, so a pod-scoped key cannot exceed pod-level access even if broader permission names are set.

All six MPP inventory records in this group have empty `payment` metadata. The inventory therefore does not mark API-key list, create, or delete operations as paid and does not provide an MPP amount for them. This should be treated as a cost gap, not as a guarantee that future MPP access will remain free.

## Endpoints Covered

| Endpoint ID | Method | MPP path | Provider path | Primary inputs | Main outputs | MPP cost note |
| --- | --- | --- | --- | --- | --- | --- |
| `endp_141e137ac8a42a462d7e` | `GET` | `/v0/api-keys` | `/v0/api-keys` | Optional query `limit`, `page_token`, `ascending`; auth via MPP or bearer on direct API. | `count`, `next_page_token`, `api_keys[]` ordered by `created_at` descending. | Empty `payment` object in inventory. |
| `endp_e0aa80e04d848cdf1f0b` | `POST` | `/v0/api-keys` | `/v0/api-keys` | Optional body `name`, `permissions`. | `api_key_id`, one-time `api_key`, `prefix`, `name`, optional `pod_id`/`inbox_id`, optional `permissions`, `created_at`. | Empty `payment` object in inventory. |
| `endp_3aa7f348b9e2ea7cade0` | `DELETE` | `/v0/api-keys/:api_key` | `/v0/api-keys/{api_key_id}` | Path `api_key_id` in OpenAPI; MPP feed path uses `:api_key`. | `200` with no documented body; `404` error body may include `name` and `message`. | Empty `payment` object in inventory. |
| `endp_e9787fb0c79ce164e7d2` | `GET` | `/v0/pods/:pod_id/api-keys` | `/v0/pods/{pod_id}/api-keys` | Required path `pod_id`; optional query `limit`, `page_token`. | `count`, `next_page_token`, `api_keys[]` for the pod scope. | Empty `payment` object in inventory. |
| `endp_8bede7598878e72780ea` | `POST` | `/v0/pods/:pod_id/api-keys` | `/v0/pods/{pod_id}/api-keys` | Required path `pod_id`; optional body `name`, `permissions`. | `api_key_id`, one-time `api_key`, `prefix`, `name`, optional `pod_id`/`inbox_id`, optional `permissions`, `created_at`. | Empty `payment` object in inventory. |
| `endp_c716b06c8dce7af3b7af` | `DELETE` | `/v0/pods/:pod_id/api-keys/:api_key` | `/v0/pods/{pod_id}/api-keys/{api_key_id}` | Required path `pod_id`; path `api_key_id` in OpenAPI; MPP feed path uses `:api_key`. | `200` with no documented body; `404` error body may include `name` and `message`. | Empty `payment` object in inventory. |

## Field Notes

### Inputs

`name` is an optional request-body string for create operations. It should be treated as the human-facing handle for audit, rotation, and tenant/service identification.

`permissions` is an optional object of boolean permission fields. The OpenAPI-derived inventory lists these permission names: `inbox_read`, `inbox_create`, `inbox_update`, `inbox_delete`, `thread_read`, `thread_delete`, `message_read`, `message_send`, `message_update`, `label_spam_read`, `label_blocked_read`, `label_trash_read`, `draft_read`, `draft_create`, `draft_update`, `draft_delete`, `draft_send`, `webhook_read`, `webhook_create`, `webhook_update`, `webhook_delete`, `domain_read`, `domain_create`, `domain_update`, `domain_delete`, `list_entry_read`, `list_entry_create`, `list_entry_delete`, `metrics_read`, `api_key_read`, `api_key_create`, `api_key_delete`, `pod_read`, `pod_create`, and `pod_delete`.

`pod_id` is required only on pod-scoped list, create, and delete paths. It makes the key-management operation tenant- or pod-specific.

`api_key_id` is the provider-side delete identifier. The MPP feed uses `:api_key` in both delete MPP paths, while the OpenAPI provider path and CLI examples use `api_key_id`; this artifact preserves that field drift rather than normalizing it away.

`limit`, `page_token`, and `ascending` are pagination/sort controls. `ascending` appears in the organization-level list endpoint inventory, while the pod-scoped list inventory only includes `limit` and `page_token`.

### Outputs

List responses return `count`, optional `next_page_token`, and `api_keys[]`. Each key item can include `api_key_id`, `prefix`, `name`, optional `pod_id`, optional `inbox_id`, optional `used_at`, optional `permissions`, and `created_at`.

Create responses return the same metadata plus the full `api_key` secret. Public docs state that the full key is shown only once at creation, so downstream systems should store it immediately and rotate by delete-and-create if it is lost.

Delete responses document a successful `200` with no body. Error responses documented in the relevant inventory records include validation errors for create (`400` with `name` and `errors`) and not-found failures for scoped resources (`404` with `name` and `message`).

### Important Constraints Or Gaps

Direct AgentMail API calls use bearer authentication. MPP calls use the MPP base URL and an `mppx` client that negotiates and signs payment per request instead of a traditional API key.

Permission behavior is whitelist-based only when the `permissions` field is present. Omitting `permissions` means full access within the key scope, which is convenient but risky for agents that only need a narrow set of operations.

Restricted keys cannot create child keys with more access than their own effective permissions, according to the public permissions docs. This matters for workflows that delegate key creation to customer-specific agents.

Label visibility permissions affect both message visibility and event subscriptions. Without the relevant label permissions, spam, blocked, or trash content may be excluded from list/look-up flows or rejected for corresponding event subscription setup.

The assigned MPP manifest group does not include inbox-scoped API-key endpoints, even though the public OpenAPI/docs mention inbox-scoped keys. This artifact therefore covers organization and pod API-key access control only.

All six records use mixed field sources from the MPP feed and OpenAPI. The only explicit field gap in the inventory is the MPP delete path parameter name `:api_key` versus the provider/OpenAPI `api_key_id`.

## Use Cases

1. Create a tenant service key for one pod by calling `POST /v0/pods/:pod_id/api-keys` with a tenant-specific `name` and only the permissions that tenant worker needs, such as `inbox_read`, `thread_read`, `message_read`, `message_send`, and `draft_create`.

2. Rotate a compromised organization key by listing `/v0/api-keys`, identifying the record by `api_key_id`, `prefix`, `name`, or `used_at`, creating a replacement key, and deleting the old key through `/v0/api-keys/:api_key`.

3. Build a read-only audit or analytics integration by creating an organization key with read permissions such as `inbox_read`, `thread_read`, `message_read`, `domain_read`, `list_entry_read`, `metrics_read`, `api_key_read`, and `pod_read`, while omitting all create, update, delete, and send permissions.

4. Provision least-privilege support agents for each customer pod by listing current pod keys, creating missing pod-scoped keys, and deleting stale keys when a tenant churns or a contractor loses access.

5. Keep unwanted-email handling out of agent workflows by creating keys that omit or set `label_spam_read`, `label_blocked_read`, and `label_trash_read` to `false`, so spam, blocked, and trash messages are not visible to the agent key.

6. Separate infrastructure administration from mail operations by issuing one key with domain/list/pod permissions for platform operators and a different pod-scoped key with message/draft/thread permissions for the runtime agent.

7. Enforce key inventory hygiene by paginating through organization and pod key lists with `limit` and `page_token`, checking `created_at` and `used_at`, and deleting unused or stale keys by `api_key_id`.
