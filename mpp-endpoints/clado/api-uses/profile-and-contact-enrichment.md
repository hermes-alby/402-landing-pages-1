# Clado: Profile And Contact Enrichment API Uses

## What This Endpoint Group Does

This group starts from a known person identifier, usually a LinkedIn URL, and enriches it into structured profile data and reachable contact channels. It covers direct contact lookup, live/profile scraping, and database-backed LinkedIn profile retrieval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/clado/contacts` | Find email and/or phone contact data | `linkedin_url`, `email`, `phone`, `email_enrichment`, `phone_enrichment` | `contacts`, `social`, confidence `rating`, `subType` |
| POST | `/clado/scrape` | Scrape detailed LinkedIn profile data | `linkedin_url` | `profile`, `experience`, `education`, `skills`, `languages`, `posts` |
| POST | `/clado/linkedin-profile` | Retrieve structured LinkedIn profile data from database | `linkedin_url` | Similar profile, experience, education, skills, location, and activity fields |

## Field Notes

### Inputs

`linkedin_url` is accepted by all three endpoints. Contact enrichment can instead start from exactly one of `email` or `phone`, and can request `email_enrichment`, `phone_enrichment`, or both. The MPP schema does not enforce the "exactly one lookup key" rule, but the first-party docs do.

### Outputs

Contact enrichment returns `data[].contacts[]` with `type`, `value`, `rating`, and `subType`, plus matched social profiles. Profile endpoints return professional identity, location, current headline/title, experience, company LinkedIn IDs/domains, education, skills, languages, websites, emails where present, post summaries, and `last_updated` or similar freshness clues.

### Important Constraints Or Gaps

Contact enrichment requires purchased credits in the first-party docs and is not available on the free trial. It can return zero-charge no-find outcomes in native pricing when email/phone is not found, but the MPP wrapper advertises an estimated `$0.04-$0.14`. Database profile retrieval and scraping overlap, but docs do not fully state when to prefer one over the other or how fresh each source is.

## Use Cases

### Turn Search Results Into Reachable Leads

A personal user can take a promising LinkedIn profile from search and request a work email before sending a carefully scoped message. A sales or recruiting team can enrich a selected prospect list only after profile fields show good fit, reducing wasted spend on weak candidates.

The crucial fields are `contacts[].type`, `contacts[].value`, `contacts[].rating`, and `contacts[].subType`. They let a workflow choose work email over personal email, suppress low-confidence contacts, and avoid phone outreach unless there is a clear business reason. Compliance review is important because the API returns personal contact data.

### Verify Profile Fit Before Outreach

A recruiter or founder can scrape or retrieve a LinkedIn profile to confirm current title, employer, skills, and work history before contacting someone. A business can automate CRM hygiene by checking whether a lead's current company or role still matches the campaign.

Fields such as `profile.title`, `profile.headline`, `experience[].employer_name`, `experience[].is_current`, `skills`, `location`, and `last_updated` support routing decisions: send to sales, hold for nurture, reject as stale, or request manual review. The limitation is that `last_updated` availability differs by schema and endpoint.

### Account Map Enrichment

A business can enrich several known LinkedIn URLs gathered from events, referrals, or search into a richer account map. Profile and experience fields reveal who works at which company, what roles they hold, and whether they have relevant skills or public activity.

This enables specific actions: associate people with target accounts, identify likely technical buyers, find alumni or prior-company ties, and personalize outreach with current role context. Contact fields should be used only after fit is established because contact enrichment is higher-cost and more sensitive.

### Personal Career Networking

A job seeker can enrich a small number of known public LinkedIn profiles to prepare for informational interviews: current role, prior companies, education, skills, and public post topics can guide better questions. A career platform could use the same fields to help users identify approachable alumni or role models.

The endpoint group is valuable because it combines identity, work history, and content clues. It does not provide relationship strength or consent, so workflows should avoid unsolicited bulk outreach and use the data to prepare relevant, respectful messages.
