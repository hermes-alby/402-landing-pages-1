# Browserbase: Browser Session Lifecycle API Uses

## What This Endpoint Group Does

This endpoint group creates and manages one prepaid cloud browser session at a time. The core workflow is: request a paid session with `estimatedMinutes`, complete the x402/MPP payment flow, receive a `sessionId` and `connectUrl`, connect an automation client such as Playwright or Puppeteer, monitor remaining prepaid time, optionally buy more time with `additionalMinutes`, and terminate the session when the work is done.

The useful data is mostly operational and budgetary. `connectUrl` is the handoff into the browser runtime. `sessionId` is the handle for status, extension, and termination. `paidMinutes`, `expiresAt`, `usage.minutesPaid`, `usage.minutesUsed`, `usage.minutesRemaining`, `pricing.amountPaid`, and `refund` fields let an agent or application decide whether to continue, extend, stop, retry, or record cost against a task. This is narrower than the full Browserbase API: direct session configuration fields such as `region`, `timeout`, `proxies`, `browserSettings`, `keepAlive`, `contextId`, and `userMetadata` exist in first-party docs, but are not clearly accepted by the MPP/x402 browser-session create endpoint.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/browser/session/create` | Create a prepaid browser session and return a browser connection URL after payment. | Body `estimatedMinutes`; x402/MPP payment header after the first `402` response. Direct API fields such as `region`, `timeout`, `proxies`, and `browserSettings` are not documented for this wrapper path. | `sessionId`, `connectUrl`, `paidMinutes`, `expiresAt`, `pricing.ratePerHour`, `pricing.amountPaid`, `pricing.currency`; initial `402` payment requirements include `accepts[].scheme`, `network`, `asset`, `maxAmountRequired`, `payTo`, and `resource`. |
| `GET` | `/browser/session/:id/status` | Check whether an active prepaid session still has usable time. | Path `id` / `sessionId`. | `sessionId`, example `status: active`, `usage.minutesPaid`, `usage.minutesUsed`, `usage.minutesRemaining`, `expiresAt`. |
| `POST` | `/browser/session/:id/extend` | Add prepaid time to an active session. | Path `id`; body `additionalMinutes`; another x402/MPP payment is required. | The docs show the payment requirement concept but do not document the paid success response for this endpoint. |
| `DELETE` | `/browser/session/:id` | End a prepaid session early according to the MPP feed. | Path `id`. | x402 quickstart termination response fields include `sessionId`, `finalStatus: terminated`, `usage.minutesPaid`, `usage.minutesUsed`, and optional `refund.eligible`, `refund.amount`, `refund.currency`. |

## Field Notes

### Inputs

- `estimatedMinutes` is the main create-time control. It represents prepaid session duration in minutes. Browserbase publishes 5, 15, 30, and 60 minute x402 price examples, but the docs do not state exact allowed values, rounding rules, or validation behavior for other durations.
- `additionalMinutes` is the extension control for an active session. It requires another payment, but the x402 quickstart does not show the success response after that payment.
- `id` in the path is the `sessionId` returned by create. It is the only documented selector for status, extension, and termination in the x402 examples.
- The x402 payment flow requires Base USDC and an `X-PAYMENT` header after the first `402 Payment Required` response. The local MPP feed uses `https://mpp.browserbase.com`, while Browserbase's x402 docs use `https://x402.browserbase.com`.
- Direct Browserbase create-session fields such as `projectId`, `extensionId`, `browserSettings`, `timeout`, `keepAlive`, `proxies`, `region`, and `userMetadata` should not be assumed to work on the MPP/x402 create endpoint unless separately verified.

### Outputs

