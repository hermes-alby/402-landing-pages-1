# OpenWeather: Current Conditions API Uses

## What This Endpoint Group Does

This endpoint returns real-time weather context for a coordinate: temperature, perceived temperature, pressure, humidity, weather condition text, wind, cloud cover, visibility, recent rain or snow, sunrise/sunset, timezone, and place metadata. It is best for immediate decisions rather than future scheduling.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/openweather/current-weather` | Fetch current weather conditions for coordinates. | `lat`, `lon`, `units`, `lang` | `weather`, `main`, `visibility`, `wind`, `clouds`, `rain`, `snow`, `dt`, `sys`, `timezone`, `name` |

## Field Notes

### Inputs

`lat` and `lon` are required. `units` controls whether temperature and speed are returned in standard, metric, or imperial units. `lang` localizes weather descriptions where supported.

### Outputs

The most decision-ready outputs are `main.temp`, `main.feels_like`, `main.humidity`, `wind.speed`, `wind.gust`, `visibility`, `clouds.all`, `rain.1h`, `snow.1h`, `weather[].description`, and `dt`. `sys.sunrise`, `sys.sunset`, and `timezone` help interpret local daylight and time.

### Important Constraints Or Gaps

The MPP OpenAPI does not publish a response schema, so response fields are derived from OpenWeather current weather docs. Current weather is a snapshot, not a forecast; use the forecast or One Call endpoints for planning later time windows.

## Use Cases

### Field-Service Dispatch Checks

A dispatcher can check `temp`, `feels_like`, `humidity`, `wind.speed`, `visibility`, and recent `rain` or `snow` before assigning outdoor work. A personal user gets the same benefit when deciding whether to bike, walk, or delay a chore.

For businesses, the value is operational triage: route crews differently, add weather gear, pause unsafe ladder work, or warn customers about weather delays. The endpoint should be treated as current context only; a job scheduled hours later needs forecast data too.

### Weather-Aware Smart Home Or Building Automation

A home automation agent can combine `temp`, `feels_like`, humidity, clouds, sunrise/sunset, and weather descriptions to decide whether to pre-cool, close shades, or delay irrigation. The `units` field lets the response match the user's preferred measurement system.

Commercial building systems can use the same fields as a lightweight external signal for HVAC scheduling or lobby messaging. These automations should include local sensor checks because OpenWeather data may not reflect microclimates around a specific building.

### Event Arrival And On-Site Messaging

An event organizer can check weather at venue coordinates shortly before doors open. `visibility`, `wind`, `rain.1h`, `snow.1h`, and condition descriptions can drive attendee messages about umbrellas, parking-lot delays, or outdoor queue adjustments.

For an individual, the same data helps decide what to wear or whether to leave earlier. The endpoint is especially valuable when paired with reverse geocoding so alerts use a human-readable venue or neighborhood label.

### Logistics Exception Triage

A logistics team can enrich delayed delivery events with current conditions at the vehicle or destination coordinate. Wind, visibility, rain/snow, and weather description fields help distinguish weather-related delays from staffing or routing issues.

That context can drive automated notes, customer messaging, or escalation thresholds. The limitation is evidentiary: current weather data supports operational explanation but should not be treated as proof for contractual claims without stronger source and timestamp controls.
