# OpenWeather: Full Weather Suite And Summaries API Uses

## What This Endpoint Group Does

This group covers the One Call weather suite and its narrative Weather Overview companion. `onecall` returns structured current, minutely, hourly, daily, and alert blocks for a coordinate unless sections are excluded. `weather-overview` returns an AI-generated human-readable summary for today or tomorrow.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/openweather/onecall` | Fetch full One Call forecast and alerts. | `lat`, `lon`, `exclude`, `units`, `lang` | `current`, `minutely`, `hourly`, `daily`, `alerts`, `timezone` |
| POST | `/openweather/weather-overview` | Fetch a natural-language weather summary for today or tomorrow. | `lat`, `lon`, `date`, `units` | Human-readable overview text; exact wrapper key undocumented |

## Field Notes

### Inputs

Both endpoints require `lat` and `lon`. `onecall` supports `exclude` values for `current`, `minutely`, `hourly`, `daily`, and `alerts`, plus `units` and `lang`. `weather-overview` supports `date` for today or tomorrow and `units`, but the MPP docs do not list `lang`.

### Outputs

`onecall` provides structured blocks for immediate conditions, minute precipitation, hourly and daily forecasts, UV, wind, precipitation probability, rain/snow, and government alerts. Alert fields include sender, event, start/end time, description, and tags. `weather-overview` provides narrative summary text but the exact response field name is not documented by the wrapper.

### Important Constraints Or Gaps

MPP docs state both endpoints require One Call 3.0 subscription upstream. The wrapper OpenAPI does not include detailed 200 schemas. Weather Overview is limited to today or tomorrow according to MPP docs, and timezone-boundary handling is not documented.

## Use Cases

### Severe Weather And Alert Triage

A personal assistant can use `alerts` plus hourly and daily forecast fields to warn about storms, heat, wind, or precipitation before a commute or outdoor plan. Alert `event`, `start`, `end`, `sender_name`, and `description` fields are directly actionable because they explain what is happening and when.

A business can route these alerts into operations tooling for store closures, crew dispatch holds, or customer notifications. The value is strongest when alert windows are combined with `hourly` wind, precipitation, and temperature details so staff know whether to monitor, delay, or cancel.

### Minute-To-Day Personal Planning

One Call combines immediate weather, minute precipitation, hourly outlook, and daily forecast in one request. A user can decide whether to leave now, wait 20 minutes for rain to pass, or shift a weekend plan based on `minutely.precipitation`, `hourly.pop`, `daily.temp`, and `weather.description`.

For consumer apps, this reduces multiple weather calls into a single paid request and enables richer recommendations. The `exclude` field is useful when the app needs only certain blocks, but the MPP cost appears fixed per endpoint call in the available metadata.

### Operations Briefings In Plain Language

Weather Overview can turn weather data into a narrative briefing for a location and date. A user gets an immediate readable summary without interpreting temperature, UV, humidity, wind, and precipitation fields.

Businesses can include the summary in morning shift notes, hotel concierge messages, tour itineraries, or field-service briefings. Because the exact returned field name is undocumented, implementations should inspect the wrapper response once payment-enabled usage is explicitly approved, then parse defensively.

### Weather-Aware Risk Scoring

An insurer, logistics platform, or field-service system can score operational risk from `hourly` and `daily` fields: wind speed/gust, precipitation probability, rain/snow, visibility, UV, temperature, and alerts. The score can trigger review, rescheduling, or extra documentation.

The fields are valuable because they combine near-term timing and severity in one payload. The limitation is governance: weather data can support risk triage, but high-stakes or contractual decisions should record source, retrieval time, forecast horizon, and any official alert provenance.

### Customer-Facing Travel And Hospitality Context

Travel apps and hotels can use `daily`, `hourly`, and Weather Overview outputs to suggest packing, departure timing, indoor alternatives, or alert-aware itinerary changes. `lang` on One Call can localize descriptions for users where supported.

The business value is proactive service: fewer surprised customers and better recommendations. It should be paired with location resolution and cached coordinates so repeated destination lookups do not add unnecessary cost.
