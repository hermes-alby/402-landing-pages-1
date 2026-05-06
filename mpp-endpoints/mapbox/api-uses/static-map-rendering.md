# Mapbox: Static Map Rendering API Uses

## What This Endpoint Group Does

This group covers Static Image rendering. It accepts a Mapbox style, map position, image size, optional overlays, retina setting, attribution/logo controls, and padding, then returns a static map image. The public MPP docs say the wrapper returns base64-encoded image data.

This endpoint is useful when a workflow needs a portable visual artifact rather than an interactive map: reports, emails, support tickets, receipts, alerts, PDFs, previews, or evidence packs.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/mapbox/static-image` | Render a static map image from style, viewport, size, and overlay controls. | `style`, `position`, `size`, `overlay`, `retina`, `attribution`, `logo`, `padding` | Base64 image data per MPP docs; provider content type is PNG for vector-layer styles and JPEG for raster-only styles |

## Field Notes

### Inputs

`style` chooses the visual base map, such as streets, light, dark, outdoors, satellite, or satellite-streets. `position` can be a fixed center/zoom or `auto` to fit overlays. `size` controls pixel dimensions, with official docs capping width and height at 1280 pixels.

`overlay` is the practical value driver. It can encode markers, paths, custom markers, or GeoJSON overlays. `padding` controls auto-fit spacing, while `retina` requests high-DPI output. `attribution` and `logo` affect the rendered image but also carry legal obligations.

### Outputs

The wrapper docs state the endpoint returns base64-encoded image data, but the exact JSON field is not described in the public OpenAPI. Official provider docs return a PNG for styles with vector layers and a JPEG for styles containing only raster layers.

The image can be embedded into documents, emails, chat messages, support tickets, static sites, or generated reports without running an interactive map client.

### Important Constraints Or Gaps

Official docs state that if `attribution=false`, the caller remains legally responsible for proper attribution elsewhere. Static Images has documented caching behavior; changes to styles or data can take up to 12 hours to propagate in some cases.

The wrapper does not expose advanced provider style parameters such as `addlayer`, `setfilter`, `layer_id`, `before_layer`, bearing, or pitch as first-class fields. The public OpenAPI does not expose the exact response schema.

## Use Cases

### Delivery, Ride, Or Appointment Confirmation Maps

A person receiving a delivery, pickup, or appointment reminder can see a static map with a marker for the location and maybe a path overlay. The workflow combines a known coordinate with `style`, `position`, `size`, and `overlay`, then embeds the returned image in email, SMS, or a ticket.

For a business, this reduces ambiguity without requiring an interactive map load. The key inputs are `overlay` for pins or paths, `position=auto` for fitting, and `size` for the target channel. Attribution and logo settings should be handled carefully so the rendered communication remains compliant.

### Static Evidence For Support And Disputes

Support teams can attach a static map to a delivery dispute, route incident, property inspection, or service ticket. The map can show the claimed location, geocoded address, route segment, or service-area boundary using overlays.

The image is valuable because it freezes the location context at review time and can be shared in systems that cannot render interactive maps. Because Static Images can be cached and styles can update slowly, high-stakes evidence should preserve the request fields and source coordinates alongside the image.

### Reports, PDFs, And Executive Briefs

Analysts creating real estate, retail, logistics, or field operations reports can include static maps that highlight candidate sites, depots, branches, catchments, or routes. A personal user could use the same workflow to add clean maps to a travel itinerary or relocation notes.

The fields that matter are `style`, `position`, `size`, `overlay`, and `padding`. Static output is easier to embed than interactive maps, but it is not searchable GIS data; any decision workflow should also preserve the coordinates and analysis that produced the overlay.

### Alert Images For Operations Channels

An operations system can send a map image to Slack, email, or an incident-management tool when a driver deviates, a sensor event occurs, or a field task is assigned. Markers and paths in `overlay` can make the alert understandable at a glance.

The business value is speed: recipients do not need to open a separate map app to understand where the issue is. The limitation is that static images do not support pan/zoom or layer toggles, so complex incidents should link to a richer map or include the raw coordinates.

### Visual QA For Geocoding And Routing Pipelines

Teams can render sampled geocoding or routing outputs as static maps to audit whether points, routable points, and route lines look plausible. A QA reviewer can compare the marker or path overlay against the base map and flag bad geocodes or route anomalies.

This pairs well with the Geocoding, Directions, Matrix, or Map Matching groups. The static image itself does not prove correctness, but it gives a cheap, portable review artifact. Batch QA should manage paid-call cost and avoid storing images without considering Mapbox attribution and terms.
