# Build With Locus: Webhook Monitoring API Uses

## What This Endpoint Group Does

This endpoint group lets a Build With Locus workspace register, review, modify, and remove webhook subscriptions for project-level operational events. The covered API surface is push-monitoring infrastructure: instead of polling deployment status, logs, service errors, and billing state, a caller can point Locus at an HTTPS receiver and subscribe to specific event names.

The MPP catalog exposes webhook CRUD only. Provider docs also describe single-webhook fetch, test delivery, and delivery-log endpoints, but those are not present in the reviewed MPP endpoint list.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/webhooks` | Create a webhook subscription for a project. | JWT bearer token, JSON body with `projectId`, `url`, `events`, optional `description`. | `201` webhook object with `id`, `projectId`, `url`, `events`, optional `description`, generated `secret`, `active`, `createdAt`. |
| GET | `/v1/webhooks` | List workspace webhooks, optionally filtered to one project. | JWT bearer token, optional query `projectId`. | `200` response with `webhooks[]`, each carrying webhook identity, destination, event list, secret, active flag, and creation timestamp. |
| PATCH | `/v1/webhooks/:webhookId` | Update destination, subscribed events, active state, or description. | JWT bearer token, path `webhookId`, JSON body with optional `url`, `events`, `active`, `description`. | `200` updated webhook object. |
| DELETE | `/v1/webhooks/:webhookId` | Remove a webhook subscription. | JWT bearer token, path `webhookId`. | `204` with no response body. |

## Field Notes

### Inputs

All covered endpoints require a JWT bearer token. The provider guide says tokens expire after 30 days and can be checked with the whoami endpoint or refreshed through auth flows.

Webhook creation requires `projectId`, a destination `url`, and an `events` array. The provider-documented event set includes deployment lifecycle events, `deployment.log`, `service.error`, billing reminder and failure events, and `*` for all events. Updates accept replacement values for `url`, `events`, `active`, and `description`; deletion and update address an existing webhook by `webhookId`.

### Outputs

Create, list, and update return webhook objects with identifiers and configuration: `id`, `projectId`, `url`, `events`, optional `description`, generated `secret`, `active`, and `createdAt`. The `secret` is operationally important because provider docs state webhook deliveries include an `X-Locus-Signature` HMAC-SHA256 digest of the JSON body signed with that secret.

Delivery payloads vary by event type. Deployment status events include fields such as `event`, `timestamp`, `webhookId`, `deploymentId`, `serviceId`, `projectId`, `status`, and `version`. `deployment.log` payloads include `phase` and `logs[]`; docs describe `phase` as build or deploy related and say batches arrive about once per minute while deployment is active.

### Important Constraints Or Gaps

The MPP feed marks the four covered webhook endpoints with `payment: null`, but they still require an authenticated workspace and project. Creating or updating webhooks is a mutation, so this research did not call the endpoints.

Webhook receivers must be prepared to validate signatures, protect the generated secret, and handle retries. Provider docs say failed deliveries retry up to three times with exponential backoff, and each attempt is logged separately.

The MPP catalog omits provider-documented `GET /v1/webhooks/:webhookId`, `POST /v1/webhooks/:webhookId/test`, and `GET /v1/webhooks/:webhookId/deliveries`. That means MPP users may not have cataloged access to direct webhook inspection, synthetic test sends, or delivery diagnostics, even though provider docs describe them. Unknown event names can produce a `400` with `invalidEvents` and `validEvents`.

## Use Cases

### Deployment Failure And Recovery Alerts

A solo developer or agent operator can subscribe to `deployment.failed`, `deployment.cancelled`, `deployment.rolled_back`, and `deployment.healthy` so a deployment pipeline stops being a polling loop. The webhook payload gives the receiver enough context to correlate the incident to a `deploymentId`, `serviceId`, `projectId`, status, and version, then decide whether to notify a person, open an incident, fetch logs, or trigger an approved recovery workflow.

The business value is shorter time to detection after a broken deploy, especially for small teams that do not have a full monitoring stack. The setup still needs a stable HTTPS receiver, JWT-authenticated webhook creation, HMAC verification, and a clear policy for automated rollback or redeploy actions because those recovery actions are outside this endpoint group and can change production state.

### Push-Based Build Log Monitoring

An AI deployment assistant can create a webhook for `deployment.log`, `deployment.healthy`, and `deployment.failed` after it starts a Build With Locus deployment. Instead of holding an SSE connection or repeatedly polling, it receives log batches with timestamps and phase information, then summarizes progress for the user or flags stuck builds.

This is useful when the user wants a personal "tell me when it is done or broken" workflow, and for businesses it reduces polling traffic and makes deployment progress easier to route into Slack, PagerDuty, or an internal status board. Logs are batched about once per minute and each batch is documented as up to 100 lines, so this is not a byte-for-byte real-time terminal stream.

### Runtime Error Triage

Teams can subscribe to `service.error` plus deployment failure events to catch runtime problems after a service is already live. Provider docs say the scanner runs about every five minutes against patterns such as error, fatal, panic, and exception variants; once the webhook arrives, the receiver can use `serviceId` and related context to query service logs, create a bug report, or page the owner.

The personal angle is that a developer does not need to keep checking logs after handoff. The business angle is basic production safety for low-cost services. The limitation is signal quality: pattern-based error detection can miss domain-specific failures or flag noisy logs, so teams should tune downstream routing, deduplicate alerts, and avoid shipping sensitive log content into third-party tools without checking privacy requirements.

### Billing Continuity Notifications

Build With Locus billing events such as `billing.reminder`, `billing.failed`, `billing.delinquent`, `billing.final_warning`, and `billing.payment_received` can be sent to an operations mailbox, finance automation, or chat channel. For an MPP-funded workspace that starts at zero credits and needs top-ups before billable resources can continue, these events can drive timely human approval before services are suspended.

This is valuable for small businesses because a missed credit top-up can become an availability problem. The webhook itself does not add credits or settle payments; it should trigger review, budget checks, or an approved top-up workflow elsewhere. Receivers should treat billing events as sensitive operational data and route them only to systems allowed to process payment and account-status information.

### Webhook Hygiene And Rotation

The list, update, and delete endpoints support operational maintenance: inventory existing hooks, disable a noisy subscription with `active: false`, rotate a destination URL, narrow an event set, or delete a receiver that no longer exists. This matters after project ownership changes or when an incident channel migrates from a test endpoint to a production alerting system.

The strongest business case is reducing alert drift and secret exposure over time. Since the generated secret appears in webhook objects, teams should store and handle it as a credential, restrict who can list webhooks, and verify whether their MPP access path exposes enough diagnostics before depending on provider-documented delivery logs.
