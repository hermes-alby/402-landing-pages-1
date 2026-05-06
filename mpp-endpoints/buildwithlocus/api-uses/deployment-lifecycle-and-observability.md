# Build With Locus: Deployment Lifecycle And Observability API Uses

## What This Endpoint Group Does

This endpoint group manages release state after a Locus service already exists. It can trigger a deployment, poll or list deployment records, cancel an in-flight rollout, roll back to a prior healthy image, restart running containers, redeploy the latest known source/image, and inspect deployment logs as either historical JSON or a Server-Sent Events stream.

The group is most useful for agentic or CI-driven release operations where the caller needs to make deployment decisions from structured fields instead of watching a dashboard: `status`, `version`, `durationMs`, `metadata.phaseTimestamps`, `lastLogs`, phase-aware log metadata, and SSE log events.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/deployments` | Trigger a new deployment for an existing service. | `Authorization` bearer JWT, JSON `serviceId`, optional `source`, `Content-Type: application/json` | Deployment object with `id`, `serviceId`, `version`, `status`, `source`, `createdAt`, `durationMs`, `lastLogs`, `metadata.phaseTimestamps` |
| GET | `/v1/deployments/:deploymentId` | Poll a deployment record and terminal status. | `Authorization` bearer JWT, path `deploymentId` | Deployment object with lifecycle status, timing fields, source, failed-deploy `lastLogs` when available |
| GET | `/v1/deployments/service/:serviceId` | List deployments for one service. | `Authorization` bearer JWT, path `serviceId`, optional query `status`, `limit` | `deployments` collection for history, filtering, and release audit |
| POST | `/v1/deployments/:deploymentId/cancel` | Cancel a queued, building, or deploying rollout. | `Authorization` bearer JWT, path `deploymentId`, `Content-Type: application/json` | Updated deployment object, usually moving toward `cancelled` |
| POST | `/v1/deployments/:deploymentId/rollback` | Deploy the previous healthy image. | `Authorization` bearer JWT, path `deploymentId`, optional JSON `reason`, `Content-Type: application/json` | Deployment object for rollback action, including status and timing fields |
| POST | `/v1/services/:serviceId/restart` | Rolling restart without a rebuild. | `Authorization` bearer JWT, path `serviceId`, `Content-Type: application/json` | Deployment object for the restart lifecycle |
| POST | `/v1/services/:serviceId/redeploy` | Redeploy the latest successful image/source state. | `Authorization` bearer JWT, path `serviceId`, `Content-Type: application/json` | Deployment object for the redeploy lifecycle |
| GET | `/v1/deployments/:deploymentId/logs` | Fetch historical deployment logs or stream phase-aware logs. | `Authorization` bearer JWT, path `deploymentId`, optional query `follow`, optional query `token` for EventSource-style clients | JSON `{logs, phase, reason, deploymentStatus}` or `text/event-stream` events such as `connected`, `log`, `complete`, `error` |

## Field Notes

### Inputs

All endpoints require a Locus workspace JWT as a bearer token. The log endpoint also documents a query `token` alternative for clients such as browser `EventSource` that cannot set an `Authorization` header, but that makes token handling more sensitive because the token appears in a URL.

The core identifiers are `serviceId` and `deploymentId`. `POST /v1/deployments` needs a `serviceId` and may include an optional `source` object. Source details depend on the service source family; documented source types include `image`, `github`, and `s3`, with fields such as `imageUri`, `repo`, `branch`, and `rootDir` where relevant.

Lifecycle mutation endpoints generally have no body. Rollback accepts an optional `reason`, which is valuable for incident records and business review. List-by-service supports `status` and `limit` query inputs. Logs support `follow=true` for SSE streaming; without `follow`, the endpoint returns available historical log data.

### Outputs

Deployment responses expose `id`, `serviceId`, auto-assigned monotonically increasing `version`, `status`, `source`, `createdAt`, `durationMs`, optional `lastLogs`, and optional `metadata.phaseTimestamps`. Documented deployment statuses include `queued`, `building`, `deploying`, `healthy`, `failed`, `cancelled`, and `rolled_back`.

`durationMs` is null while a deployment is still running and useful after terminal completion. `metadata.phaseTimestamps` supports timing analysis with keys such as `queued`, `execution_started`, `building`, `deploying`, `task_definition_registered`, `ecs_service_updated`, `first_task_healthy`, `healthy`, and `failed`.

Failed deployment records may include `lastLogs`, capped at the last 20 relevant lines. Full log retrieval uses `/v1/deployments/:deploymentId/logs`, which is phase-aware: build-phase statuses surface build logs, while deploy/runtime statuses surface runtime logs. Non-streaming log responses can include `phase`, `reason`, and `deploymentStatus`; documented empty-log reasons include `build_not_started`, `build_in_progress`, `deploying_no_logs_yet`, and `no_logs_available`.

### Important Constraints Or Gaps

These endpoints can mutate live infrastructure. They should only be called after explicit user or workflow approval, with enough credits and an existing service already in place. Service creation is billable in the broader API at $0.25/month per service, and new MPP workspaces may need a credit top-up before billable resources can be created.

Deployment status is asynchronous. GitHub/source builds are documented at roughly 3-7 minutes, image deployments at roughly 1-2 minutes, and `queued` can look long during build startup. Polling every 60 seconds is the recommended operational cadence. A `healthy` deployment means the pipeline completed, but service discovery and runtime counts can briefly lag; the service URL may return 503 for up to about 60 seconds after `healthy`.

Cancel returns a conflict when the deployment is already terminal. Rollback requires a previous `healthy` deployment with an image URI, so first deploys or deploys that never reached `healthy` cannot be rolled back. Restart requires actual running instances; if runtime status is `not_deployed`, a fresh deployment is the safer path. Redeploy is documented as useful for environment-variable or start-command changes, but it should not be relied on to apply changed build arguments because redeploy can skip the build phase.

Logs are retained for completed deployments for up to 14 days according to the logs guide, and logging secrets is explicitly risky because logs are stored and retrievable through the API. The MPP catalog includes deployment logs, but the provider docs also mention related status SSE, log search, and service-log endpoints that are not part of this endpoint group.

## Use Cases

### Agent-Run Release Monitoring

An AI coding agent or release bot can trigger `POST /v1/deployments`, store the returned `deploymentId`, then poll `GET /v1/deployments/:deploymentId` on a human-friendly cadence until `healthy`, `failed`, `cancelled`, or `rolled_back`. The useful fields are `status`, `version`, `durationMs`, and `metadata.phaseTimestamps`, because they let the bot distinguish normal build latency from a stalled deployment and report concrete progress instead of vague waiting.

The personal value is that a solo developer can step away from the terminal without losing release visibility. The business value is repeatable, low-touch deployments with an audit trail of IDs, versions, and timings. The main prerequisites are an existing service, a valid JWT, explicit approval for the mutation, and enough workspace credit to keep the service running.

### CI Release Gate And Timing Audit

A CI system can publish an image or update service configuration, call the deployment trigger, then gate promotion on the deployment record reaching `healthy`. The list endpoint, `GET /v1/deployments/service/:serviceId`, lets the pipeline or internal dashboard show recent attempts, filter by status, and compare `durationMs` or phase timestamps across releases.

This helps a team quantify whether builds, task registration, or container startup is getting slower over time. It also gives managers and support teams a shared release history without requiring dashboard access. The limitation is that this catalog group does not include every observability endpoint mentioned in provider docs, such as log search or recent deployments across the whole workspace.

### Incident Rollback And Recovery

During an outage, an operator can inspect the active deployment, stream or fetch logs, and decide whether to cancel, roll back, restart, or redeploy. `lastLogs` can provide a fast failure clue, while full phase-aware logs help separate a Docker build problem from a runtime crash or health-check failure. Supplying a rollback `reason` gives the incident record a human explanation that can be reviewed later.

The decision tree is constrained by deployment state. Cancel is for in-flight work, rollback needs a prior healthy deployment with an image URI, restart needs currently running instances, and redeploy is better for applying environment or start-command changes than for build-argument changes. For compliance and security, incident tooling should avoid placing JWTs in URLs where possible and should not write secrets to stdout/stderr because logs are stored.

### Customer Support And Self-Service Status Views

A support dashboard can use the list and get endpoints to show a customer or internal support engineer what happened to a service release: which version ran, when phases changed, how long the deployment took, and whether the terminal state was `healthy` or `failed`. The logs endpoint can add a controlled diagnostic pane for build/runtime evidence, especially when the failed deployment object includes only the last 20 log lines.

The personal angle is fewer "is it live yet?" interruptions for builders. The business angle is faster ticket triage and clearer post-release accountability. The dashboard must handle log retention limits, empty-log reasons, SSE stream completion/error events, and token exposure if it uses query-token streaming from a browser.
