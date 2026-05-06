# StableUpload: Custom Domain And TLS API Uses

## What This Endpoint Group Does

This group connects a custom hostname to an activated StableUpload site and checks TLS provisioning. It is the branding and delivery layer for static sites after the zip has been uploaded and activated.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/api/site/domain` | Connect a custom domain to a site and return DNS records. | `uploadId`, `hostname` | `status`, `hostname`, `customHostnameId`, `dnsRecords[]` |
| GET | `/api/site/domain/status` | Check custom-domain and SSL provisioning status. | `uploadId` | `status`, `hostname`, `ssl` |

## Field Notes

### Inputs

`uploadId` identifies the activated site. `hostname` is the subdomain to attach, such as `blog.example.com`. Official guidance says hostnames must be subdomains, not apex domains.

### Outputs

`dnsRecords` contains record `type`, `name`, and `value`, which are the practical fields needed to configure DNS. `customHostnameId` is the provider-side identifier for the hostname. The status endpoint returns `status`, `hostname`, and `ssl`; official guidance says to poll until `ssl` is `active`.

### Important Constraints Or Gaps

These are SIWX-protected owner actions. The docs recommend a DNS-first workflow using the official preview endpoint before posting the domain, but `GET /api/site/domain/preview` is not in the mpp.dev seven-endpoint manifest and is therefore treated as related context rather than a primary endpoint in this group. The OpenAPI does not enumerate all `status` or `ssl` values.

## Use Cases

### Branded Preview Or Launch URLs

A person can publish a static site through StableUpload and then attach a memorable subdomain instead of sharing the generated `*.s.stableupload.dev` URL. The returned `dnsRecords` tell them exactly what to add at their DNS provider, and `ssl` status tells them when the branded URL is ready.

For a business, this makes StableUpload more credible for demos, microsites, and client-facing previews. A deployment workflow can create the site, attach `preview.customer.example.com`, store `customHostnameId`, and poll `GET /api/site/domain/status` until SSL is active before notifying reviewers. The limitation is that DNS changes happen outside StableUpload and may require manual or separate registrar automation.

### Domain Provisioning Runbooks

A person managing several small sites can use `dnsRecords` as a checklist for DNS setup and use `ssl` as the readiness signal. This reduces ambiguity compared with copying DNS instructions from a web UI.

For businesses, the fields support a repeatable runbook: create records, attach domain, poll status, then mark the site ready. The API does not expose detailed certificate error reasons, so failed provisioning may still require manual DNS inspection or support workflow.

### White-Labeled Static Reports

A consultant or creator can use StableUpload to publish static reports at a client-specific hostname. The static site endpoint produces `siteUrl`, while the domain endpoint turns it into a branded property through `hostname` and `dnsRecords`.

For companies, this is useful for lightweight white-labeled portals or campaign reports where a full hosting stack would be excessive. The workflow should store both `uploadId` and `hostname` so renewal, metadata lookup, and TLS checks can be tied to the branded site later. Public access remains a caveat: the custom domain makes the site easier to find, not more private.
