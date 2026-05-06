# Google Maps API Uses

## Service Summary

Google Maps via MPP exposes a broad Google Maps Platform surface for location intelligence: addresses, places, routes, maps, imagery, roads, solar, elevation, air quality, pollen, geolocation, and weather. The strongest MPP fit is occasional or agentic access where the caller wants a few paid calls without setting up Google Cloud projects, billing, API keys, and quota configuration.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Address And Location Intelligence | 5 | Resolve addresses, coordinates, device signals, time zones, and postal validity into normalized geographic facts. | [api-uses/address-location-intelligence.md](api-uses/address-location-intelligence.md) |
| Routing, Distance, And Roads | 6 | Calculate routes, travel time, origin-destination matrices, and road-snapped coordinates for logistics and mobility workflows. | [api-uses/routing-distance-and-roads.md](api-uses/routing-distance-and-roads.md) |
| Places Search And Details | 12 | Find, identify, describe, autocomplete, and visualize businesses or points of interest. | [api-uses/places-search-and-details.md](api-uses/places-search-and-details.md) |
| Map And Street View Imagery | 10 | Render static maps, Street View imagery, tiles, and aerial videos for visual inspection or presentation. | [api-uses/map-and-streetview-imagery.md](api-uses/map-and-streetview-imagery.md) |
| Terrain And Solar Property Assessment | 3 | Return elevation and solar roof/imagery layers for terrain, siting, and solar potential analysis. | [api-uses/terrain-and-solar-property-assessment.md](api-uses/terrain-and-solar-property-assessment.md) |
| Environmental Air And Allergy | 3 | Look up current and historical air quality plus pollen forecasts for health, travel, and operations decisions. | [api-uses/environmental-air-and-allergy.md](api-uses/environmental-air-and-allergy.md) |
| Weather Conditions And Forecasts | 4 | Return current, forecast, and historical weather conditions at a coordinate. | [api-uses/weather-conditions-and-forecasts.md](api-uses/weather-conditions-and-forecasts.md) |

## Highest-Value Uses

- Clean and validate addresses before shipping, dispatch, onboarding, or CRM insertion.
- Rank local places, vendors, stores, or leads using place IDs, categories, coordinates, hours, ratings, contact fields, and photos.
- Choose delivery, service, or travel options using route duration, matrix elements, traffic-aware estimates, and road-snapped traces.
- Prequalify solar and property opportunities using building insights, imagery quality, roof segment statistics, elevation, and solar layer URLs.
- Adjust outdoor plans and operations with current/forecast weather, air quality, pollen, and historical conditions.
- Add trustworthy map, Street View, tile, or aerial context to reports, reviews, listings, and operational records.

## Personal Use Opportunities

Individuals can plan trips, compare routes, inspect properties, validate addresses, choose local businesses, avoid poor air or pollen conditions, and schedule across time zones. The most useful personal flows combine multiple groups: for example, autocomplete a place, fetch details and photos, route to it, then check weather or air quality before going.

## Business Use Opportunities

Businesses can enrich customer and vendor records, improve checkout success, dispatch workers, screen service areas, generate location evidence for support cases, rank solar leads, and adapt operations to weather or environmental risk. MPP access is most attractive for low-volume automations, prototypes, agents, and marketplace flows where direct Google Cloud setup is heavier than the task warrants.

## Endpoint Group Summaries

### Address And Location Intelligence

Resolve addresses, coordinates, device signals, time zones, and postal validity into normalized geographic facts. Full detail: [api-uses/address-location-intelligence.md](api-uses/address-location-intelligence.md).

### Routing, Distance, And Roads

Calculate routes, travel time, origin-destination matrices, and road-snapped coordinates for logistics and mobility workflows. Full detail: [api-uses/routing-distance-and-roads.md](api-uses/routing-distance-and-roads.md).

### Places Search And Details

Find, identify, describe, autocomplete, and visualize businesses or points of interest. Full detail: [api-uses/places-search-and-details.md](api-uses/places-search-and-details.md).

### Map And Street View Imagery

Render static maps, Street View imagery, tiles, and aerial videos for visual inspection or presentation. Full detail: [api-uses/map-and-streetview-imagery.md](api-uses/map-and-streetview-imagery.md).

### Terrain And Solar Property Assessment

Return elevation and solar roof/imagery layers for terrain, siting, and solar potential analysis. Full detail: [api-uses/terrain-and-solar-property-assessment.md](api-uses/terrain-and-solar-property-assessment.md).

### Environmental Air And Allergy

Look up current and historical air quality plus pollen forecasts for health, travel, and operations decisions. Full detail: [api-uses/environmental-air-and-allergy.md](api-uses/environmental-air-and-allergy.md).

### Weather Conditions And Forecasts

Return current, forecast, and historical weather conditions at a coordinate. Full detail: [api-uses/weather-conditions-and-forecasts.md](api-uses/weather-conditions-and-forecasts.md).

## Field And Data Themes

Across the service, the recurring inputs are addresses, coordinates, place IDs, text queries, time windows, route waypoints, field masks, language/region hints, and media sizing parameters. The recurring outputs are normalized identifiers, coordinates, distance and duration quantities, human-readable labels, business attributes, imagery/media references, timestamps, environmental indexes, and confidence or quality indicators.
