# AgentMail: Recipient Policy Lists API Uses

## What This Endpoint Group Does

Recipient policy lists let an AgentMail organization, pod, or individual inbox allow or block email addresses and domains for three communication directions: `send`, `receive`, and `reply`. The fields are deliberately small but high-impact: the path selects scope plus `direction` and `type`, while create requests add an `entry` and optional `reason`.

The public docs describe six list classes: receive allow, receive block, send allow, send block, reply allow, and reply block. Entries can be full email addresses or entire domains. Scope resolution is important: inbox-level matches override pod and organization lists, and pod-level matches override organization lists. Reply handling is also separate from general receive handling: inbound replies detected through `In-Reply-To` check `reply` lists, while non-replies check `receive` lists.

In the MPP inventory, the three create-entry endpoints are paid operations. Each `POST` create operation carries `amount_units: 0.01` for "Create list entry" using the Tempo payment method. The list, get, and delete operations in this group have no MPP charge metadata in the inventory. The public docs confirm per-request MPP negotiation but do not provide a comprehensive public MPP price table.

## Endpoints Covered

| Scope | Endpoint ID | Method | MPP path | Operation | MPP cost metadata |
| --- | --- | --- | --- | --- | --- |
| Inbox | `endp_b5a52848f9cc871fd7e5` | GET | `/v0/inboxes/:inbox_id/lists/:direction/:type` | List entries | No charge metadata |
| Inbox | `endp_2a1410b31dbf6a310500` | GET | `/v0/inboxes/:inbox_id/lists/:direction/:type/:entry` | Get one entry | No charge metadata |
| Inbox | `endp_d68be2f915d80da4fed6` | POST | `/v0/inboxes/:inbox_id/lists/:direction/:type` | Create entry | `0.01` token units |
| Inbox | `endp_db1d2fb69abfe40fbbe3` | DELETE | `/v0/inboxes/:inbox_id/lists/:direction/:type/:entry` | Delete entry | No charge metadata |
| Organization | `endp_3b82f7772de24a36aa6d` | GET | `/v0/lists/:direction/:type` | List entries | No charge metadata |
| Organization | `endp_50c223609edb315b7f6e` | GET | `/v0/lists/:direction/:type/:entry` | Get one entry | No charge metadata |
| Organization | `endp_a6d07fd4a24af100d365` | POST | `/v0/lists/:direction/:type` | Create entry | `0.01` token units |
| Organization | `endp_32f70c4a97ded3c7355d` | DELETE | `/v0/lists/:direction/:type/:entry` | Delete entry | No charge metadata |
| Pod | `endp_355832374e650007d81f` | GET | `/v0/pods/:pod_id/lists/:direction/:type` | List entries | No charge metadata |
| Pod | `endp_14f8254ed31473c4c769` | GET | `/v0/pods/:pod_id/lists/:direction/:type/:entry` | Get one entry | No charge metadata |
| Pod | `endp_49198a490aeb62036f0e` | POST | `/v0/pods/:pod_id/lists/:direction/:type` | Create entry | `0.01` token units |
| Pod | `endp_36e600d8712d1ce8ff74` | DELETE | `/v0/pods/:pod_id/lists/:direction/:type/:entry` | Delete entry | No charge metadata |

## Field Notes

### Inputs

All operations require `direction` and `type` path parameters. `direction` is one of `send`, `receive`, or `reply`; `type` is one of `allow` or `block`.

Scoped operations add either `pod_id` or `inbox_id` as a required path parameter. Single-entry get and delete operations also require `entry` in the path, described as an email address or domain. List operations accept optional `limit` and `page_token` query parameters for pagination.

Create operations accept an `application/json` body with required `entry` and optional `reason`. `entry` is the email address or domain to add. The docs say `reason` is optional and available on block lists; the OpenAPI request schema does not enforce that distinction directly, so callers should treat `reason` on allow lists as undefined behavior unless AgentMail documents otherwise.

### Outputs

List operations return `count`, optional `limit`, optional `next_page_token`, and an `entries` array ordered by `entry` ascending. Organization-scope list entries use `ListEntry`; pod and inbox list operations use `PodListEntry`.

Single-entry get and create operations return the created or fetched list entry. Common response fields are `entry`, `organization_id`, optional `reason`, `direction`, `list_type`, `entry_type`, and `created_at`. `entry_type` is one of `email` or `domain`, which lets consumers distinguish exact-address policy entries from domain-wide entries after normalization.

Pod and inbox responses also include required `pod_id`; inbox-level responses can include `inbox_id` when the entry is inbox-scoped. Delete operations return a successful `200` with no documented body, or a `404` error object with `name` and `message`.

### Important Constraints Or Gaps

Create operations are the only paid operations in this group according to the MPP inventory: organization, pod, and inbox `POST` create-entry endpoints each list `amount_units: 0.01`, `amount: "10000"`, `decimals: 6`, method `tempo`, and description "Create list entry". The public docs explain MPP per-request payment negotiation, but the retrieved public sources do not include a complete official MPP price table or quota mapping for these list operations.

AgentMail evaluates the most specific scope first. If an inbox list matches, broader pod and organization lists are not checked. This means policy audits need to inspect all three scopes, not just organization lists.

Reply lists are not fallback receive lists. Replies to previous outbound messages are evaluated against `reply` lists, while non-reply inbound mail is evaluated against `receive` lists. Public docs state that empty reply lists allow replies by default.

The OpenAPI spec documents bearer authentication on the direct API, while MPP use is through `https://mpp.api.agentmail.to` and SDK/client payment negotiation. This artifact did not call endpoints, pay invoices, sign wallet messages, register accounts, or mutate data.

## Use Cases

1. **Organization-wide send allowlist for production outreach.** Add approved customer or prospect domains with `POST /v0/lists/send/allow` and required `entry`, then audit with `GET /v0/lists/send/allow?limit=...&page_token=...`. The returned `entry_type` shows whether each rule applies to one address or a whole domain, and `created_at` supports change-review workflows.

2. **Pod-level tenant guardrails.** For a multi-tenant agent platform, maintain `send` and `receive` policies under `/v0/pods/:pod_id/lists/:direction/:type` so every inbox in that pod inherits the same boundary. This is useful when a pod maps to a customer workspace and needs customer-specific allowed domains or blocked competitors.

3. **Inbox-specific exception handling.** Use `/v0/inboxes/:inbox_id/lists/:direction/:type` when one agent needs a narrower rule than its pod. For example, a support inbox can allow `receive` from known enterprise domains while a sales inbox in the same pod has a different allowlist. The `inbox_id` field in returned entries identifies inbox-scoped policy records.

4. **Reply-safe task agents.** Keep unsolicited inbound mail constrained with `receive` allowlists, while leaving `reply` lists empty or adding targeted `reply` block entries. This supports agents that send booking, reservation, or support emails and need legitimate replies to get through even when general receive policy is restrictive.

5. **Abuse response and audit trail.** When a spam sender or unwanted domain appears, create a `receive` or `reply` block entry with `reason` set to a concise abuse category. Later, `GET .../:entry` can retrieve the stored `reason`, `direction`, `list_type`, `entry_type`, and `created_at` for incident review.

6. **Policy inventory reconciliation.** Periodically page through organization, pod, and inbox list endpoints using `limit` and `page_token`, then compare `entry`, `direction`, `list_type`, `entry_type`, and scope IDs against an internal desired-state file. Because create calls are paid through MPP and deletes mutate policy, a no-paid-calls audit can stop at GET reads.
