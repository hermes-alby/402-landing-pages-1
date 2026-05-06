# OpenWeather: Air Quality Risk API Uses

## What This Endpoint Group Does

This endpoint returns current air quality for a coordinate: AQI from 1 to 5 and concentrations for carbon monoxide, nitrogen monoxide, nitrogen dioxide, ozone, sulphur dioxide, PM2.5, PM10, and ammonia. It supports exposure-aware decisions rather than general weather planning.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | `/openweather/air-quality` | Fetch current AQI and pollutant concentrations for coordinates. | `lat`, `lon` | `coord`, `list[].main.aqi`, `list[].components.*`, `list[].dt` |

## Field Notes

### Inputs

`lat` and `lon` are required. The MPP wrapper does not expose units, language, forecast, or historical parameters for this endpoint.

### Outputs

`list[].main.aqi` is the coarse 1-5 air-quality category. `components.co`, `no`, `no2`, `o3`, `so2`, `pm2_5`, `pm10`, and `nh3` provide pollutant-level detail. `list[].dt` timestamps the observation.

### Important Constraints Or Gaps

The wrapper lists current air quality only. OpenWeather offers broader air-pollution products upstream, but forecast and historical variants are not in the assigned MPP endpoint list. This data is useful for risk screening and user guidance, not medical diagnosis.

## Use Cases

### Sensitive-Person Outdoor Activity Decisions

An individual with asthma, allergies, or high sensitivity to pollution can check AQI and pollutant components before running, commuting by bike, or taking children outside. PM2.5, PM10, ozone, and NO2 fields are especially relevant for exposure-aware choices.

A school, elder-care facility, or fitness business can use the same data to move activities indoors, modify class intensity, or send caution messages. Health guidance should be conservative and paired with local public-health recommendations where available.

### Facility And Workplace Safety Screening

A construction or outdoor operations manager can check AQI and pollutant concentrations before assigning long outdoor shifts. The timestamp `dt` helps ensure the decision is based on a current observation.

The operational value is a simple trigger for masks, breaks, indoor reassignment, or supervisor review. The endpoint does not provide site-level sensor certainty, so high-risk workplaces should combine it with local monitoring and safety policy.

### Travel And Destination Comfort Checks

A traveler can compare air quality at a destination before choosing outdoor-heavy plans. AQI plus PM2.5/PM10 and ozone can explain why a day that looks pleasant by temperature may still be uncomfortable.

Hotels, tour operators, and event venues can use the fields to adjust recommendations or proactively message guests about air-quality-sensitive activities. The use case is strongest when paired with weather forecast data so users see both comfort and exposure risk.

### Environmental Context For Incident Triage

A support or operations team can attach AQI and pollutant components to incident reports involving smoke, industrial odor, or visibility complaints. The data helps distinguish generalized regional conditions from issues that need local inspection.

This is valuable for triage, but not for regulatory compliance or attribution. The endpoint does not identify pollution sources, measurement stations, or legal exceedance status.
