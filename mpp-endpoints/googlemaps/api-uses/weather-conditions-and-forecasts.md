# Google Maps: Weather Conditions And Forecasts API Uses

## What This Endpoint Group Does

Return current, forecast, and historical weather conditions at a coordinate.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /weather/v1/currentConditions:lookup | Get current weather conditions | location.latitude, location.longitude, unitsSystem, languageCode, pageSize, pageToken | interval, temperature, feelsLikeTemperature, relativeHumidity, uvIndex, precipitation, thunderstormProbability, airPressure |
| GET | /weather/v1/forecast/hours:lookup | Get hourly weather forecast | location.latitude, location.longitude, unitsSystem, languageCode, pageSize, pageToken | interval, temperature, feelsLikeTemperature, relativeHumidity, uvIndex, precipitation, thunderstormProbability, airPressure |
| GET | /weather/v1/forecast/days:lookup | Get daily weather forecast | location.latitude, location.longitude, unitsSystem, languageCode, pageSize, pageToken | interval, temperature, feelsLikeTemperature, relativeHumidity, uvIndex, precipitation, thunderstormProbability, airPressure |
| GET | /weather/v1/history/hours:lookup | Get hourly weather history | location.latitude, location.longitude, unitsSystem, languageCode, pageSize, pageToken | interval, temperature, feelsLikeTemperature, relativeHumidity, uvIndex, precipitation, thunderstormProbability, airPressure |

## Field Notes

### Inputs

- latitude/longitude
- units system
- language
- page size/token

### Outputs

- temperature
- feels-like temperature
- humidity
- UV index
- precipitation
- wind
- visibility
- cloud cover
- weather condition
- forecast/history intervals

### Important Constraints Or Gaps

- Direct Google Maps Platform use normally requires an API key or OAuth, enabled APIs, a Google Cloud project, billing, quotas, and compliance with Google Maps Platform terms. The MPP wrapper hides direct key setup but the public feed does not document wrapper-specific error schemas or transformations.
- Several newer APIs require field masks or optional response field selection. Missing field masks can change output shape and billing tier.
- Image, tile, photo, and video endpoints return binary media, redirects, media URLs, or tileset metadata rather than uniform JSON.

## Use Cases

### Trip And Outdoor Activity Decisions

A person can compare hourly and daily forecasts for precipitation, wind, UV, visibility, and temperature before choosing when to travel, hike, commute, or host an outdoor gathering.

### Weather-Aware Operations

Delivery, field service, agriculture, construction, and event businesses can use current and forecast weather to adjust staffing, safety guidance, routing buffers, and cancellation policies. Historical hourly weather helps explain delays or service-quality exceptions after the fact.

### Contextual Customer Messaging

Retailers, travel apps, and local services can trigger timely messages using weather condition fields, such as reminding customers about rain gear, heat risk, or poor visibility. This is valuable only when messaging respects consent and avoids over-personalized inference.
