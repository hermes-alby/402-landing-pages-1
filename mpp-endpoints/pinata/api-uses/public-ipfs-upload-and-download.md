# Pinata IPFS: Public IPFS Upload And Download API Uses

## What This Endpoint Group Does

This group covers Pinata's account-free public IPFS storage loop through MPP. A caller pays for a signed upload URL by declaring `fileSize` in bytes, uploads the file to that short-lived URL, receives a CID from the downstream Pinata upload flow if the upload response follows Pinata's documented direct upload shape, and later pays a flat per-request amount to retrieve the public file by CID.

The useful abstraction is not a full file-management API. It is a narrow machine-to-machine handoff primitive: pay for one public upload, pass around a content-addressed identifier, and pay for retrieval when needed. There are no MPP endpoints for list, delete, update metadata, private access, gateway management, or analytics.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| `POST` | `/v1/pin/public?fileSize={bytes}` | Get a signed upload URL for a public IPFS file. | `fileSize` in bytes; MPP payment proof in `Authorization` after 402; multipart `file` field sent to returned signed URL. | JSON `url`; downstream upload may return `id`, `name`, `cid`, `size`, `number_of_files`, `mime_type`, and `group_id` based on direct Pinata upload docs, but the MPP docs only document `url`. |
| `GET` | `/v1/pin/public/:cid` | Download a public IPFS file by CID. | `cid`; MPP payment proof in `Authorization` after 402. | Binary/blob file body; `Content-Type`; `Content-Disposition`; `404` when file is not found on IPFS. |

## Field Notes

### Inputs

The upload endpoint's central input is `fileSize`, in bytes. Pinata uses that value for dynamic pricing: `fileSize (GB) x $0.10 x 12 months`, with a $0.01 USDC minimum. After payment, the returned signed URL is used quickly because it is valid for 120 seconds. The quickstart's actual upload uses multipart form data with a `file` field.

The download endpoint's central input is `cid`, the IPFS content identifier. The quickstart examples use `QmYourCid`; Pinata's broader docs also show CIDv1 examples beginning with `bafy...` or `bafk...`.

Both endpoints use the MPP 402 challenge-response flow. The initial request receives a payment challenge; the retry includes payment proof in the `Authorization` header. Tempo CLI and `mppx` automate that flow.

### Outputs

The MPP upload URL response exposes `url`. The quickstart shows extracting `url` and then posting a file to it. Pinata's direct upload docs show upload result fields such as `id`, `name`, `cid`, `size`, `number_of_files`, `mime_type`, and `group_id`, which are the fields a workflow most likely needs after the signed upload finishes. Because the MPP docs do not show the signed URL upload response, consumers should treat those downstream fields as expected Pinata upload context rather than guaranteed wrapper schema.

The download endpoint returns file content, not a JSON metadata object. In TypeScript, the quickstart reads the response as a `Blob`; in the CLI, it saves the response to a file. The MPP overview says the proxy returns correct `Content-Type` and `Content-Disposition` headers.

### Important Constraints Or Gaps

The public MPP docs do not publish an OpenAPI schema, maximum MPP upload size, downstream signed upload response contract, rate limits, payment proof lifetime, signed URL metadata support, or retention semantics after the 12-month pricing formula. The direct Pinata upload docs say files over 100MB require TUS or legacy upload methods, but the MPP docs do not say whether the signed URL supports TUS or large-file resume.

These endpoints are public-IPFS oriented. They do not provide private file access, ACLs, delete/list/update operations, metadata search, gateway analytics, or custom domain management. Every successful upload URL request and every successful download requires payment; failed retries and duplicate upload attempts need application-side guards.

## Use Cases

### Accountless Agent Artifact Handoff

A personal agent can produce a report, transcript, image, or generated data file, pay for a one-off public upload, and return the resulting CID to the user instead of requiring the user to create a Pinata account. The important fields are `fileSize` for cost estimation, the short-lived `url` for upload, and the downstream `cid` for later retrieval. The download endpoint lets the same or another agent recover the artifact by CID when a later workflow needs it.

For a business, this is useful for low-frequency cross-system handoffs where standing storage accounts are too heavy: vendor intake, AI job outputs, generated PDFs, or one-off evidence bundles. The limitation is that Pinata MPP does not expose file listing or deletion, so the business needs its own record of CIDs, upload timestamps, expected MIME types, and internal ownership.

### Content-Addressed Records For Audit Or Verification

A person can store a public receipt, signed PDF, dataset snapshot, or research artifact on IPFS and keep the CID as a stable reference. The CID is valuable because it is derived from content, so later downloads can be tied back to the original artifact. The `Content-Type` and `Content-Disposition` headers help clients save or render the content correctly.

A business can use the same workflow for public, non-sensitive audit evidence: published terms snapshots, reproducibility bundles, model output samples, public procurement documents, or partner-delivered files. This should not be used for confidential or regulated data unless the business is comfortable placing it on public IPFS. The MPP API also does not provide a built-in hash verification response; clients should compute and store their own local hashes when that matters.

### Lightweight Public File Delivery For Small Apps

A developer can use the upload endpoint to place occasional public assets on IPFS and store the CID in their application state. Later, the app or a support script can use the download endpoint to retrieve that asset by CID without maintaining Pinata API keys in the runtime. This fits prototypes, demos, static examples, and small automation tasks where a monthly plan is not justified.

For a business, the same pattern can support low-volume customer-facing files such as public brochures, onboarding packets, sample datasets, or support attachments. It is not a replacement for a production CDN: downloads cost $0.01 each, there is no metadata listing endpoint, and gateway tuning, custom domains, analytics, and cache controls are outside this MPP surface.

### AI Workflow Checkpoint Storage

An AI workflow can save intermediate artifacts that are too large for prompt context, such as CSV exports, generated images, model evaluation outputs, or zipped logs. The upload response's CID becomes a compact pointer in the workflow state, while `fileSize` controls cost before the payment is made. A later step can download by CID and continue processing the exact file.

For businesses running agent platforms, this is valuable when artifacts need to move between isolated workers without granting every worker a shared storage API key. The caveat is operational: because the signed upload URL expires after 120 seconds, workers need to upload immediately after paying. The platform also needs retry logic that avoids paying twice for the same intended artifact.

### Public Data Package Exchange Between Organizations

A person can share a public dataset, media file, or document package by uploading it once and sending the CID to someone else. The recipient can fetch the file by CID through the paid download endpoint, and the content headers help the receiving client decide how to save or open it.

For businesses, this can simplify public data exchange with contractors, researchers, or partners when both sides can operate over CIDs rather than account-specific links. The MPP flow is especially relevant when the recipient is an agent with a Tempo wallet. It is less suitable when the organization needs access revocation, recipient-level authorization, private content, or guaranteed SLA-backed delivery.

### Paid Retrieval Of Known Public CIDs

A user who already has a CID can retrieve it through Pinata's paid proxy without configuring a dedicated gateway. The only material input is `cid`; the output is the file body plus content headers. This is useful for ad hoc recovery of known public content or for agents that need a simple paid path to fetch public IPFS content.

A business can use this in support and investigation workflows: given a customer-provided CID, retrieve the content once, inspect the MIME type, save a copy internally if policy allows, and decide whether the file is valid, corrupt, unavailable, or outside the expected content class. The endpoint returns `404` for file-not-found, but it does not provide richer availability diagnostics, pin status, provenance, or abuse signals.
