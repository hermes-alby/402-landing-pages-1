# Google Maps: Routing, Distance, And Roads API Uses

## What This Endpoint Group Does

Calculate routes, travel time, origin-destination matrices, and road-snapped coordinates for logistics and mobility workflows.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /maps/directions/json | Get directions between locations | origin, destination, mode, waypoints, alternatives, avoid, departure_time, arrival_time | routes, geocoded_waypoints, status |
| GET | /maps/distancematrix/json | Travel time and distance for origin-destination pairs | origins, destinations, mode, departure_time, arrival_time, traffic_model, avoid, language | origin_addresses, destination_addresses, rows.elements, status |
| POST | /routes/directions/v2:computeRoutes | Compute routes between locations | X-Goog-FieldMask, origin, destination, intermediates, travelMode, routingPreference, departureTime, arrivalTime | routes |
| POST | /routes/distanceMatrix/v2:computeRouteMatrix | Compute distance matrix | X-Goog-FieldMask, origins, destinations, travelMode, routingPreference, departureTime, arrivalTime, languageCode | originIndex, destinationIndex, status, condition, distanceMeters, duration, localizedValues |
| GET | /roads/v1/nearestRoads | Find nearest roads to coordinates | points | snappedPoints |
| GET | /roads/v1/snapToRoads | Snap GPS coordinates to roads | path, interpolate | snappedPoints |

## Field Notes

### Inputs

- origins
- destinations
- waypoints
- travel mode
- departure/arrival time
- traffic preference
- route modifiers
- GPS path points

### Outputs

- distance
- duration
- traffic-aware duration
- route polyline
- legs and steps
- matrix elements
- snapped road points
- road place IDs

### Important Constraints Or Gaps

- Direct Google Maps Platform use normally requires an API key or OAuth, enabled APIs, a Google Cloud project, billing, quotas, and compliance with Google Maps Platform terms. The MPP wrapper hides direct key setup but the public feed does not document wrapper-specific error schemas or transformations.
- Several newer APIs require field masks or optional response field selection. Missing field masks can change output shape and billing tier.
- Image, tile, photo, and video endpoints return binary media, redirects, media URLs, or tileset metadata rather than uniform JSON.

## Use Cases

### Delivery Promise And Dispatch Selection

A shopper can see realistic delivery or pickup timing before committing to a store. A delivery business can compare route durations and matrix elements across drivers, warehouses, or pickup windows, then assign the option with the best traffic-aware ETA.

### Territory And Service-Area Screening

A home-services marketplace can check whether a requested address is inside a practical drive-time radius rather than a straight-line radius. Matrix outputs let the business score coverage, price travel surcharges, or reject infeasible bookings before a human scheduler gets involved.

### GPS Trace Cleanup For Mileage And Compliance

A fleet or mileage app can snap noisy GPS points to roads and preserve original indexes for auditability. The cleaned path supports more defensible mileage, route reconstruction, and anomaly review than raw device points alone.
