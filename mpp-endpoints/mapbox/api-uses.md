# Mapbox API Uses

## Service Summary

Mapbox provides location, mapping, search, and navigation APIs. The Mapbox MPP wrapper exposes eight paid `POST` endpoints for geocoding, routing, matrix travel times, isochrones, map matching, static map images, and tile feature lookup.

This research used local MPP metadata, public MPP wrapper docs/OpenAPI, and official Mapbox documentation snapshots only. No paid endpoints, API keys, account actions, wallet signatures, or mutations were used.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Address And Place Geocoding | 2 | Normalize addresses and places, reverse geocode coordinates, validate location precision, and enrich records with geography. | [api-uses/address-and-place-geocoding.md](api-uses/address-and-place-geocoding.md) |
| Routing And Trip Planning | 1 | Compute routes, ETAs, distances, geometry, steps, route alternatives, and segment annotations. | [api-uses/routing-and-trip-planning.md](api-uses/routing-and-trip-planning.md) |
| Travel-Time Matrices And Reachability | 2 | Compare travel times between many points and draw reachable service areas around a point. | [api-uses/travel-time-matrices-and-reachability.md](api-uses/travel-time-matrices-and-reachability.md) |
| GPS Trace Cleanup And Road Matching | 1 | Snap noisy GPS traces to roads, identify outliers, and create clean trip geometry. | [api-uses/gps-trace-cleanup-and-road-matching.md](api-uses/gps-trace-cleanup-and-road-matching.md) |
| Static Map Rendering | 1 | Render portable static map images with markers, paths, GeoJSON, attribution, and sizing controls. | [api-uses/static-map-rendering.md](api-uses/static-map-rendering.md) |
| Spatial Feature Lookup | 1 | Query Mapbox-hosted tileset features or rasterarray values at or near a point. | [api-uses/spatial-feature-lookup.md](api-uses/spatial-feature-lookup.md) |

## Highest-Value Uses

The strongest use cases are practical location workflows where fields directly change a decision: validating delivery addresses before fulfillment, choosing the nearest driver or facility by travel time, drawing service areas for site planning, reconstructing fleet trips from noisy GPS, embedding map evidence in support workflows, and tagging coordinates with custom tile-layer attributes.

The wrapper is most useful for accountless or low-volume access to Mapbox-style location APIs. It is less differentiated where a team already has a Mapbox account and access token, because Mapbox publishes pay-as-you-go pricing and free tiers for the same endpoint families.

## Personal Use Opportunities

Personal workflows include address autocomplete, choosing a route by ETA and road exclusions, comparing travel time to stores or clinics, mapping areas reachable by walking or cycling, cleaning a noisy activity trace, generating travel itinerary maps, and querying a point on a custom or public Mapbox tileset.

These uses are best when the output remains transient or is displayed on a Mapbox map, because provider docs include storage and display restrictions for several endpoint families.

## Business Use Opportunities

Business workflows include checkout address validation, territory and market enrichment, delivery or field-service dispatch, service-area design, site selection, SLA feasibility checks, fleet trip reconstruction, speed-limit or congestion triage, support evidence maps, and custom operational layer lookups.

The decision-critical fields are `match_code`, `coordinates.accuracy`, `routable_points`, route `duration` and `distance`, Matrix `durations[][]`, Isochrone GeoJSON, Map Matching `confidence` and `tracepoints[]`, Static Image overlays, and Tilequery feature properties.

## Endpoint Group Summaries

### Address And Place Geocoding

Forward and reverse geocoding normalize user-entered text and coordinates into structured location context. The most useful outputs are coordinates, administrative hierarchy, Mapbox IDs, address accuracy, routable points, and match confidence. Full details: [api-uses/address-and-place-geocoding.md](api-uses/address-and-place-geocoding.md).

### Routing And Trip Planning

Directions computes routes between ordered waypoints for driving, traffic-aware driving, walking, and cycling. It supports ETAs, distance, geometry, optional steps, route alternatives, and segment annotations for speed, congestion, maxspeed, closure, distance, and duration. Full details: [api-uses/routing-and-trip-planning.md](api-uses/routing-and-trip-planning.md).

### Travel-Time Matrices And Reachability

Matrix compares discrete origin-destination pairs, while Isochrone turns one origin into reachable polygons or lines by time or distance. Together they support dispatch, site selection, service-area planning, and accessibility analysis. Full details: [api-uses/travel-time-matrices-and-reachability.md](api-uses/travel-time-matrices-and-reachability.md).

### GPS Trace Cleanup And Road Matching

Map Matching converts noisy GPS traces into road-aligned route geometry with confidence and tracepoint-level ambiguity/outlier signals. It is valuable for fleet analytics, fitness trace cleanup, incident timelines, and telemetry quality control. Full details: [api-uses/gps-trace-cleanup-and-road-matching.md](api-uses/gps-trace-cleanup-and-road-matching.md).

### Static Map Rendering

Static Image turns known map state and overlays into portable PNG/JPEG-style visual artifacts. It is useful for emails, reports, support tickets, alerts, and QA snapshots where interactive maps are unnecessary or unavailable. Full details: [api-uses/static-map-rendering.md](api-uses/static-map-rendering.md).

### Spatial Feature Lookup

Tilequery answers point-based questions against Mapbox-hosted vector or rasterarray tilesets. It can identify nearby features, containing polygons, layer properties, and rasterarray values, but output meaning depends on the selected tileset schema. Full details: [api-uses/spatial-feature-lookup.md](api-uses/spatial-feature-lookup.md).

## Field And Data Themes

The dominant data theme is location normalization and network-aware travel time. Coordinates appear in every group, but different endpoints attach different semantics: geocoding returns place hierarchy, Directions returns ordered route geometry, Matrix returns pairwise duration/distance arrays, Isochrone returns coverage geometry, Map Matching returns snapped tracepoints, Static Image returns visual output, and Tilequery returns tileset-specific properties.

Quality-control fields matter throughout: `match_code`, `coordinates.accuracy`, null Matrix entries, Isochrone contour limits, Map Matching `confidence`, null tracepoints, Static Image cache behavior, and empty Tilequery FeatureCollections all tell consumers when not to overtrust a result.
