# Mapbox: Routing And Trip Planning API Uses

## What This Endpoint Group Does

This group covers the Directions endpoint. It accepts a routing profile and ordered waypoint coordinates, then returns routes with distance, duration, geometry, snapped waypoints, optional alternatives, optional turn-by-turn steps, and optional segment annotations such as speed, congestion, maxspeed, closure, distance, and duration.

It is useful when a workflow needs to choose how to travel between known points, estimate ETA, render a route line, compare a primary route with alternatives, produce navigation instructions, or enrich a trip with segment-level road and traffic metadata.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mapbox/directions` | Compute routes between ordered waypoints. | `profile`, `coordinates`, `alternatives`, `steps`, `annotations`, `geometries`, `overview`, `language`, `exclude` | `routes[].distance`, `routes[].duration`, `routes[].geometry`, `routes[].legs`, `routes[].legs[].steps`, `routes[].legs[].annotation`, `waypoints[]`, `uuid` |

## Field Notes

### Inputs

`profile` selects driving, traffic-aware driving, walking, or cycling. `coordinates` is the ordered stop list; official docs allow 2-25 waypoints for standard routing. `alternatives` asks for up to two materially different routes when available. `steps`, `language`, and `geometries` determine whether the output can support user-facing guidance and map rendering.

`annotations` makes the endpoint useful for analysis rather than simple routing. With `overview=full`, annotations can return segment arrays for distance, duration, speed, congestion, maxspeed, and closures where supported. `exclude` lets a route avoid tolls, ferries, motorways, unpaved roads, or cash-only tolls, subject to profile support.

### Outputs

The core outputs are `routes[].distance`, `duration`, `geometry`, and `legs`. `legs[].steps` and each step's maneuver data support turn-by-turn guidance. `legs[].annotation` supports downstream analysis of road speed, congestion, closure, or distance/duration distribution along a route.

`waypoints[]` are snapped input coordinates, which helps detect whether the route starts or ends on the intended road network. `uuid` can identify a route response for support or downstream traceability.

### Important Constraints Or Gaps

The wrapper exposes a smaller request surface than the full provider API. Public wrapper schemas do not include many provider controls such as bearings, radiuses, approaches, waypoint names, voice/banner instructions, `waypoints_per_route`, or EV routing parameters.

Official docs state traffic-aware routing depends on supported geographies and can fall back where traffic coverage is unavailable. Directions is limited to 300 requests per minute by default, and intercontinental or water-body routes are not supported.

## Use Cases

### ETA And Route Choice For Delivery Or Pickup

A personal user can compare route duration, distance, and alternatives before deciding when to leave or whether a toll-free route is acceptable. The important inputs are `profile`, ordered `coordinates`, `alternatives`, and `exclude`; the useful outputs are `routes[].duration`, `distance`, `geometry`, and route legs.

For a business, these fields can power dispatch promises and pickup ETAs. A delivery system can calculate the fastest route, compare with a no-toll route, and store the selected `uuid`, distance, and duration for customer communication. The caveat is that traffic estimates require `mapbox/driving-traffic` and are geography-dependent.

### Route Preview And User-Facing Navigation Instructions

Apps that need a simple route preview can request `geometries=geojson` and draw `routes[].geometry` on a Mapbox map. If the workflow needs instructions, `steps=true` and `language` produce step objects and maneuver instructions for a user-facing itinerary.

For business operations, this enables driver apps, technician job details, and customer "driver is on the way" views. The key implementation decision is whether to request detailed steps and full geometry for every route or only after a user selects a route, because richer responses and paid calls add cost.

### Compliance-Aware Or Preference-Aware Route Screening

A driver or cyclist may want to avoid ferries, tolls, motorways, or unpaved roads. Businesses can encode vehicle or policy constraints with `exclude` and then review the resulting `routes[].distance`, `duration`, and geometry. A field service team, for example, can prefer routes that avoid cash-only tolls or unpaved roads when dispatching company vehicles.

This is not a full truck-routing compliance system from the exposed wrapper fields. Official provider docs have many additional constraints and notifications, but the MPP wrapper only exposes `exclude` as a high-level control. Workflows needing height, weight, hazmat, or EV charging constraints should not assume support from this wrapper without separate confirmation.

### Road Condition And Traffic Analysis Along A Trip

When `annotations` is used with `overview=full`, route legs can include segment-level distance, duration, speed, congestion, maxspeed, or closure data. A personal app can use this to explain why a route is slower than expected. A business can use it to flag routes affected by congestion or closure and decide whether to delay dispatch or choose an alternative.

The output is especially useful when combined with `alternatives=true`: compare primary and alternative routes not only by total duration but by where slowdowns occur. The limitation is field availability: congestion and closure data are profile- and geography-dependent, and wrapper runtime support for every provider annotation was not verified by paid calls.

### Multimodal Product Planning

Consumer apps and workplace tools can compare `mapbox/walking`, `mapbox/cycling`, `mapbox/driving`, and `mapbox/driving-traffic` for the same coordinates. This helps a person choose whether walking or cycling is practical, and helps businesses estimate service areas by mode before committing to a more expensive matrix or isochrone analysis.

The route outputs make the comparison concrete: total `duration`, `distance`, and `geometry` are enough to decide which travel mode to present. However, the endpoint returns routes between ordered waypoints, not public transit schedules or fare data, so use cases requiring transit, rideshare price, or vehicle availability need additional APIs.
