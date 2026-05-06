# Code Storage API Uses

## Service Summary

Code Storage provides API-first Git repository storage with JWT-authenticated HTTPS Git remotes. Native Code Storage can create repositories, sync or fork from upstream repositories, generate authenticated clone URLs, and support broader Git-oriented operations through its SDK, HTTP API, and standard Git clients.

The assigned MPP service is much narrower than the native provider. The local MPP catalog lists exactly two endpoints at `https://codestorage.mpp.tempo.xyz`: create a repository and get a clone URL for a repository. This research used public GET documentation and local catalog snapshots only. No paid MPP calls, repository creation, clone URL retrieval, wallet signing, payment settlement, account creation, Git clone, or Git push was performed.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Repository Provisioning And Clone Access | 2 | Create a paid Code Storage Git repository and obtain an authenticated HTTPS Git remote URL so code can move through standard Git operations. | [api-uses/repository-provisioning-and-clone-access.md](api-uses/repository-provisioning-and-clone-access.md) |

## Highest-Value Uses

- Disposable repositories for AI coding agents, sandboxed code generation, test artifacts, and review handoff.
- Per-customer or per-workspace code vaults where generated code needs a durable Git-native home.
- Template forks and project bootstrapping from known baseline repositories.
- Migration or redundancy staging from external Git providers into Code Storage.
- Short-lived CI/CD clone URLs that avoid sharing long-lived broad Git credentials.
- Contractor, reviewer, auditor, or support handoffs through scoped repository URLs.

## Personal Use Opportunities

A developer can create a one-off repository for an experiment, generated app, coding-agent result, or template fork, then retrieve a clone URL and work with it in normal Git. This is most useful when the user wants a Git remote without going through direct provider setup.

A solo user can also use the clone URL endpoint as a temporary access handoff: for example, read-only review by another person or short-lived access for a build job. The value depends on whether the MPP wrapper exposes TTL and permission controls; provider SDK docs support them, but the wrapper does not document them.

## Business Use Opportunities

Businesses can use the two endpoints as a repository provisioning primitive inside products and automation. A SaaS app can allocate one repository per customer workspace, an AI platform can allocate one repository per agent task, a CI system can request task-specific clone URLs, and an engineering team can stage template forks or upstream sync repositories before onboarding them into a larger workflow.

The strongest business value is reducing account and credential friction around Git handoff. The main caveat is that the assigned MPP wrapper is only a provisioning/access surface. File changes, commits, branch operations, and reviews happen through standard Git over the returned URL or through native Code Storage APIs outside the assigned MPP manifest.

## Endpoint Group Summaries

### Repository Provisioning And Clone Access

This single group covers all assigned MPP endpoints: `POST /repos` and `GET /repos/:id`. Together they create a Code Storage repository and return an authenticated HTTPS Git remote URL for that repository. Provider docs show rich creation and access-control semantics, including repository IDs, default branches, Git Sync, forking, JWT scopes, TTLs, and no-force-push policies. The MPP catalog proves the endpoint paths and payment amounts, but it does not publish wrapper-specific schemas, so production integration should confirm request fields, response shape, URL TTL, permissions, and ongoing cost ownership. Full details are in [api-uses/repository-provisioning-and-clone-access.md](api-uses/repository-provisioning-and-clone-access.md).

## Field And Data Themes

- Core identifiers: `repo_id`, SDK `id`, path `id`, `http_url`, repository namespace, upstream `owner`, upstream `name`, `ref`, and `sha`.
- Core inputs: default branch, optional `base_repo` or `baseRepo`, upstream provider, upstream host, fork operation, source auth token, remote URL `permissions`, `ttl`, and `ops`.
- Core outputs: repository metadata, success message, and authenticated HTTPS Git remote URL.
- Access-control fields: JWT issuer, subject, repository claim, scopes, issued-at, expiration, remote URL TTL, and policy operation such as `no-force-push`.
- Cost fields: MPP payment amount and decimals for each wrapper call, plus provider-side storage GB-month and bandwidth GB meters from the existing pricing artifact.
