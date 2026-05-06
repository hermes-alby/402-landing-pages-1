# Google Maps: Environmental Air And Allergy API Uses

## What This Endpoint Group Does

Look up current and historical air quality plus pollen forecasts for health, travel, and operations decisions.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| POST | /airquality/v1/currentConditions:lookup | Get current air quality conditions | location, extraComputations, languageCode, universalAqi, customLocalAqis | dateTime, regionCode, indexes, pollutants, healthRecommendations |
| POST | /airquality/v1/history:lookup | Get air quality history | location, dateTime, period, pageSize, pageToken, extraComputations, languageCode | hoursInfo, nextPageToken, regionCode |
| GET | /pollen/v1/forecast:lookup | Get pollen forecast | location.latitude, location.longitude, days, pageSize, pageToken, languageCode, plantsDescription | dailyInfo, nextPageToken, regionCode |

## Field Notes

### Inputs

- latitude/longitude
- time or period
- forecast days
- language
- AQI options
- extra computations

### Outputs

- AQI indexes
- pollutants
- dominant pollutants
- health recommendations
- hourly AQ history
- pollen index values
- plant information

### Important Constraints Or Gaps

- Direct Google Maps Platform use normally requires an API key or OAuth, enabled APIs, a Google Cloud project, billing, quotas, and compliance with Google Maps Platform terms. The MPP wrapper hides direct key setup but the public feed does not document wrapper-specific error schemas or transformations.
- Several newer APIs require field masks or optional response field selection. Missing field masks can change output shape and billing tier.
- Image, tile, photo, and video endpoints return binary media, redirects, media URLs, or tileset metadata rather than uniform JSON.

## Use Cases

### Personal Exposure Planning

A person with asthma, allergies, or children can check AQI, pollutants, health recommendations, and pollen indexes before exercising outdoors or opening windows. The fields support concrete decisions such as rescheduling a run or choosing indoor childcare activities.

### Workforce And Event Safety

Schools, construction firms, farms, and event operators can monitor local AQI, pollutant details, and pollen forecasts to decide whether to modify outdoor work, issue PPE guidance, or change event plans. Historical hourly records also support after-action review for exposure incidents.

### Location Scoring For Travel Or Relocation

A travel or real-estate product can enrich neighborhoods with recent AQI and pollen seasonality signals. These are decision-support signals, not medical advice, and should be presented with freshness and coverage caveats.
