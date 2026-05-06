# BuiltWith: Domain Technology And Trust Profiling API Uses

## What This Endpoint Group Does

This group turns a domain into a technology and risk profile. `Domain Lookup` returns the richest record: technologies, categories, detection dates, path/subdomain coverage, spend estimates, ranks, social links, company metadata, contact fields, and attributes. `Free Summary` gives a cheaper live/dead category count view for quick triage. `Trust` gives fraud and credibility signals such as parked status, ecommerce/payment-option flags, premium technology count, spend, database indexing, and earliest record.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/builtwith/domain` | Full technology and metadata profile for a domain | `LOOKUP`, `NOPII`, `NOMETA`, `NOATTR`, `FDRANGE`, `LDRANGE`, `LIVEONLY`, `HIDETEXT`, `HIDEDL` | Technologies, tags, categories, first/last detected dates, spend, spend history, metadata, attributes, company/contact/social/location fields |
| POST | `/builtwith/free` | Lightweight technology summary | `LOOKUP` | Domain first/last indexed dates, groups, category live/dead counts, latest/oldest timestamps |
| POST | `/builtwith/trust` | Trust and fraud signal check | `LOOKUP` | `DBRecord`, `LiveRecord`, `Status`, parked/ecommerce/payment flags, spend, premium tech count, earliest record |

## Field Notes

### Inputs

All three endpoints are domain-driven through `LOOKUP`. `Domain Lookup` adds useful controls for privacy and performance: `NOPII` suppresses people/contact fields, `NOMETA` suppresses metadata, `NOATTR` suppresses attributes, `LIVEONLY` focuses on currently live technologies, and `FDRANGE`/`LDRANGE` narrow by technology detection dates.

### Outputs

The richest outputs are technology names, tags, categories, descriptions, provider links, `IsPremium`, `FirstDetected`, `LastDetected`, path/subdomain scope, `Spend`, `SpendHistory`, `SalesRevenue`, `Meta`, `Attributes`, and rank/location/contact/social fields. The summary endpoint reduces that to group/category counts. The trust endpoint returns boolean-style risk flags such as `PaymentOptions`, `Ecommerce`, `Parked`, `LiveTechs`, `AffiliateLinks`, `Established`, and `DBIndexed`.

### Important Constraints Or Gaps

The MPP OpenAPI spec does not define response schemas, so output fields are derived from official BuiltWith sample JSON. Domain metadata can include PII-like contact fields unless suppression flags are used. Trust `Status` values and `LiveRecord` schema are not explained in the local public docs.

## Use Cases

### Lead Qualification By Technology Fit

A salesperson can paste a prospect domain into `Domain Lookup` and check whether it uses technologies that indicate budget, maturity, or fit: ecommerce platforms, analytics suites, marketing automation, payment tools, hosting vendors, or premium services. `Spend`, `IsPremium`, `Categories`, `FirstDetected`, and `LastDetected` make the lead more actionable than a plain domain match because the rep can prioritize live, recent, high-spend signals.

For a business, the same fields can automate CRM enrichment. A routing job can tag inbound leads with current stack categories, inferred spend, ecommerce status, and company/location metadata, then route Shopify-heavy or enterprise-analytics-heavy accounts to the right sales motion. `NOPII` should be used when the workflow does not need people/contact fields.

### Vendor Migration And Churn Monitoring

An individual consultant or agency can use `Domain Lookup` with `LIVEONLY` and date filters to understand whether a client still runs a legacy CMS, old JavaScript framework, expiring analytics stack, or outdated hosting/CDN setup. `FirstDetected` and `LastDetected` reveal whether the technology is live, stale, or recently changed.

At business scale, an agency or SaaS vendor can monitor customer domains for adoption or removal of competitor technologies. A change from a competitor tag to a new parent technology can trigger customer-success outreach, migration assistance, or risk review. The limitation is that this endpoint is lookup-based rather than a documented webhook stream in the MPP wrapper.

### Lightweight Screening Before Paying For Full Enrichment

`Free Summary` is useful when a user wants a quick read on a domain before paying for the full profile. The `groups[].live`, `groups[].dead`, `latest`, and `oldest` fields can show whether a site is active in categories that matter, such as CMS, web server, SSL, ecommerce, analytics, or JavaScript.

A business can run the summary endpoint as a first pass over a list and only call `Domain Lookup` when the category mix crosses a threshold. This reduces cost for workflows that only need broad technology presence before deeper enrichment.

### Checkout And Marketplace Risk Triage

The `Trust` endpoint can help a person vet an unfamiliar merchant domain before buying from it by checking whether BuiltWith has indexed it, whether it appears parked, whether it has payment options, whether it has live technologies, and how old its earliest record is. These are not a guarantee of safety, but they are useful context.

For marketplaces or procurement teams, `Trust` fields can feed triage queues: domains with `Parked: true`, no `PaymentOptions`, very low history, low technology spend, or missing live technologies can be sent for manual review. The endpoint should not be the sole fraud decision because the docs do not define the full trust score semantics.

### Competitive Stack Benchmarking

An operator can compare their own domain against competitors by inspecting categories, premium technologies, spend estimates, and historical adoption. The output fields answer practical questions: which analytics or marketing tools are competitors using, how recently were they adopted, and which categories are missing from the user's own stack.

A business intelligence team can repeat this across a named competitor set and produce a structured technology matrix. `HIDETEXT` or `HIDEDL` can reduce payload size when the workflow only needs names, tags, and dates rather than descriptions and links.
