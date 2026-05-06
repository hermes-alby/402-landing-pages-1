# StableTravel: Airport Operations And Weather API Uses

## What This Endpoint Group Does

Inspect airport metadata, nearby airports, delays, arrivals/departures, scheduled flights, route filings, flight counts, METAR observations, and TAF forecasts. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream airport operations, delay, and weather data comes from FlightAware AeroAPI surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/flightaware/airports/:id/flights/counts` | Get flight counts (departed, enroute, scheduled) for a specific airport | none documented | departed, enroute, scheduled_departures, scheduled_arrivals |
| GET | `/api/flightaware/airports/:id/routes/:dest_id` | Get routes between two airports with historical filing data | sort_by, date_start, date_end, max_pages, cursor | routes, links, num_pages |
| GET | `/api/flightaware/airports/:id` | Get detailed information for a specific airport by its code | none documented | airport_code, code_icao, code_iata, code_lid, name, type, elevation, city |
| GET | `/api/flightaware/airports/:id/canonical` | Get the canonical airport code for a given airport identifier | none documented | airport_code, code_icao, code_iata, code_lid |
| GET | `/api/flightaware/airports/nearby` | Find airports near a given latitude/longitude coordinate | latitude, longitude, radius, only_iap, max_pages, cursor | airports, links, num_pages |
| GET | `/api/flightaware/airports` | List all airports with optional pagination | max_pages, cursor | airports, links, num_pages |
| GET | `/api/flightaware/airports/delays` | Get all current airport delays across the system | none documented | delays |
| GET | `/api/flightaware/airports/:id/nearby` | Get airports near a specific airport | radius, only_iap, max_pages, cursor | airports, links, num_pages |
| GET | `/api/flightaware/airports/:id/delays` | Get current delay information for a specific airport | none documented | delays |
| GET | `/api/flightaware/airports/:id/flights` | Get all flights (arrivals, departures, enroute, scheduled) for an airport | type, airline, max_pages, cursor | arrivals, departures, scheduled_arrivals, scheduled_departures, links, num_pages |
| GET | `/api/flightaware/airports/:id/flights/arrivals` | Get arrival flights for a specific airport | type, airline, max_pages, cursor | arrivals, links, num_pages |
| GET | `/api/flightaware/airports/:id/flights/departures` | Get departure flights for a specific airport | type, airline, max_pages, cursor | departures, links, num_pages |
| GET | `/api/flightaware/airports/:id/flights/scheduled-departures` | Get scheduled departure flights for a specific airport | type, airline, max_pages, cursor | scheduled_departures, links, num_pages |
| GET | `/api/flightaware/airports/:id/flights/scheduled-arrivals` | Get scheduled arrival flights for a specific airport | type, airline, max_pages, cursor | scheduled_arrivals, links, num_pages |
| GET | `/api/flightaware/airports/:id/flights/to/:dest_id` | Get flights from one airport to another specific destination airport | type, connection, date_start, date_end, max_pages, cursor | flights, links, num_pages, num_flights |
| GET | `/api/flightaware/airports/:id/weather/observations` | Get weather observations (METAR) for a specific airport | timestamp, return_nearby_weather, temperature_units | airport_code, cloud_friendly, clouds, conditions, density_altitude, dewpoint, flight_rules, humidity_pct |
| GET | `/api/flightaware/airports/:id/weather/forecast` | Get weather forecast (TAF) for a specific airport | timestamp, return_nearby_weather, temperature_units | airport_code, timeframe, forecast, raw_forecast |

## Field Notes

### Inputs

- sort_by
- date_start
- date_end
- max_pages
- cursor
- latitude (required)
- longitude (required)
- radius
- only_iap
- type
- airline
- connection
- timestamp
- return_nearby_weather
- temperature_units

### Outputs

- departed
- enroute
- scheduled_departures
- scheduled_arrivals
- routes
- links
- num_pages
- airport_code
- code_icao
- code_iata
- code_lid
- name
- type
- elevation
- city
- state
- longitude
- latitude
- timezone
- country_code
- wiki_url
- airport_flights_url
- alternatives
- airports
- delays
- arrivals
- departures
- flights
- num_flights
- cloud_friendly
- clouds
- conditions
- density_altitude
- dewpoint
- flight_rules
- humidity_pct
- pressure
- pressure_hg
- raw_data
- temperature

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Airport Delay And Weather Triage

Airport delay, weather observations, and forecast endpoints let travelers and support teams decide whether a problem is airline-specific, weather-driven, or airport-wide. METAR/TAF fields, delay records, and scheduled arrivals/departures support earlier rebooking and pickup decisions than waiting for airline notifications.

### Pickup, Lounge, And Staffing Coordination

Arrivals, departures, scheduled flights, all-flight lists, and flight counts help businesses estimate airport flow. Hotels, ground transport providers, lounges, and event teams can plan staff around bursts of arriving flights or disruptions, while individuals can time airport pickup more precisely.

### Alternate Airport Discovery

Nearby airport and canonical-code endpoints help reroute around disruptions or choose an airport for a flexible trip. Combined with direct route and weather data, an agent can evaluate whether a nearby airport is a practical alternative instead of simply cheaper.

### Route Filing And Airport Pair Analysis

Routes between airports and flights-to-destination endpoints expose historical or operational routing context between airport pairs. Aviation analysts and travel operations teams can use this to judge common routings, expected flight activity, and whether a route merits deeper fare or disruption analysis.
