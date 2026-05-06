# AgentMail: Domain Setup And Deliverability API Uses

## What This Endpoint Group Does

This endpoint group manages custom AgentMail domains that underpin branded sending, inbound routing, and deliverability. It covers organization-level domains at `/v0/domains` and pod-scoped domains at `/v0/pods/:pod_id/domains`.

The core lifecycle is: create a domain with `domain` and `feedback_enabled`, read back `domain_id`, `status`, `records`, and timestamps, publish the returned DNS `records` or download a BIND zone file, trigger verification, monitor record status, and eventually delete the domain. Pod-scoped variants add `pod_id` so multi-tenant platforms can keep each customer's domains isolated.

## Endpoints Covered

| Endpoint ID | Method | MPP path | Purpose | Key inputs | Key outputs | MPP cost or gap |
| --- | --- | --- | --- | --- | --- | --- |
| `endp_f43e712310b9236699e6` | `GET` | `/v0/domains` | List organization domains | Query `limit`, `page_token`, `ascending` | `count`, `limit`, `next_page_token`, `domains[]` | No payment metadata in inventory |
| `endp_495a6b38d51e5328921e` | `GET` | `/v0/domains/:domain_id` | Get organization domain details | Path `domain_id` | `domain_id`, `domain`, `status`, `feedback_enabled`, `records[]`, `client_id`, timestamps | No payment metadata in inventory |
| `endp_d7deafb9564004e1a97b` | `GET` | `/v0/domains/:domain_id/zone-file` | Download org domain zone file | Path `domain_id` | `application/octet-stream` zone file | No payment metadata; binary response has no JSON field schema |
| `endp_9372376e3636102b5441` | `POST` | `/v0/domains` | Create org-wide domain | Body `domain`, `feedback_enabled` | Domain object with verification `records[]` | Paid: `0.01` token units by MPP feed |
| `endp_eb7c37a5d755ebef2c12` | `DELETE` | `/v0/domains/:domain_id` | Delete org domain | Path `domain_id` | Empty `200` body, or JSON `404` error | No payment metadata in inventory |
| `endp_7ca65380c13946f1cec1` | `POST` | `/v0/domains/:domain_id/verify` | Trigger org domain verification | Path `domain_id` | Empty `200` body, or JSON `404` error | No payment metadata in inventory |
| `endp_46ffb3e43e57188c8be8` | `GET` | `/v0/pods/:pod_id/domains` | List domains in a pod | Path `pod_id`; query `limit`, `page_token`, `ascending` | `count`, `limit`, `next_page_token`, `domains[]` | No payment metadata in inventory |
| `endp_e923f2d9331200811321` | `GET` | `/v0/pods/:pod_id/domains/:domain_id` | Get pod domain details | Path `pod_id`, `domain_id` | Domain object with `pod_id`, `status`, `records[]` | No payment metadata in inventory |
| `endp_b08e28bb81ea9f1cf876` | `GET` | `/v0/pods/:pod_id/domains/:domain_id/zone-file` | Download pod domain zone file | Path `pod_id`, `domain_id` | `application/octet-stream` zone file | No payment metadata; binary response has no JSON field schema |
| `endp_f38f9db8af9e7d5ca22c` | `POST` | `/v0/pods/:pod_id/domains` | Create pod-scoped domain | Path `pod_id`; body `domain`, `feedback_enabled` | Domain object with `pod_id` and verification `records[]` | Paid: `10.0` token units by MPP feed |
| `endp_df916496706184bfa88a` | `PATCH` | `/v0/pods/:pod_id/domains/:domain_id` | Update pod domain feedback behavior | Path `pod_id`, `domain_id`; optional body `feedback_enabled` | Updated Domain object | No payment metadata in inventory |
| `endp_70ccbb6485dd9eb8543c` | `DELETE` | `/v0/pods/:pod_id/domains/:domain_id` | Delete pod domain | Path `pod_id`, `domain_id` | Empty `200` body, or JSON `404` error | No payment metadata in inventory |
| `endp_8e1d1d2dfdf8e57ff5b7` | `POST` | `/v0/pods/:pod_id/domains/:domain_id/verify` | Trigger pod domain verification | Path `pod_id`, `domain_id` | Empty `200` body, or JSON `404` error | No payment metadata in inventory |

## Field Notes

### Inputs

Create operations use a JSON body with required `domain` and required `feedback_enabled`. `domain` is the custom domain name, such as `example.com`. `feedback_enabled` controls whether bounce and complaint notifications are sent to the user's inboxes; the docs say this defaults to enabled when not specified, but the OpenAPI-derived inventory marks it required on create.

Pod-scoped operations add required `pod_id` in the path. This matters for tenant isolation: pod domains are resources inside a single pod, while organization domains are available at the organization scope. The docs state that domains can be scoped either to one pod or to all pods, not to an arbitrary subset of pods.

List operations accept `limit`, `page_token`, and `ascending`. The list response is ordered by `created_at` descending unless changed by `ascending`.

