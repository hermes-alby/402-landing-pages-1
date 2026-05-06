# IPinfo API Uses

## Service Summary

IPinfo provides IP address intelligence: geolocation, ASN/network ownership, privacy and anonymity detection, hosting/mobile/satellite flags, carrier identifiers, and tier-dependent freshness or residential proxy signals. The Locus MPP wrapper exposes two paid single-IP enrichment endpoints: a Lite lookup and a fuller IP lookup.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| IP Address Intelligence | 2 | Enrich a single IPv4 or IPv6 address with location, ASN, network type, privacy, hosting, carrier, and related operational context. | [`api-uses/ip-address-intelligence.md`](api-uses/ip-address-intelligence.md) |

## Highest-Value Uses

The strongest use is occasional premium IP enrichment where a user or agent needs one-off context without opening an IPinfo account or committing to a monthly plan. High-value workflows include checkout and account-risk review, regional support or sales routing, infrastructure triage, marketing traffic quality review, and lightweight product localization.

The Lite endpoint is useful for coarse country, continent, and ASN context, but IPinfo Lite is already free and unlimited from the provider. The full lookup is the more compelling MPP fit when it returns richer Core/Plus/Max-style fields such as city/region, timezone, coordinates, ASN type, privacy flags, hosting/mobile/satellite indicators, carrier data, radius, and freshness fields.

## Personal Use Opportunities

A person can check what their own network reveals, explain why a website sees them in a particular country or city, understand whether a VPN/relay/proxy is visible, and troubleshoot location-dependent access or content defaults. This should be explicit because `"me"` performs a caller-IP lookup; the research did not perform live IP lookups.

## Business Use Opportunities

Businesses can enrich IPs attached to logins, signups, checkouts, support tickets, analytics events, ad clicks, and infrastructure logs. The fields can drive regional defaults, queue routing, risk scoring, campaign auditing, capacity planning, and incident triage. Privacy and geolocation fields should be treated as supporting signals rather than definitive evidence, especially for sensitive decisions.

## Endpoint Group Summaries

### IP Address Intelligence

The IP address intelligence group covers both MPP endpoints. `POST /ipinfo/ip-lite` handles basic country/continent/ASN enrichment; `POST /ipinfo/ip-lookup` handles fuller geolocation, ASN/network, privacy, hosting, carrier, and related signals when the wrapper tier returns them. See [`api-uses/ip-address-intelligence.md`](api-uses/ip-address-intelligence.md).

## Field And Data Themes

The input theme is simple: one required `ip` string. The output themes are location (`country_code`, `geo.city`, `geo.timezone`, `geo.radius`), network ownership (`asn`, `as.name`, `as.domain`, `as.type`), privacy and risk context (`anonymous.*`, `is_anonymous`, `is_hosting`), access network type (`is_mobile`, `mobile.*`, `is_satellite`, `is_anycast`), and freshness (`geo.last_changed`, `as.last_changed`, `anonymous.last_seen`).
