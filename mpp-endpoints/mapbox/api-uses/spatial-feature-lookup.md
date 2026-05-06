# Mapbox: Spatial Feature Lookup API Uses

## What This Endpoint Group Does

This group covers Tilequery. It accepts a Mapbox tileset ID and a geographic point, plus optional radius, limit, dedupe, geometry, and layer filters. It returns GeoJSON features at or near the point, including original feature properties and `tilequery` metadata such as distance, original geometry type, layer, band, zoom, units, or rasterarray values.

The endpoint is useful when a workflow needs to answer "what map feature or tileset value is here?" without downloading or rendering the whole tileset.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mapbox/tilequery` | Query vector or rasterarray tileset features near a point. | `tileset_id`, `longitude`, `latitude`, `radius`, `limit`, `dedupe`, `geometry`, `layers` | `features[].geometry.coordinates`, `features[].properties`, `properties.tilequery.distance`, `geometry`, `layer`, `band`, `zoom`, `units`, `properties.val` |

## Field Notes

### Inputs

`tileset_id` selects the Mapbox-hosted dataset and can be a comma-separated list of up to 25 tilesets in official docs. `longitude` and `latitude` define the query point. `radius` is essential for point or line data because the default is point-in-polygon behavior.

`limit` caps returned features from 1 to 50. `dedupe` removes duplicates where possible. `geometry` filters by original feature geometry type, and `layers` restricts the query to named layers. For rasterarray tilesets, official docs say `layers` is needed to avoid empty results, and a provider `bands` parameter exists but is not exposed by the wrapper.

### Outputs

Vector Tilequery returns a GeoJSON FeatureCollection where each returned feature has `geometry.type=Point`. The returned point is the query point or nearest/interpolated point; it is not the full original geometry. `properties.tilequery.distance` tells how far the result is from the queried coordinate, and `properties.tilequery.geometry` tells whether the original feature was a point, line, or polygon.

Rasterarray Tilequery returns point values with metadata such as layer, band, zoom, units, and `properties.val`. The meaning of the original `properties` depends on the selected tileset and layer schema, which the wrapper does not describe.

### Important Constraints Or Gaps

Tilequery's usefulness depends heavily on the selected tileset. The wrapper does not publish tileset schemas, layer schemas, or available fields. The wrapper also does not expose the provider `bands` parameter for rasterarray queries.

Official docs document a 600 requests per minute default rate limit and cache headers with a 12-hour device TTL and 5-minute CDN TTL. Spatial attributes may therefore lag source changes depending on the tileset and cache behavior.

## Use Cases

### Point-In-Polygon Context Enrichment

A personal user can tap a point on a map and ask what administrative, land-use, or custom polygon contains it. With `radius=0` and `geometry=polygon`, Tilequery can return matching polygon features and their properties.

For a business, this powers territory lookup, service-zone checks, risk-zone tagging, or regulatory-area enrichment. The key outputs are `features[].properties`, `properties.tilequery.distance=0`, and `properties.tilequery.geometry=polygon`. The limitation is that the properties only mean what the selected tileset schema defines.

### Nearby Feature Lookup For Map Interactions

An app can query nearby point or line features around a clicked coordinate using `radius`, `limit`, `geometry`, and `layers`. A personal map can identify nearby trails, road features, or points of interest from a hosted tileset. A business map can identify nearby assets, boundaries, or infrastructure features.

`properties.tilequery.distance` supports ranking results by proximity, while `dedupe` reduces repeated features from tile boundaries or overlapping tiles. Large radius queries may miss some large point or line datasets due to tile buffering limitations documented by Mapbox, so this should not be treated as a complete spatial search engine.

### Custom Operational Layer Queries

Companies with Mapbox-hosted operational tilesets can query custom layers such as depots, zones, parcels, maintenance assets, delivery areas, or inspection regions. The workflow sends `tileset_id`, `layers`, and a coordinate from an event or job, then attaches returned `properties` to the job record.

This is valuable because it avoids maintaining a separate GIS query service for lightweight lookups. The caveat is schema governance: downstream automations should preserve the tileset ID and layer name used, because property names and meanings can drift as tilesets are republished.

### Environmental Or Rasterarray Point Values

For rasterarray tilesets, Tilequery can return a value at a coordinate, along with `properties.tilequery.layer`, `band`, `zoom`, `units`, and `properties.val`. A personal use might check a weather, elevation, or environmental layer at a point. A business could enrich site, route, or asset records with raster-derived measurements.

The wrapper gap is material here: official docs include a `bands` parameter, but the MPP wrapper only exposes `layers`. If a rasterarray workflow needs specific bands or time slices, confirm wrapper support before relying on it.

### Map QA And Tileset Debugging

GIS and map operations teams can use Tilequery to debug why a feature appears or does not appear at a location. By querying the relevant `tileset_id`, `layers`, `geometry`, and `radius`, they can inspect the returned properties and tilequery metadata without manually reading vector tiles.

This can support both personal map-building projects and business production QA. The output helps decide whether a rendering issue is caused by missing data, layer filtering, deduplication, or style logic. Empty FeatureCollections are valid 200 responses, so QA tooling should distinguish "no feature returned" from transport errors.
