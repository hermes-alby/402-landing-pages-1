# AgentMail: Pod And Organization Administration API Uses

## What This Endpoint Group Does

This endpoint group manages the administrative boundary between an AgentMail organization and its pods. The organization endpoint reports account-level usage, limits, billing metadata, and authentication metadata for the authenticated principal. The pod endpoints list, inspect, create, and delete pods, which AgentMail documents as isolated workspaces between an organization and inboxes for multi-tenant email infrastructure.

The group is useful when an application needs to map customers, agents, or internal business units to isolated AgentMail workspaces. Actual cross-resource work happens in other endpoint groups, such as pod-scoped inboxes, domains, drafts, threads, metrics, lists, and API keys; this group provides the pod identifiers and organization-level state needed to administer those resources.

## Endpoints Covered

| Endpoint ID | Operation | MPP path | Key inputs | Key outputs | MPP cost or gap |
| --- | --- | --- | --- | --- | --- |
| `endp_f7c39940d15235f1d0db` | `GET` List Pods | `/v0/pods` | Optional `limit`, `page_token`, `ascending` query fields; MPP payment-layer auth or direct Bearer auth. | `count`, optional `limit`, optional `next_page_token`, and `pods[]` with `pod_id`, `name`, `created_at`, `updated_at`, optional `client_id`. | Inventory has no `payment` object. |
| `endp_369f97baefa9b0787bcd` | `GET` Get Pod | `/v0/pods/:pod_id` | Required path `pod_id`; MPP payment-layer auth or direct Bearer auth. | Pod object: `pod_id`, `name`, `created_at`, `updated_at`, optional `client_id`; `404` error can return `name` and `message`. | Inventory has no `payment` object. |
| `endp_9a7d61e99f2c25cc12df` | `POST` Create Pod | `/v0/pods` | Optional JSON `name` and `client_id`; MPP payment-layer auth or direct Bearer auth. | Pod object: `pod_id`, `name`, `created_at`, `updated_at`, optional `client_id`; `400` validation errors can return `name` and `errors`. | Paid in MPP inventory: `0.01` token units, raw amount `10000` with 6 decimals, description `Create pod`. |
| `endp_7315cff9a3764259b034` | `DELETE` Delete Pod | `/v0/pods/:pod_id` | Required path `pod_id`; MPP payment-layer auth or direct Bearer auth. | `200` success with no documented response body; `404` error can return `name` and `message`. | Inventory has no `payment` object. |
| `endp_d02cb87bdb2ba49414ca` | `GET` Get Organization | `/v0/organizations` | No operation-specific parameters beyond MPP payment-layer auth or direct Bearer auth. | `organization_id`, `inbox_count`, `domain_count`, optional `inbox_limit`, optional `domain_limit`, optional billing fields, optional authentication fields, `created_at`, `updated_at`. | Inventory has no `payment` object. |

## Field Notes

### Inputs

The only mutable request in this group is `POST /v0/pods`. Its request body has optional `name` and `client_id` fields. `client_id` is important because AgentMail documents `client_id` as the idempotency mechanism for create operations; for pods, it can also hold a caller's internal tenant or customer identifier so the caller does not need a separate mapping table from internal tenant IDs to AgentMail `pod_id` values.

`GET /v0/pods` supports pagination and ordering through optional `limit`, `page_token`, and `ascending` query fields. The item order is documented as `created_at` descending unless changed by the ascending flag. `GET /v0/pods/:pod_id` and `DELETE /v0/pods/:pod_id` require the `pod_id` path identifier. `GET /v0/organizations` takes no group-specific request fields.

The direct OpenAPI spec documents a required `Authorization` Bearer header. The MPP service uses `https://mpp.api.agentmail.to` and MPP payment negotiation through an `mppx` client instead of a traditional API key flow; this artifact did not call any endpoint or sign any payment.

### Outputs

Pod responses center on `pod_id`, `name`, `created_at`, `updated_at`, and optional `client_id`. List responses wrap pods in `count`, optional `limit`, optional `next_page_token`, and `pods[]`. The optional `client_id` output is the field that lets an admin system reconcile AgentMail pods with its own customer, workspace, or agent records.

The organization response is a usage and account-status object. Required fields are `organization_id`, `inbox_count`, `domain_count`, `created_at`, and `updated_at`. Optional limit fields are `inbox_limit` and `domain_limit`. Optional account metadata includes `billing_id`, `billing_type`, `billing_subscription_id`, `authentication_id`, and `authentication_type`.

### Important Constraints Or Gaps

AgentMail docs say pods isolate data access and resource organization, not email delivery: inboxes in different pods can still send email to one another. Pods are optional for single-organization use, but recommended for multi-tenant applications.

Deletion has a key operational constraint: a pod cannot be deleted while it has child inboxes or domains. The docs describe deleting inboxes and domains first, then deleting the pod. They also state that deleting inboxes or domains cleans up associated messages, threads, and drafts, so pod deletion workflows should treat child deletion as destructive.

The public docs state that newly signed-up organizations get a default pod and that there is no hard documented limit on the number of pods. The organization endpoint exposes inbox and domain counts and optional limits, but it does not expose pod counts, pod limits, MPP balance, or per-request spend history.

MPP pricing is partial in the assigned inventory. Creating a pod is marked paid at `0.01` token units. The other four endpoints in this group have empty payment metadata. The public AgentMail docs explain MPP per-request payment but the retrieved public sources do not provide a comprehensive official price table, MPP-specific quota mapping, or payment-failure retry schema for these endpoints.

Rate-limit behavior is documented for the API generally as `429 Too Many Requests` with `Retry-After`, but how direct API-key limits map to MPP-paid access is not stated in the retrieved public snapshots.

## Use Cases

1. **Tenant onboarding for SaaS email infrastructure.** Create one pod per customer with `name` as the customer-facing label and deterministic `client_id` as the platform tenant ID, then use the returned `pod_id` to provision customer inboxes, domains, API keys, lists, and metrics in other endpoint groups.

2. **Agent workspace separation.** Give each high-autonomy agent or agent team a separate pod so its inboxes, drafts, threads, and domains are isolated from unrelated agents. The pod record's `client_id` can map to the internal agent, team, or project ID.

3. **Customer workspace inventory.** Use `GET /v0/pods` with `limit`, `page_token`, and `ascending` to page through tenant workspaces for an admin console, syncing `pod_id`, `name`, timestamps, and `client_id` into a local control plane.

4. **Provisioning retry safety.** When tenant creation jobs may retry after network or payment-layer failures, send `client_id` on `POST /v0/pods` so duplicate create attempts return the same logical pod instead of creating multiple isolated workspaces for one customer.

5. **Quota and plan monitoring.** Use `GET /v0/organizations` to compare `inbox_count` and `domain_count` against optional `inbox_limit` and `domain_limit` before provisioning more inboxes or domains, and surface billing/authentication metadata for operator diagnostics.

6. **Tenant offboarding workflow.** Use `GET /v0/pods/:pod_id` to confirm the target pod, delete child inboxes and domains through their own endpoint groups, then call `DELETE /v0/pods/:pod_id` only after the workspace is empty.

7. **Billing-aware MPP orchestration.** Treat `POST /v0/pods` as a paid operation at `0.01` token units per the inventory, while treating list/get/delete and organization reads as endpoints with no published MPP payment object until newer source data says otherwise.
