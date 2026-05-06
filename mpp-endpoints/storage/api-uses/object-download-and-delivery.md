# Object Storage: Object Download And Delivery API Uses

## What This Endpoint Group Does

This group covers paid object retrieval. `GET /:key` accepts an object key and returns the stored object bytes after an MPP payment. The mpp.dev feed and live descriptor both indicate dynamic pricing by object size, so download decisions should be made with attention to object size, content type, and whether partial or conditional reads are supported.

The successful response schema is not public, but S3/R2-compatible retrieval normally returns the object body plus HTTP metadata such as `Content-Type`, `Content-Length`, `ETag`, and `Last-Modified`. Cloudflare R2 also supports range and conditional retrieval headers for `GetObject`; Tempo has not documented whether its wrapper forwards them.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `GET` | `/:key` | Download one object by key. | `key`; optional compatibility-derived `Range`, `If-Match`, `If-None-Match`, `PartNumber`. | Object bytes; likely `Content-Type`, `Content-Length`, `ETag`, `Last-Modified`; unpaid requests return 402 payment metadata. |

## Field Notes

### Inputs

The confirmed input is the `key` path segment. Compatibility-derived inputs include a byte `Range` header for partial reads, conditional headers for cache-safe reads, and `PartNumber` for multipart objects. These fields would be valuable for cost control and cache validation, but wrapper support is unresolved.

### Outputs

The central output is the binary object body. Metadata headers such as `Content-Type` and `Content-Length` let an agent choose a parser and estimate downstream processing cost. `ETag` and `Last-Modified` allow cache validation, duplicate detection, and provenance tracking.

### Important Constraints Or Gaps

No paid object was downloaded. The safe public `GET /example-key` sample returned a 402 challenge with amount `100`, but the service still describes downloads as dynamic by size. Object-not-found behavior, conditional reads, range reads, and repeated-download billing are not documented.

## Use Cases

### On-Demand Retrieval For Agent Workspaces

A personal agent can store generated files during a task and retrieve a selected artifact later by key, such as `notes/final-summary.md` or `images/chart.png`. `Content-Type` helps choose whether to parse the body as text, JSON, image bytes, or another format, while `Content-Length` helps avoid unexpectedly large downloads.

For a business, this enables accountless handoff between agents. A scraper can upload raw pages, an extractor can download one key for structured processing, and an analyst agent can retrieve only the final report. The key is the workflow identifier, and metadata fields support caching, provenance, and cost-aware retrieval.

### Dynamic Cost Control For Large Artifacts

Because download pricing is size-based, an agent can combine listing and download metadata to choose the cheapest useful artifact. A personal user might download a small `summary.json` instead of a large `raw-video.mp4` when asking for a quick answer.

Businesses can place retrieval policies around byte size and content type. For example, a compliance review system can allow small text downloads automatically but require human approval for large binary files. This is valuable only if the caller can see or infer size before paying; the current wrapper docs do not guarantee pre-payment size metadata.

### Cache Revalidation And Reproducible Reports

If the wrapper exposes `ETag` and `Last-Modified`, an agent can avoid re-downloading unchanged objects. A personal knowledge agent can check whether `journal/export.json` changed before paying for another retrieval.

For a company, ETags and timestamps help make report generation reproducible. A downstream report can record the object key, ETag, and last-modified time used for each source artifact. Later audits can determine whether a result came from the same object version or a newer upload.

### Partial Reads For Preview Or Chunked Processing

If `Range` is supported, a user could preview the first bytes of a large text, CSV, or archive object before paying for or processing the whole file. That enables lightweight inspection of headers, schemas, or magic bytes.

A business pipeline could chunk large objects for downstream processors, retrieving only the byte ranges needed for indexing or resumable processing. This would be especially useful for logs, datasets, and media files, but support is compatibility-derived and not confirmed by the Tempo wrapper.