- `connectUrl` is the operationally important output: it is the WebSocket URL used by Playwright or Puppeteer to attach to the remote browser.
- `sessionId` is the lifecycle handle for later status checks, extension requests, and termination.
- `paidMinutes`, `expiresAt`, `pricing.ratePerHour`, `pricing.amountPaid`, and `pricing.currency` let a caller record the initial prepaid budget and expected expiry.
- Status responses expose `usage.minutesPaid`, `usage.minutesUsed`, and `usage.minutesRemaining`, which are enough to build countdowns, extension thresholds, task cancellation rules, and cost attribution.
- Termination responses in the x402 quickstart expose `finalStatus`, final usage, and optional `refund` data. The refund example should be treated cautiously because the public snapshot does not define eligibility or calculation rules, and the example amount appears inconsistent with the published hourly rate.
- Direct Browserbase status enums are `PENDING`, `RUNNING`, `ERROR`, `TIMED_OUT`, and `COMPLETED`; the x402 status example uses `active`. Consumers should not hard-code only one enum family without wrapper-specific confirmation.

### Important Constraints Or Gaps

- No paid endpoints were called, no wallet messages were signed, no Browserbase account was registered, and no browser sessions were created for this artifact.
- There is base URL drift: the assigned MPP service URL is `https://mpp.browserbase.com`, but Browserbase's public x402 documentation names `https://x402.browserbase.com`.
- There is termination drift: the MPP feed lists `DELETE /browser/session/:id`; the x402 quickstart documents `POST /browser/session/:id/terminate`; the direct Browserbase API releases sessions with `POST /v1/sessions/{id}` and body `status: REQUEST_RELEASE`.
- The extension endpoint's paid success response is undocumented in the retrieved x402 quickstart. A client can know it needs `additionalMinutes` and another payment, but cannot rely on exact returned fields from public docs alone.
- Browserbase x402 pricing is published as 5 minutes for $0.01, 15 minutes for $0.03, 30 minutes for $0.06, and 60 minutes for $0.12. Browserbase plan docs also say browser time has a one-minute minimum and is billed by the minute with the first minute rounded up, but the exact mapping to x402 refunds and arbitrary durations is not fully documented.
- Browserbase concurrency and session creation limits exist in first-party plan docs. They are listed as Free 3 concurrent / 5 sessions per minute, Developer 25 / 25, Startup 100 / 50, and Scale 250+ / 150+, but the public snapshots do not explain whether accountless x402 sessions share those same buckets or have separate wrapper limits.
- Status and termination endpoints have no payment metadata in the local MPP feed, and their auth model is not described beyond possession of the `sessionId`.
- Full Browserbase observability features such as recordings, logs, network inspection, session lists, contexts, extension upload, and project-level usage dashboards are direct API or dashboard features, not exposed by this MPP endpoint group.

## Use Cases

### Accountless One-Off Browser Automation

A person can run a short browser task, such as collecting screenshots, checking a JavaScript-heavy page, or testing a personal automation idea, without opening a Browserbase account. They would create a session with `estimatedMinutes`, pay through x402, connect Playwright or Puppeteer to `connectUrl`, then use `GET /browser/session/:id/status` to watch `usage.minutesRemaining` and `expiresAt`. When finished, they can terminate the session and record `usage.minutesUsed` and any `refund` fields if the wrapper returns them.

A business team can use the same flow for prototypes, evaluations, demos, or rare internal automations where a recurring plan is premature. The value is that `pricing.amountPaid`, `paidMinutes`, and status usage fields make each trial cost visible at task level. The limitations are material: this requires a wallet with Base USDC, still involves payment, and the public docs do not confirm whether advanced direct API controls such as region, proxies, contexts, or custom browser settings are available through the MPP/x402 create path.

### Spend-Bounded Autonomous Agent Runtime

An agent can treat `estimatedMinutes` as a hard initial budget for a browser run. It creates a session, stores `sessionId`, connects through `connectUrl`, and periodically checks `usage.minutesRemaining`. If the task is close to completion, the agent can continue. If remaining time is low and the expected value is still high, it can request approval or policy permission to call `/browser/session/:id/extend` with `additionalMinutes`. If the task is done or no longer worth the cost, it can terminate the session.

For businesses, this enables per-job browser budgets for research agents, QA agents, or web operations agents. The fields support useful controls: stop when `minutesRemaining` falls below a threshold, attribute `pricing.amountPaid` to a job or customer, and use `finalStatus` plus final `usage` to audit whether agents are overbuying time. The gap is that extension success fields are not documented, so production automation should follow extension with a status check rather than assuming what the extension response contains.

