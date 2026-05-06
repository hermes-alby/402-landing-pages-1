# Code Storage: Repository Provisioning And Clone Access API Uses

## What This Endpoint Group Does

This endpoint group covers the complete assigned MPP surface for Code Storage: create a Git repository and retrieve an authenticated HTTPS clone URL for that repository. The group is useful because it turns repository provisioning into a paid API step and then hands the result to ordinary Git tooling. A caller can create a repository for an agent task, product workspace, CI job, customer project, or fork/sync workflow, then use the clone URL for `git clone`, `git fetch`, `git pull`, or `git push` according to the embedded JWT permissions.

The high-value fields are repository identifiers, default branch, optional upstream/fork settings, and authenticated remote URL controls. Provider docs show native creation inputs such as `default_branch` and `base_repo`, SDK inputs such as `id`, `defaultBranch`, `baseRepo`, and `ttl`, and remote URL options such as `permissions`, `ttl`, and `ops`. The local MPP catalog proves the two wrapper endpoints and their payment amounts, but it does not document the wrapper-specific request or response schema, so workflows should treat schema details as a required integration check before automation.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/repos` | Create a paid Code Storage Git repository. | MPP body not publicly documented. Provider docs support repository ID or JWT repo claim, default branch, optional Git Sync `base_repo`, optional Code Storage fork, source auth token for forks, and SDK `ttl`. | Provider docs show `repo_id`, `http_url`, and `message`; SDK exposes `id` and `defaultBranch`. MPP response shape is undocumented. |
| GET | `/repos/:id` | Get an authenticated clone URL for a repository. | Path repository `id`; provider SDK supports optional `permissions`, `ttl`, and `ops`, but MPP query support is undocumented. | Authenticated HTTPS Git remote URL such as `https://t:{jwt}@{org}.code.storage/{repo-id}.git`; MPP content type and field name are undocumented. |

## Field Notes

### Inputs

Repository identity is the central input. Provider docs say repository IDs can be auto-generated or caller-provided through the SDK, can include `/` for namespacing, and are represented in native JWTs through the `repo` claim. The MPP `GET /repos/:id` path clearly requires an `id`, but the wrapper does not document how to encode namespaced IDs such as `team/project-alpha`.

Repository creation can be simple or seeded. Native HTTP docs show `default_branch` and `base_repo`; SDK docs show `id`, `defaultBranch`, `baseRepo`, and `ttl`. For Git Sync, `base_repo` can include `provider`, `owner`, `name`, `default_branch`, `operation`, and `upstream_host`, with providers including GitHub, GitLab, Bitbucket, Gitea, Forgejo, Codeberg, sr.ht, and SourceHut. For Code Storage forks, `base_repo` can include `provider`, `name`, `operation: fork`, `ref`, `sha`, and `auth.token` with `git:read` scope.

Remote URL generation is governed by access controls. Provider SDK docs expose `permissions` such as `git:read`, `git:write`, and `repo:write`, a `ttl` in seconds, and `ops` such as `no-force-push`. These details matter because a clone URL embeds JWT authentication and should be treated as a secret. The MPP wrapper does not say whether users can request read-only URLs, short-lived URLs, no-force-push URLs, ephemeral namespace URLs, or import URLs.

### Outputs

Repository creation returns enough metadata to identify the new repository in provider docs: `repo_id`, `http_url`, and `message` in native HTTP examples, and SDK repository properties such as `id` and `defaultBranch`. If the MPP wrapper returns an authenticated clone URL as part of creation, that is not documented in the local catalog or public wrapper probes.

Clone URL retrieval returns the operational handoff: an HTTPS Git remote URL with embedded JWT authentication. Provider docs show the format `https://t:{jwt}@{org}.code.storage/{repo-id}.git`, with variants for `+ephemeral` and `+import` namespaces. The URL itself is useful but sensitive; downstream tools should avoid logging it, storing it in plaintext, or handing it to untrusted processes.

Errors are underdocumented at the wrapper level. Native Code Storage docs show `401` for invalid JWT or missing scope, `409` for repository conflict or existing upstream configuration, and `412` when GitHub App configuration is required for authenticated GitHub sync. The native HTTP overview says API errors include a plain `error` string, but MPP payment failures and wrapper validation errors may differ.

### Important Constraints Or Gaps

- No public MPP wrapper OpenAPI, `llms.txt`, `.well-known/x402`, or root documentation was found; public GET probes returned `Not Found`.
- The provider OpenAPI URL linked from official docs returned `404 Asset not found`, so the inventory is docs-derived.
- No paid endpoint was called, so the MPP request/response shape could not be verified empirically.
- The MPP catalog gives payment amounts but no schema. Creation is listed at `1000000` units and clone URL retrieval at `10000` units, both using currency `0x20c000000000000000000000b9537d11c60e8b50` with `decimals: 6`.
- Native Code Storage uses customer-signed JWTs and provider-side key management. The MPP wrapper's account/namespace model is not documented.
- Provider direct pricing includes ongoing storage and bandwidth meters; the relationship between those costs and one-time MPP call pricing is not documented.
- The assigned MPP surface cannot list repositories, inspect files, create commits, delete repositories, manage branches/tags/notes, configure Git credentials, or trigger upstream pulls. Those actions require standard Git over the returned URL or direct native Code Storage APIs outside the assigned MPP wrapper.

