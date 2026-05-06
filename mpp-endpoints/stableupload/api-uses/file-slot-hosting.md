# StableUpload: File Slot Hosting API Uses

## What This Endpoint Group Does

This group buys a paid file upload slot and returns everything needed to upload and share the file: the upload method, upload URL or POST form fields, upload URL expiry, public URL, public URL expiry, maximum size, transaction hash when available, and a curl example. It is useful when a person, agent, or system needs one file-hosting operation without creating a storage account, bucket, API key, or subscription.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/upload` | Buy a file upload slot and receive a file upload target plus public URL. | `filename`, `contentType`, `tier`, optional `policyTtlSeconds` | `uploadId`, `uploadUrl`, `uploadMethod`, `postUrl`, `postFields`, `publicUrl`, `expiresAt`, `maxSize`, `curlExample` |

## Field Notes

### Inputs

`filename` and `contentType` describe the object that will later be uploaded. `tier` controls size, price, and retention; StableUpload documents 6-month tiers for durable user-visible links and `short-*` 7-day tiers for temporary workflow artifacts. `policyTtlSeconds` controls how long the upload target remains usable, from 60 to 86400 seconds.

### Outputs

`uploadMethod` determines whether the caller should PUT raw bytes to `uploadUrl` or POST multipart data to `postUrl` with every `postFields` entry. `publicUrl` is the file URL to store, share, or pass downstream, and `expiresAt` is the durable availability boundary. `uploadUrlExpiresAt` is separate and only governs the upload handoff window.

### Important Constraints Or Gaps

This is a paid x402/MPP endpoint; this research did not call it. S3 enforces content type and max size before storing bytes. Public links should not use `short-*` tiers when a user expects durable access. The OpenAPI does not document exact payment headers or all S3 error cases.

## Use Cases

### Agent Artifact Handoff

A person using an AI agent can buy a short-term upload slot for a generated PDF, spreadsheet, image, or model output, then let the agent upload using the returned `uploadMethod`, `uploadUrl`, `postUrl`, and `postFields`. The useful decision fields are `maxSize`, `uploadUrlExpiresAt`, and `publicUrl`: the agent can verify the artifact fits the paid tier, upload before the target expires, and pass a stable URL to the next tool or user.

For a business workflow, this supports accountless handoff between systems that do not share a storage account. A report-generation job can reserve `short-100mb`, hand the POST fields to a downstream renderer, and store only `uploadId`, `publicUrl`, and `expiresAt` in the job record. The limitation is retention: a short tier is appropriate for workflow transfer, not customer-facing archives.

### Customer-Support File Delivery

A support agent can create a one-off hosted link for a log bundle, diagnostic screenshot, or replacement file without adding the customer to an internal storage system. `contentType` keeps the hosted object interpretable, while `expiresAt` gives the support team a clear deadline to include in the ticket.

For a company, this can reduce operational friction for low-volume file delivery. The per-slot cost and `maxSize` fields make the workflow auditable: a helpdesk integration can choose the cheapest tier that fits the file and record the `txHash` when returned. The compliance caveat is that public URLs are public until expiry, so sensitive files still need policy review outside this API.

### Temporary Build Or Media Assets

A developer can host a one-off build artifact, demo video, dataset sample, or generated image for a few days using a `short-*` tier. `policyTtlSeconds` matters when a later process will upload the actual bytes; it can be extended within the documented range so the downstream uploader has enough time.

For businesses, this is valuable in CI, QA, or creative-review pipelines where artifacts are useful briefly and then should disappear. The output fields support automation: store `publicUrl` in a pull request comment, use `expiresAt` to clean references, and reject artifacts whose size exceeds `maxSize` before paying for another slot.

### No-Account Static Asset Publishing

A person can publish a public image, downloadable asset, or one-page attachment without opening a storage provider account. The API returns a direct `publicUrl`, and the `curlExample` reduces integration ambiguity for manual or scripted upload.

For a business, this can back small campaign operations or internal tools that need occasional hosted assets. The main value is exact per-use purchasing: tier choice encodes expected size and retention. The gap is access control; the endpoint provides public file hosting, not signed download authorization.