Verify and delete operations have no JSON body. They are driven by `domain_id`, plus `pod_id` for pod variants. Zone-file downloads also have no JSON body and return binary `application/octet-stream`.

### Outputs

The Domain response returns `domain_id`, `domain`, `status`, `feedback_enabled`, `records`, `updated_at`, and `created_at`; pod-scoped domains may include `pod_id`, and responses may include `client_id`. `records[]` is the operationally important field: each record has `type`, `name`, `value`, `status`, and optional `priority`.

Documented record types are `TXT`, `CNAME`, and `MX`. Record status values are `MISSING`, `INVALID`, and `VALID`. Domain verification status values are `NOT_STARTED`, `PENDING`, `INVALID`, `FAILED`, `VERIFYING`, and `VERIFIED`.

The zone-file endpoints return binary BIND zone-file content rather than JSON. That is useful for DNS providers that support zone-file import, but the inventory cannot expose per-record fields for those responses.

### Important Constraints Or Gaps

The MPP feed marks only two endpoints in this group as paid: organization-level `POST /v0/domains` costs `0.01` token units, and pod-scoped `POST /v0/pods/:pod_id/domains` costs `10.0` token units. The public docs explain MPP per-request payment and base URLs, but the local sources do not provide a comprehensive official MPP price table or explain why the pod-scoped domain create price is much higher.

Direct AgentMail OpenAPI operations require bearer `Authorization`; MPP usage goes through `https://mpp.api.agentmail.to` and the `mppx` payment client instead. This artifact did not call any paid endpoints, sign payments, register accounts, or mutate data.

The docs mention idempotent domain creation via `client_id`, and the domain object can return `client_id`, but the OpenAPI-derived inventory for create-domain requests lists only `domain` and `feedback_enabled`. Treat `client_id` as a source/schema drift point until verified in the public API schema.

Custom domains have plan-level limits in the docs: Free has none, Developer has 10, Startup has 150, and Enterprise is custom. The same docs say API endpoints are rate-limited per API key and can return `429 Too Many Requests` with `Retry-After`; MPP-specific quota and retry behavior is not described in the local public sources.

DNS setup is sensitive to provider behavior. API-returned DNS names are fully qualified domain names and may need conversion to provider-relative hostnames. Route 53 TXT values may need split quoted strings for long DKIM records, MX records use `priority` plus `value`, and adding AgentMail MX records to a root domain can conflict with an existing mail provider. The docs recommend subdomains when avoiding root-domain MX conflicts.

Deleting a domain is permanent in the domain-management docs and immediately prevents associated inboxes from sending or receiving email, while that page says existing inbox data remains accessible. The pod-deletion docs separately describe domain deletion during pod cleanup as automatically cleaning associated data, so destructive semantics should be verified before offboarding. Pod deletion also requires deleting child inboxes and domains first.

## Use Cases

1. **Tenant domain onboarding for a SaaS platform.** Create a pod-scoped domain with `POST /v0/pods/:pod_id/domains`, store the returned `domain_id`, publish returned DNS `records[]`, and call the pod verify endpoint until `status` becomes `VERIFIED`. This gives each tenant isolated inboxes and branded email infrastructure.

2. **Organization-wide branded sending setup.** Use `POST /v0/domains` for a domain intended across the organization, then create inboxes on that custom domain after verification. This avoids relying on the shared `agentmail.to` domain for production sender reputation.

3. **DNS automation using record fields.** Read `records[].type`, `records[].name`, `records[].value`, and `records[].priority` from the Domain response and translate them into provider API calls for TXT, CNAME, and MX records. For providers with zone-file import, download `/zone-file` and use the binary BIND file instead.

4. **Deliverability health monitoring.** Poll `GET /v0/domains/:domain_id` or the pod equivalent and alert when domain `status` moves away from `VERIFIED` or any `records[].status` changes to `MISSING` or `INVALID`. The docs specifically call out accidental DNS changes as a reason to monitor domain health.

5. **Domain pooling for high-volume outreach.** Maintain multiple verified domains from `GET /v0/domains` or `GET /v0/pods/:pod_id/domains`, then rotate new inboxes or outbound workloads across them. The docs describe this as a strategy for spreading volume and protecting reputation when one domain is temporarily impacted.

6. **Feedback-routing policy changes.** Use the pod `PATCH /v0/pods/:pod_id/domains/:domain_id` endpoint to toggle `feedback_enabled` for a tenant domain when bounce and complaint notifications should or should not go to inboxes. The inventory does not show an org-level patch endpoint in this MPP group.

7. **Safe customer offboarding.** Before deleting a pod, list pod domains, delete each domain by `domain_id`, and then delete other child resources. The docs say pods cannot be deleted while child domains or inboxes remain.

8. **Verification support triage.** For stuck domains, inspect `status` and per-record `records[].status`, compare `name` and `value` to the DNS provider, and use `POST .../verify` to manually retrigger verification after DNS propagation or provider corrections.
