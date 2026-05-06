# StableUpload: Static Site Publication And Renewal API Uses

## What This Endpoint Group Does

This group supports the lifecycle for zip-backed static sites: buy a paid site upload slot, upload the zip to the returned target, activate it so StableUpload extracts and serves the site, and renew the site when retention needs to be extended. It turns a zip artifact into a hosted URL without a cloud hosting account.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/site` | Buy a static-site upload slot for a zip file. | `filename`, `tier`, optional `policyTtlSeconds` | `uploadId`, `uploadUrl`, `uploadMethod`, `postUrl`, `postFields`, `expiresAt`, `maxSize`, `curlExample` |
| POST | `/api/site/activate` | Extract the uploaded zip and make the site live. | `uploadId` | `siteUrl`, `fileCount`, `files` |
| POST | `/api/site/renew` | Extend a site's retention window. | `uploadId`, matching `tier`, optional `count` | `uploadId`, `newExpiresAt`, `count` |

## Field Notes

### Inputs

`filename` should be a zip file name. `tier` controls the uncompressed extracted site size and retention window; `short-5gb` is not available for sites. `policyTtlSeconds` controls the temporary upload-target window. Activation and renewal both require `uploadId`. Renewal also requires the original matching `tier` and supports `count` from 1 to 10 periods.

### Outputs

The site purchase response returns an upload target for the source zip, not the served site URL. `siteUrl` appears only after activation. `fileCount` and `files` provide a basic extracted-file audit. Renewal returns `newExpiresAt`, which is the key field for deciding whether the site is covered for the needed campaign, preview, or publication period.

### Important Constraints Or Gaps

Paid purchase and renewal endpoints require x402/MPP payment; activation requires SIWX wallet authentication. Official guidance says site size is the uncompressed extracted total and sites can contain up to 500 files. `/api/site/renew` appears in official OpenAPI and x402 discovery but not in the seven-endpoint mpp.dev manifest, so it is preserved as source drift.

## Use Cases

### Shareable Preview Sites

A person can zip a portfolio draft, landing page, documentation preview, or generated static app, buy a site slot, activate it, and share `siteUrl` for review. `fileCount` and `files` help catch obvious packaging mistakes, such as an empty build directory or missing expected assets, before the link is sent.

For a business, this supports low-friction review environments for agencies, product teams, or AI-generated site drafts. `expiresAt` and `newExpiresAt` let the workflow match hosting duration to the review cycle. The limitation is that this is static hosting: server-side functions, private access control, and database-backed previews require other infrastructure.

### Campaign And Microsite Publishing

A marketer or creator can publish a small campaign page without provisioning a hosting account. The useful input is `tier`: it forces a cost and size decision before the site is bought. After activation, `siteUrl` can be used in social posts, email campaigns, or QR codes until expiry.

For businesses, the API can power programmatic microsite generation from templates. A campaign system can build a zip, reserve a slot, upload it, activate it, and store `siteUrl`, `uploadId`, `expiresAt`, and `fileCount` in campaign records. Renewal makes sense only when the campaign needs to stay online; otherwise expiry provides a natural cleanup boundary.

### Agent-Generated Static Reports

An AI agent can compile research, charts, or decision-support pages into a static site and publish it as a browsable artifact instead of sending a long document. `files` and `fileCount` give a lightweight manifest of what was deployed, while `siteUrl` is the handoff field for the user.

For companies, this is useful for automated client reports or internal investigation packets that need to be reviewed in a browser. The cost is bounded by tier and renewal count. The privacy limitation is material: unless the site content is safe to expose at a public URL, the workflow needs an additional access-control layer not provided here.

### Renewal-Driven Site Portfolio Management

A person can keep a small set of sites alive only when they still matter. The metadata from activation plus `newExpiresAt` from renewal makes it easy to decide whether to renew a portfolio page, event page, or temporary documentation site.

For a business, renewal supports explicit lifecycle control. A workflow can renew active customer-facing sites for `count` periods while letting expired demos or completed campaign pages lapse. The renewal tier must match the original tier, so systems need to retain `tier` alongside `uploadId`.
