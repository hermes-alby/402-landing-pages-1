# Hunter: Person Email Finding API Uses

## What This Endpoint Group Does

Person Email Finding finds the most likely email address for a specific person. It accepts a company domain or company name plus a person's first/last or full name, or it can use a LinkedIn handle. It returns one likely address with a score, company/domain fields, source evidence, public profile fields, and automatic verification status.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/hunter/email-finder` | Find a likely email for a known person. | `domain`, `company`, `linkedin_handle`, `first_name`, `last_name`, `full_name`, `max_duration`. | `email`, `score`, `domain`, `company`, `accept_all`, `position`, `twitter`, `linkedin_url`, `phone_number`, `sources`, `verification.status`, `verification.date`, echoed params. |

## Field Notes

### Inputs

The provider requires a company locator (`domain`, `company`, or `linkedin_handle`) and a person name (`first_name` plus `last_name`, or `full_name`) unless `linkedin_handle` is provided. `domain` is preferred over `company` because it avoids company-name resolution. `max_duration` controls how long Hunter may refine the result; provider docs say 3-20 seconds and default 10, while the MPP markdown says default 3.

### Outputs

The main output is `data.email`, but the quality controls are `score`, `accept_all`, `verification.status`, `verification.date`, and `sources[]`. Profile fields such as `position`, `linkedin_url`, `twitter`, `phone_number`, and `company` help confirm whether the address likely belongs to the intended person.

### Important Constraints Or Gaps

Hunter docs say a verification is automatically performed on each email found and no credit is charged upstream if no email can be found. The MPP wrapper charges `$0.013` per request according to its docs. Source records are capped at 20. No live finder calls were performed.

## Use Cases

### Fill A Missing Email For A Known Decision-Maker

A person preparing a targeted partnership, sales, press, or recruiting note may know the recipient's name and company but not their email address. A business can automate the same workflow from a CRM record where `first_name`, `last_name`, and `domain` are known but email is blank.

The endpoint's value is the combined result: `email`, `score`, `verification.status`, `position`, `company`, and `sources`. A workflow can require a high score, a non-accept-all domain, and a matching company before adding the address to CRM. When `verification.status` is `unknown` or sources are stale, the record should go to manual review or a separate Email Verifier check.

### Convert LinkedIn-Sourced Prospects Into Contactable Records

A recruiter, founder, or salesperson may have a LinkedIn handle from manual research or another compliant source. `linkedin_handle` lets the endpoint try to find the person's email without separately resolving name plus company.

For a business, this is useful when sourcing systems collect profile handles but not emails. The returned `email`, `linkedin_url`, `position`, and `company` can reconcile the result back to the original profile. The limitation is that the docs do not guarantee the same completeness for every LinkedIn-handle lookup, and users must respect platform terms and privacy rules for any upstream source of handles.

### Reduce Manual Address Guessing

Instead of guessing an email pattern and sending a test message, a personal user can use Email Finder to get Hunter's best supported address and evidence. A business can replace brittle pattern-generation logic with a request that returns `score`, public `sources`, and automatic `verification`.

This helps avoid unnecessary bounces and protects sender reputation by using deliverability signals before outreach. It does not remove the need for consent, legitimate interest review, unsubscribe handling, or campaign relevance.

### Enrich Sparse Event Or Referral Leads

After a webinar, conference, referral, or inbound form, a user might have a person's name and company but no email. A business can run Email Finder only for records that meet qualification rules, then use `position`, `company`, `score`, and `verification.status` to decide whether to send a direct follow-up, route to sales, or ask for confirmation.

The endpoint is useful here because the output includes both address and confidence context. If `accept_all` is true or the score is low, the automation can avoid direct email and instead request a confirmed address through a safer channel.

### Validate Identity Fit Before Outreach

The endpoint can help avoid contacting the wrong person when names are common. Returned fields such as `position`, `company`, `linkedin_url`, `twitter`, and sources give reviewers a way to assess whether the found address matches the intended prospect.

A business workflow can hold results for review when the company name differs from the expected account, the position is missing, or source evidence is weak. This prevents blindly writing to an address just because a pattern matched.
