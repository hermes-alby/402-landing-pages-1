# Email Reputation: Email Reputation And Risk Screening API Uses

## What This Endpoint Group Does

This endpoint group checks one email address and returns deliverability, quality, sender, domain, risk, and breach signals. It is useful when an application needs to decide whether an email is likely reachable, whether it looks disposable or suspicious, whether its domain has credible mail and registration signals, and whether known breach exposure should change trust or security treatment.

The group is best treated as a decision-support signal rather than an absolute identity or fraud verdict. A reachable address can still belong to a bad actor, and a risky or breached address can still belong to a legitimate person. The strongest use cases combine these fields with first-party context such as account age, payment risk, CRM history, user consent, or campaign engagement.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/abstract-email-reputation/check` | Check reputation score and risk assessment for an email address. | `email` | Deliverability status/detail, format/SMTP/MX checks, MX records, quality score, disposable/free/role/catchall/subaddress flags, DMARC/SPF indicators, sender and organization hints, domain registration data, risk statuses, breach count and breach dates/domains. |

## Field Notes

### Inputs

The MPP endpoint accepts a JSON body with a required `email` string. The provider's direct endpoint is documented as `GET https://emailreputation.abstractapi.com/v1` with `api_key` and `email` query parameters; the MPP wrapper replaces direct provider authentication with MPP/Tempo payment.

### Outputs

The most operational fields are `email_deliverability.status`, `email_deliverability.status_detail`, `email_deliverability.is_smtp_valid`, `email_deliverability.is_mx_valid`, and `email_deliverability.mx_records`, which help decide whether an email is likely reachable. `email_quality.score`, `is_disposable`, `is_username_suspicious`, `is_role`, `is_catchall`, `is_free_email`, `is_subaddress`, `is_dmarc_enforced`, and `is_spf_strict` help judge address quality and abuse risk. `email_domain` adds domain age, live-site, registrar, and date context. `email_risk` gives address/domain risk statuses. `email_breaches` adds known breach exposure counts and timestamps.

### Important Constraints Or Gaps

The MPP OpenAPI does not define the 200 response schema, so response fields are derived from official provider docs. The wrapper's exact response passthrough behavior was not tested because that would require a paid call. Provider docs state each submitted email counts as a credit even if the email is invalid. The provider documents bulk CSV upload separately, but this MPP service exposes only a single-address check endpoint. Privacy and compliance claims come from the provider product page and should be reviewed against the user's own policies before production use.

## Use Cases

### Signup Fraud And Abuse Screening

A consumer app, marketplace, forum, or SaaS product can check an email during signup and use `is_disposable`, `is_username_suspicious`, `email_risk.address_risk_status`, `email_risk.domain_risk_status`, domain age, and breach exposure to decide whether to allow the account normally, require email verification, add step-up authentication, throttle trial usage, or queue a manual review. The personal angle is account protection: a user can be prompted to use a more stable email when a disposable or unreachable address would make account recovery unreliable.

The endpoint should not be used as the only fraud decision. A disposable or breached address is a risk signal, not proof of bad intent. The strongest workflow combines it with device, IP, payment, velocity, and historical account signals, while retaining an appeal or recovery route for legitimate users.

### Email List Hygiene Before Campaigns

Marketing and lifecycle teams can run checks on addresses before sending a campaign, then suppress or segment contacts with `undeliverable`, `invalid_mailbox`, `full_mailbox`, `dns_record_not_found`, invalid MX, disposable providers, or low quality scores. This reduces hard bounces and avoids sending to addresses that can hurt sender reputation. A person managing a small newsletter could use the same signal before importing an old list.

The useful workflow is not just "validate email"; it is ranking what to do next. Deliverable business-domain contacts can stay in the main audience, catchall domains can be sent at a lower rate, role addresses can move to a generic-contact segment, and risky or invalid addresses can be suppressed. Cost matters for large lists because each checked address consumes a paid MPP request or provider credit.

### Lead Qualification And Sales Routing

Sales operations can enrich inbound demo requests or content downloads by checking whether the email belongs to a credible business domain, a free provider, a live domain, or a known organization. `email_sender.organization_name`, `organization_type`, `email_provider_name`, `email_domain.domain`, `is_free_email`, `is_role`, and domain age help separate likely business leads from personal, generic, or throwaway submissions.

This is valuable for routing: high-quality business-domain contacts can go directly to sales, personal or role-based addresses can enter nurture, and suspicious or disposable addresses can be excluded from expensive manual follow-up. The limitation is that sender and organization fields are inferred and may be null or wrong; they should complement, not replace, first-party form data and CRM enrichment.

### Checkout And Promotion Abuse Triage

E-commerce, subscriptions, and digital-product businesses can check the email attached to a first purchase, coupon redemption, or free-trial creation. Disposable address flags, suspicious usernames, recently created or risky domains, and breach exposure can trigger lower-risk mitigations such as requiring email verification before delivery, delaying high-risk promotions, limiting trial credits, or asking for additional confirmation.

This is especially useful where abuse is low-value but high-volume, such as repeated free trials or coupon cycling. The returned fields help avoid heavy-handed blocking: a deliverable address on an old domain with strict SPF/DMARC and low risk can pass, while disposable or undeliverable addresses can receive extra friction. The workflow still needs policy guardrails so breach exposure alone does not become an unfair denial signal.

### Account Security And Recovery Risk Review

Security teams can use the breach fields during account recovery or sensitive profile changes. `email_breaches.total_breaches`, `date_first_breached`, `date_last_breached`, and `breached_domains` can inform whether to require stronger verification before allowing password resets, email changes, or payout changes. A person could use the same information as a reminder to rotate passwords and ensure the mailbox itself is secured.

The endpoint does not prove that the current account is compromised. It indicates historical exposure for the email address, so it should be used to tune friction and user education rather than to accuse or lock out users automatically. Freshness and coverage of breach sources are not fully documented in the local sources.

### Domain Trust Review For Partnerships And Vendor Intake

Procurement, partnership, and community teams can check an email domain before trusting inbound outreach. `email_domain.domain_age`, `is_live_site`, registrar fields, expiration dates, `is_risky_tld`, `email_deliverability.mx_records`, and mail-authentication indicators help reveal whether the sender's domain looks established and configured for legitimate communication.

This is useful for triaging cold outreach, sponsor requests, marketplace seller applications, or vendor onboarding. For example, a new domain with no live site, weak mail configuration, and risky status can be escalated, while an established domain with valid MX and organization hints can move through normal review. The endpoint does not verify legal identity or authorization to represent an organization.

### Customer Support Prioritization And Contact Repair

Support teams can check bounced or unreachable customer emails before closing tickets, sending invoices, or escalating account recovery. `status_detail` distinguishes invalid format, invalid mailbox, full mailbox, missing DNS records, and unavailable servers, which supports different actions: request a corrected address, retry later, warn about a full mailbox, or route to alternate contact methods.

For individuals and small teams, this can reduce time spent chasing contacts that cannot receive email. For businesses, it can improve collections, onboarding, and retention by catching bad contact data before automation fails silently. The limitation is that provider checks can be transient when servers are unavailable or high traffic; retries and non-email fallback channels are still needed.
