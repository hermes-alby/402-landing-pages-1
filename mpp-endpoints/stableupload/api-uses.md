# StableUpload API Uses

## Service Summary

StableUpload is a first-party Merit Systems service for accountless pay-per-upload file hosting and zip-backed static site hosting. Paid endpoints use x402/MPP; owner actions use SIWX wallet authentication. The service is strongest when a user, agent, or workflow needs a public artifact URL, static preview site, or custom-domain static page without provisioning storage accounts, API keys, buckets, or monthly hosting plans.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| File Slot Hosting | 1 | Buy a file upload slot and receive upload/public URLs for file handoff or publishing. | [file-slot-hosting.md](api-uses/file-slot-hosting.md) |
| Static Site Publication And Renewal | 3 | Turn zip files into hosted static sites and extend their retention windows. | [static-site-publication-and-renewal.md](api-uses/static-site-publication-and-renewal.md) |
| Upload Metadata And Lifecycle | 2 | List and inspect wallet-owned uploads, expiries, statuses, prices, and URLs. | [upload-metadata-and-lifecycle.md](api-uses/upload-metadata-and-lifecycle.md) |
| Custom Domain And TLS | 2 | Attach branded subdomains to static sites and poll SSL readiness. | [custom-domain-and-tls.md](api-uses/custom-domain-and-tls.md) |

## Highest-Value Uses

The highest-value use is agent artifact handoff: an agent can buy only the upload capacity it needs, upload a generated file or static report, and return a `publicUrl` or `siteUrl` with a clear expiry. This avoids API keys, accounts, storage provisioning, and monthly commitments for workflows that produce occasional public artifacts.

The second-highest-value use is preview and microsite publishing. `POST /api/site`, `POST /api/site/activate`, optional custom-domain endpoints, and official renewal support create a complete lightweight static hosting lifecycle. The key fields are `uploadId`, `siteUrl`, `fileCount`, `customHostname`, `ssl`, `expiresAt`, and `newExpiresAt`.

## Personal Use Opportunities

- Share temporary generated assets, build artifacts, screenshots, PDFs, or media files with a `short-*` tier and a known `expiresAt`.
- Publish a portfolio page, event page, or report as a static site without opening a hosting account.
- Maintain a wallet-owned catalog of links and sites using `GET /api/uploads`, then decide which assets to renew, replace, or let expire.
- Add a memorable subdomain to a site and poll `ssl` until the branded URL is ready.

## Business Use Opportunities

- Use StableUpload as a low-friction handoff layer between agents and downstream tools that need URL-addressable files.
- Generate static client reports, campaign pages, or QA previews and publish them as zip-backed sites.
- Reconcile per-use storage costs with `pricePaid`, `tier`, `txHash`, `createdAt`, and `expiresAt`.
- Build an asset-retention workflow that pages through wallet-owned uploads, alerts on upcoming expiry, and renews only high-value sites.
- White-label lightweight static reports or demos by attaching customer-specific subdomains and polling TLS status before release.

## Endpoint Group Summaries

### File Slot Hosting

`POST /api/upload` buys a paid file slot and returns the fields needed for upload and sharing. The important distinction is between `uploadUrlExpiresAt`, which limits when bytes can be uploaded, and `expiresAt`, which limits public file availability. Full details: [file-slot-hosting.md](api-uses/file-slot-hosting.md).

### Static Site Publication And Renewal

Static-site endpoints reserve a zip upload slot, activate the uploaded zip into a served `siteUrl`, and renew hosting when needed. The purchase response does not include the served URL; activation is the step that returns `siteUrl`, `fileCount`, and `files`. Full details: [static-site-publication-and-renewal.md](api-uses/static-site-publication-and-renewal.md).

### Upload Metadata And Lifecycle

Metadata endpoints provide the asset catalog for a wallet: file/site type, size fields, prices, URLs, hostnames, status, and expiry. They are useful for retention review, reconciliation, and operational lookup, but they do not stream file bytes. Full details: [upload-metadata-and-lifecycle.md](api-uses/upload-metadata-and-lifecycle.md).

### Custom Domain And TLS

Domain endpoints attach a subdomain to an activated site and report TLS readiness. `dnsRecords` supports DNS setup, while `ssl` is the automation signal for whether the branded URL is ready. Full details: [custom-domain-and-tls.md](api-uses/custom-domain-and-tls.md).

## Field And Data Themes

The API revolves around five data themes: upload identifiers (`uploadId`, `id`), public delivery URLs (`publicUrl`, `siteUrl`, `hostname`), expiration timestamps (`uploadUrlExpiresAt`, `expiresAt`, `newExpiresAt`), size and cost controls (`tier`, `maxSize`, `actualSize`, `pricePaid`, `count`), and lifecycle readiness (`status`, `fileCount`, `files`, `ssl`).
