# Object Storage API Uses

## Service Summary

Tempo Object Storage exposes a small MPP-paid object-store wrapper at `https://storage.mpp.tempo.xyz`. It is described as S3/R2-compatible storage with dynamic per-size pricing. The practical value is accountless storage for agents: upload a file, list available keys, retrieve the one needed, and delete temporary artifacts without provisioning a Cloudflare account, S3 keys, IAM policy, or a monthly storage workflow.

The service should be treated as a reduced wrapper around object-storage concepts, not as the full Cloudflare R2 S3 API. The public MPP feed lists five endpoints, while the refreshed live `/.well-known/mpp` descriptor lists four and omits `POST /:key` multipart support.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Object Listing And Discovery | 1 | Find available keys, estimate which objects are worth retrieving, and select cleanup targets. | [`api-uses/object-listing-and-discovery.md`](api-uses/object-listing-and-discovery.md) |
| Object Download And Delivery | 1 | Retrieve one object by key for parsing, rendering, handoff, cache validation, or archival. | [`api-uses/object-download-and-delivery.md`](api-uses/object-download-and-delivery.md) |
| Object Upload And Multipart Ingest | 2 | Create or replace objects and potentially manage multipart ingest for larger artifacts. | [`api-uses/object-upload-and-multipart-ingest.md`](api-uses/object-upload-and-multipart-ingest.md) |
| Object Deletion And Cleanup | 1 | Remove temporary, obsolete, or sensitive objects after their workflow value expires. | [`api-uses/object-deletion-and-cleanup.md`](api-uses/object-deletion-and-cleanup.md) |

## Highest-Value Uses

The strongest use is short-lived agent artifact storage. An agent can store generated reports, scraped pages, transformed data, screenshots, or logs, then pass object keys between workflow steps. The fields that matter are object keys, object bytes, content metadata, byte size, ETags, last-modified timestamps, and payment challenge amounts.

The second strongest use is spend-aware retrieval. Because downloads and uploads are dynamically priced by size, listing and metadata fields can help agents avoid blindly retrieving large files. This makes the service useful for agents that need to operate under explicit per-task budgets.

The third strong use is cleanup. Object workflows produce temporary files, and a fixed-price delete endpoint lets agents remove artifacts once a task is complete. This is valuable for hygiene and exposure reduction, though not a substitute for documented compliance retention controls.

## Personal Use Opportunities

- Store generated notes, charts, PDFs, CSVs, and scratch files during an AI-assisted task without setting up a cloud storage account.
- Retrieve one selected object later by key, using content type and size metadata to choose the right parser and avoid large downloads.
- Maintain a lightweight personal handoff space where different tools exchange object keys instead of local files.
- Delete temporary objects after summaries, reports, or exports have been saved elsewhere.

## Business Use Opportunities

- Use Object Storage as an accountless artifact bus between agents in research, support, scraping, enrichment, and reporting workflows.
- Store per-run outputs such as `raw.html`, `normalized.json`, `evidence.csv`, and `final-report.pdf`, then pass keys into review queues or downstream systems.
- Enforce budget policies around object size and dynamic payment challenges before allowing downloads or uploads.
- Attach cleanup steps to workflow completion so stale intermediate artifacts do not accumulate.
- Prototype MPP-paid storage flows before deciding whether to integrate direct R2/S3 credentials and billing.

## Endpoint Group Summaries

### Object Listing And Discovery

`GET /` is the discovery layer. It helps callers find candidate keys, inspect possible metadata such as size or timestamps, and choose what to retrieve or delete. Its main value is budget and state awareness before dynamic download/upload operations.

Full details: [`api-uses/object-listing-and-discovery.md`](api-uses/object-listing-and-discovery.md)

### Object Download And Delivery

`GET /:key` is the read path. It retrieves object bytes after payment and is useful for agent workspaces, report delivery, cache validation, and downstream parsing. Size-based pricing makes preflight listing and approval policies important.

Full details: [`api-uses/object-download-and-delivery.md`](api-uses/object-download-and-delivery.md)

### Object Upload And Multipart Ingest

`PUT /:key` uploads an object body, and `POST /:key` is listed by the manifest/feed as multipart initiation or completion. This group enables agent file drops, generated report publishing, scratch storage, and larger ingest flows, but it has the most unresolved schema risk because no mutation was tested and multipart is missing from live discovery metadata.

Full details: [`api-uses/object-upload-and-multipart-ingest.md`](api-uses/object-upload-and-multipart-ingest.md)

### Object Deletion And Cleanup

`DELETE /:key` removes an object by key. It supports temporary file cleanup, retention workflows, and namespace hygiene. It is fixed-price in the feed and live descriptor, but successful response shape, idempotency, and conditional delete behavior are undocumented.

Full details: [`api-uses/object-deletion-and-cleanup.md`](api-uses/object-deletion-and-cleanup.md)

## Field And Data Themes

- Identifiers: object `key`, `uploadId`, `ETag`, pagination markers, payment recipient, and currency address.
- Content fields: binary object body, `Content-Type`, `Content-Disposition`, `Content-Encoding`, and object key names.
- Quantity fields: object byte size, `Content-Length`, `Range` byte offsets, `max-keys`, part numbers, dynamic payment amount, and fixed amount `100` for list/delete.
- Freshness and cache fields: `Last-Modified`, `ETag`, conditional headers, and possible list timestamps.
- Payment fields: MPP charge/session intent, currency `0x20c000000000000000000000b9537d11c60e8b50`, amount, chain ID, fee payer flag, and recipient address.
