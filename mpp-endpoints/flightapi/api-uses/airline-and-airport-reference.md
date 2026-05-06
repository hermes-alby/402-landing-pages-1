# FlightAPI: Airline And Airport Reference API Uses

## What This Endpoint Group Does

This endpoint group resolves airline or airport names to provider-recognized codes. It is a small reference-data endpoint, but it matters because the other FlightAPI endpoints require airline codes, flight numbers, and airport IATA codes as inputs.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/iata/:rest*` | Search airline or airport code records by name | Name string, type `airline` or `airport` | `data[]` records with `fs` code and `name` |

## Field Notes

### Inputs

The provider endpoint is documented as `/iata/<api_key>?name=<search>&type=<airline|airport>`. The `name` parameter can be any string matching an airline or airport. The `type` enum is documented as `airline` or `airport`.

### Outputs

The sample response returns a `data` array. Each record contains `fs` and `name`, such as `AA` and `American Airlines`. The docs do not clarify whether `fs` always equals an IATA code, an ICAO code, or a provider-specific code in all cases.

### Important Constraints Or Gaps

The docs' usage paragraph mistakenly says to call `trackbyroute`, but the endpoint heading and examples show `/iata`. Matching behavior, ranking, pagination, and exact code semantics are not documented. No MPP-specific docs clarify upstream API-key handling.

## Use Cases

### Natural-Language Travel Intake Cleanup

A personal travel agent can accept loose user text such as "American from JFK to Heathrow" and resolve "American" or airport names before calling price-search or tracking endpoints. The `type` input keeps airline and airport searches separate, and returned `fs`/`name` pairs let the user or agent confirm the intended entity.

For a business, this reduces failed API calls and support friction in search forms. Instead of requiring exact IATA inputs up front, the app can resolve partial names, show choices, and then pass clean codes into FlightAPI fare or tracking calls.

### Data Normalization For Travel Records

A company with messy itinerary data can use the endpoint to normalize airline and airport names before matching them to flight status or schedule workflows. `fs` becomes the join key and `name` becomes the display label.

The value is highest when the business receives unstructured data from emails, PDFs, chat, or CRM notes. The limitation is that the endpoint does not document confidence scores or canonical code type, so ambiguous matches should be reviewed or presented as selectable candidates.

### Search Autocomplete For Travel Apps

A travel app can power lightweight autocomplete for airline or airport fields. As the user types, the app can query by `name` and `type`, then display returned `name` values while storing the returned `fs` code for later FlightAPI calls.

The output is intentionally simple, which makes it easy to use in forms. For production autocomplete, the app would need throttling, caching, and fallback UX for no matches because the docs do not specify rate limits beyond plan connection limits or response pagination.

### Agent Tool Selection And Validation

An AI travel assistant can use the reference endpoint as a validation step before choosing a more expensive MPP endpoint. If a user gives "Delta 33 on Oct 24", the agent can resolve Delta to the expected airline code and only then call the tracking endpoint.

For businesses, this can reduce paid-call waste and improve auditability: failed or ambiguous lookups can be logged before invoking fare search or tracking. The caveat is that the lookup itself is also paid through MPP metadata, so very high-volume systems may prefer a cached code table when possible.
