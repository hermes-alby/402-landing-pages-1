# Papercut API Uses

## Service Summary

Papercut is a first-party agent postcard service. An agent fetches GitHub profile context, writes a short friendly roast, and sends it as a digital postcard or physical mailed postcard. The MPP catalog exposes one paid endpoint, `POST /api/send`, with dynamic pricing of $1 for digital and $3 for physical.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| GitHub Profile Roast Prep | 1 | Gather official Papercut-curated GitHub profile context before writing a roast. | [`api-uses/github-profile-roast-prep.md`](api-uses/github-profile-roast-prep.md) |
| Postcard Ordering And Fulfillment | 1 | Create and fulfill a paid digital or physical postcard order through MPP/x402. | [`api-uses/postcard-ordering-and-fulfillment.md`](api-uses/postcard-ordering-and-fulfillment.md) |

## Highest-Value Uses

Papercut is most valuable where a small paid action creates a memorable artifact: personal developer keepsakes, opt-in developer community rewards, recruiting follow-ups, internal engineering recognition, and compact demos of agent payment workflows. The practical value comes from combining GitHub-specific personalization, low per-order pricing, digital reveal links, and optional physical mail.

## Personal Use Opportunities

Individuals can create a $1 digital roast postcard from their own GitHub profile, send a $3 physical postcard as a novelty gift, or share the returned referral link after ordering. The important outputs are `reveal`, which provides the digital experience, `id`, which identifies the order, and `arrives`, which gives physical-delivery context when available.

## Business Use Opportunities

Businesses can use Papercut for opt-in developer relations, conference follow-ups, open-source contributor recognition, recruiting touchpoints, and team morale moments. The endpoint fields make these workflows concrete: `github_username` anchors the personalization, `type` controls cost and fulfillment mode, physical address fields support mail, and `reveal` gives an immediate artifact even before a physical postcard arrives.

## Endpoint Group Summaries

### GitHub Profile Roast Prep

`GET /api/github/{username}` is the official profile lookup step. It returns a broad `user` object and `profileReadme` so an agent can write a roast from Papercut-provided context instead of calling GitHub directly. The endpoint is useful for validating usernames and deciding whether there is enough public profile material before any paid order. Full details: [`api-uses/github-profile-roast-prep.md`](api-uses/github-profile-roast-prep.md).

### Postcard Ordering And Fulfillment

`POST /api/send` is the single paid MPP endpoint. It accepts `roast`, `github_username`, `type`, optional physical address fields, and optional `ref`, then returns processing status, order id, reveal URL, optional arrival estimate, and referral URL. Full details: [`api-uses/postcard-ordering-and-fulfillment.md`](api-uses/postcard-ordering-and-fulfillment.md).

## Field And Data Themes

Papercut's data model is small and task-specific. The prep endpoint centers on GitHub identity and public profile content. The send endpoint centers on creative content (`roast`), fulfillment choice (`type`), mailing address fields for physical orders, payment metadata, and post-order links (`reveal`, `referral`). The strongest workflows use the free lookup endpoint to avoid malformed or low-context paid orders, then call the paid endpoint only after explicit confirmation.
