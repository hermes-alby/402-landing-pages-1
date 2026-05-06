# Stability AI: Async Result Retrieval API Uses

## What This Endpoint Group Does

This endpoint polls the output of asynchronous MPP operations. The MPP docs specifically mention creative upscaling and replace-background-and-relight as operations that return an async id and require result polling.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/stability-ai/result` | Poll an async generation result. | `id` | Final async result or status; exact schema not documented. |

## Field Notes

### Inputs

The only documented request field is `id`, the async generation id returned by the initiating call.

### Outputs

The MPP OpenAPI lists a generic 200 response and a 402 response, while the MPP markdown docs call the endpoint free. It does not document status fields, error fields, result URLs, binary payloads, or expiration behavior.

### Important Constraints Or Gaps

This endpoint is a support endpoint, not a generation endpoint. It is only useful when paired with an initiating async operation. The caller needs to store the initiating request, id, paid operation, and local job state because the result response schema is not documented.

## Use Cases

### Reliable Async Job Completion

A personal creative tool can submit a creative upscale or background relight request, show a pending state, and poll `/stability-ai/result` until the output is available. A business workflow can enqueue paid media operations and decouple user interaction from model latency.

The `id` field is the key bridge between the paid initiating request and final media retrieval. Without documented status fields, callers should implement conservative polling, timeouts, and user-visible failure states.

### Cost-Aware Media Pipelines

A platform can charge or allocate credits when the initiating operation is submitted, then use the free result endpoint to retrieve output without creating a second paid media request. This is useful for expensive operations like creative upscale.

The workflow should store the payment metadata from the initiating endpoint, the `id`, and request parameters locally. That makes audit and retry handling possible even if the result response does not echo all metadata.

### Batch Processing With Human Review

A team can run multiple async background or upscale jobs and collect completed outputs into a review queue. The result endpoint lets the application separate generation from approval, so reviewers only see finished candidates.

This enables operational workflows such as ecommerce image review or agency creative QA. The missing dependency is a documented lifecycle: without status names and expiration windows, the batch system must handle unknown, failed, and expired ids explicitly.
