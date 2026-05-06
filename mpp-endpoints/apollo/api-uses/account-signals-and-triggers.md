# Apollo: Account Signals And Triggers API Uses

## What This Endpoint Group Does

This group retrieves company-specific signals after the user already has Apollo organization IDs. Job postings show hiring activity by title, location, posted date, and last-seen date. News search returns articles associated with organization IDs, including title, URL, snippet, publication date, publisher domain, and event categories.

The endpoints are useful for deciding when to act on an account, what angle to use, and whether a company is showing change, growth, or urgency.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/apollo/job-postings` | Get current job postings for one company. | `organization_id` | `organization_job_postings[].title`, `url`, `city`, `state`, `country`, `posted_at`, `last_seen_at` |
| POST | `/apollo/news-search` | Find recent news articles for one or more companies. | `organization_ids`, `page`, `per_page` | `news_articles[].title`, `url`, `domain`, `snippet`, `published_at`, `event_categories`, `pagination` |

## Field Notes

### Inputs

Both endpoints require Apollo organization IDs, so they usually follow organization search or organization enrichment. The MPP news endpoint supports pagination; the native Apollo OpenAPI also lists category and publication-date filters that are not documented in the MPP request body.

### Outputs

Job postings are structured around role, location, posting URL, posted date, and last-seen date. News outputs are structured around article metadata and event categories. These fields are not contact data; they are timing and context signals for account research and prioritization.

### Important Constraints Or Gaps

These endpoints depend on accurate organization IDs. Native docs include status codes such as 401, 422, and 429; the MPP OpenAPI lists 402 payment-required in addition to success. The captured docs do not enumerate all possible news event categories.

## Use Cases

### Detect Hiring-Driven Buying Signals

A sales team can call job postings for target accounts and identify companies hiring for roles related to the team's product. For example, postings for security engineers, RevOps roles, data engineers, or implementation managers can indicate active projects, budget, or operational pain.

The output fields `title`, `city`, `state`, `country`, `posted_at`, and `last_seen_at` help decide whether an account is growing in a relevant function and whether the signal is fresh. A personal user could use this to research a company's hiring direction before networking or interviewing.

### Prioritize Accounts With Fresh News

News search can turn a static account list into a daily or weekly trigger feed. Articles with `title`, `snippet`, `published_at`, `url`, and `event_categories` help identify companies announcing funding, launches, partnerships, executive changes, or other events.

For a business, this supports account prioritization and outreach timing. For an individual, it supports preparation before meetings, interviews, or investment research. The practical limitation is that a news article is a signal, not proof of a buying process; teams should combine it with enrichment and account-fit fields.

### Build Event-Based Outreach Queues

An agent can combine organization search, organization enrichment, and this signal group to create queues such as "companies in my ICP with new hiring posts this week" or "target accounts with recent news." The signal endpoints add the time-sensitive fields that make outreach timely rather than generic.

The workflow can automate routing to sales reps, create CRM tasks, or produce research briefs. The system should include deduplication by article URL or job posting ID and avoid repeatedly triggering on the same `last_seen_at` or `published_at` values.

### Monitor Competitive Or Partner Accounts

A founder, investor, or partnership team can track a small list of organizations and watch for changes in hiring or media activity. Job titles can reveal where companies are investing, while news snippets can reveal product direction or market moves.

The value is in structured monitoring without manually checking career pages and news sites. However, Apollo's coverage, refresh cadence, and event categorization are not fully documented in the captured sources, so high-stakes decisions should verify important findings from primary sources.

### Improve Account Research Briefs

Before a sales call or partner meeting, a user can retrieve recent jobs and news for the organization ID, then combine those fields with organization enrichment. A brief can include hiring priorities, recent public developments, company size, funding, technologies, and headquarters location.

This helps both individuals and teams prepare with concrete context. The output enables better question selection and prioritization, but it should be presented as research context rather than definitive internal company information.
