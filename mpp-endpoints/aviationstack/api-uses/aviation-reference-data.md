# AviationStack: Aviation Reference Data API Uses

## What This Endpoint Group Does

This group covers lookup endpoints for airports, airlines, airplanes, aircraft types, cities, countries, and aviation taxes. These endpoints are best for resolving codes, enriching records, powering search/autocomplete, and joining operational flight data to stable reference metadata.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /v1/aircraft_types | Aircraft type lookup | limit, offset, search | plane_type_id, aircraft_name, iata_code |
| GET | /v1/airlines | Airline lookup | limit, offset, search | airline id/name, IATA/ICAO, callsign, fleet, hub, country |
| GET | /v1/airplanes | Airplane lookup | limit, offset, search | registration, model, owner, airline codes, engine/count/status/class data |
| GET | /v1/airports | Airport lookup | limit, offset, search | airport name, IATA/ICAO, coordinates, timezone, phone, country, city IATA |
| GET | /v1/cities | City lookup | limit, offset, search | city id/name, IATA, country, coordinates, timezone, GeoNames |
| GET | /v1/countries | Country lookup | limit, offset, search | ISO codes, capital, continent, currency, FIPS, phone prefix, population |
| GET | /v1/taxes | Aviation tax lookup | limit, offset, search | tax id, tax name, IATA code |

## Field Notes

### Inputs

All endpoints use common pagination. The docs describe search as an autocomplete-style parameter for supported lookup endpoints, available only to paid upstream plan subscribers.

### Outputs

The outputs are identifier-heavy: IATA, ICAO, ISO, GeoNames, airline ids, airplane ids, aircraft type ids, and tax ids. Several endpoints also return useful enrichment fields such as coordinates, timezones, GMT offsets, fleet size, aircraft age/status, country currency, phone prefix, and population.

### Important Constraints Or Gaps

These are reference lookups, not proof of current operational state. Some fields may be stale or null, especially phone numbers, airplane ownership, cabin class details, or airline fleet metadata. Search/autocomplete is upstream paid-plan-only, and the MPP wrapper's exact handling of upstream plan gates is not separately documented.

## Use Cases

### Validate And Normalize User-Entered Flight Data

A person entering an itinerary may type a city name, airport name, airline name, or flight code inconsistently. Airport, city, and airline lookups can resolve names to IATA/ICAO codes before querying flight or schedule endpoints. This reduces false misses when a user says New York but the workflow needs JFK, LGA, or EWR.

Businesses can use the same normalization in booking support, travel intake forms, CRM notes, and logistics systems. Consistent airport and airline codes make downstream flight tracking and reporting more reliable.

### Enrich Flight Records For User Interfaces And Reports

Operational flight endpoints often return compact codes. Reference lookups can add airport names, coordinates, timezones, country names, airline callsigns, and aircraft names. A traveler gets a clearer itinerary; a business report becomes understandable without manual code tables.

This is especially valuable when combining multiple data sources. The IATA/ICAO and ISO fields become join keys, while timezones and GMT offsets help display times correctly for users in different regions.

### Fleet And Aircraft Context For Risk Or Experience Reviews

The airplanes and aircraft_types endpoints expose model, registration, aircraft type, engine count/type, plane age, owner, status, and class data when available. A traveler may use this to understand aircraft type or cabin expectations.

A business can use aircraft age, model, owner, and status fields for light operational context, travel policy analysis, or internal enrichment. This should not be treated as safety certification or maintenance authority; it is reference data from the provider, not a regulatory record.

### Destination Metadata For Travel Products

City and country endpoints provide coordinates, timezones, currency, capital, phone prefix, population, and ISO identifiers. Personal travel tools can show destination context alongside flight status.

Travel companies can enrich destination pages, payment/currency hints, localization rules, and regional reporting with these fields. The useful action is to avoid maintaining separate country/city tables for lightweight travel workflows.

### Aviation Tax Code Resolution

The taxes endpoint returns tax ids, names, and IATA tax codes. A traveler might rarely use this directly, but businesses dealing with fare display, invoice review, or travel-cost explanation can map cryptic aviation tax codes to readable names.

This does not calculate fare taxes by itinerary. It is best treated as a code dictionary that can enrich invoices, receipts, or customer-support explanations when a separate fare or ticketing system supplies the actual assessed tax codes.
