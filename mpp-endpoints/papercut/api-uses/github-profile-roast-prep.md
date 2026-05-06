# Papercut: GitHub Profile Roast Prep API Uses

## What This Endpoint Group Does

This endpoint group gives an agent the GitHub profile context needed to write a short Papercut roast without calling GitHub directly. The endpoint accepts a GitHub username and returns a broad profile object plus optional profile README content. Papercut's docs make this the required upstream data source for the creative step before any paid postcard order.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/github/{username}` | Fetch Papercut-curated GitHub profile data for roast writing. | `username` path parameter matching `^[a-zA-Z0-9-]+$` | `user` object, `profileReadme` |

## Field Notes

### Inputs

The only documented input is `username`, a path parameter for the GitHub profile to look up. The OpenAPI requires the username to match `^[a-zA-Z0-9-]+$`. The skill docs say to ask for a GitHub username and stop if the user does not have one.

### Outputs

The 200 response includes `user`, described as profile info, repositories, contribution stats, organizations, and pinned items, plus `profileReadme`, which is a string or `null`. The OpenAPI does not enumerate nested `user` fields, so downstream workflows should treat the exact profile object shape as schema-light and preserve raw data for debugging.

### Important Constraints Or Gaps

Papercut's docs instruct agents not to call `api.github.com` directly and not to read local files, environment variables, or system data. Roast content should be based only on data returned by this endpoint. The endpoint can return 400 for invalid usernames, 404 when the user is not found, and 429 when GitHub API access is rate limited through Papercut's backend. No formal rate-limit policy or nested response schema is published.

## Use Cases

### Consent-Based Personal Roast Preview

A person can provide their own GitHub username and let an agent fetch public profile context before deciding whether to buy a postcard. The useful fields are the input `username`, the returned `user` object, and `profileReadme`, which give enough signals about languages, pinned repos, organizations, and self-description to generate a playful roast that feels specific.

For the user, the value is pre-purchase confidence: the agent can draft a concise roast internally and present an order summary without exposing or sending the roast yet. The limitation is that the OpenAPI does not enumerate the profile object, so an integration should handle sparse profiles and missing nested fields gracefully.

### Developer Community Icebreaker

A community manager could use the endpoint to prepare lightweight icebreakers for GitHub-first communities, hackathons, or open-source contributor events. The workflow starts with opt-in GitHub usernames, fetches each profile through Papercut, then uses repos, organizations, pinned items, and README text as creative material.

The returned data helps personalize outreach without asking for private information. A business can decide which profiles have enough public context for a good postcard and skip sparse or missing profiles before paying for `POST /api/send`. This should stay opt-in because the output is a roast and could feel intrusive if used cold.

### Recruiting Or Candidate Follow-Up Personalization

Recruiters or hiring teams could use the endpoint after a candidate opts in with a GitHub username. The profile object and README can help an agent produce a playful, developer-native follow-up postcard that references public work without scraping unrelated sources.

The decision value is whether a profile has enough public material to justify a personalized postcard. The endpoint's 404 and schema gaps are important: candidates with private or sparse GitHub activity may not produce useful content, and teams should not infer ability from missing public data.

### Internal Recognition For Engineering Teams

An engineering team could use Papercut as a morale tool: teammates provide GitHub usernames, an internal agent fetches profile context, and the team sends digital or physical postcards for launches, anniversaries, or open-source milestones. The relevant fields are profile context and README content for generating a short roast that is specific but friendly.

For a business, the endpoint reduces the manual research burden before ordering. The main caveat is content safety: docs require funny-not-cruel roasts and prohibit secrets, emails, URLs, and file paths in the roast text.

### Order Qualification Before Spend

Because the profile lookup is separate from the paid order endpoint, an agent can validate whether a username exists and has enough public material before triggering any payment flow. The endpoint's 400, 404, and 429 responses let the agent ask for corrections or pause instead of proceeding to a paid request.

This is valuable for both individuals and businesses because it avoids wasting the $1 or $3 paid send on malformed usernames or unavailable profiles. The workflow still requires explicit confirmation before any paid/mutating request.
