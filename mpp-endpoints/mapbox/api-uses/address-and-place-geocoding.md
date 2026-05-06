# Mapbox: Address And Place Geocoding API Uses

## What This Endpoint Group Does

This group covers forward and reverse geocoding. Forward geocoding accepts search text such as an address, place name, or Mapbox ID and returns standardized geographic features with coordinates, hierarchy, accuracy, and match metadata. Reverse geocoding accepts longitude and latitude and returns nearby address/place context ordered from specific to broad administrative levels.

The group is useful when a workflow needs to normalize messy location input, validate whether an address is precise enough, bias search to a market or bounding box, translate a coordinate into human-readable context, or prepare locations for downstream routing, maps, or analysis.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mapbox/geocode-forward` | Convert text into geographic features and coordinates. | `q`, `proximity`, `bbox`, `country`, `language`, `limit`, `types`, `autocomplete`, `worldview` | `features[].geometry.coordinates`, `properties.mapbox_id`, `feature_type`, `full_address`, `context`, `coordinates.accuracy`, `routable_points`, `match_code` |
| POST | `/mapbox/geocode-reverse` | Convert coordinates into nearby address/place context. | `longitude`, `latitude`, `country`, `language`, `limit`, `types`, `worldview` | `features[]`, `geometry.coordinates`, `properties.context`, `routable_points`, `attribution` |

## Field Notes

### Inputs

`q` is the main forward search field and can be an address, city, place name, or Mapbox ID. `proximity`, `bbox`, and `country` are the practical controls for resolving ambiguous text, such as choosing the right "Chester" or limiting service to supported countries. `types` narrows the result class, while `limit` controls how many candidates a workflow must rank or review.

Reverse geocoding starts from `longitude` and `latitude`. The most important controls are `types`, to request address-only or place-level context, and `limit`, which defaults to one and requires exactly one `types` value when raised above the default in official docs. `worldview` changes how disputed or regionally represented features are returned.

### Outputs

The primary outputs are GeoJSON features with coordinates and `properties.context`. `context` breaks out hierarchy such as address, neighborhood, place, region, postcode, and country, which is more useful for automation than a single formatted address string. `properties.mapbox_id` provides a durable Mapbox identifier for later lookup.

Address results may include `coordinates.accuracy`, `routable_points`, and `match_code`. `accuracy` helps decide whether a result is rooftop, parcel, interpolated, or approximate. `routable_points` can identify vehicle stop points or entrances. `match_code` helps screen fuzzy address matches before using them in shipping, routing, or account records.

### Important Constraints Or Gaps

The official Geocoding API defaults to temporary geocoding, and temporary results cannot be cached. Permanent storage requires a credit card on file or an enterprise contract in provider docs, but the MPP wrapper does not expose a `permanent` parameter. Consumers should treat storage rights as unresolved unless separately confirmed.

Mapbox docs also state that Geocoding API responses may only be used with a Mapbox map. The wrapper OpenAPI does not expose response schemas, so response fields here are provider-derived.

## Use Cases

### Checkout And Delivery Address Validation

A person entering a delivery address can get immediate correction suggestions by sending partial or full text to forward geocoding with `country`, `proximity`, and `types=address`. The workflow can show candidate `full_address` values, then use `coordinates.accuracy`, `match_code`, and `routable_points` to decide whether the address is precise enough for delivery or whether the user should confirm an entrance or unit.

For a business, this reduces failed deliveries and manual support review. Orders with `match_code` below the business threshold, approximate coordinates, or missing routable points can be routed to a validation queue before labels are printed or routes are built. The limitation is storage: temporary geocoding results should not be cached unless storage rights are resolved.

### Lead, Store, Or Property Location Enrichment

A sales, retail, or real estate workflow can turn messy address text into structured geography. Forward geocoding returns coordinates and context fields such as neighborhood, place, region, postcode, and country, which can be joined to sales territories, service regions, market tiers, or property datasets. A personal user could use the same flow to organize saved places or compare neighborhoods.

The valuable fields are not only coordinates. `feature_type` and `coordinates.accuracy` tell whether the location is a precise address or a broader place, and `mapbox_id` gives a stable handle for follow-up lookups. Records with ambiguous `features[]` or weak `match_code` can be held for human review instead of silently contaminating territory analytics.

### Localized Search And Autocomplete

A consumer travel, event, or real estate app can use forward geocoding with `autocomplete=true`, `proximity`, `bbox`, and `language` to produce location suggestions that are biased to the user's current market and language. The returned `features[].properties.name`, `full_address`, and `context` can be displayed while `geometry.coordinates` feeds the map viewport or next routing step.

For a business, the same flow improves conversion by reducing ambiguous place selection. Cost matters because official docs count each keystroke-style autocomplete request as a geocoding request, so applications should debounce input and wait for enough characters before calling. The wrapper cost is per request, so indiscriminate autocomplete can be expensive.

### Coordinate-To-Context For Field Operations

A field service, emergency operations, or inspection app can reverse geocode GPS coordinates from photos, devices, or job events into addresses and administrative context. The workflow can store a user-facing place label, route job tickets to the right region, or flag when a coordinate falls outside a supported service area.

For an individual, reverse geocoding helps explain where a dropped pin, saved photo, or travel waypoint actually is. Business systems should use `types` and `limit` deliberately: a broad place result may be enough for regional analytics, but dispatch workflows often need `types=address` and a confidence review before sending a driver.

### Region And Worldview-Sensitive Place Handling

Products operating internationally can use `worldview`, `language`, and `country` to produce place context that matches the intended audience. For personal travel planning, this can make map labels and administrative hierarchy more understandable. For businesses, it can avoid inconsistent country/region values across markets and reports.

The key caveat is that worldview changes are not a substitute for legal or compliance review. The output identifies how Mapbox represents features for a selected worldview, and systems should preserve which `worldview` and `language` were used so later audits can explain differences.
