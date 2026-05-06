# Mapbox: Travel-Time Matrices And Reachability API Uses

## What This Endpoint Group Does

This group combines Matrix and Isochrone because both answer travel-time planning questions. Matrix compares travel time and distance between many origin-destination pairs. Isochrone converts a single origin and travel mode into reachable areas by time or distance.

Together, these endpoints support allocation, site selection, service-area design, logistics planning, and accessibility analysis. Matrix is best for discrete candidates; Isochrone is best for geographic coverage.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mapbox/matrix` | Compute duration and/or distance matrices between source and destination coordinates. | `profile`, `coordinates`, `sources`, `destinations`, `annotations`, `approaches` | `durations[][]`, `distances[][]`, `sources[]`, `destinations[]`, nulls for unroutable pairs |
| POST | `/mapbox/isochrone` | Generate reachable-area GeoJSON contours around one coordinate. | `profile`, `coordinates`, `contours_minutes`, `contours_meters`, `polygons`, `denoise`, `generalize`, `exclude` | `features[].properties.contour`, `metric`, style properties, `features[].geometry` |

## Field Notes

### Inputs

Matrix requires `profile` and a semicolon-separated list of coordinates. `sources` and `destinations` select asymmetric matrices, which is central for one-to-many or many-to-one comparisons. `annotations` chooses duration, distance, or both. Official docs bill Matrix by source x destination elements rather than by raw request.

Isochrone requires one `coordinates` value and either `contours_minutes` or `contours_meters`, not both. It supports up to four contours per request. `polygons` controls whether the result is a filled area or line contours, while `denoise`, `generalize`, and `exclude` tune shape quality and route restrictions.

### Outputs

Matrix returns row-major arrays where `durations[i][j]` and `distances[i][j]` describe travel from a source to a destination. Null values matter: they identify unroutable pairs that should not be hidden in downstream ranking.

Isochrone returns a GeoJSON FeatureCollection. Each feature has a contour value, a `metric` of time or distance, style-oriented color/fill fields, and geometry. These geometries are directly useful for map overlays, coverage tests, and spatial joins.

### Important Constraints Or Gaps

Matrix driving/walking/cycling supports up to 25 input coordinates by official docs, while driving-traffic supports up to 10. Minimum output is two elements and maximum is 625 elements. The public MPP metadata says Matrix costs `$0.002/element`, but does not expose the exact wrapper precharge calculation.

Isochrone supports one coordinate and up to four contours. Official docs say Isochrone results must be displayed on a Mapbox map. The wrapper does not expose provider fields such as `depart_at` or `contours_colors`.

## Use Cases

### Nearest Provider, Driver, Or Facility Selection

A personal user can compare travel time from their location to several clinics, stores, trailheads, or pickup points. The workflow sends one source and multiple destinations with `annotations=duration,distance`, then ranks options by `durations[0][j]` and `distances[0][j]`.

For a business, the same matrix powers dispatch assignment: choose the nearest available driver, technician, warehouse, or branch for a job. Null matrix entries should be treated as exceptions rather than ranked as zero. Because Matrix is priced by elements, systems should only include viable candidates after filtering by geography or availability.

### Service-Area And Coverage Design

Isochrone can draw 10, 20, 30, or 60-minute reachable areas around a store, depot, clinic, school, or station. A person can use this to choose where to live or whether a destination is reachable by bike or walking. A business can map where it can deliver, dispatch, or serve within an SLA.

The fields that matter are `profile`, `contours_minutes` or `contours_meters`, `polygons`, and the returned `features[].geometry`. Those polygons can be overlaid with demand, customer, or asset locations. The caveat is that isochrones are modeled by routing profile and traffic coverage; they are not a guarantee of real-world access at every time.

### Site Selection And Catchment Comparison

Retail, healthcare, logistics, and real estate teams can compare candidate sites by combining Isochrone polygons with Matrix scores to known demand points. Isochrone tells the broad area reachable from each candidate, while Matrix quantifies travel time to specific high-value locations.

This is stronger than measuring straight-line distance. `durations[][]` can reveal that two candidates with similar radius coverage have very different road-network access. Businesses should preserve profile and exclusion settings, because driving, walking, and cycling catchments can produce different decisions.

### Appointment Scheduling And Route Feasibility

A personal planner can check whether a sequence of errands is realistic by querying travel times between home, stops, and appointments. A business scheduler can use Matrix to screen whether a technician can make a requested time window from any current or previous job location.

The useful fields are `sources`, `destinations`, and `durations[][]`. For many jobs, the system can query only candidate origin-destination pairs instead of a full symmetric matrix to reduce element cost. If using traffic-aware profiles, supported geographies and time assumptions must be considered.

### Emergency Or Field Response Readiness

Public sector, campus operations, and facility teams can use Isochrone to map reachable areas from depots or responders, then Matrix to rank exact response choices for incidents. A personal safety app could estimate reachable clinics or safe locations within a travel-time band.

This should be treated as planning support, not a life-safety guarantee. Official docs include rate limits, traffic/geography caveats, and null-route conditions; workflows should preserve nulls, avoid overpromising, and validate critical operational use with authoritative systems.

### Territory Balancing And Workload Allocation

Sales, service, and delivery teams can use travel-time matrices to assign accounts or stops to territories based on drive-time burden rather than ZIP code alone. Isochrone polygons can visualize the resulting coverage and reveal gaps or overlaps.

The main business value is better workload fairness and lower travel waste. The fields that enable this are `distances[][]`, `durations[][]`, and isochrone `features[].geometry`. Cost control matters because large candidate sets scale as sources x destinations, so prefiltering and batching strategy are part of the workflow design.
