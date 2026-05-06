# Build With Locus API Uses

## Service Summary

Build With Locus is an API-first deployment platform for containerized services, managed Postgres and Redis addons, project environments, custom domains, deployment logs, lifecycle controls, and webhooks. The MPP service at `https://mpp.buildwithlocus.com` exposes a 46-endpoint catalog for Tempo MPP users, with wallet-funded onboarding and credit top-up wrapped around the provider's `/v1` API surface.

The highest-value opportunity is not a single data lookup. It is programmatic infrastructure creation: a developer, AI agent, agency, or internal platform can turn a GitHub repo, container image, or monorepo plan into a hosted app with credits, services, data stores, domains, release monitoring, and billing guardrails managed through API calls.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| MPP Onboarding And Identity | 2 | Create or recover an MPP-funded workspace, receive a JWT, and verify the active workspace identity before provisioning. | [api-uses/mpp-onboarding-and-identity.md](api-uses/mpp-onboarding-and-identity.md) |
| Billing And Credit Control | 4 | Check credits, top up through Tempo MPP, audit transactions, and monitor active monthly resource charges. | [api-uses/billing-and-credit-control.md](api-uses/billing-and-credit-control.md) |
| Project And Environment Scaffolding | 9 | Create the project and development/staging/production environment structure that services, addons, domains, deployments, and webhooks attach to. | [api-uses/project-and-environment-scaffolding.md](api-uses/project-and-environment-scaffolding.md) |
| Service Configuration And Variables | 8 | Define services, tune runtime settings, manage variables, preview resolved service/addon references, and inventory services by environment. | [api-uses/service-configuration-and-variables.md](api-uses/service-configuration-and-variables.md) |
| GitHub And Monorepo Bootstrap | 2 | Create a full project, production environment, services, addons, and initial deployments from a GitHub repo or inline `.locusbuild` plan. | [api-uses/github-and-monorepo-bootstrap.md](api-uses/github-and-monorepo-bootstrap.md) |
| Deployment Lifecycle And Observability | 8 | Trigger, poll, list, cancel, roll back, restart, redeploy, and inspect deployment logs for services. | [api-uses/deployment-lifecycle-and-observability.md](api-uses/deployment-lifecycle-and-observability.md) |
| Datastore Addons | 4 | Provision, poll, list, and delete managed Postgres or Redis resources for an environment. | [api-uses/datastore-addons.md](api-uses/datastore-addons.md) |
| Custom Domain Management | 5 | Register BYOD domains, obtain DNS/SSL validation records, verify readiness, attach domains to services, and clean up domain records. | [api-uses/custom-domain-management.md](api-uses/custom-domain-management.md) |
| Webhook Monitoring | 4 | Push deployment, log, runtime-error, and billing events to HTTPS receivers for monitoring and automation. | [api-uses/webhook-monitoring.md](api-uses/webhook-monitoring.md) |

## Highest-Value Uses

- Wallet-funded app launch: MPP sign-up, credit check/top-up, project creation, service setup, deployment polling, and optional domain/webhook setup create a practical end-to-end path from wallet authorization to a live hosted app.
- One-call GitHub or monorepo deployment: `from-repo` and `from-locusbuild` are the strongest acceleration points because they can create project structure, production environment, services, addons, and initial deployments together.
- Agent-safe infrastructure orchestration: identity checks, balance checks, structured project/environment IDs, deployment status fields, and rollback/redeploy controls give agents concrete gates instead of relying on dashboard state.
- Small SaaS and internal-tool stack creation: services plus Postgres/Redis, resolved variables, custom domains, and webhooks cover the common shape of production-like prototypes and low-cost customer-facing apps.
- Operational continuity: balance/status checks and billing webhooks help prevent credit exhaustion, while deployment logs, failure events, restart, rollback, and redeploy endpoints support release recovery.

## Personal Use Opportunities

- Launch a side project from a GitHub repo with a generated Locus URL, then attach a personal domain after DNS and certificate validation complete.
- Add Postgres or Redis to a small app without manually provisioning separate infrastructure, using template variables and resolved variable previews to wire credentials.
- Let a coding agent scaffold a clean project and environment, create services, trigger deployments, and report deployment progress through status fields and logs.
- Keep costs visible by checking `creditBalance`, `monthlyTotal`, `totalServices`, and billable service lists before adding resources.
- Use webhooks or deployment polling for "tell me when it is healthy or failed" workflows instead of watching a dashboard.

## Business Use Opportunities

