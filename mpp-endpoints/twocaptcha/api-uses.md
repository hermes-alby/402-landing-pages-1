# 2Captcha API Uses

## Service Summary

2Captcha provides a CAPTCHA-solving and image-recognition API. The MPP wrapper exposes the core asynchronous workflow: submit a CAPTCHA task to `createTask`, then poll `getTaskResult` until the task is processing, ready, or failed. The provider supports image-to-text tasks and token-based challenge types such as reCAPTCHA, Cloudflare Turnstile, and Arkose Labs/FunCaptcha.

The most credible MPP value is accountless, pay-per-request access to occasional CAPTCHA-solving tasks and related polling, with the important caveat that wrapper-specific request schemas and upstream API-key handling are not publicly documented.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| CAPTCHA Task Lifecycle | 2 | Submit a CAPTCHA challenge, receive a task ID, poll for text/token solution, and inspect cost/timing/error metadata. | [api-uses/captcha-task-lifecycle.md](api-uses/captcha-task-lifecycle.md) |

## Highest-Value Uses

- Authorized QA for owned sign-up, checkout, and account flows where CAPTCHA must remain enabled during realistic tests.
- Controlled browser automation recovery for internal workflows where the organization has permission to automate the target site.
- Solver quality and cost monitoring using `cost`, `createTime`, `endTime`, `solveCount`, `status`, and error codes.
- Synthetic monitoring of owned CAPTCHA widgets to detect bad sitekeys, slow challenge resolution, or broken page integration.

## Personal Use Opportunities

A developer can use the wrapper for occasional integration tests without managing a direct 2Captcha account balance, provided the MPP wrapper does not require an upstream key. The useful outputs are `taskId` for workflow state, `solution.text` for image CAPTCHAs, token fields for browser challenge continuation, and error details for debugging bad payloads.

The strongest personal use is controlled testing on owned properties or local/staging apps. Public-site bypass automation should be treated as off-limits unless the user has explicit authorization.

## Business Use Opportunities

Businesses can use the workflow for QA automation, accessibility testing, internal RPA under approved site terms, and CAPTCHA parameter extraction validation. Returned cost and timing fields make it possible to build budgets and retry policies instead of treating CAPTCHA handling as a black box.

The group also supports compliance-reviewed experiments around whether CAPTCHA challenges are harming user flows. For owned sites, `ERROR_RECAPTCHA_INVALID_SITEKEY`, `ERROR_PAGEURL`, and latency fields can help diagnose misconfigured widgets before customers hit them.

## Endpoint Group Summaries

### CAPTCHA Task Lifecycle

The lifecycle group combines `POST /createTask` and `POST /getTaskResult`, because submission and polling are one practical unit. `createTask` accepts a task object whose fields depend on CAPTCHA type, while `getTaskResult` returns processing, ready, or error state with task-specific solution data. Full details: [api-uses/captcha-task-lifecycle.md](api-uses/captcha-task-lifecycle.md).

## Field And Data Themes

Key input themes are CAPTCHA type, page identity, challenge keys, optional browser context, proxy context, and image payloads. Key output themes are task identity, solved text/token, provider cost, latency timestamps, solve attempts, and typed errors.

The highest-value fields are `task.type`, `taskId`, `solution.text`, `solution.token`, `solution.gRecaptchaResponse`, `cost`, `createTime`, `endTime`, `solveCount`, `errorCode`, and `errorDescription`.