### Interactive QA And Release Smoke Checks

A developer can create a short-lived browser session before a release and run Playwright smoke checks against flows that require real browser behavior, JavaScript execution, navigation, cookies, or screenshots. `connectUrl` is the connection point, `expiresAt` bounds the run, and `status` plus `usage.minutesRemaining` tell the test harness whether it should finish, extend, or fail fast before the browser disappears.

A business can use the same pattern for lightweight production monitoring or customer-critical checkout/login checks without maintaining a browser cluster. The main value is operational confidence from an isolated remote browser plus explicit minute-level cost. The main constraints are concurrency/session creation limits, the one-minute minimum, and the fact that this MPP group does not expose direct Browserbase recording, logging, or network-inspector retrieval endpoints. Those may exist in the broader first-party product, but they are not part of this group.

### Queue-Based Batch Browsing

A personal script or small team can process a list of pages by creating one paid browser session per item or per small batch, storing each `sessionId`, then using status responses to decide whether to wait, extend, or abandon jobs. `expiresAt` and `usage.minutesRemaining` are enough to drive a simple lease model: do not start a new navigation when the remaining lease is too short, and terminate early when work finishes before the prepaid window ends.

For businesses, this is useful for research crawls, lead-site inspection, visual checks, or browser-only data collection where pages need JavaScript or interactive automation. The fields help coordinate workers and keep cost visible, but the group does not provide queue primitives, retry headers, or a list-sessions endpoint. Browserbase docs say session creation can return `429` when concurrency or creation limits are reached, so a batch scheduler should rate-limit creates and treat wrapper limit behavior as an open question until tested with explicit paid-call approval.

### Crypto-Native App-Embedded Browser Tasks

A crypto-native app can let users pay directly for a browser session from a wallet and receive a `connectUrl` for an automation task, without the app proxying a Browserbase API key or managing per-user subscription billing. The `402` response's `accepts[]` fields tell the client what asset, network, recipient, and maximum amount are required; the create response then gives the user a concrete `sessionId`, `paidMinutes`, and `expiresAt`.

For a business building agent marketplaces or wallet-native developer tools, this supports pass-through browser infrastructure where each user or agent pays for its own session. The returned pricing and usage fields support receipts, user-visible countdowns, and dispute handling. The limitations are payment-specific: Base USDC is required, signed payment headers are required, and this research did not sign or submit any payment.

### Procurement And Plan-Fit Evaluation

An individual developer can use short x402 sessions to decide whether managed browsers solve their problem before adopting a Browserbase plan. They can record `estimatedMinutes`, `paidMinutes`, `pricing.amountPaid`, actual `usage.minutesUsed`, and task outcome across several trials to estimate whether a recurring plan or direct API account would make sense.

A business can use the same lifecycle data for an initial cost model: compare per-task x402 usage against published Browserbase plans, included browser hours, overage rates, concurrency, session duration, and session creation limits. This endpoint group does not expose organization dashboards or full usage history, so the evaluation depends on the caller logging session responses locally. It also cannot validate advanced plan-gated features such as Verified mode unless the relevant proof or direct-plan capability is separately available.

### Controlled Cleanup For Long Or Fragile Runs

A person running a long browser automation can poll status and terminate intentionally when they see that the script has completed, failed, or is unlikely to finish before `expiresAt`. This is especially useful when local code crashes or disconnects: the lifecycle API gives the script an external cleanup handle through `sessionId`, not only the in-browser `browser.close()` call.

For businesses, explicit cleanup reduces wasted browser minutes and leaves better audit records. A worker can write final `usage.minutesPaid`, `usage.minutesUsed`, `finalStatus`, and any `refund` fields into job logs. The documentation drift matters here: callers should confirm whether the deployed MPP endpoint expects `DELETE /browser/session/:id` or the x402-documented `POST /browser/session/:id/terminate` before relying on automated cleanup in production.
