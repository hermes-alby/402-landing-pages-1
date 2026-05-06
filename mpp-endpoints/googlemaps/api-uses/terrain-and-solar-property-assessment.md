# Google Maps: Terrain And Solar Property Assessment API Uses

## What This Endpoint Group Does

Return elevation and solar roof/imagery layers for terrain, siting, and solar potential analysis.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /maps/elevation/json | Get elevation for locations | locations, path, samples | results, status |
| GET | /solar/v1/buildingInsights:findClosest | Get building solar insights | location.latitude, location.longitude, requiredQuality, exactQualityRequired | name, center, boundingBox, imageryDate, imageryQuality, solarPotential |
| GET | /solar/v1/dataLayers:get | Get solar data layers | location.latitude, location.longitude, radiusMeters, view, requiredQuality, pixelSizeMeters | imageryDate, imageryQuality, metadataUrl, rgbUrl, dsmUrl, annualFluxUrl, monthlyFluxUrl, hourlyShadeUrls |

## Field Notes

### Inputs

- latitude/longitude
- path samples
- imagery quality
- radius
- pixel size
- layer view

### Outputs

- elevation
- resolution
- building center
- imagery date/quality
- solar potential
- roof segment stats
- flux/shade/model layer URLs

### Important Constraints Or Gaps

- Direct Google Maps Platform use normally requires an API key or OAuth, enabled APIs, a Google Cloud project, billing, quotas, and compliance with Google Maps Platform terms. The MPP wrapper hides direct key setup but the public feed does not document wrapper-specific error schemas or transformations.
- Several newer APIs require field masks or optional response field selection. Missing field masks can change output shape and billing tier.
- Image, tile, photo, and video endpoints return binary media, redirects, media URLs, or tileset metadata rather than uniform JSON.

## Use Cases

### Solar Lead Prequalification

A homeowner can estimate whether a roof is worth a solar consultation before sharing detailed utility data. A solar company can use building insights, imagery quality, roof segment statistics, sunshine, panel configuration, and financial-analysis fields to rank inbound leads.

### Terrain-Aware Outdoor Planning

A hiker, cyclist, or event planner can sample elevation along a path before choosing a route. Businesses planning telecommunications, signage, drainage, or site visits can add elevation and resolution fields to feasibility checks.

### Roof And Shade Analysis Prep

Solar data layer URLs give technical teams raw inputs for deeper roof modeling, shade analysis, or proposal visualization. The caveat is that imagery date, quality, and layer coverage must be checked before treating the output as current engineering truth.
