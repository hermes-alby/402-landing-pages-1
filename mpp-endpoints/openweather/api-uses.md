# OpenWeather API Uses

## Service Summary

OpenWeather provides global weather and environmental data. The MPP wrapper exposes seven paid-per-request endpoints for geocoding, current conditions, five-day forecasts, air quality, One Call forecasts, and natural-language weather summaries. Its strongest API-use value is adding weather context to decisions without requiring the caller to manage a direct OpenWeather account, API key, or monthly plan for occasional requests.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Location Resolution | 2 | Turn place text into coordinates, or coordinates into readable place labels. | [location-resolution.md](api-uses/location-resolution.md) |
| Current Conditions | 1 | Make immediate decisions from current temperature, wind, visibility, precipitation, and condition text. | [current-conditions.md](api-uses/current-conditions.md) |
| Forecast Planning | 1 | Plan near-term work, travel, events, and demand around 3-hour forecast windows. | [forecast-planning.md](api-uses/forecast-planning.md) |
| Air Quality Risk | 1 | Screen current pollution exposure using AQI and pollutant components. | [air-quality-risk.md](api-uses/air-quality-risk.md) |
| Full Weather Suite And Summaries | 2 | Retrieve richer One Call forecast blocks, alerts, and plain-language weather briefings. | [full-weather-suite-and-summaries.md](api-uses/full-weather-suite-and-summaries.md) |

## Highest-Value Uses

The most valuable uses are operational workflows where weather changes decisions: dispatching crews, selecting outdoor work windows, routing or delaying deliveries, changing event setup, warning travelers, moving school or fitness activities indoors, and adding alert-aware context to customer communications.

The One Call and forecast endpoints are highest-value when timing matters because they expose forecast windows, precipitation probability, wind, UV, and alerts. Current conditions and air quality are strongest for immediate go/no-go decisions. Geocoding is an enabling step that keeps all downstream weather calls tied to the intended location.

## Personal Use Opportunities

Personal assistants can resolve ambiguous locations, summarize today or tomorrow's weather, choose safer commute or exercise windows, warn about poor air quality, and recommend clothing or gear from current and forecast fields. The Weather Overview endpoint is useful when a person wants a readable answer instead of raw weather blocks.

## Business Use Opportunities

Businesses can enrich job sites, stores, deliveries, venues, and travel itineraries with weather context. Concrete workflows include rescheduling wind- or rain-sensitive work, sending customer delay notices, adjusting staffing for outdoor events, changing inventory or merchandising ahead of local weather, and routing safety review when air quality or official alerts cross thresholds.

## Endpoint Group Summaries

### Location Resolution

Geocoding and reverse geocoding convert between user-friendly place labels and the coordinates required by weather endpoints. This is essential for avoiding wrong-city matches and for making coordinate-based alerts readable. Full details: [api-uses/location-resolution.md](api-uses/location-resolution.md).

### Current Conditions

Current Weather returns the immediate state at a coordinate: temperature, feels-like, wind, visibility, clouds, recent rain/snow, humidity, pressure, and daylight metadata. It supports same-moment decisions for dispatch, smart-home automation, event messaging, and logistics triage. Full details: [api-uses/current-conditions.md](api-uses/current-conditions.md).

### Forecast Planning

The 5-day forecast endpoint provides up to 40 3-hour forecast records. Its `pop`, rain/snow, wind, visibility, temperature, and weather-description fields support near-term scheduling and demand planning. Full details: [api-uses/forecast-planning.md](api-uses/forecast-planning.md).

### Air Quality Risk

Air Quality returns AQI and pollutant concentrations for current exposure screening. It is valuable for sensitive-person activity decisions, workplace safety review, travel comfort, and environmental incident context. Full details: [api-uses/air-quality-risk.md](api-uses/air-quality-risk.md).

### Full Weather Suite And Summaries

One Call combines current, minutely, hourly, daily, and alert data, while Weather Overview supplies a concise narrative for today or tomorrow. This group is best for severe-weather triage, richer planning, and customer-facing briefings. Full details: [api-uses/full-weather-suite-and-summaries.md](api-uses/full-weather-suite-and-summaries.md).

## Field And Data Themes

Most endpoints are coordinate-first: `lat` and `lon` are the recurring identifiers. `units` and `lang` shape output usability. Important quantity fields include temperature, feels-like temperature, wind speed/gust, humidity, pressure, visibility, precipitation probability, rain/snow volume, UV index, AQI, and pollutant components. Important timestamps include current observation time, forecast item time, sunrise/sunset, and alert start/end.
