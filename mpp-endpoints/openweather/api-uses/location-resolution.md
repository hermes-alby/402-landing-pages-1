# OpenWeather: Location Resolution API Uses

## What This Endpoint Group Does

This group turns human location text into coordinates and coordinates back into place names. It is the setup layer for every coordinate-based weather call: if a user says "Austin" or an operations system stores only an address-derived coordinate, these endpoints help select the exact city/state/country and latitude/longitude used by downstream weather, forecast, and air-quality requests.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/openweather/geocode` | Convert a city/state/country query into matching locations. | `q`, `limit` | `name`, `local_names`, `lat`, `lon`, `country`, `state` |
| POST | `/openweather/reverse-geocode` | Convert coordinates into matching place names. | `lat`, `lon`, `limit` | `name`, `local_names`, `lat`, `lon`, `country`, `state` |

## Field Notes

### Inputs

`q` accepts city text with optional state and country code, such as `Austin,TX,US`. `lat` and `lon` identify a coordinate. `limit` caps returned candidates from 1 to 5, defaulting to 5 in the MPP docs.

### Outputs

Both endpoints return candidate places with display name, localized names when available, latitude, longitude, country code, and state when available.

### Important Constraints Or Gaps

The MPP wrapper documents city geocoding and reverse geocoding, but not zip-code geocoding. It also does not document confidence scores, match ranking semantics, or whether returned arrays are always in upstream OpenWeather order.

## Use Cases

### Disambiguating Weather Requests From Natural Language

A personal assistant can turn "weather in Springfield" into a short candidate list instead of guessing the wrong city. The returned `state`, `country`, `lat`, and `lon` fields let the user or agent choose "Springfield, Illinois, US" before calling current weather or forecasts.

A business workflow can use the same step when customer-service tickets, delivery notes, or trip records contain city text. Resolving to coordinates makes weather enrichment repeatable, and keeping the candidate list visible prevents silently attaching a weather risk to the wrong market.

### Normalizing Store, Job-Site, Or Asset Locations

A field-service, construction, or retail operations team can geocode site names or city/state records into `lat` and `lon` before checking current conditions, forecast windows, or air quality. This is valuable when a dispatch tool stores locations in inconsistent text formats.

The main operational value is a stable coordinate that can be reused across scheduled weather checks. The limitation is that the endpoint does not validate street addresses; a separate address geocoder would be needed for precise parcel-level routing.

### Labeling Coordinates In Reports And Alerts

Reverse geocoding can turn device, vehicle, or job-site coordinates into readable `name`, `state`, and `country` labels before sending an alert. A personal user might see "storm risk near Boulder, Colorado" rather than raw coordinates.

For a business, readable labels make automated weather events easier to triage in dashboards, shift notes, or customer messages. The endpoint returns place identity rather than administrative boundary geometry, so it should not be used as a compliance-grade jurisdiction lookup.

### Preparing Multi-Location Weather Batches

An analyst can geocode a list of target cities and cache the returned coordinates before comparing conditions or forecasts across markets. `limit` helps review ambiguous locations during setup, then downstream calls can use the selected coordinates.

Businesses can use this to enrich store networks, event venues, or route stops without maintaining an OpenWeather account for occasional setup work. Costs still scale per geocoding request and then per weather request, so high-volume normalization should use caching and review.
