# Object Storage: Object Upload And Multipart Ingest API Uses

## What This Endpoint Group Does

This group covers object creation and larger ingest workflows. `PUT /:key` stores an object body at a key, while `POST /:key` is listed by the manifest and mpp.dev feed as an endpoint to initiate or complete multipart uploads. Both are mutation paths and were not tested.

The mpp.dev feed says `PUT /:key` uses dynamic pricing with a `$0.001 base + $0.01/MB` hint and a 100 MB maximum. The refreshed live `/.well-known/mpp` descriptor confirms `PUT /:key` but omits the formula. `POST /:key` is present in the manifest/mpp.dev feed and absent from the live descriptor, so multipart support should be treated as unresolved until tested with explicit permission.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `PUT` | `/:key` | Upload or overwrite one object. | `key`; binary body; optional metadata headers such as `Content-Type`, `Cache-Control`, `Content-MD5`, `x-amz-storage-class` if forwarded. | Payment challenge; likely ETag or wrapper success response after payment. |
| `POST` | `/:key` | Initiate or complete multipart upload according to mpp.dev feed. | `key`; possible `uploads` or `uploadId` query marker; possible completion `parts[]` body. | Payment challenge; possible `uploadId` for initiation or ETag for completion. |

## Field Notes

### Inputs

`PUT /:key` centers on the key and binary request body. Metadata headers matter because they determine how later downloaders parse or cache the object. `Content-MD5` would support integrity checks, and `x-amz-storage-class` would matter if the wrapper forwards R2 storage class selection.

`POST /:key` likely depends on S3-style multipart fields such as an `uploads` initiation marker, an `uploadId`, and a completion body listing part numbers and ETags. Those fields are inferred from S3 semantics; Tempo has not published its multipart request format.

### Outputs

Useful upload outputs would include an `ETag` for the stored object and, for multipart initiation, an `uploadId`. The MPP payment challenge exposes currency and amount metadata before the operation is paid. No successful mutation response was captured.

### Important Constraints Or Gaps

No upload or multipart call was made because these endpoints mutate storage. The live descriptor lists `PUT /:key` but not `POST /:key`. The exact upload response, metadata support, overwrite behavior, namespace scoping, integrity behavior, and multipart upload process are not publicly documented.

## Use Cases

### Accountless Agent File Drop

A personal agent can upload generated artifacts such as `summary.md`, `receipt.pdf`, or `chart.png` without requiring the user to create a Cloudflare account or issue object-store credentials. The key names the artifact, the body contains the file, and `Content-Type` lets later readers open it correctly.

For a business, this is useful for agent-to-agent handoffs. A web capture agent can upload raw HTML, a data extraction agent can upload normalized JSON, and a reporting agent can download the final object. The value is operational simplicity: each upload is paid per operation instead of requiring a shared cloud account.

### Temporary Workflow Scratch Storage

An individual can use object upload as scratch space for multi-step work: store a draft, retrieve it later, and delete it when the task is complete. Size-based pricing and a 100 MB upload hint push this toward small and medium artifacts rather than bulk archival storage.

Companies can use the same pattern for ephemeral workflow state in environments where provisioning durable cloud buckets is too heavy. A support automation can upload generated attachments or diagnostic bundles for a short-lived case, then hand the key to another tool. The missing retention and namespace rules are important caveats.

### Generated Report And Dataset Publishing

A personal analytics agent can upload a generated CSV, JSON export, or chart image and return the key to the user. The user or another agent can later retrieve the exact artifact. If ETags are returned, the workflow can record integrity metadata.

For businesses, this enables pay-per-run report delivery. A market research pipeline, compliance scan, or sales enrichment job can write its output to object storage and pass a stable key into a notification, CRM note, or review queue. Content type, ETag, and last-modified metadata would make these outputs easier to validate and consume.

### Multipart Ingest For Larger Outputs

If `POST /:key` is live and follows S3-compatible multipart semantics, an agent could initiate multipart upload for larger artifacts, upload parts, and complete the object with part ETags. This would help when generated outputs are too large or unreliable for a single PUT.

For a business, multipart ingest could support large scrape archives, batch exports, or media transformations. The unresolved issue is significant: the manifest lists multipart initiation/completion, but the live descriptor omits it and no public schema explains how individual parts are uploaded or paid.

### Metadata-Aware Object Storage

If metadata headers are forwarded, a user can store objects with useful cache, content disposition, and MIME-type behavior. That prevents later agents from guessing whether a body is JSON, Markdown, PDF, or image data.

Business workflows benefit from consistent metadata because downstream systems can route files automatically. For example, `Content-Type: application/json` can send an uploaded object to a parser, while `Content-Disposition` could preserve a user-facing filename. The wrapper has not confirmed which headers it supports, so production workflows should verify this before depending on it.
