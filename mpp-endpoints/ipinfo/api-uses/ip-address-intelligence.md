# IPinfo: IP Address Intelligence API Uses

## What This Endpoint Group Does

This endpoint group enriches a single IPv4 or IPv6 address with IPinfo data. `POST /ipinfo/ip-lite` is the coarse lookup for country, continent, and ASN identity. `POST /ipinfo/ip-lookup` is the richer lookup for geolocation, ASN/network type, privacy/anonymity flags, hosting/mobile/satellite/anycast indicators, mobile carrier identifiers, and tier-dependent freshness or residential proxy signals.

The core value is not "find an IP address"; it is attaching operational context to an IP address already seen in a workflow: a login, checkout, signup, support ticket, analytics event, server log, ad click, webhook, or network event.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/ipinfo/ip-lite` | Basic country, continent, and ASN enrichment. | `ip` string: IPv4, IPv6, or `"me"` according to docs. | `ip`, `asn`, `as_name`, `as_domain`, `country_code`, `country`, `continent_code`, `continent` from the official Lite docs. |
| POST | `/ipinfo/ip-lookup` | Fuller lookup for geolocation, network ownership/type, privacy flags, hosting/carrier context, and tier-dependent freshness details. | `ip` string: IPv4, IPv6, or `"me"` according to docs. | `ip`, `hostname`, `geo.*`, `as.*`, `anonymous.*`, `mobile.*`, `is_anonymous`, `is_anycast`, `is_hosting`, `is_mobile`, `is_satellite`; exact fields depend on wrapper/upstream plan tier. |

## Field Notes

### Inputs

Both endpoints accept one required JSON body field, `ip`. The MPP docs allow IPv4, IPv6, or `"me"` for the caller's IP. For repeatable automation, explicit IP addresses are safer than `"me"` because `"me"` depends on caller network path and would perform a live caller-IP lookup.

### Outputs

Lite outputs support coarse location and network-owner decisions: country, continent, ASN number/name/domain, and the queried IP.

Full lookup outputs support richer decisions:

- `geo.city`, `geo.region`, `geo.country_code`, `geo.latitude`, `geo.longitude`, `geo.timezone`, `geo.postal_code`, `geo.radius`, and `geo.last_changed` add local context and confidence.
- `as.asn`, `as.name`, `as.domain`, `as.type`, and `as.last_changed` identify the network operator and whether it looks like hosting, ISP, education, government, or business infrastructure.
- `anonymous.is_proxy`, `anonymous.is_relay`, `anonymous.is_tor`, `anonymous.is_vpn`, `anonymous.name`, `anonymous.last_seen`, and `anonymous.percent_days_seen` add privacy-network and residential-proxy context.
- `is_anonymous`, `is_anycast`, `is_hosting`, `is_mobile`, `is_satellite`, plus `mobile.name`, `mobile.mcc`, and `mobile.mnc`, help separate consumer, mobile, cloud, satellite, and privacy-routed traffic.

### Important Constraints Or Gaps

The MPP OpenAPI documents request bodies but not 200 response schemas. Response fields in this artifact are docs-derived from IPinfo official pages and may not exactly match the wrapper output. The MPP docs say full lookup fields expand with plan tier, but they do not say which IPinfo tier backs the wrapper.

IP geolocation is approximate. `geo.radius` and `geo.last_changed` matter when deciding whether a location is precise enough. Privacy flags are useful risk signals but should not be the only basis for blocking a user or making a sensitive decision. The MPP endpoint costs about $0.001 per request in the wrapper docs, while IPinfo Lite itself is already free and unlimited at the provider.

## Use Cases

### Localize Product Experience Without Asking For Location

A consumer app can use Lite or full lookup on a signup, page view, or checkout IP to select default country, currency region, language, timezone, or region-specific content before the user fills out a profile. The Lite endpoint is enough when the decision only needs country or continent. Full lookup is better when timezone, city, or postal-code context changes the workflow, such as scheduling a demo in local business hours or preselecting local delivery coverage.

For businesses, this reduces friction in onboarding and sales funnels. The useful fields are `country_code`, `continent_code`, `geo.timezone`, `geo.city`, and `geo.region`. The limitation is precision: IP location can be wrong, especially on mobile, VPN, corporate, satellite, or anycast networks, so the application should let the user override inferred settings.

### Route Leads And Support Tickets By Region And Network Type

A sales or support workflow can enrich an inbound form, chat, or API request IP before assigning it. `geo.country_code`, `geo.region`, and `geo.timezone` help route to the right regional queue. `as.name`, `as.domain`, and `as.type` can distinguish a request from a company network, hosting provider, education network, ISP, or government network when the user did not provide a company domain.

The personal angle is faster support in the right language or timezone. The business angle is cleaner routing and enrichment without requiring a full account profile. This should remain assistive: ASN organization is not the same as the user's employer, especially on residential ISPs, mobile networks, VPNs, or cloud-hosted environments.

### Add Checkout And Account-Risk Context

An e-commerce, fintech, SaaS, or marketplace system can enrich login, signup, password reset, and checkout IPs to add risk context. Privacy fields such as `anonymous.is_vpn`, `anonymous.is_proxy`, `anonymous.is_tor`, `anonymous.is_relay`, `anonymous.name`, and Max-tier residential proxy signals can feed step-up verification decisions. `is_hosting`, `is_mobile`, `is_satellite`, `as.type`, and `geo.country_code` can be combined with user-provided country, shipping country, card country, and account history.

This enables actions like requiring MFA, holding a suspicious order for review, or prioritizing manual checks. It should not be a standalone denial rule. VPNs and relays are legitimate for privacy, and IP location can differ from billing or travel location.

### Segment Product Analytics By Geography And Network

Analytics teams can enrich server-side event IPs before aggregation to understand country mix, regional adoption, traffic from mobile networks, cloud/hosting traffic, satellite usage, and privacy-routed usage. Lite fields answer broad geography and ASN questions at lower cost. Full lookup adds city/region/timezone, hosting/mobile/satellite flags, and ASN type for better segmentation.

The business value is more accurate capacity planning, go-to-market analysis, and product localization. The personal benefit is a product that adapts to regional availability or performance constraints. The main caveat is privacy: IP addresses are personal data in many compliance contexts, so teams should minimize retention, aggregate when possible, and avoid unnecessary raw-IP storage.

### Improve Ad And Affiliate Traffic Quality Review

Marketing and affiliate teams can enrich click IPs to identify traffic patterns that look mismatched with campaign targeting. `country_code`, `continent_code`, `geo.region`, and `geo.dma_code` support geo validation. `is_hosting`, `as.type`, `anonymous.is_proxy`, `anonymous.is_vpn`, `anonymous.is_tor`, and `anonymous.percent_days_seen` can highlight non-consumer or privacy-routed traffic that may deserve review.

This is most useful as an audit layer, not as automatic accusation. A campaign might legitimately receive mobile, VPN, or corporate traffic. The fields help prioritize investigation, compare partners, and tune campaign rules when the traffic source does not match the bought region or expected audience.

### Personal Privacy And Network Awareness

A person or personal automation can use the endpoint on their own known IP address to understand what their network reveals: country, ASN, ISP/network name, whether traffic appears as mobile, hosting, satellite, VPN, proxy, relay, Tor, or anycast. `anonymous.name`, `as.name`, `as.domain`, and `geo.radius` are useful for understanding why a service may show a different location or treat the connection as higher risk.

This use is educational and diagnostic. It should avoid silently collecting other people's IPs, and the `"me"` input should be used only when the user explicitly wants a caller-IP lookup.

### Enrich Infrastructure Logs For Operational Triage

Infrastructure and SRE teams can enrich selected web, API gateway, CDN, or error-log IPs when investigating traffic spikes, regional incidents, or unusual source networks. `as.asn`, `as.name`, `as.type`, `is_hosting`, `is_anycast`, `is_mobile`, `is_satellite`, and `geo.country_code` help separate consumer traffic from cloud-provider traffic, mobile carriers, academic networks, or anycast services.

This enables decisions like whether to contact a provider, adjust regional capacity, tune bot-management thresholds, or annotate an incident timeline. The endpoint is single-IP and paid per request, so it is best for sampled or high-value events rather than bulk log enrichment; bulk use would likely need IPinfo database downloads or a first-party plan.
