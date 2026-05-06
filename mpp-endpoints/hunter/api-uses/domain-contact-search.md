# Hunter: Domain Contact Search API Uses

## What This Endpoint Group Does

Domain Contact Search retrieves email addresses associated with one website or company. It returns domain-level mail signals and per-contact fields such as address, type, confidence, source URLs, name, job title, seniority, department, social handles, phone number, and verification status. It is the broad contact-list endpoint in the assigned Hunter MPP surface.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/hunter/domain-search` | Find personal and generic email addresses for a domain or company. | `domain` or `company`, `limit`, `offset`, `type`, `seniority`, `department`, `required_field`, `verification_status`; provider docs also include `location` and `job_titles`. | `domain`, `accept_all`, `pattern`, `organization`, `linked_domains`, `emails[].value`, `emails[].type`, `emails[].confidence`, `emails[].sources`, names, `position`, `seniority`, `department`, social handles, `phone_number`, `verification`. |

## Field Notes

### Inputs

The endpoint requires `domain` or `company`; `domain` takes precedence and avoids company-name resolution. Filters can narrow by personal versus generic addresses, seniority, department, required fields, and verification status. Provider docs also support location and job-title filtering, but these fields are missing from the MPP OpenAPI.

### Outputs

Domain-level fields show whether the domain is disposable, webmail, accept-all, and what email `pattern` Hunter observes. `emails[]` carries the operational value: the address, type, confidence estimate, source evidence with `extracted_on` and `last_seen_on`, role/person fields, and verification date/status.

### Important Constraints Or Gaps

The provider docs say each response returns up to 100 emails and each email has up to 20 sources. Domain Search is rate-limited upstream to 15 requests/second and 500/minute. The MPP cost is dynamic with a published hint of `$0.013-$0.103`, but the exact formula is not in the local sources. A new query is counted upstream when it returns at least one result. No live domain searches were performed.

## Use Cases

### Build A Role-Specific Outreach Queue

A salesperson, founder, or recruiter can request a target domain with `department`, `seniority`, `type`, and `required_field` filters to surface likely contacts for a specific campaign. For example, filtering for `department=sales` and `seniority=executive` helps build a short list of revenue leaders, while `required_field=position` avoids addresses without a title.

A business can automate this into an outbound queue: select target accounts from CRM, call Domain Search only for accounts that pass fit and coverage thresholds, and create review tasks from `emails[].value`, `position`, `confidence`, `verification.status`, and `sources`. The key limit is that a confidence score and source URL are not permission to email; compliance, opt-out handling, and relevance checks still need to happen outside the endpoint.

### Find Functional Inboxes For Support, Security, Or Partnerships

A personal user may need a public role address such as support, press, partnerships, or security for a legitimate request. A business can use `type=generic` to identify role-based inboxes for vendor management, responsible disclosure routing, partner outreach, or customer-support escalation.

The valuable fields are `emails[].type=generic`, the address value, source URLs, and domain-level `pattern`/`organization`. Unlike person-specific outreach, a generic address may be more appropriate for official requests. The workflow should still validate that the discovered address is current by inspecting `last_seen_on` and optionally using Email Verifier before sending.

### Prioritize Contacts By Evidence Strength

An analyst or salesperson can sort returned contacts by `confidence`, `verification.status`, and source freshness before deciding whom to contact. A business can encode these as rules: accept only `verification.status=valid`, reject stale sources, or require multiple recent sources before pushing a record into CRM.

This group supports evidence-aware routing because it includes both probability (`confidence`) and provenance (`sources[].uri`, `extracted_on`, `last_seen_on`, `still_on_page`). The limitation is that source URLs can become stale or unavailable, and accept-all domains can still create false positives even when an address looks syntactically plausible.

### Map A Buying Committee Or Hiring Panel

For an account-based sales motion, Domain Search can surface people across departments and seniority levels for one target company. For a job seeker or recruiter, it can help identify likely people in HR, management, or a relevant functional team.

Fields such as `department`, `seniority`, `position`, `first_name`, `last_name`, and `linkedin` help turn a raw domain into a lightweight org map. The endpoint does not provide reporting lines or consent status, so the output is best used for research triage before a human reviews who should be contacted.

### Detect Domain-Level Email Pattern And Deliverability Risk

A business can use `pattern`, `accept_all`, `webmail`, `disposable`, and per-email verification status to understand how a company structures addresses and whether automated guessing or outreach is risky. A personal user might use the same information to double-check a suspected address format before sending a high-stakes note.

`pattern` can guide data cleanup or matching, while `accept_all` and `verification.status` warn when apparent matches may bounce or be false positives. This use case should avoid generating or emailing guessed addresses without validation and compliance review.
