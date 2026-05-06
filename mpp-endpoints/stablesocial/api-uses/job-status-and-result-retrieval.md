# StableSocial: Job Status And Result Retrieval API Uses

## What This Endpoint Group Does

Poll paid trigger jobs, enforce wallet ownership, and retrieve pending, finished, or failed result envelopes. The polling endpoint is the common retrieval and access-control step for every paid trigger endpoint.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/jobs` | Poll job status and retrieve results | token | status, message, data, error |

## Field Notes

### Inputs

- `token`

### Outputs

- `status`
- `message`
- `data`
- `error`

Finished social-data payload fields are not documented in the public OpenAPI or `llms.txt`. The usable documented output contract is the async envelope: paid trigger returns `token`; polling returns `status`, optional `message`, `data`, or `error`.

### Important Constraints Or Gaps

- Paid trigger endpoints cost $0.06 and require x402/MPP payment; this research did not call them.
- Successful trigger calls return a job token; users must poll /api/jobs with SIWX wallet authentication to retrieve results.
- Public OpenAPI and llms.txt do not publish field-level schemas for finished social data payloads.
- Pagination uses cursor values and each additional page requires another paid trigger.
- Finished data is endpoint-specific and not field-level documented.

## Use Cases

### Agent-Controlled Async Retrieval

An AI agent can trigger a paid social lookup, store the returned token, and poll with SIWX wallet proof until the job is `finished`, `pending`, or `failed`. This gives a clean control loop for long-running data collection without API keys or accounts. The token expires after 30 minutes, so retries must happen within that window or restart with another paid trigger.

### Wallet-Scoped Result Access

For a business, the polling endpoint acts as a payment receipt and access-control checkpoint: only the wallet that paid for a trigger can retrieve its result. That can simplify internal audit trails for pay-per-request agents, because each job token maps to a wallet-funded action. It also means teams need wallet custody or delegated signing patterns outside StableSocial if multiple systems must read results.

### Failure And Cost Handling

A workflow can distinguish `pending`, `finished`, and `failed` states and avoid treating collection failures as empty data. The docs say failed paid triggers are not charged when the trigger itself fails, while upstream collection failures can appear as errors. Businesses should log token, endpoint, input, status, and error text to preserve schema drift and avoid silently dropping failed records.
