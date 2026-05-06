# StableStudio: Generation Job Lifecycle API Uses

## What This Endpoint Group Does

These endpoints manage async generation jobs after a paid image or video request returns a `jobId`. They let an authenticated wallet list jobs, poll a single job, retrieve temporary result URLs, and soft-delete failed jobs.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/jobs` | List jobs for authenticated user | `SIGN-IN-WITH-X`, optional `limit`, optional `status` | Job list, exact wrapper not documented |
| GET | `/api/jobs/:jobId` | Poll job status and retrieve result | `jobId`, `SIGN-IN-WITH-X` | `status`, `result.imageUrl` or `result.videoUrl`/`thumbnailUrl` |
| DELETE | `/api/jobs/:jobId` | Soft-delete a failed job | `jobId`, `SIGN-IN-WITH-X` | Response body not documented |

## Field Notes

### Inputs

All job routes require `SIGN-IN-WITH-X`. The status route and delete route use `jobId`, which is returned from paid generation endpoints. Docs show list filters such as `limit=20` and `status=complete`.

### Outputs

Docs show completed image jobs returning `result.imageUrl`; videos return `result.videoUrl` and `thumbnailUrl`. The OpenAPI does not include detailed 200 response schemas for these routes, so the inventory marks job fields as docs-derived.

### Important Constraints Or Gaps

Returned result URLs expire after roughly 20 minutes. Images should be polled every 3 seconds with a 2 minute timeout; videos every 10 seconds with a 10 minute timeout. Full job-list schema, failed-job schema, and delete response body are not documented.

## Use Cases

### Reliable Async Retrieval

A user can submit paid jobs and poll by `jobId` until completion instead of blocking on model latency. A business can run queue workers that treat `status`, `imageUrl`, `videoUrl`, and `thumbnailUrl` as the handoff from generation to review, storage, or publishing.

The key operational requirement is to download final assets quickly because URLs expire. The job route is the bridge between payment and usable media.

### Spend And Production Audit Trail

A team can log generation route, model, prompt category, payment estimate, `jobId`, final status, and retrieved asset URL. The list endpoint can help reconcile jobs for an authenticated wallet, especially when multiple automations submit work.

The API does not expose full billing history or quality metrics, so finance-grade reporting would need payment records from the wallet/MPP layer and internal review metadata.

### Human Review Queues

A creative operations system can poll jobs and move completed assets into a review queue. Images and videos can be presented with their prompt, model, cost, and result URL before publication.

This supports concrete decisions: approve, regenerate with a different model, escalate to manual editing, or reject. The missing field is an explicit failure reason schema for rejected or failed jobs.

### Cleanup Of Failed Work

The delete route is scoped to failed jobs. A user or business can remove failed items from a workspace or internal queue once they have been logged and reconciled.

Because the delete response body and retention behavior are not documented, deletion should be treated as workspace cleanup rather than durable audit deletion unless verified under explicit approval.
