# Build With Locus: Custom Domain Management API Uses

## What This Endpoint Group Does

This endpoint group lets an authenticated Build With Locus workspace register a bring-your-own domain, inspect the workspace's domain list, trigger DNS and certificate verification, attach a verified domain to a deployed service, and delete a domain record. It turns a generated Locus service URL into a customer-owned public hostname with HTTPS, but it still depends on the user or operator controlling DNS outside the API.

The MPP catalog entries for this group are not per-call paid endpoints. They require the JWT returned by onboarding, and the practical workflow may still depend on existing workspace credits if the attached service is billable or if the user later uses provider-documented domain purchase endpoints that are outside this MPP group.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/v1/domains` | Register a BYOD domain and request the routing and SSL validation material. | `Authorization` bearer token, JSON body with required `domain` and optional `projectId`. | Domain object with `id`, `domain`, optional `projectId`, optional `serviceId`, `cnameTarget`, `validationRecords`, `validationStatus`, `cnameVerified`, `certificateValidated`, and optional `registrationPrice`. |
| GET | `/v1/domains` | List all domains owned by the workspace. | `Authorization` bearer token. | `domains` array of workspace domain objects, including routing, validation, attachment, and optional purchased-domain pricing fields where present. |
| POST | `/v1/domains/:domainId/verify` | Trigger an immediate CNAME and certificate validation check. | `Authorization` bearer token and path `domainId`. | `domainId`, `cnameVerified`, `certificateValidated`, `validationStatus`, and optional human-readable `message`. |
| POST | `/v1/domains/:domainId/attach` | Route a verified domain to a service. | `Authorization` bearer token, path `domainId`, and JSON body with required `serviceId`. | Updated domain object showing the attached `serviceId` plus domain, DNS, validation, and optional pricing fields. |
| DELETE | `/v1/domains/:domainId` | Delete a domain record. | `Authorization` bearer token and path `domainId`. | `204 NoContent` on success. |

## Field Notes

### Inputs

All endpoints require a workspace JWT bearer token. Domain creation takes a plain domain name in `domain`; `projectId` is optional and is used for organization rather than ownership, because domains are workspace-owned assets. Attachment requires a `serviceId`, so the service must already exist and be the intended target for traffic.

The verification, attachment, and deletion endpoints identify the domain with path `domainId`. The MPP group does not expose a request body for verification or deletion. The attach endpoint uses JSON and requires `Content-Type: application/json`.

### Outputs

The main response shape is a domain object. The routing fields are `domain` and `cnameTarget`; the SSL fields are `validationRecords`, `cnameVerified`, `certificateValidated`, and `validationStatus`. The documented validation statuses are `pending`, `validated`, and `failed`. Attachment state is represented by `serviceId` when present.

The verification response is narrower and is useful for automation: `cnameVerified` tells whether the routing CNAME resolves correctly, `certificateValidated` tells whether the SSL certificate is issued, `validationStatus` summarizes the result, and `message` can be shown to the user. List responses wrap domain objects in a `domains` array. Delete success returns no body.

### Important Constraints Or Gaps

DNS is an external dependency. For BYOD domains, the user must create both the routing CNAME and the SSL validation CNAME at their DNS provider. The docs say Locus automatically checks DNS every 5 minutes for up to 2 hours; normal DNS propagation is usually 1 to 15 minutes but can take up to 30 minutes. Both `cnameVerified` and `certificateValidated` must be true before attach is reliable.

The provider docs list a pending or validating domain limit of 5 per workspace and a total domain limit of 20. Pending domains that fail auto-verification after 2 hours are marked `failed` and stop counting against the pending limit. Deleting a domain is documented as requiring the domain to be detached first, but the MPP catalog does not include a detach endpoint.

The MPP catalog omits several provider-documented domain endpoints: availability checks, suggestions, purchase, registration status, list by project, get single domain, certificate status, DNS auto-create for Locus-managed DNS, and detach. No official OpenAPI spec was located, so field details are derived from provider markdown, examples, and the public MPP feed.

## Use Cases

### Launching A Customer-Facing Product Domain

A solo developer or small team can deploy an API or web app on Locus, then use this group to move from a generated hosting URL to a branded hostname like `api.example.com` or `app.example.com`. The workflow is to create the domain with `POST /v1/domains`, copy `cnameTarget` and `validationRecords` into the DNS provider, wait for `validationStatus` to become `validated`, and then attach the domain to the service with `serviceId`.

The business value is trust and continuity: customers see the company's own domain, SSL is included, and the infrastructure can still be managed programmatically. The limitation is that the API cannot fully automate BYOD DNS unless the user's DNS is managed by a provider integration outside this MPP group, so a human may need to edit DNS records and wait for propagation.

### Agency Or Consultant Client Handoffs

An agency building client projects can keep each client's domain visible in the workspace list, optionally group it with `projectId`, and attach it to the correct service only after validation succeeds. The `domains` array gives a quick audit surface for which hostnames are registered, which service each one routes to, and whether any are still pending or failed.

This is useful for client handoffs because DNS work is often the point where projects stall. An agent or internal tool can generate clear DNS instructions from `cnameTarget` and `validationRecords`, monitor `cnameVerified` and `certificateValidated`, and produce a plain status report for the client. The main operational constraint is avoiding mistaken attachment to the wrong `serviceId`, especially when one workspace contains many client services.

### Automated Go-Live Checklists

Before launch, a deployment pipeline can use `GET /v1/domains` and `POST /v1/domains/:domainId/verify` to check whether the production domain is ready. It can block a release until `validationStatus` is `validated`, both boolean checks are true, and the domain object shows the expected `serviceId`.

The personal angle is fewer late-night launch surprises: DNS and certificate readiness become explicit checks rather than assumptions. For the business, this reduces support risk and avoids announcing a URL before it is routable. The gap is that the group does not expose every diagnostic endpoint from the provider docs, such as standalone certificate status or single-domain get, so robust tooling may need to rely on list filtering plus verify responses.

### Domain Cleanup And Workspace Hygiene

Teams that create preview projects, retired apps, or migrated services can use the list and delete endpoints to find domains that are no longer attached or no longer needed. A cleanup tool can flag records with no `serviceId`, failed validation, or stale project grouping, then delete the domain by `domainId` after confirming it is safe to remove.

This matters financially and operationally even when BYOD registration itself is not per-call paid: stale DNS and domain records confuse operators, create support ambiguity, and may keep old customer paths looking active. The important prerequisite is detachment. Provider docs say domains must be detached before deletion, while this MPP group does not include the detach endpoint, so deletion workflows need to handle that missing operation explicitly.

### Brand Migration With Controlled Cutover

During a rebrand or migration, a team can register the new hostname, validate DNS and SSL in advance, and attach it to the existing service only when the cutover window arrives. The old and new hostnames can be reviewed through `GET /v1/domains`, while `POST /v1/domains/:domainId/verify` gives a last-mile readiness check before routing changes are made.

The practical benefit is a cleaner, less risky cutover: marketing, support, and engineering can coordinate around concrete fields rather than screenshots from a DNS dashboard. The limitation is compliance and ownership: the organization must control the domain and any DNS changes, and if domain purchase is needed, the provider-documented purchase flow costs real money and is outside this no-paid-call MPP artifact.
