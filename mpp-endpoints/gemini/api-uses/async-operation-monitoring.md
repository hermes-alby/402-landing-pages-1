# Google Gemini: Async Operation Monitoring API Uses

## What This Endpoint Group Does

This group polls long-running Gemini operations. It is necessary when a generation, batch, video, or other model workflow returns an operation name instead of a finished result.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/:version/operations/*` | Poll status for a long-running operation. | version, operation wildcard/name | name, done, metadata, error, response |

## Field Notes

### Inputs

The input is the operation resource name, carried through the wildcard path. Google Discovery documents model-scoped operations like `models/{model}/operations/{operation_id}`; the MPP catalog exposes a broader `/:version/operations/*` path, so the wrapper's exact rewrite remains uncertain.

### Outputs

`done` distinguishes in-progress from complete work. When complete, either `error` or `response` is available. `error.code`, `error.message`, and `error.details` support failure handling. `metadata` and `response` are Any-typed, so they can contain service-specific progress or final payload fields.

### Important Constraints Or Gaps

Polling costs 100 catalog units per request, so clients should avoid tight polling loops. The generic Operation schema does not reveal the final response fields for each model-specific job. Operation ownership and expiration behavior are not documented in the MPP feed.

## Use Cases

### Video Generation Job Tracking

A person generating a Veo video can submit the job through the generation endpoint and store the returned operation name. The client can poll `done`, show progress metadata if present, and display either the final response or the error message.

A business can use this for media production queues. Operation polling enables job tables, retry policies, customer notifications, and SLA tracking for generated clips. The workflow should back off polling based on expected generation time to manage MPP polling charges.

### Batch Or Long-Running AI Workflow Orchestration

Developers can treat `Operation.name` as a durable job id for any model action that does not complete synchronously. Personal automations can resume after a laptop sleeps; business systems can persist the operation id in a database and continue from another worker.

The returned `done`, `error`, and `response` fields enable deterministic state transitions: pending, succeeded, failed, or needs human review. Because `response` is untyped, downstream processors should validate the final payload before storing or delivering it.

### Failure Triage And User Messaging

When a job fails, `Status.code`, `message`, and `details` provide a developer-facing explanation. A person can see whether a prompt, media asset, or quota issue caused the failure.

For businesses, structured operation errors can route incidents: prompt errors back to product teams, media-processing failures to intake teams, and quota/rate-limit failures to platform owners. The limitation is that not all service-specific details may be present or user-safe, so applications should sanitize error messages before displaying them to customers.