## Use Cases

### Disposable Repositories For AI Agent Work

A developer or agent platform can create a fresh Code Storage repository for each coding task, benchmark run, bug reproduction, or review package, then retrieve an authenticated clone URL and hand it to an isolated worker. The fields that matter are repository `id` or generated `repo_id`, `default_branch`, clone URL, optional `permissions`, `ttl`, and `ops`. A short-lived read/write URL lets the worker push results, while a read-only URL can be handed to reviewers or analysis tools after the task completes.

For a business, this workflow creates a clean audit boundary around agent-generated code. Each task can have its own repository namespace and remote URL rather than sharing a long-lived GitHub token or central repository. The limitations are important: the MPP wrapper does not document TTL or permission controls, clone URLs are secrets, and ongoing storage/bandwidth costs may outlive the initial MPP creation call.

### Customer Or Workspace Code Vaults

A SaaS product that generates code for customers can create one repository per customer, workspace, project, or environment. Repository namespacing such as `customer-id/project-id` keeps generated code separated, while `defaultBranch` or `default_branch` can match the product's release model. After creation, the product can retrieve a clone URL for a customer export, internal support review, or automated build job.

The value is operational isolation. Support teams can reason about one customer's code without cloning a shared monorepo, and customers can receive a Git remote URL instead of a ZIP file. This use depends on the MPP wrapper accepting caller-controlled repository IDs or returning stable IDs; because that schema is not documented, integrators need a test environment or direct wrapper docs before relying on deterministic names.

### Template Forks For Project Bootstrapping

An individual developer, bootcamp, agency, or internal platform team can fork a known starter repository into a new Code Storage repo for each project. Provider docs support Code Storage forks with `base_repo.provider` set to `code` or `code.storage`, `base_repo.name` identifying the source, `operation: fork`, and optional `ref` or `sha` to pin the template version. The returned repository metadata and clone URL let the user immediately customize the fork with standard Git.

For a business, this supports repeatable project creation: sales demos, customer portals, internal tools, or course exercises can all start from a controlled template commit. Pinning by `sha` helps prove which baseline was used. The MPP gap is that fork fields are provider-documented but not wrapper-documented, and forking requires source access via a token with `git:read` scope when the source is private.

### Upstream Git Sync And Migration Staging

A team moving code from GitHub, GitLab, Bitbucket, Gitea, Forgejo, Codeberg, sr.ht, SourceHut, or a self-hosted Git service can create a Code Storage repository with `base_repo` metadata for sync. The relevant fields are `provider`, `owner`, `name`, `default_branch`, and sometimes `upstream_host`. After creation, the team can retrieve a clone URL and use it to inspect or build against the Code Storage copy.

This is valuable for migration pilots and redundancy checks because teams can test Code Storage as a storage backend without redesigning developer workflows around a new Git protocol. It can also help businesses stage customer imports or preserve code in a separate storage layer. Authenticated GitHub sync, generic provider credentials, and self-hosted hosts add configuration requirements; the MPP wrapper does not expose credential-management endpoints in the assigned manifest.

### Short-Lived CI/CD Git Access

A CI system can request a clone URL for an existing repository and use the returned remote in a build, test, preview, or deployment job. Provider docs support TTL and permission controls, so the desired design is a short-lived `git:read` URL for read-only builds or a constrained read/write URL for jobs that push generated artifacts. The `no-force-push` operation is especially relevant for write-capable automation.

For businesses, this avoids sharing long-lived deploy keys or broad Git provider tokens across CI runners. Each job can receive a URL scoped to one repository and intended lifetime. The blocker is wrapper documentation: the MPP endpoint is listed as `GET /repos/:id`, but it is not documented whether `permissions`, `ttl`, or `ops` can be requested through MPP, so a production integration should not assume fine-grained URL controls until confirmed.

### Contractor And Reviewer Handoffs

A person or company can create a repository for a contained engagement, retrieve a read-only or write-capable remote URL, and send it to a contractor, external reviewer, auditor, or support engineer. Repository namespacing can identify project and engagement, while TTL and permissions can bound the access window and allowed Git operations.

The returned clone URL changes the handoff from account provisioning to capability-based Git access. That can be useful for short consulting jobs, code review packets, audit evidence, or support reproductions. The risk is that authenticated URLs embed secrets; they should be distributed through secure channels, redacted from logs, rotated by creating new URLs, and scoped as narrowly as the wrapper allows.

### Code Artifact Export From Automated Tools

An AI coding tool, low-code builder, documentation generator, or browser automation system can create a repository and push generated source, tests, snapshots, or scaffolding through the clone URL. The repository ID becomes the artifact handle, and the default branch defines where downstream systems should fetch the result. A user can later clone the repo into their local environment or import it into another Git host.

The business value is a durable, Git-native artifact rather than a temporary download. Teams can run normal review, diff, build, and compliance workflows against the generated repository. The assigned MPP endpoints do not provide file upload or commit APIs directly, so the automation must use standard Git over HTTPS after receiving the remote URL.
