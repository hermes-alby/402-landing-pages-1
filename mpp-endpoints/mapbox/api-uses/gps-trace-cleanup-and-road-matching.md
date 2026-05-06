# Mapbox: GPS Trace Cleanup And Road Matching API Uses

## What This Endpoint Group Does

This group covers Map Matching. It accepts a sequence of GPS trace coordinates and snaps them to Mapbox's road and path network. It returns matched route geometry, route legs, confidence, and tracepoints that identify where each input point snapped or whether it was omitted as an outlier.

The endpoint is useful when raw GPS data is too noisy for analytics, route display, distance calculation, speed-limit analysis, or map-based user experiences.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mapbox/map-matching` | Snap noisy trace points to road/path network and return matched route objects. | `profile`, `coordinates`, `annotations`, `geometries`, `overview`, `radiuses`, `steps`, `timestamps`, `tidy` | `matchings[].confidence`, `matchings[].geometry`, `matchings[].legs`, `matchings[].distance`, `matchings[].duration`, `tracepoints[]`, `tracepoints[].alternatives_count`, `tracepoints[].location`, `tracepoints[].name` |

## Field Notes

### Inputs

`coordinates` is the raw trace, with official docs supporting 2-100 regular coordinate pairs. `profile` determines the network used for snapping. `radiuses` controls how far each point may move to find a routable segment; larger values help noisy traces but can create false matches.

`timestamps` improve matching when they are present for every coordinate in ascending order, and official docs recommend roughly 5-second sample rates for best results. `tidy` can clean coordinate clusters. `annotations`, `geometries`, `overview`, and `steps` control how much route detail comes back.

### Outputs

`matchings[]` contains route-like objects with `confidence`, `geometry`, `legs`, `distance`, and `duration`. A clean trace usually returns one match. Multiple match objects can indicate ambiguous or disconnected matching.

`tracepoints[]` are critical for quality control. A tracepoint can be `null` if the input point was omitted as an outlier. `alternatives_count` identifies ambiguous snaps, while `location` and `name` show the snapped road/path position.

### Important Constraints Or Gaps

Official docs limit Map Matching to 300 requests per minute and 100 regular coordinates per request. Results must be displayed on a Mapbox map using Mapbox libraries or SDKs.

The wrapper does not expose several provider fields, including OpenLR input controls, ignored restrictions, selected waypoint indices, waypoint names, and linear references. The wrapper response schema is not published, so response fields are provider-derived.

## Use Cases

### Fitness And Outdoor Activity Cleanup

A person recording a ride, run, hike, or drive often gets noisy GPS points near buildings, tunnels, or urban canyons. Map Matching can snap the trace back to the walking, cycling, or driving network and return a cleaner `geometry`, `distance`, and `duration`.

The useful fields are `profile`, `coordinates`, `timestamps`, `radiuses`, `matchings[].confidence`, and `tracepoints[]`. A personal app can show a cleaned route line and flag low-confidence sections where the user might need to edit or split the activity.

### Fleet Trip Reconstruction

A delivery, rideshare, trucking, or field service business can use Map Matching to reconstruct completed trips from GPS pings. The matched `geometry`, `distance`, `duration`, and route legs create a more reliable trip record than raw points, and `tracepoints[].name` can add road context.

This supports mileage auditing, route adherence, customer dispute resolution, and post-trip analytics. Low `confidence`, null tracepoints, or high `alternatives_count` should trigger review rather than automatic billing or performance scoring, especially when GPS sampling is sparse.

### Speed Limit And Road Segment Enrichment

When `annotations=maxspeed` is requested where supported, Map Matching can enrich a cleaned route with speed-limit data. A personal dashcam or driving log could annotate where a trip occurred relative to known limits. A fleet safety team can compare observed telemetry against matched road segments and posted limits.

The main value is joining telemetry to the road network. The caveat is that speed-limit availability and accuracy vary; official docs mark maxspeed as beta in related navigation docs. This should support triage or coaching, not standalone enforcement without validation.

### GPS Outlier And Data Quality Detection

A location-data pipeline can use `tracepoints[]` to identify outlier points, ambiguous points, and traces that split into multiple matches. A personal user sees this as a cleaned path; a business sees it as data quality scoring before analytics.

Fields such as `tracepoints[].alternatives_count`, `tracepoints[].location`, null tracepoints, and `matchings[].confidence` are the key decision inputs. Trips with too many nulls or ambiguous alternatives can be excluded from KPI calculations or sent through a higher-cost review path.

### Map-Matched Incident Or Asset Timeline

Operations teams can reconstruct where an asset traveled before an incident by matching timestamped GPS traces to named roads. The output can support an evidence pack with route geometry, matched road names, and suspicious gaps or outliers.

This is useful for insurance, maintenance, and field operations, but it has a clear limitation: matching depends on sampling quality, profile choice, and road-network coverage. The workflow should preserve the raw trace, matched result, confidence, and null tracepoints so later reviewers can see where inference was involved.
