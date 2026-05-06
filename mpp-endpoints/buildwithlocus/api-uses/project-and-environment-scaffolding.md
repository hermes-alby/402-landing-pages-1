# Build With Locus: Project And Environment Scaffolding API Uses

## What This Endpoint Group Does

This endpoint group creates and manages the structural layer that every Build With Locus workload depends on: projects and their environments. A project groups one codebase or application, fixes its deployment region, and owns the environments where services, addons, domains, deployments, variables, and webhooks later attach. Environments split that project into operational lanes such as development, staging, and production.

The group is useful for agents and developer tools that need to turn an intent like "deploy this app" into a predictable workspace shape before service creation. It does not deploy code by itself and does not directly buy credits, create services, provision addons, settle payments, or sign wallet messages.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/projects` | Create a project container for an application or codebase. | Bearer JWT, `name`, optional `description`, optional `region` (`us-east-1` or `sa-east-1`). | Project `id`, `name`, optional `description`, `region`, `workspaceId`, `createdAt`. |
| GET | `/v1/projects` | List projects in the authenticated workspace. | Bearer JWT, optional `limit`, optional `offset`. | `projects` array, `total`; project rows include id/name/description/region/workspace/timestamp fields where documented. |
| GET | `/v1/projects/:projectId` | Fetch one project by ID. | Bearer JWT, `projectId`. | Project `id`, `name`, optional `description`, `region`, `workspaceId`, `createdAt`. |
| PATCH | `/v1/projects/:projectId` | Update project metadata. | Bearer JWT, `projectId`, optional `name`, optional `description`. | Updated project object with the same project fields. |
| DELETE | `/v1/projects/:projectId` | Delete a project. | Bearer JWT, `projectId`. | `204 No Content` on success. |
| POST | `/v1/projects/:projectId/environments` | Create an environment inside a project. | Bearer JWT, `projectId`, `name`, `type` (`development`, `staging`, or `production`). | Environment `id`, `name`, `type`, `projectId`. |
| GET | `/v1/projects/:projectId/environments` | List environments for a project. | Bearer JWT, `projectId`. | `environments` array with environment `id`, `name`, `type`, `projectId`. |
| GET | `/v1/projects/:projectId/environments/:envId` | Fetch one environment by ID. | Bearer JWT, `projectId`, `envId`. | Environment `id`, `name`, `type`, `projectId`. |
| DELETE | `/v1/projects/:projectId/environments/:envId` | Delete an environment. | Bearer JWT, `projectId`, `envId`. | `204 No Content` on success. |

## Field Notes

### Inputs

All endpoints require a JWT bearer token. MPP sign-up is outside this group, but it is the wallet-based path that returns the JWT used here. JSON mutations also require `Content-Type: application/json`.

Project creation takes `name` as required metadata, optional `description`, and optional `region`. Supported regions in the reviewed docs are `us-east-1` and `sa-east-1`; `us-east-1` is the default. The region is set at project creation and applies to all services in the project. The Locus guide says the control plane remains centralized in `us-east-1` while build and container runtime infrastructure run in the selected project region.

Project update is metadata-only in the inventory: `name` and `description` are documented, but region changes are not. Project listing accepts `limit` and `offset`; the API reference examples use `limit=50&offset=0` and note a maximum list limit of 100.

Environment creation requires a parent `projectId`, `name`, and `type`. The documented type values are `development`, `staging`, and `production`. Environment get/delete operations require both `projectId` and `envId`.

### Outputs

Project responses expose a stable project identifier plus human-facing metadata: `id`, `name`, nullable or optional `description`, `region`, `workspaceId`, and `createdAt`. List responses wrap project rows in `projects` and include `total`, which is useful for pagination and drift checks.

Environment responses are smaller: `id`, `name`, `type`, and `projectId`. List environment responses return an `environments` array. Delete operations return `204 No Content`, so callers should not expect a JSON body after successful cleanup.

The field inventory records common error behavior from the provider docs: `400` for validation problems, `401` for missing or expired JWTs, `404` for missing referenced resources, `409` for some state conflicts, and `500` for server-side failures. The API reference specifically notes `409` when deleting an environment that still has services.

### Important Constraints Or Gaps

These endpoints are structural prerequisites, not a complete deployment workflow. Creating services, provisioning Postgres/Redis addons, attaching domains, setting variables, and triggering deployments are covered by other endpoint groups and may create monthly resource charges.

The Locus guide says each distinct codebase or application should get its own project and environment. Reusing a project created for a different codebase can mix services, environments, billing attribution, domains, and webhook scope in a way that is hard to audit later.

Region is a project creation choice in the reviewed sources. There is no documented update path for changing a project's `region`, so agents should treat region as an early architectural decision and create a new project if a different deployment geography is required.

The API reference says environment deletion returns `409` if the environment has services. The reviewed docs do not fully specify whether project deletion cascades across services, addons, domains, variables, and deployments in every state. Cleanup automation should inspect child resources first and avoid assuming deletion semantics beyond documented responses.

The MPP feed marks these nine project/environment endpoints with `payment: null`, but a caller still needs an authenticated workspace and enough credits before later billable resource creation. New MPP workspaces may require credit top-up before service or addon creation.

## Use Cases

### Agent-Controlled App Bootstrap

An AI coding agent can use this group to create a clean project for the exact codebase it is about to deploy, choose the project region, then create a production environment before handing off to service creation and deployment endpoints. The useful decision fields are `name`, `description`, and `region` on the project, followed by environment `name` and `type`; the returned `projectId` and `envId` become the routing keys for every later service, addon, variable, domain, and webhook call.

The personal angle is speed and reduced dashboard work: a developer can ask for deployment and receive concrete IDs without manually clicking through infrastructure setup. The business angle is repeatability: every app can be scaffolded from the same internal policy, with default naming, region selection, and environment type rules. The limitation is that this group only creates the shell; the agent must still verify billing, create services, respect port 8080 and ARM64 constraints downstream, and avoid making any paid calls without approval in workflows that require wallet payment or credit top-up.

### Standard Development, Staging, And Production Lanes

A team can use one project with multiple environments to separate daily development, release validation, and live traffic. Automation can create `development`, `staging`, and `production` environments, then wire later service and variable operations to the correct `envId`. The `type` enum gives downstream policy code a machine-readable way to decide where to allow debug settings, stricter health checks, production webhooks, or domain attachment.

This is useful for individuals because it keeps experiments away from the live service while preserving one project identity for the app. It is useful for businesses because release controls, audit messages, and billing reports can be grouped around one project while still distinguishing operational lanes. The main gap is that environment promotion is not handled by these endpoints; callers need separate service, variable, deployment, and rollback APIs to move behavior between lanes.

### Workspace Inventory And Drift Detection

Platform teams can call `GET /v1/projects` with pagination and then list environments per project to build an internal inventory of what exists in a Locus workspace. The `total` field helps detect pagination completeness, while `workspaceId`, `createdAt`, `region`, environment `type`, and object names support ownership review and naming policy checks.

For a solo developer, this can answer "what did my agent create for me?" before spending more credits. For a business, it supports governance workflows such as finding projects in the wrong region, projects without a production environment, stale scaffolds with no attached services, or naming patterns that do not match compliance policy. The API does not expose cost details in this group, so a complete audit needs the billing and billable-services endpoints as a second pass.

### Region-Aware Deployment Planning

A deployment tool can decide whether to create the project in `us-east-1` or `sa-east-1` before any services exist. The region output also lets later automation display the expected auto-subdomain pattern and flag when an application intended for South American users was scaffolded in the default region.

The personal benefit is lower friction when a developer knows the user base geography and wants a simple region switch during setup. The business benefit is making latency and data-handling decisions visible early in the workflow instead of burying them in a manual dashboard step. This is not a complete compliance control: the docs state that the control plane remains centralized in `us-east-1`, and only build/container runtime infrastructure moves to the selected region, so teams with formal residency requirements need their own review.

### Safe Cleanup Of Empty Scaffolds

Cleanup scripts can delete unused environments and projects after a failed experiment or abandoned prototype. A cautious workflow lists projects, lists environments, checks the target project/environment IDs against the intended codebase, then calls delete only after confirming no dependent services or other billable resources remain.

For an individual, this avoids clutter from repeated agent experiments. For a business, it helps keep workspace inventory tidy and can reduce the chance that orphaned structures mask billable services or policy violations. The important limitation is deletion semantics: environment deletion is documented to fail with `409` when services exist, and project deletion cascade behavior is not fully documented in the reviewed sources, so automation should use child-resource inventories from other endpoint groups before deleting.
