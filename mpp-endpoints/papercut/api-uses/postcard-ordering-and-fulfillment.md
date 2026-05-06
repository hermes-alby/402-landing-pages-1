# Papercut: Postcard Ordering And Fulfillment API Uses

## What This Endpoint Group Does

This endpoint group creates the actual Papercut order. It accepts a finished roast, the target GitHub username, a choice of digital or physical postcard, optional physical shipping fields, and an optional referral wallet. It returns an order id, processing status, reveal link, optional physical arrival estimate, and referral link. This is the service's single paid MPP endpoint.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/send` | Create and fulfill a paid digital or physical agent-penned postcard. | `roast`, `github_username`, `type`, physical address fields for physical orders, optional `ref` | `status`, `id`, `message`, `arrives`, `reveal`, `referral` |

## Field Notes

### Inputs

Required fields are `roast`, `github_username`, and `type`. `roast` must be no more than 280 characters and should be lowercase, funny, and not cruel. The docs prohibit secrets, API keys, emails, URLs, or file paths in the roast. `github_username` must match the GitHub username pattern. `type` is either `digital` or `physical`.

For physical postcards, the docs require `name`, `address_line1`, `city`, `state`, `zip`, and `country`; `address_line2` is optional. `country` should be a two-letter ISO country code and defaults to `US` in the OpenAPI schema. `ref` is an optional referral wallet address and must not be fabricated.

### Outputs

The success response returns `status` with documented value `processing`, an order `id`, a confirmation `message`, a required `reveal` URL, optional `arrives` for physical delivery, and optional `referral` URL. The reveal page is the key output for digital fulfillment and for tracking art that takes about 60 seconds to generate.

### Important Constraints Or Gaps

This endpoint is paid and mutating. It should only be called after explicit user confirmation and with an MPP/x402-capable payment client. The OpenAPI payment metadata lists a range from $1 to $3, protocols `mpp` and `x402`, and x402 USDC on `eip155:8453`. The skill states that payment settles on-chain before fulfillment and that there are no automatic refunds if generation fails after payment. Shipping coverage, exact delivery SLA, carrier, and detailed refund handling are not documented.

## Use Cases

### Personal Digital Roast Keepsake

An individual can turn their GitHub profile into a quick digital postcard for $1. The agent uses `roast`, `github_username`, and `type=digital`, then returns the `id`, `reveal`, and `referral` fields after payment. The reveal link is the meaningful output: it gives the user a shareable destination where art updates after about 60 seconds.

This is useful when the goal is lightweight entertainment with minimal commitment. The user should confirm the order before payment, and the agent should not display the roast in chat if following Papercut's official flow.

### Physical Developer Gift

A person can send a physical postcard to themselves or another consenting recipient by using `type=physical` and providing the required mailing fields. The response's `arrives` field adds fulfillment context, while `reveal` gives immediate digital value while the mailed postcard is pending.

For personal use, this turns a small GitHub joke into a tangible keepsake. The main prerequisites are a valid address, a two-letter country code, explicit confirmation, and acceptance of the no-automatic-refund limitation after payment settlement.

### Developer Relations Campaigns

A developer relations team could send opt-in Papercut postcards to hackathon winners, open-source contributors, beta testers, or conference visitors. The endpoint fields map directly to campaign operations: `github_username` identifies the recipient context, `type` controls cost and fulfillment mode, physical address fields drive shipping, and `id` plus `reveal` support follow-up tracking.

The business value is a memorable, low-cost touchpoint that can be sent by an agent without creating a subscription or API-key workflow. Teams should maintain consent records and avoid using roast content in ways that could be interpreted as harassment or discriminatory evaluation.

### Recruiting Follow-Up With A Novel Artifact

After a candidate opts in, a recruiting team could send a digital or physical Papercut postcard as a playful follow-up. The key fields are `roast`, `github_username`, and either `type=digital` for fast low-cost delivery or `type=physical` plus address fields for a mailed artifact.

The response lets the recruiter store `id`, `reveal`, and `arrives` in the recruiting workflow. The value is not candidate assessment; it is a personalized engagement moment. The limitations are important: missing delivery coverage details, no automatic refunds, and the need to keep roast language friendly and appropriate.

### Internal Engineering Recognition

Managers or teammates can send Papercut postcards for launches, retrospectives, promotion moments, or open-source milestones. A digital order can be used for remote teams, while a physical order can turn the joke into mail. The endpoint's `type` field controls the price and experience, and `reveal` gives the team an immediate artifact to share.

For businesses, this is a low-friction recognition workflow that an internal agent can run after explicit approval. The address fields should be handled as personal data, and the roast must be reviewed or constrained so recognition does not become mean-spirited.

### Referral-Driven Social Sharing

Papercut's request accepts an optional `ref` wallet address and the response may return a `referral` URL, with the OpenAPI field description saying the payer can share it to earn 10% on referred orders. A creator or community organizer could use this to share Papercut after sending their own postcard.

The relevant workflow is: place an order, receive `referral`, then share that link in a community or event recap. The limitation is that the referral mechanics are only briefly described in the response field; eligibility, payout timing, fraud rules, and tax handling are not documented in the saved sources.

### Agent Payment Flow Demonstration

Papercut is a compact demonstration of agent-driven paid fulfillment because the endpoint combines user confirmation, structured inputs, dynamic pricing, a 402 challenge, and real-world output. Builders can use the documented fields to design a safe agent workflow without touching broader account setup or subscription billing.

The returned `status`, `id`, and `reveal` fields are enough to show a completed purchase flow, while `arrives` adds a physical fulfillment dimension. This is only appropriate in environments where the user has explicitly approved spend; testing should not call the endpoint unless paid fulfillment is intended.
