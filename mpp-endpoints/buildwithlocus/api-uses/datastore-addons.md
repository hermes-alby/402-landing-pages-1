# Build With Locus: Datastore Addons API Uses

## What This Endpoint Group Does

This endpoint group manages Build With Locus datastore addons for an environment. It covers provisioning a managed Postgres database or Redis cache, polling the addon until it is usable, listing existing addons for an environment, and deleting an addon when it is no longer needed.

These calls are not per-request paid MPP endpoints in the catalog, but addon creation consumes workspace credits because each addon is billed as a monthly resource. Services do not receive addon credentials automatically just because the addon exists; callers must reference addon template variables in the service environment and redeploy after the addon reaches `available`.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/addons` | Create a Postgres or Redis addon in a project environment. | JWT bearer token; JSON body with `projectId`, `environmentId`, `type` (`postgres` or `redis`), optional `name`, optional Postgres `config.databaseName` and `config.username` hints. | `id`, `name`, `type`, `status`, `projectId`, `environmentId`, optional `connectionString`, optional `requiresRedeploy`, optional `note`; `402` can include `creditBalance` and `requiredAmount`. |
| GET | `/v1/addons/:addonId` | Retrieve addon details and poll provisioning status. | JWT bearer token; path `addonId`. | Addon object with `id`, `name`, `type`, `status`, `projectId`, `environmentId`, optional `connectionString`, optional `requiresRedeploy`, optional `note`. |
| GET | `/v1/addons/environment/:envId` | List addons attached to one environment, optionally by datastore type. | JWT bearer token; path `envId`; optional query `type=postgres` or `type=redis`. | `addons` array containing addon objects and their status/connection metadata. |
| DELETE | `/v1/addons/:addonId` | Delete an addon and deprovision its backing infrastructure. | JWT bearer token; path `addonId`. | `204 No Content` on success; common errors include `401`, `404`, and `500`. |

## Field Notes

### Inputs

All endpoints require a JWT bearer token. `POST /v1/addons` requires a JSON body tying the addon to a `projectId` and `environmentId`, with `type` limited to `postgres` or `redis`. Postgres accepts optional `config.databaseName` and `config.username`, but the docs describe these as provisioning hints rather than guaranteed final names.

The list endpoint uses `envId` in the path and can filter with the same `postgres` or `redis` enum. Delete and status lookup both use `addonId`; delete should be treated as destructive because it deprovisions the backing datastore and returns no body.

### Outputs

Addon records expose the operational fields needed to wire application services: `id`, `name`, `type`, `status`, `projectId`, `environmentId`, and, once ready, `connectionString`. The documented status enum is `provisioning`, `available`, and `failed`; `available` means the connection string is populated.

The create/get responses can include `requiresRedeploy` and a `note` telling callers that services must be redeployed to pick up addon connection variables. The environment list wraps addon records in an `addons` array. Delete succeeds with `204 No Content`.

### Important Constraints Or Gaps

Each addon costs `$0.25/month` from workspace credits, and creation can return `402 Insufficient credits` with `creditBalance` and `requiredAmount`. The broader service research says new MPP workspaces start with `$0.00` credits, while the cached addon/billing docs say new workspaces start with `$1.00`; that credit-start discrepancy should be checked before building automated onboarding assumptions.

Addon credentials are injected through explicit service environment templates, such as `${{db.DATABASE_URL}}` for Postgres or `${{cache.REDIS_URL}}` for Redis. Templates resolve at deployment time, so a service needs a fresh deployment after the addon is `available`; setting variables alone is not enough.

Postgres `databaseName` and `username` are hints, and callers should not construct credentials manually. Use the provider-supplied template variables or resolved variables instead. Redis addons use an isolated database number in a shared Redis cluster, so application-level key prefixes are still useful when several services share the same Redis addon.

Provider docs describe additional datastore data and execution APIs for table inspection, read-only SQL, Redis key inspection, SQL execution, Redis execution, and migrations, but those endpoints are not included in this MPP catalog group. No official OpenAPI spec was found for the reviewed docs; field coverage is derived from provider markdown and examples.

## Use Cases

### Add A Postgres Database To A New App

A developer or agent deploying a personal app can create a Postgres addon immediately after creating the project, environment, and service. The workflow is to call `POST /v1/addons` with `type: "postgres"`, store the returned `addonId`, poll `GET /v1/addons/:addonId` until `status` is `available`, set service variables with a template such as `${{db.DATABASE_URL}}`, and trigger a redeploy so the app receives `DATABASE_URL`.

For a business, this makes a repeatable launch path for small SaaS apps, internal tools, customer portals, and prototypes that need durable relational storage without manual dashboard work. The main caveats are credit availability, the `$0.25/month` addon cost, possible `402` handling, and migration timing: if the app runs migrations at startup, the first deployment after the addon is ready is the moment those migrations are likely to run.

### Add Redis For Cache, Sessions, Or Job Coordination

An app with slow repeated reads, session state, rate-limit counters, or lightweight job coordination can provision a Redis addon with `POST /v1/addons` and `type: "redis"`. Once `GET /v1/addons/:addonId` reports `available`, the service should reference `${{cache.REDIS_URL}}` or the Redis `HOST`/`PORT` templates and redeploy.

The personal angle is speed and simplicity: one small app can add caching without running its own Redis host. The business angle is operational leverage: teams can standardize cache creation in deployment scripts, reduce database pressure, and keep environment setup reproducible. Redis still needs application discipline, including key prefixes when multiple services share the addon, and the documented data/command inspection endpoints are outside this MPP group.

### Gate Deployments On Datastore Readiness

Provisioning is asynchronous, so a deployment workflow can poll addon status before promoting an app or redeploying services that depend on database credentials. `provisioning` means keep waiting, `available` means it is safe to inject variables and redeploy, and `failed` means stop the rollout and surface a clear operator action instead of letting the app boot with missing credentials.

This is useful for solo builders because it prevents confusing first-launch failures where the app starts before its datastore exists. For businesses, the same polling step can become a CI/CD control that blocks broken releases, creates audit logs around infrastructure readiness, and reduces support tickets from half-configured environments. The limitation is that these endpoints report provisioning state, not application-level database schema health.

### Inventory And Cleanup Environment Datastores

`GET /v1/addons/environment/:envId` lets an operator or agent show all Postgres and Redis addons in an environment, optionally filtered by `type`. A useful workflow is to compare listed addons against service variables, deployment configuration, and product ownership notes to identify datastores that are active, unused, or waiting for redeploy.

This can help an individual avoid paying for stale experiment databases, and it gives a business a lightweight inventory check for monthly credit spend. Any cleanup should be approval-gated because `DELETE /v1/addons/:addonId` deprovisions infrastructure and returns only `204 No Content`; the reviewed endpoint records do not document backup, restore, retention, or cascade behavior for deleted addons.
