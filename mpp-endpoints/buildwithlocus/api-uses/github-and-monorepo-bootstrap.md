# Build With Locus: GitHub And Monorepo Bootstrap API Uses

## What This Endpoint Group Does

This endpoint group turns an accessible GitHub repository into a deployed Locus project in one call. It creates the project, a production environment, services, optional Postgres or Redis addons, and initial deployment records. The repo-root `.locusbuild` file is the main configuration format for monorepos; without it, `from-repo` falls back to a single `web` service rooted at the repository root on port 8080.

The two endpoints differ in where the `.locusbuild` configuration comes from. `from-repo` reads it from the GitHub repository, while `from-locusbuild` accepts the JSON configuration inline but still clones source code from a real GitHub repo.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/projects/from-repo` | Deploy a full stack from a GitHub repo, using repo-root `.locusbuild` when present. | Bearer JWT, JSON body, `repo` required, optional `name`, `branch`, `region`. | `project`, `environment`, `services`, optional `addons`, `deployments`, `locusbuild`. |
| POST | `/v1/projects/from-locusbuild` | Deploy from inline `.locusbuild` JSON while cloning code from a GitHub repo. | Bearer JWT, JSON body, required `name`, required real `repo`, optional `branch`, required `locusbuild.services`, optional `locusbuild.addons` and `locusbuild.region`. | `project`, `environment`, `services`, optional `addons`, `deployments`, `locusbuild`. |

## Field Notes

### Inputs

Both endpoints require a JWT bearer token and `Content-Type: application/json`. The `repo` field is a GitHub repository identifier such as `owner/repo`; private repositories require Locus GitHub integration before cloning can work. `branch` selects the branch to deploy. Region is constrained to `us-east-1` or `sa-east-1`; `from-repo` can take it from the request body or the `.locusbuild` file, and `from-locusbuild` can take it from `locusbuild.region`.

The `.locusbuild` object is a service and addon map. Service entries require `path` and can include `port`, `healthCheck`, `startCommand`, `runtime`, and `env`; addons require `type` with `postgres` or `redis`. Environment values can use template references such as addon connection variables or sibling service URLs. The docs explicitly exclude `buildConfig`, `errorPatterns`, and `autoDeploy` from `.locusbuild`; those belong to direct service APIs instead.

### Outputs

Successful calls return an aggregate creation response rather than a single entity. `project` includes identifiers such as `id`, `name`, and sometimes `region`, `workspaceId`, or `createdAt`. `environment` is the created production environment with `id`, `name`, `type`, and `projectId`.

`services` returns created service objects with IDs, names, URLs, ownership IDs, source/runtime configuration, and deployment-related fields where available. `addons` returns created database or cache resources with `id`, `name`, `type`, `status`, ownership IDs, and possibly `connectionString`, `requiresRedeploy`, or a note. `deployments` returns the initial deployment IDs or deployment records, including `serviceId`, `status`, and sometimes version, source, timestamps, duration, logs, or phase metadata. The `locusbuild` boolean indicates whether `.locusbuild` drove the setup.

### Important Constraints Or Gaps

These are resource-creating POST endpoints, not discovery-safe GETs. They require an authenticated workspace with enough credits, and each created service or addon is documented at $0.25/month. A monorepo with two services and one addon would therefore create three billable resources. Errors include validation failures, missing or expired JWTs, missing resources, and generic server failures; service or addon creation elsewhere returns `402` for insufficient credits, so bootstrap automation should treat credit failure as a likely setup blocker even if the endpoint inventory does not publish a special bootstrap-specific error schema.

`from-locusbuild` cannot be used with fake repository names or purely local code; Locus still clones from GitHub. If no GitHub repo exists, the documented path is manual project/environment/service/addon setup followed by git-push deployment. The MPP catalog group does not include the provider-documented `verify-locusbuild` endpoint, so a pure MPP-surface workflow lacks a dry-run validation call even though the provider docs recommend verification before deploying. No official OpenAPI spec was found; fields are derived from provider markdown, examples, and the MPP feed.

## Use Cases

### Solo Founder Or Agent Launch From GitHub

A developer or AI agent can take a ready GitHub repo and turn it into a live application with one authenticated call to `from-repo`. Personally, this removes the slow dashboard work of creating a project, production environment, service, datastore, and first deployment by hand. The useful response fields are the service URLs for immediate smoke testing, deployment IDs for polling and log retrieval, addon IDs for database/cache readiness checks, and the `locusbuild` flag to confirm whether repo configuration was honored.

For a business workflow, this can become a "deploy this repo" button in an internal platform or agent product. The automation should check credit balance first, confirm the repo is accessible, and poll deployments until they are healthy before exposing the URL to a customer or teammate. It should also surface cost before creation because services and addons become monthly billable resources, and it should avoid deploying private repositories until the GitHub integration is connected through the Locus integrations flow.

### Monorepo Product Bootstrap

Teams with a backend, frontend, worker, and database in one repository can encode the topology in `.locusbuild` and let `from-repo` create everything together. This is personally useful for engineers who want infrastructure shape reviewed in code review instead of reconstructed from notes. Service `path`, `port`, `runtime`, `startCommand`, `healthCheck`, and `env` fields define how each component boots; addon and service template references let the backend receive `DATABASE_URL` and the frontend receive the backend URL without hard-coding runtime addresses.

The business value is repeatable environment creation for product teams, agencies, and implementation partners. A standard `.locusbuild` can turn a customer repo into a consistent production-like stack and return the identifiers needed for monitoring, webhook setup, domain attachment, or cleanup. The main limitations are that `.locusbuild` does not support every direct service field, removed services are not auto-deleted on later pushes, and addon provisioning may still need polling or redeploy checks before dependent services should be treated as fully ready.

### Inline Configuration For Guided Deployment

`from-locusbuild` supports workflows where an agent or setup wizard generates the deployment plan from user answers instead of requiring the repo to already contain `.locusbuild`. The user can say which subdirectory is the API, which path is the frontend, whether Postgres or Redis is needed, and which branch to deploy; the system then submits the generated `locusbuild` object alongside the real GitHub repo. The response gives enough structure to show "created project", "created services", and "queued deployments" in a guided setup UI.

This is commercially useful for onboarding flows, templates, and migration assistants that want to keep configuration outside the repository until the user accepts it. The compliance and trust boundary is important: the endpoint creates billable resources and triggers deployments, so a product should present the plan, region, service count, addon count, and estimated monthly charge before calling it. Because the MPP catalog omits `verify-locusbuild`, a cautious MPP-only integration may need its own local schema validation and an explicit user confirmation step.

### Branch-Based Demo Or Customer Environment Creation

A support engineer, sales engineer, or customer-success agent can create a named Locus project from a branch to demonstrate a feature or reproduce a customer issue. `name`, `repo`, `branch`, and `region` are enough to create a separate project with service URLs and deployment IDs, while `.locusbuild` controls whether the branch becomes one service or a full stack. Personally, this makes it easier to share a live URL without spending time stitching together temporary infrastructure.

For the business, this can shorten sales demos, QA reproduction loops, and customer escalations. The workflow should tag project names clearly, log returned project/service/addon/deployment IDs for later cleanup, and check cost exposure because these are persistent billable resources rather than ephemeral previews. It should also avoid using these endpoints for untrusted code without repository controls, because the platform will clone and build the provided GitHub source.
