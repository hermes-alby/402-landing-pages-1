# Google Maps: Map And Street View Imagery API Uses

## What This Endpoint Group Does

Render static maps, Street View imagery, tiles, and aerial videos for visual inspection or presentation.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /maps/staticmap | Generate a static map image | center, zoom, size, scale, format, maptype, markers, path | binary_image |
| GET | /maps/streetview | Get a static Street View image | size, location, pano, heading, fov, pitch, radius, source | binary_image |
| GET | /maps/streetview/metadata | Get Street View metadata | location, pano, heading, radius, source | status, pano_id, date, location, copyright |
| GET | /tiles/v1/createSession | Create a tile session | mapType, language, region, layerTypes, overlay, scale | session, expiry, tileWidth, tileHeight, imageFormat |
| GET | /tiles/v1/2dtiles/:z/:x/:y | Get a 2D map tile | z, x, y, session | binary_image |
| GET | /tiles/v1/streetview/tiles/:panoId/:z/:x/:y | Get a Street View tile | panoId, z, x, y, session | binary_image |
| GET | /tiles/v1/3dtiles/root.json | Get 3D tiles root | session | asset, geometricError, root |
| GET | /aerialview/v1/videos:lookupVideo | Look up an aerial view video | address, videoId | videoId, state, uris, metadata |
| POST | /aerialview/v1/videos:renderVideo | Render an aerial view video | address | metadata |
| GET | /aerialview/v1/videos:lookupVideoMetadata | Look up video metadata | address, videoId | videoId, state, uris, metadata |

## Field Notes

### Inputs

- map viewport
- markers
- paths
- tile coordinates
- session token
- panorama ID
- camera heading/FOV/pitch
- address

### Outputs

- map images
- Street View images
- tile images
- 3D tileset metadata
- panorama metadata
- aerial video IDs and URIs

### Important Constraints Or Gaps

- Direct Google Maps Platform use normally requires an API key or OAuth, enabled APIs, a Google Cloud project, billing, quotas, and compliance with Google Maps Platform terms. The MPP wrapper hides direct key setup but the public feed does not document wrapper-specific error schemas or transformations.
- Several newer APIs require field masks or optional response field selection. Missing field masks can change output shape and billing tier.
- Image, tile, photo, and video endpoints return binary media, redirects, media URLs, or tileset metadata rather than uniform JSON.

## Use Cases

### Property Or Job-Site Visual Triage

A homeowner can inspect Street View, static maps, and aerial video availability before visiting a property. Insurers, contractors, and solar installers can add imagery to intake workflows so reviewers understand access, frontage, roof shape, or surroundings before dispatch.

### Lightweight Map Evidence In Reports

A researcher or analyst can embed static map images with markers and paths into a report without building an interactive map UI. Businesses can attach consistent location visuals to CRM records, delivery exceptions, incident reports, or customer emails.

### Custom Map Rendering Pipelines

Teams building map clients can use tile sessions and 2D, Street View, or 3D tile endpoints to render controlled map experiences. The value is highest when paired with caching, attribution, quota awareness, and strict compliance with Google Maps terms.
