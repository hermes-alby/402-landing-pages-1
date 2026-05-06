# Pinata IPFS API Uses

## Service Summary

Pinata IPFS is a first-party MPP wrapper for a narrow slice of Pinata's public IPFS storage product. It lets agents and scripts pay with USDC on Tempo to get a short-lived signed upload URL, upload a public file, and later download a public file by CID. No Pinata account or API key is required for the MPP flow.

The service is most useful when the operational burden of creating a Pinata account, managing API keys, or subscribing to a monthly plan is larger than the value of a small number of uploads or downloads. It is not a full replacement for Pinata's direct product, which includes dashboards, gateway management, private files, analytics, workspaces, metadata search, custom domains, and plan quotas.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Public IPFS Upload And Download | 2 | Store public files through a signed upload URL and retrieve public files by CID without a Pinata account or API key. | [Details](api-uses/public-ipfs-upload-and-download.md) |

## Highest-Value Uses

1. Accountless agent artifact handoff. Agents can store generated public outputs and pass CIDs between workflows without sharing a Pinata API key.
2. Content-addressed public records. People and businesses can publish public documents, reports, datasets, or evidence bundles and retain CIDs as stable references.
3. Low-volume public file delivery. Small apps and scripts can upload or retrieve occasional public files without monthly storage infrastructure.
4. AI workflow checkpoint storage. Larger intermediate artifacts can be stored outside prompt context and fetched later by CID.
5. Known-CID retrieval. Agents can pay for one-off public IPFS retrieval through Pinata's proxy and receive a binary/blob response with content headers.

## Personal Use Opportunities

- Store public generated files such as reports, images, transcripts, or datasets and keep the CID for later retrieval.
- Share public files with another person or agent using a CID rather than an account-specific link.
- Retrieve a known public CID without setting up a dedicated Pinata gateway or API key.
- Use the upload price formula and `fileSize` to estimate whether a one-off upload is worth the cost before paying.

## Business Use Opportunities

- Move public artifacts between isolated agents, contractors, or partner systems without distributing long-lived Pinata credentials.
- Publish public evidence bundles, terms snapshots, support artifacts, or reproducibility packages with content-addressed references.
- Add a low-volume fallback storage path for occasional public files when a full storage account integration is unnecessary.
- Triage customer-provided public CIDs by retrieving the content, checking content headers, and preserving a copy according to internal policy.
- Prototype IPFS-backed workflows before committing to direct Pinata plans, custom gateways, analytics, and account operations.

## Endpoint Group Summaries

### Public IPFS Upload And Download

This group covers `POST /v1/pin/public?fileSize={bytes}` and `GET /v1/pin/public/:cid`. Upload returns a signed Pinata upload URL after MPP payment; the signed URL is valid for 120 seconds and is used with multipart form data. Download retrieves the binary file by CID and returns content headers. Full details: [api-uses/public-ipfs-upload-and-download.md](api-uses/public-ipfs-upload-and-download.md).

## Field And Data Themes

- Content identifiers: `cid` is the durable reference for public IPFS retrieval.
- Quantity and cost: `fileSize` drives upload pricing; downloads have a flat per-request price.
- Payment: both endpoints rely on the MPP 402 flow and an `Authorization` payment proof on retry.
- Content payloads: upload uses a multipart `file` field on the signed URL; download returns binary/blob data.
- Headers: download includes `Content-Type` and `Content-Disposition` according to the MPP overview.
- Timing: signed upload URLs expire after 120 seconds.
