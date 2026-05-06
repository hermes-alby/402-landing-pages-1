# 2Captcha: CAPTCHA Task Lifecycle API Uses

## What This Endpoint Group Does

This endpoint group covers the complete asynchronous CAPTCHA-solving lifecycle exposed by the MPP wrapper. `createTask` accepts a CAPTCHA task object and returns a `taskId`; `getTaskResult` uses that `taskId` to check whether the task is still `processing`, completed with a task-specific `solution`, or failed with an error code.

The group is valuable when a workflow needs a structured answer to a CAPTCHA challenge: decoded image text, a reCAPTCHA response token, a Cloudflare Turnstile token, an Arkose Labs/FunCaptcha token, or related metadata. The output also carries operational signals such as `cost`, `createTime`, `endTime`, `solveCount`, and errors, which are useful for retry policy, budget control, and quality monitoring.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/createTask` | Submit a CAPTCHA-solving task and receive a task ID. | `task.type`, `task.body`, `task.websiteURL`, `task.websiteKey`, `task.websitePublicKey`, Turnstile challenge fields, proxy fields, `languagePool`, `callbackUrl` | `taskId`, `errorId`, `errorCode`, `errorDescription` |
| POST | `/getTaskResult` | Poll a submitted task until processing, ready, or failed. | `taskId`; provider docs also list `clientKey` | `status`, `solution.text`, `solution.token`, `solution.gRecaptchaResponse`, `solution.userAgent`, `cost`, `createTime`, `endTime`, `solveCount`, errors |

## Field Notes

### Inputs

The central input is `task`, whose shape depends on `task.type`. Image-to-text tasks use `body` for a Base64 image and optional hints such as `phrase`, `case`, `numeric`, `math`, `minLength`, `maxLength`, `comment`, and `imgInstructions`. Token-based tasks use target-page fields such as `websiteURL`, `websiteKey`, or `websitePublicKey`. More complex challenge pages may require browser-derived fields: Turnstile challenge pages use `action`, `data`, and `pagedata`; Arkose Labs/FunCaptcha can use `funcaptchaApiJSSubdomain`, JSON-stringified `data`, and `userAgent`.

Proxy-backed task variants add `proxyType`, `proxyAddress`, `proxyPort`, `proxyLogin`, and `proxyPassword`. Provider docs say proxies can be important when the CAPTCHA must be solved from the same IP address as the page load, especially for some protection pages. The polling input is `taskId`, created by the submission endpoint.

### Outputs

`createTask` returns `taskId` when accepted. `getTaskResult` returns `status: processing` while the solver is still working, or `status: ready` with a task-specific `solution`. Image CAPTCHAs can return `solution.text`; token challenge tasks can return `solution.token` or `solution.gRecaptchaResponse`; Turnstile challenge-page responses can include a `solution.userAgent` that must be paired with the token. The common completion fields `cost`, `ip`, `createTime`, `endTime`, and `solveCount` support internal monitoring and post-run analysis.

### Important Constraints Or Gaps

2Captcha's provider docs require `clientKey`, but the MPP wrapper's public metadata does not explain whether MPP clients still send an upstream key or whether the wrapper handles provider authentication internally. The wrapper also lacks a public OpenAPI schema in the fetched `openapi.json` location. Use cases should therefore treat field schemas as provider-derived and wrapper-compatible only to the extent suggested by mirrored endpoint paths.

The provider recommends waiting at least 5 seconds before polling, 10-20 seconds for reCAPTCHA, and then retrying unresolved tasks every 5 seconds. Image-to-text docs list JPEG, PNG, and GIF support, a 100 kB max file size, and 1000 px max image side. Some source wording differs in the error-code page, so callers should preserve error details instead of assuming a single static limit.

## Use Cases

### Authorized QA For CAPTCHA-Protected Sign-Up Or Checkout

A QA team can use the lifecycle endpoints in a controlled staging or owned production test environment to exercise flows that are protected by reCAPTCHA, Turnstile, or image CAPTCHAs. `createTask` takes the page URL and sitekey/public key or the test image body, then `getTaskResult` returns the token or text needed to continue the scripted test. `createTime`, `endTime`, `solveCount`, and error fields let the team separate application failures from CAPTCHA-provider delays or unsolved challenges.

For a business, this makes regression suites more realistic without disabling CAPTCHA protections globally. The constraints are important: tests should run only on owned or explicitly authorized properties, polling must respect documented wait intervals, and MPP/provider cost should be tracked from both wrapper payment metadata and returned task `cost` where available.

### Browser Automation Recovery For Legitimate Internal Operations

Some internal operations still pass through third-party web portals that an organization is authorized to access, but where CAPTCHA challenges interrupt robotic process automation. The task lifecycle can let an agent pause when a challenge appears, send the relevant `websiteURL`, `websiteKey`, token challenge fields, or image `body`, then resume when `solution.token` or `solution.text` is ready.

The business value is reduced manual intervention for repetitive workflows such as authorized vendor-portal checks or internal data entry. The limiting factor is policy: the organization needs permission to automate the target site, and some challenges need IP matching, cookies, user agent consistency, or proxy fields. If those fields are not available from the automation context, the use case should be rejected or handled manually.

### Accessibility Assistance For Owned Services

A product team can use the API in an accessibility lab to evaluate whether CAPTCHA-protected flows block users who rely on assistive technology. Image CAPTCHAs can be submitted with `body` and optional worker hints; token CAPTCHAs can be tested with page URL and key fields. The output clarifies whether a fallback process can reliably produce `solution.text` or a challenge token under controlled conditions.

For a business, the result helps decide whether to replace CAPTCHA with more accessible defenses, add verified alternatives, or improve support paths. This should be framed as measurement and remediation, not a permanent bypass for users, because CAPTCHA handling can involve sensitive anti-abuse controls and may conflict with site policy.

### Solver Quality And Cost Monitoring

Because `getTaskResult` returns `cost`, `createTime`, `endTime`, `solveCount`, `status`, and error fields, a team can build internal telemetry around completion latency, unsolved rates, and per-task economics. For example, a test harness can record whether Turnstile tasks are slower than image-to-text tasks, or whether proxy-backed tasks have a higher `ERROR_BAD_PROXY` rate.

The personal angle is budget control for a developer or researcher running occasional tests through MPP without a direct 2Captcha account. The business angle is procurement and operational control: returned data can inform retry rules, per-flow budgets, and whether a particular CAPTCHA type is too unreliable for automation.

### CAPTCHA Parameter Extraction Validation

For token-based challenges, most failures happen before solving: the automation must extract the right `websiteKey`, `websitePublicKey`, Turnstile `action`, `data`, `pagedata`, cookies, user agent, or proxy context. A team can use the lifecycle endpoints as a validation loop: submit a candidate task payload, inspect `errorCode` and `errorDescription`, and refine the extraction logic when fields are missing or malformed.

The value is stronger diagnosis than a generic browser failure. If the API returns `ERROR_PAGEURL`, `ERROR_RECAPTCHA_INVALID_SITEKEY`, `ERROR_BAD_PARAMETERS`, or `ERROR_BAD_PROXY`, the caller knows which extraction or environment assumption needs attention. This is still bounded by safety requirements: do not test against sites where the caller lacks authorization.

### Synthetic Monitoring Of Owned CAPTCHA Widgets

Site owners can monitor whether their own CAPTCHA widgets remain solvable in the intended browser environment. A monitor can submit a known staging page's `websiteURL` and `websiteKey`, wait according to the provider's backoff guidance, then check whether the result is `ready` and how long it took.

This helps decide whether a production rollout is likely to cause customer friction. The output fields provide direct operational signals: `endTime - createTime` estimates solver latency, `solveCount` hints at challenge difficulty, and error codes identify bad sitekeys or broken challenge configuration.

### Data Labeling For Small Image Recognition Tasks

The image-to-text task schema can support narrow internal labeling tasks where an image contains human-readable text, a math prompt, or constrained characters. Inputs such as `numeric`, `case`, `math`, `minLength`, `maxLength`, `comment`, and `imgInstructions` let the requester communicate what answer format is expected, while `solution.text` returns the recognized value.

For a business, this can fill gaps in a data cleaning pipeline when OCR fails on distorted but human-readable images. It is not a general OCR or annotation platform replacement: image size limits are tight, the workflow is paid and asynchronous, and the service's CAPTCHA-oriented terms and privacy posture need review before submitting sensitive images.
