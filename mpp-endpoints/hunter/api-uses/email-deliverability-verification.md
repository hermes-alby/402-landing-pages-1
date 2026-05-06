# Hunter: Email Deliverability Verification API Uses

## What This Endpoint Group Does

Email Deliverability Verification checks a known email address and returns deliverability and risk signals. It reports a detailed `status`, deprecated coarse `result`, score, syntax and gibberish checks, disposable/webmail flags, MX and SMTP signals, accept-all behavior, block status, and public source evidence.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/hunter/email-verifier` | Verify whether a known email address is likely deliverable. | `email`. | `status`, `result`, `score`, `regexp`, `gibberish`, `disposable`, `webmail`, `mx_records`, `smtp_server`, `smtp_check`, `accept_all`, `block`, `sources`, echoed email. |

## Field Notes

### Inputs

The only required input is `email`. The provider docs describe the upstream endpoint as a 20-second verification process that can return `202` while work is still in progress, after which the same endpoint can be polled.

### Outputs

`status` is the primary classification and can be `valid`, `invalid`, `accept_all`, `webmail`, `disposable`, or `unknown`. `result` is deprecated but maps to `deliverable`, `undeliverable`, or `risky`. Boolean diagnostics explain why the address was scored: regex validity, disposable/webmail, MX records, SMTP server, SMTP check, accept-all, and server block. Public `sources[]` can provide provenance with dates.

### Important Constraints Or Gaps

The provider rate limit is 10 requests/second and 300/minute. Provider docs list `202` pending and `222` remote SMTP failure behavior, plus `451 claimed_email` privacy/legal suppression. The MPP OpenAPI only documents the request field and does not describe pending polling semantics. No live verifications were performed.

## Use Cases

### Protect Sender Reputation Before Outreach

A personal user can verify a single address before sending an important message. A business can automatically validate newly found or imported emails before adding them to a sales sequence, recruiting campaign, or customer communications queue.

The decision fields are `status`, `score`, `smtp_check`, `mx_records`, `accept_all`, `disposable`, and `block`. A workflow can accept `valid`, suppress `invalid` and `disposable`, and route `accept_all`, `unknown`, or `block=true` to manual review. The endpoint is valuable because it separates deliverability risk from mere address format.

### Clean CRM Or Mailing-List Data

Teams often inherit stale contacts from spreadsheets, event exports, integrations, or legacy CRM data. Email Verifier can be used to triage these records one at a time, marking undeliverable or risky emails before they cause bounces.

The output supports concrete CRM actions: update validation status, remove disposable/webmail addresses from B2B campaigns, re-request a better email when `mx_records` is false, or stop using records that return privacy-related errors. This should be combined with consent and retention policies; verification does not make cold outreach compliant by itself.

### Detect Risky Webmail Or Disposable Submissions

A SaaS product, community, or event organizer can check whether a submitted contact email is a business address, webmail, disposable, or generated-looking address. A business can use this as one feature in lead scoring or abuse prevention for forms where B2B identity matters.

Fields like `webmail`, `disposable`, `gibberish`, `regexp`, and `emailProvider`-adjacent domain behavior help decide whether to ask for a work email, require manual approval, or route a lead to a lower-priority nurture flow. The endpoint should not be the only fraud signal because a legitimate user can use webmail and some business domains are accept-all.

### Resolve Ambiguous Email Finder Results

When Email Finder or Domain Search returns an address with `accept_all` or low confidence, Email Verifier can provide a second look at SMTP and deliverability behavior. A personal user might do this before contacting a potential employer; a business can use it as a gate before campaign enrollment.

The useful fields are `status`, `score`, `accept_all`, `smtp_check`, and `sources`. If the verifier returns `unknown` or `block`, a workflow can delay outreach, try another contact, or request human confirmation. If the provider returns `202`, the automation needs documented retry behavior; the MPP wrapper's charging behavior for polling remains an open question.

### Add Evidence To Data Quality Audits

Data teams can store verification snapshots with `status`, `score`, boolean checks, and `sources[].last_seen_on` to explain why a contact was accepted or rejected. This creates an auditable trail for enrichment pipelines and outbound compliance reviews.

The endpoint supports this because it exposes diagnostic fields rather than a single yes/no. The caveat is freshness: a valid address today can bounce later, and source dates indicate when Hunter saw public evidence, not necessarily current employment or consent.
