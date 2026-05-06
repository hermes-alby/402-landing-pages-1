# Build With Locus: Service Configuration And Variables API Uses

## What This Endpoint Group Does

This endpoint group defines how Build With Locus services are configured and how each service receives environment variables. It covers creating, listing, inspecting, updating, and deleting service definitions, plus replacing, merging, and previewing service-level variables.

The group is the configuration layer rather than the full deployment lifecycle. A caller uses these endpoints after it already has a workspace JWT plus a project and environment, then hands the resulting service IDs, URLs, runtime settings, and variable maps to deployment, logs, addon, domain, or webhook workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/services` | Create a service definition in a project environment. | Bearer JWT, `projectId`, `environmentId`, `name`, `source`, optional `runtime`, `buildConfig`, `startCommand`, `healthCheckPath`, `errorPatterns`, `autoDeploy`. | Service object with `id`, `name`, `url`, project/environment IDs, source/runtime config, deployment fields, optional `runtime_instances`, and low-balance `warnings`. |
| GET | `/v1/services/:serviceId` | Fetch one service and its latest status metadata. | Bearer JWT, `serviceId`, optional `include=runtime`. | Service object with `deploymentStatus`, `lastDeploymentId`, `lastDeployedAt`, and optional `runtime_instances`. |
| PATCH | `/v1/services/:serviceId` | Update mutable service settings. | Bearer JWT, `serviceId`, optional `name`, `autoDeploy`, `runtime`, `startCommand`, `healthCheckPath`, `errorPatterns`. | Updated service object with the same status and runtime fields as the get endpoint. |
| DELETE | `/v1/services/:serviceId` | Delete a service. | Bearer JWT, `serviceId`. | `204 NoContent`. |
| GET | `/v1/services/environment/:environmentId` | List services in an environment. | Bearer JWT, `environmentId`, optional `include=runtime`. | `{ services: [...] }`, with service status fields and optional runtime counts per service. |
| PUT | `/v1/variables/service/:serviceId` | Replace all variables for one service. | Bearer JWT, `serviceId`, JSON body `{ variables }`. | `{ variables }` map. |
| PATCH | `/v1/variables/service/:serviceId` | Merge variable additions or updates without removing other keys. | Bearer JWT, `serviceId`, JSON body `{ variables }`. | `{ variables }` map. |
| GET | `/v1/variables/service/:serviceId/resolved` | Preview variables after service, addon, and sibling-service references are resolved. | Bearer JWT, `serviceId`. | `{ variables }` map including resolved addon references and sibling-service URL injections where available. |

## Field Notes

### Inputs

All endpoints require a JWT bearer token. Write endpoints with request bodies also require JSON content. This group does not handle MPP sign-up, credit top-up, project creation, environment creation, deployment triggers, or wallet payment settlement.

Service creation requires `projectId`, `environmentId`, `name`, and `source`. The documented source types are `image`, `github`, and `s3`: `image` uses `imageUri`, `github` uses `repo` and optional `branch`, and `s3` is used for git-push style workflows with optional `rootDir`. `runtime` accepts `port`, `cpu`, `memory`, `minInstances`, and `maxInstances`; docs describe `port` as effectively fixed at 8080 because the platform injects `PORT=8080`.

Other service inputs tune operational behavior. `startCommand` overrides the image command and runs through `sh -c`; `healthCheckPath` asks Locus to require HTTP 200 on that path; `errorPatterns` customizes runtime error detection; `autoDeploy` controls GitHub push-triggered deploys for matching source repos and branches. `buildConfig` is available on direct `POST /v1/services` with Dockerfile settings and build args, but docs note that build args only apply on fresh builds.

Variable writes use a single `variables` object. `PUT` is a full replacement, which is useful for reconciling an exact desired state but can accidentally remove keys. `PATCH` is safer for additive changes and secret rotation because it preserves keys not named in the request. The resolved-variables endpoint has no body and is meant to preview what a deployment would receive after template resolution.

### Outputs

Service responses expose identifiers and routing details: `id`, `name`, `url`, `projectId`, and `environmentId`. They also include source and runtime configuration, command and health-check settings, `autoDeploy`, and deployment summary fields such as `deploymentStatus`, `lastDeploymentId`, and `lastDeployedAt`.

When `include=runtime` is passed to service get or list, responses can include `runtime_instances` with `runningCount`, `desiredCount`, `pendingCount`, and sometimes `status: "not_deployed"`. Create-service responses may also include low-balance warnings.

Variable responses return `{ variables: { ... } }`. Resolved variables can include explicit addon references such as `${{db.DATABASE_URL}}`, sibling service URL variables such as `API_URL` and `API_INTERNAL_URL`, and `LOCUS_SERVICE_URL` for the current service. These values may include secrets or internal URLs and should be treated as sensitive configuration data.

### Important Constraints Or Gaps

There is no located OpenAPI spec for this service group. Field shapes are derived from provider markdown, examples, and the MPP feed, so exact response fields for every source variant remain somewhat example-driven.

Creating a service is a billable action in the provider docs: each service costs `$0.25/month` from workspace credits, and insufficient credit can return `402`. This artifact did not perform paid calls or mutations.

Containers must listen on port 8080. Pre-built images must support `linux/arm64`; source builds from GitHub or git push are handled by the platform. Service names must be unique within an environment.

`runtime_instances` is a debugging aid and may be cached for about 30 seconds. Deployment status should be treated as the primary readiness signal, especially around fresh deploys.

Variables are injected at deploy time. After changing variables, a redeploy or fresh deployment outside this endpoint group is needed before running containers receive the new values. Addon templates require the addon to be available before deployment.

Private GitHub repositories require prior GitHub integration through the Locus integrations flow. The service create/update endpoints do not replace that account-linking prerequisite.

## Use Cases

### Agent-Led Container Service Setup

An AI agent or developer can turn a known container image or repository into a Locus service without opening a dashboard. The workflow is to create or select a project and environment, call `POST /v1/services` with `name`, `source`, and `runtime`, then store the returned `serviceId` and `url` for deployment and monitoring steps. Useful fields are `source.type`, `source.imageUri`, `source.repo`, `source.branch`, `runtime.cpu`, `runtime.memory`, `minInstances`, `maxInstances`, `healthCheckPath`, and `startCommand`.

The personal angle is speed: a solo developer can package a prototype and let an agent set up the service shell in minutes. The business angle is repeatability: teams can enforce naming, sizing, health checks, and error patterns across environments. Prerequisites are non-trivial: the workspace needs credits, a JWT, a project/environment, port-8080 readiness, and ARM64-compatible images for pre-built sources. For GitHub repos, the docs recommend higher-level `from-repo` workflows when possible; this group is best when direct service-level control is needed.

### Multi-Service Monorepo Layout

For a monorepo with `api`, `web`, and `worker` directories, automation can create one service per component and point each service at the right source location. With git-push workflows, `source.type: "s3"` and `source.rootDir` distinguish folders such as `services/api` and `services/web`. With GitHub sources, `repo`, `branch`, and `autoDeploy` decide which commits can trigger deployments.

This helps an individual developer avoid manual wiring mistakes and gives a business a consistent topology for preview, staging, and production environments. The list endpoint, `GET /v1/services/environment/:environmentId?include=runtime`, lets automation verify that all expected services exist and optionally check running counts after deployment workflows run. Costs scale per service, so a three-service monorepo creates three monthly service charges; service naming collisions and private-repo integration are practical prerequisites.

### Service-To-Service And Addon Wiring

The variable endpoints support the common workflow of connecting one service to another service or to managed data addons. A caller can set `DATABASE_URL` to a template such as `${{db.DATABASE_URL}}`, set an API base URL from `${{api.INTERNAL_URL}}`, then call `GET /v1/variables/service/:serviceId/resolved` to preview the values that should be injected at deployment time.

For a person shipping an app, this removes the brittle step of copying URLs and credentials into source code. For a business, it creates a cleaner compliance posture: secrets and connection strings can live in service variables rather than a repository. The limits matter: templates are resolved at deploy time, not when the variable is written; addon references require the addon to be available; and resolved output may expose sensitive values, so logs and audit systems should avoid recording full variable maps.

### Secret Rotation And Environment Drift Control

`PATCH /v1/variables/service/:serviceId` is useful for targeted updates, such as rotating `LOCUS_API_KEY`, changing `LOG_LEVEL`, or adding a new feature flag without disturbing other keys. `PUT /v1/variables/service/:serviceId` is better for declarative reconciliation where a controller owns the entire variable map and intentionally removes missing keys.

The personal value is fewer surprise outages from hand-edited `.env` files. The business value is stronger change control: automation can compare desired variables against the resolved view, apply a merge or replacement, and then trigger an approved deployment outside this group. The main limitation is timing. Existing containers do not pick up variable changes live, so the workflow must include redeployment and should handle secret exposure carefully in CI logs, tickets, and chat transcripts.

### Runtime Sizing And Health Guardrails

Operations teams can use `PATCH /v1/services/:serviceId` to tune CPU, memory, minimum and maximum instances, command overrides, health checks, and custom error patterns as the service matures. A small internal tool can start with defaults, then raise memory, add `/healthz`, or enable stricter error matching after incidents.

This has a personal angle for on-call engineers: the fields provide quick levers when a service is under-provisioned or not reporting readiness accurately. The business angle is reliability with cost control, because min/max instances and memory choices affect capacity planning and credit usage. The constraints are concrete: health checks must return HTTP 200, port 8080 must work, runtime-count reads may lag, and the docs do not fully spell out which config changes apply immediately versus on the next deployment.

### Auto-Deploy Policy Management

For GitHub-backed services, `autoDeploy` lets a team decide whether a push to the configured branch should trigger a deployment automatically. Automation can list services in an environment, find GitHub sources, and patch `autoDeploy` to match release policy: fast-moving preview environments can be automatic, while production services can require manual deployment workflows outside this group.

The personal benefit is control over when a developer's commits go live. The business benefit is release governance, especially when different environments need different policies. This only applies cleanly to GitHub source services where `repo` and `branch` match incoming push events; suspended or delinquent services may be skipped by the platform, and this endpoint group does not include deployment approval, rollback, or audit-event collection.

### Service Inventory And Cleanup

The environment list endpoint gives agents and internal tools a compact inventory of all services in one environment. By using `include=runtime`, a controller can identify services with no running tasks, stale `lastDeployedAt` values, unexpected source types, or missing health checks, then report those for human review or apply controlled updates.

This is useful personally when a developer forgets which preview services exist. It is useful commercially for cost hygiene because every active service carries a monthly credit cost. Deletion is available through `DELETE /v1/services/:serviceId`, but it is destructive and the reviewed group docs only publish a `204` response, not detailed cleanup semantics for related domains, deployments, variables, or logs.
