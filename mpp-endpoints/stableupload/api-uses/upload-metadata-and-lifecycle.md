# StableUpload: Upload Metadata And Lifecycle API Uses

## What This Endpoint Group Does

This group lists and inspects wallet-owned StableUpload assets. It does not create, renew, stream, or download content. It returns metadata that helps users and systems understand what exists, whether it is a file or site, where it is served, how much was paid, when it expires, and what lifecycle status StableUpload reports.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/uploads` | List wallet-owned uploads, newest first. | `limit`, `cursor` | `uploads[]`, `nextCursor` |
| GET | `/api/download/:uploadId` | Get metadata for a single upload ID. | `uploadId` | `upload` |

## Field Notes

### Inputs

`limit` controls page size from 1 to 100, defaulting to 50. `cursor` continues pagination from `nextCursor`. `uploadId` identifies a single asset for detail lookup.

### Outputs

Both endpoints expose asset-level fields: `kind`, `isSite`, `filename`, `contentType`, `tier`, `maxSize`, `actualSize`, `publicUrl`, `siteUrl`, `fileCount`, `customHostname`, `status`, `pricePaid`, `expiresAt`, and `createdAt`. The detail endpoint also includes `txHash`. `kind` distinguishes file from site; `siteUrl` is the served site address, while `publicUrl` is the file URL or source zip URL.

### Important Constraints Or Gaps

These endpoints require SIWX wallet authentication; this research did not sign wallet messages. `GET /api/download/:uploadId` returns metadata only and does not stream file bytes. Official guidance says `pending`, `uploaded`, and `expired` are lifecycle hints, and a successful S3 upload can remain `pending` briefly.

## Use Cases

### Expiration Review And Renewal Planning

A person can list uploads and sort by `expiresAt` to decide which files or sites need action before links stop working. For sites, `siteUrl`, `customHostname`, and `tier` identify whether a renewal is worth paying for; for files, `publicUrl` and `filename` identify links that may need replacement.

For a business, this becomes a lightweight retention audit. An internal job can paginate through `GET /api/uploads`, flag high-value assets expiring soon, and route only active sites to the renewal workflow. The API does not decide business value; teams need their own metadata tying `uploadId` to a customer, campaign, or ticket.

### Hosted Asset Catalog

A person can use the list endpoint as a small catalog of everything bought by a wallet. `kind`, `filename`, `contentType`, and `createdAt` make it possible to find the right artifact without storing a separate spreadsheet.

For companies, these fields can enrich an operations dashboard with exact public URLs, site URLs, sizes, file counts, hostnames, prices, and status. This is valuable because StableUpload is accountless; the wallet-owned metadata endpoint is the closest thing to an account asset list. The limitation is authentication: the viewer must be able to SIWX-auth as the owning wallet.

### Upload Completion And Packaging Checks

A person can inspect `status`, `actualSize`, `fileCount`, and `files` through metadata and activation outputs to verify that an upload likely completed and a site zip was extracted. If `status` is still `pending`, official guidance says the returned URL and expiry remain the source of truth after a successful direct upload.

For businesses, a workflow can compare expected size and content type against `actualSize` and `contentType` after upload. For sites, `fileCount` can catch accidental empty or oversized builds. The caveat is that status is a lifecycle hint rather than a full integrity check; a separate content fetch or checksum workflow would be needed for strong verification.

### Cost And Usage Reconciliation

A person can review `pricePaid`, `tier`, `createdAt`, and `txHash` to understand what was purchased and when. This is useful for wallet-level budgeting when using many small pay-per-upload operations.

For a business, these fields support reconciliation between internal jobs and onchain or payment records. The system can store `uploadId` at purchase time, then later fetch detail metadata to attach `txHash`, `pricePaid`, and expiry to an invoice, project, or cost center. The API does not expose team, user, or project fields, so attribution must come from the caller's own records.
