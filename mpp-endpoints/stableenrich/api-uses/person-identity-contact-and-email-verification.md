# StableEnrich: Person Identity, Contact, And Email Verification API Uses

## What This Endpoint Group Does

Resolve people from partial identity signals, enrich profiles with contact and demographic attributes, verify emails, and find contact details from LinkedIn URLs, email addresses, phone numbers, names, or addresses.

These endpoints all support person identity resolution, contact discovery, or email quality checks, including B2C-style Minerva data and single-contact enrichment fallbacks.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/clado/contacts-enrich` | Clado Contacts Enrichment - Enrich contact info from LinkedIn URL, email, or phone ($0.2) | linkedin_url, email, phone, email_enrichment, phone_enrichment | data, data.error, data.contacts, data.contacts.type, data.contacts.value, data.contacts.rating, data.contacts.subType, data.social |
| POST | `/api/whitepages/person-search` | Whitepages Person Search - Find people by name, phone, address ($0.44) | name, first_name, last_name, phone, street, city, state_code, zipcode | persons, persons.id, persons.name, persons.aliases, persons.is_dead, persons.current_addresses, persons.historic_addresses, persons.owned_properties |
| POST | `/api/hunter/email-verifier` | Hunter - Verify email deliverability ($0.03) | email | status, score, email, regexp, gibberish, disposable, webmail, mx_records |
| POST | `/api/minerva/resolve` | Minerva Resolve - Resolve person identity to a Minerva PID and LinkedIn URL. Supports fuzzy matching and reverse lookup by email or phone only. ($0.02) | records, records.record_id, records.first_name, records.middle_name, records.last_name, records.full_name, records.name_suffix, records.emails | api_request_id, results, results.record_id, results.is_match, results.minerva_pid, results.linkedin_url, results.match_score, results.is_resolvable_record |
| POST | `/api/minerva/enrich` | Minerva Enrich - Enrich person records with demographics, work history, education, contact info, addresses, and financial signals. Supports lookup by Minerva PID, LinkedIn URL, or name/email/phone. ($0.05) | records, records.record_id, records.first_name, records.middle_name, records.last_name, records.full_name, records.name_suffix, records.emails | api_request_id, request_completed_at, results, results.record_id, results.is_match, results.minerva_pid, results.match_score, results.validation_errors |
| POST | `/api/minerva/validate-emails` | Minerva Validate Emails - Check if email addresses exist in the Minerva database and retrieve validation status and last seen timestamps. ($0.01) | records | api_request_id, results, results.email_address, results.is_match, results.email_validation_status, results.email_last_seen, request_completed_at |

## Field Notes

### Inputs

- `linkedin_url`
- `email`
- `phone`
- `first_name`
- `last_name`
- `street`
- `city`
- `state_code`
- `records`
- `record_id`
- `emails`
- `phones`
- `minerva_pid`
- `return_fields`
- `match_condition_fields`

### Outputs

- `contact emails`
- `phone numbers`
- `addresses`
- `Minerva PID`
- `LinkedIn URL`
- `demographics`
- `work history`
- `education`
- `income/wealth ranges`
- `relatives`
- `social profiles`
- `email validation status`
- `last_seen`

### Important Constraints Or Gaps

- The official docs do not publish compliance restrictions for regulated uses such as credit, employment, insurance, tenant screening, or eligibility decisions.
- Response freshness, match confidence calibration, and opt-out behavior are not fully documented.
- Endpoints in this group cost /api/clado/contacts-enrich: $0.2; /api/whitepages/person-search: $0.44; /api/hunter/email-verifier: $0.03; /api/minerva/resolve: $0.02; /api/minerva/enrich: $0.05; /api/minerva/validate-emails: $0.01.

## Use Cases

### Contact Completion For Known People

A person trying to reconnect with a known contact could use a LinkedIn URL, email, or phone with Clado, or a name/email/phone record with Minerva, to find additional contact routes and profile context. Hunter and Minerva validation can pre-screen whether email addresses are likely usable before spending more on enrichment.

Businesses can use this for CRM cleanup, sales enrichment, recruiting operations, and support identity resolution. Workflows should store source, match method, and confidence where available, because the docs do not provide a universal match-confidence calibration.

### Identity Resolution Before Expensive Enrichment

A list owner can run Minerva validate-emails at a lower price to find which addresses exist in the database and see validation status or last-seen timestamps, then resolve or enrich only likely matches. record_id preserves linkage back to the original list.

This is valuable for businesses with stale lists, event leads, alumni records, or customer records that need selective enrichment. The flow reduces wasted spend, but email existence in a database is not consent for outreach and should not be used as a regulated eligibility signal.

### Household And Demographic Context For Non-Regulated Personalization

Minerva enrich can return demographics, work history, education, address history, financial signals, relatives, social profiles, emails, and phones when available. A personal user might use it for benign contact reconstruction, but this is sensitive data.

Businesses could use it for segmentation, personalization, or research only after legal review and clear consent/compliance controls. The local docs do not publish restrictions for credit, employment, insurance, tenant screening, or similar regulated decisions, so those uses should be treated as blocked until independently approved.