- Build a "deploy this repo" internal platform flow for product teams, agencies, sales engineers, or customer-success demos, with preflight credit checks and cost previews.
- Standardize environment topology across development, staging, and production with project/environment APIs and policy-driven naming, region, runtime, health-check, and webhook defaults.
- Create repeatable monorepo launches where `.locusbuild` defines service paths, runtime settings, environment templates, and optional data addons in code review.
- Add lightweight platform governance: workspace identity verification, project/service inventories, region checks, cost attribution, billing reconciliation, and stale resource cleanup workflows.
- Improve support and incident response with deployment history, phase-aware logs, failure webhooks, rollback reasons, restart/redeploy actions, and billing continuity alerts.

## Endpoint Group Summaries

### MPP Onboarding And Identity

This group is the authentication entry point for MPP users. It converts Tempo MPP payment capability into a Locus workspace/JWT and lets callers verify `workspaceId`, `userId`, and optional `email` before doing anything billable or state-changing. Full details: [api-uses/mpp-onboarding-and-identity.md](api-uses/mpp-onboarding-and-identity.md).

### Billing And Credit Control

This group governs whether the workspace can create and renew billable resources. It supports credit balance checks, MPP top-up, transaction history, and billable service review, making it the right preflight layer before creating services or addons. Full details: [api-uses/billing-and-credit-control.md](api-uses/billing-and-credit-control.md).

### Project And Environment Scaffolding

Projects and environments are the structural keys for every later workflow. The APIs let tools create region-bound projects, list workspace structure, create environment lanes such as development/staging/production, and clean up empty scaffolds cautiously. Full details: [api-uses/project-and-environment-scaffolding.md](api-uses/project-and-environment-scaffolding.md).

### Service Configuration And Variables

This group defines how container services run and what configuration they receive. It is useful for direct image/GitHub/S3 service setup, runtime sizing, health checks, auto-deploy policy, environment variable reconciliation, and previewing resolved addon or sibling-service references. Full details: [api-uses/service-configuration-and-variables.md](api-uses/service-configuration-and-variables.md).

### GitHub And Monorepo Bootstrap

The bootstrap endpoints are the highest-leverage creation calls. They can turn a GitHub repo or inline `.locusbuild` configuration into a project, production environment, services, addons, and initial deployment records in one operation. Full details: [api-uses/github-and-monorepo-bootstrap.md](api-uses/github-and-monorepo-bootstrap.md).

### Deployment Lifecycle And Observability

This group handles release operations after a service exists: trigger deployments, poll status, list history, cancel in-flight work, roll back, restart, redeploy, and fetch or stream logs. It is the core surface for CI gates, agent progress reporting, and incident recovery. Full details: [api-uses/deployment-lifecycle-and-observability.md](api-uses/deployment-lifecycle-and-observability.md).

### Datastore Addons

Datastore addons provide managed Postgres and Redis resources for an environment. The valuable workflow is create, poll until `available`, inject template variables into dependent services, and redeploy so apps receive connection strings safely. Full details: [api-uses/datastore-addons.md](api-uses/datastore-addons.md).

### Custom Domain Management

This group moves apps from generated Locus URLs to user-owned hostnames. It covers BYOD domain registration, DNS and SSL validation state, service attachment, listing, and deletion, while leaving external DNS changes and omitted provider purchase/detach flows as caveats. Full details: [api-uses/custom-domain-management.md](api-uses/custom-domain-management.md).

### Webhook Monitoring

Webhook CRUD turns deployment, log, runtime-error, and billing changes into push events for monitoring systems, chatops, finance alerts, and agent workflows. It is especially valuable when polling is too brittle or when billing/deployment failure needs fast routing. Full details: [api-uses/webhook-monitoring.md](api-uses/webhook-monitoring.md).

## Field And Data Themes

- Identity and tenancy: `jwt`, `workspaceId`, `userId`, optional `email`, and `claimUrl` are the handoff fields from MPP onboarding into the rest of the API.
- Routing identifiers: `projectId`, `environmentId`/`envId`, `serviceId`, `deploymentId`, `addonId`, `domainId`, and `webhookId` are the main keys that connect workflows.
- Money and capacity: `amount`, `creditBalance`, `monthlyTotal`, `totalServices`, `requiredAmount`, resource counts, runtime CPU/memory, min/max instances, and documented `$0.25/month` service/addon pricing are central to safe automation.
- Lifecycle state: deployment statuses, addon statuses, domain validation booleans, billing status, webhook `active`, and runtime counts drive readiness and recovery decisions.
- Operational content: service variables, resolved templates, logs, webhook payloads, rollback reasons, DNS validation records, health checks, start commands, and error patterns may contain sensitive or production-critical data.
- Geography and routing: project `region`, service `url`, custom `domain`, `cnameTarget`, validation records, and internal service URLs determine where and how apps become reachable.
