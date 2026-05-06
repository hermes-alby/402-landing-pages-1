# Billboard: Billboard Pricing And Posting API Uses

## What This Endpoint Group Does

This endpoint group supports one workflow: check the current price of a public `@MPPBillboard` post, then publish short text to that X account after explicit payment approval. The data surface is intentionally small. The only documented post input is `text`, and the only documented price-check output is a current price plus post number, with response field names omitted from the docs.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/billboard/get-price` | Check current post price and post number before deciding whether to pay. | Empty JSON object in docs example. | Current price and post number are described but not named in the schema. |
| `POST` | `/billboard/post` | Publish a message to `@MPPBillboard` on X. | `text` string, required, max 280 characters. | Success response is undocumented; no confirmed post id or URL field. |

## Field Notes

### Inputs

The paid post endpoint accepts a JSON object with a required `text` string. The docs state that the text is capped at 280 characters, which aligns with standard X post-length expectations. The price endpoint is documented with an empty JSON body.

### Outputs

The price endpoint is documented as returning the current billboard post price and post number. The OpenAPI document does not publish response properties, so clients cannot rely on specific field names from the docs alone. The post endpoint has no documented success response fields, so downstream workflows should not assume they will receive an X post URL, X status id, moderation status, or timestamp.

### Important Constraints Or Gaps

`/billboard/post` is a paid mutation that publishes public content. It should be used only after explicit budget and content approval. The public sources say price starts at `$0.01` and doubles with each post, but they do not document a cap, reset interval, refund policy, moderation policy, idempotency behavior, or failed-post handling. OpenAPI lists `402 Payment Required` for both endpoints, even though `/billboard/get-price` is documented as free and amount `0`.

## Use Cases

### Price-Aware Agent Launch Announcement

A developer launching an agent can have the agent check `/billboard/get-price`, compare the current price against a pre-approved launch budget, and draft a 280-character announcement for `/billboard/post` only when the price is acceptable. The valuable fields are the current price, post number, and proposed `text`; together they let the developer automate the go/no-go decision without giving the agent open-ended spend authority.

For a business, the same pattern supports controlled low-budget product announcements. A release workflow could require human approval for the final text and payment, then publish a short public message after the price check. The main limitation is attribution and measurement: because the response schema does not document a returned X status URL, the business may need to monitor the `@MPPBillboard` profile separately to collect engagement metrics.

### Public Proof Of Agentic Payment

An individual can use Billboard as a visible demonstration that an AI agent can evaluate a price, request authorization, pay, and cause a real-world public output. The price endpoint provides a spending preflight, while the post text can describe the experiment in a compact, auditable way.

For companies building agent payment infrastructure, this is useful as a demo artifact for customers or investors. A successful post is public evidence that the agent payment loop reached an external channel. The gap is that the API does not document a structured receipt, post URL, or timestamp in the success response, so teams should preserve their own payment trace and later source the public post from X for audit records.

### Small Sponsorship Or Marketplace Spot

A creator, indie hacker, or small agent service can use the post endpoint for a one-off sponsorship message without buying a conventional ad campaign. The `text` field is enough for a short tagline, launch link, or call to action, while `/billboard/get-price` lets the user skip the action if the dynamic price has climbed beyond the value of the placement.

For a business marketplace, this can become a controlled promotion slot for new tools, agent services, or community offers. The workflow is simple: generate candidate copy, validate length, check price, approve payment, and publish. The important caveat is compliance and brand safety: content is public, moderation rules are not documented, and X/platform terms still matter.

### Event And Community Shout-Outs

A person attending a hackathon, conference, or online community event can use Billboard to post a short public shout-out at moments when timing matters. The price endpoint helps decide whether the current cost is still worth the visibility, and the `text` field supports concise event-specific copy.

For event organizers, this can support pay-per-message community announcements or sponsor acknowledgments without maintaining a separate social account integration. The lack of response fields means organizers should not depend on the API alone for a published-post permalink; they should plan a separate public profile check if they need the final X URL for recap pages or sponsor reports.

### Budget-Limited Creative Copy Testing

A user can generate several candidate messages locally, validate that each is under 280 characters, and only post the strongest one after checking the current price. The endpoint fields support a strict budget gate: current price and post number determine whether to continue, while `text` carries the selected copy.

For businesses, this enables tiny paid experiments in agent-authored copy. The workflow can compare message variants offline, select one that fits brand rules, and post only when the price is low enough. The main limitation is measurement: Billboard does not expose impressions, clicks, reactions, or downstream conversions, so campaign analysis requires external tracking links or manual X observation.
