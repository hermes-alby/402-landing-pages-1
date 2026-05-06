# AgentMail: Usage Metrics And Activity Reporting API Uses

## What This Endpoint Group Does

This group covers read-only metrics queries for AgentMail email activity. The three endpoints return time-bucketed counts keyed by metric event type, with the same query model at three scopes: organization-wide, within a pod, or for a single inbox.

The practical value is operational reporting: track sent, delivered, bounced, delayed, rejected, complained, and received message volume over a time window. The endpoints do not expose message bodies, recipients, domains, labels, or billing totals; they summarize event counts as arrays of metric buckets.

MPP access uses `https://mpp.api.agentmail.to` and payment negotiation through `mppx`, while the direct OpenAPI source documents bearer authentication. In the endpoint inventory, all three metrics records have an empty `payment` object, so the assigned data does not publish an MPP unit price, token amount, or currency for metrics reads.

## Endpoints Covered

| Endpoint ID | Method | MPP path | Direct provider path | Scope | Required path fields | MPP payment in inventory |
| --- | --- | --- | --- | --- | --- | --- |
| `endp_594cfa5dace85885f0fa` | `GET` | `/v0/metrics` | `/v0/metrics` | Organization | None | None listed; `payment` is `{}` |
| `endp_8658f887c5048fc6670f` | `GET` | `/v0/pods/:pod_id/metrics` | `/v0/pods/{pod_id}/metrics` | Pod | `pod_id` | None listed; `payment` is `{}` |
| `endp_631cc8e053ab50e5ee52` | `GET` | `/v0/inboxes/:inbox_id/metrics` | `/v0/inboxes/{inbox_id}/metrics` | Inbox | `inbox_id` | None listed; `payment` is `{}` |

## Field Notes

### Inputs

All three endpoints share the same optional query fields:

| Field | Location | Type | Notes |
| --- | --- | --- | --- |
| `event_types` | Query | `array<enum>` | Filters returned metric series. Allowed values are `message.sent`, `message.delivered`, `message.bounced`, `message.delayed`, `message.rejected`, `message.complained`, and `message.received`. |
| `start` | Query | `string:date-time` | Start timestamp for the metrics window. |
| `end` | Query | `string:date-time` | End timestamp for the metrics window. |
| `period` | Query | `string` | Bucket period expressed as a number of seconds. The schema is string, not integer. |
| `limit` | Query | `integer` | Maximum number of buckets to return. The inventory does not show a `page_token`; this is bucket limiting, not documented pagination. |
| `descending` | Query | `boolean` | Sorts buckets in descending time order when supplied. |
| `pod_id` | Path | `string` | Required only for `/v0/pods/:pod_id/metrics`. |
| `inbox_id` | Path | `string` | Required only for `/v0/inboxes/:inbox_id/metrics`. |
| `Authorization` | Header | `string` | Required in the direct OpenAPI spec as bearer authentication. MPP requests use the MPP base URL and wallet-backed payment negotiation instead. |

There is no request body for these `GET` operations.

### Outputs

Successful responses use `type_metrics:QueryMetricsResponse`, an object map where each key is a metric event type and each value is an array of metric buckets. Each bucket has:

| Field | Type | Meaning |
| --- | --- | --- |
| `timestamp` | `string:date-time` | Timestamp for the bucket. |
| `count` | `integer` | Count of matching events in that bucket. |

The documented validation error response is HTTP `400` with `name` and `errors` fields. The inventory does not list additional metrics-specific error bodies.

### Important Constraints Or Gaps

- These endpoints are reporting endpoints only. They do not send mail, mutate state, register accounts, create API keys, or expose raw message content.
- Scope matters: `/v0/metrics` aggregates organization activity, `/v0/pods/:pod_id/metrics` narrows to one pod, and `/v0/inboxes/:inbox_id/metrics` narrows to one inbox.
- The metrics event enum is narrower than the webhook event surface. The metrics schema includes standard sent, delivered, bounced, delayed, rejected, complained, and received events, but not webhook-only received variants such as spam, blocked, or unauthenticated.
- `message.delivered` should be treated as delivery to the recipient mail server, not proof that the message landed in the recipient inbox.
- `count` is event volume, not cost. MPP price metadata is absent for all three metrics endpoints in the inventory, even though the broader AgentMail MPP service uses per-request payment negotiation.
- The public snapshots do not state default `start`, `end`, `period`, `limit`, or sort behavior when those query fields are omitted.
- The inventory records have `field_gaps: []`, but they still omit MPP-specific rate limits, retry behavior after payment negotiation failure, and a published metrics-read unit price.

## Use Cases

1. Organization deliverability dashboard: Query `/v0/metrics` with `event_types=message.sent,message.delivered,message.bounced,message.complained` over a daily or hourly `period` to show aggregate sending health across all AgentMail resources.

2. Pod-level tenant monitoring: Query `/v0/pods/:pod_id/metrics` for a customer or agent cohort to compare `message.sent`, `message.bounced`, and `message.rejected` counts without mixing activity from other pods.

3. Inbox-level agent performance report: Query `/v0/inboxes/:inbox_id/metrics` with `message.received` and `message.sent` to measure whether a specific agent inbox is receiving work, responding, and keeping pace over a defined `start` to `end` window.

4. Bounce and complaint escalation: Track `message.bounced` and `message.complained` counts by bucket. A sudden increase can trigger review of recipient quality, sending cadence, or domain reputation before more paid sending endpoints are used.

5. Delivery pipeline incident detection: Monitor `message.delayed` and `message.rejected` at organization and pod scope. Rising delayed or rejected counts can separate platform-wide delivery issues from tenant-specific configuration problems.

6. MPP spend-planning signal: Because metrics reads have no published MPP amount in the inventory, use their `count` outputs as non-billing volume indicators that help estimate future use of paid sending, draft, inbox, list, domain, or pod endpoints documented elsewhere in the service inventory.
