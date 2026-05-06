# FlightAPI: Flight Price Search API Uses

## What This Endpoint Group Does

This endpoint group searches available priced flight itineraries for one-way, round-trip, and multi-city trips. Inputs describe airports, travel dates, passenger counts, cabin class, and currency. Outputs include itinerary, leg, segment, carrier, airport, booking-provider, stopover, timing, quote-age, price, fare, and handoff/deeplink fields.

The strongest value is pre-booking decision support: comparing routes, checking whether a price is current, evaluating stopover burden, choosing cabin and date combinations, and feeding travel-planning workflows with structured fare options.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/onewaytrip/:rest*` | Search one-way priced itineraries | Departure airport, arrival airport, departure date, passenger counts, cabin class, currency | Itineraries, legs, segments, pricing options, price amount, quote age, booking/deeplink URL, carriers, agents |
| GET | `/roundtrip/:rest*` | Search return-trip priced itineraries | Departure airport, arrival airport, outbound date, return date, passenger counts, cabin class, currency | Two-leg itineraries, cheapest price, pricing options, legs, segments, carriers, agents |
| GET | `/multitrip/:rest*` | Search multi-city priced itineraries | Three to five trip count, airport/date leg pairs, passenger counts, cabin class, currency | Multi-leg options, segments, stopovers, airlines, airports, trips, fares, price breakdowns, handoff URL |

## Field Notes

### Inputs

The core inputs are IATA airport codes, travel dates, passenger counts, cabin class, and currency. One-way and round-trip provider docs list `region` as required in the parameter table, but the displayed URL schema and examples omit it. Multi-trip uses query parameters such as `arp1` through `arp6`, `date1` through `date3`, `adults`, `children`, `infants`, `cabinclass`, `currency`, and `trips`.

### Outputs

One-way and round-trip examples return normalized reference arrays: `itineraries` point to `legs`, `legs` point to `segments`, and docs describe `places`, `carriers`, and `agents` as reference arrays. Price-bearing fields include `pricing_options[].price.amount`, `pricing_options[].price.last_updated`, `quote_age`, `cheapest_price.amount`, and booking or transport deeplink URLs.

Multi-trip examples include `legs`, `search`, `airlines`, `airports`, `trips`, and `fares`. Its fare objects expose richer price breakdown fields such as `totalAmount`, `amountPerAdult`, `currencyCode`, `bookingFee`, `providerCode`, `remainingSeatsCount`, `refundable`, `exchangeable`, and `handoffUrl`.

### Important Constraints Or Gaps

Official docs are sample-derived and explicitly say more attributes or arrays may appear. No OpenAPI spec was found. Public MPP feed paths use `:rest*`, but no MPP-specific docs explain whether callers provide the upstream API key path segment or whether the wrapper injects it after MPP payment. Provider credit costs are 2 credits for one-way, 2 for round-trip, and 5 for multi-trip; MPP payment metadata lists separate raw payment amounts.

## Use Cases

### Flexible Trip Fare Shopping

A traveler can compare nearby dates, airports, cabins, and currencies by issuing one-way or round-trip searches and ranking the returned itineraries by `price.amount`, `cheapest_price.amount`, `duration`, `stop_count`, and `quote_age`. The output helps decide whether a cheaper fare is worth a long layover, whether the quote is fresh enough to act on, and which booking provider or deeplink should be opened next.

A travel marketplace or agency can use the same fields to enrich a search results page or agent response with structured price, duration, carrier, and stop information. The main limitation is that booking still depends on handoff/deeplink URLs and provider/agent availability; the API is not documented as a booking or ticketing API.

### Corporate Travel Policy Screening

A business travel desk can query round-trip routes and automatically flag options that exceed policy, such as too many stops, nonpreferred carriers, high `amountPerAdult`, or itineraries with long `durationMinutes`. The fare, carrier, stopover, and segment fields can support a recommendation like "within budget but requires one long stop" before an employee opens a booking provider.

This is valuable for expense control and traveler productivity, but the API does not expose corporate contract fares, baggage rules, ticket conditions beyond partial fare flags, or policy metadata. A production workflow would need to combine FlightAPI results with the company's travel policy and booking system.

### Multi-City Itinerary Feasibility Planning

A traveler planning a complex route can use the multi-trip endpoint to see whether a sequence of city hops is practical. Fields such as `segments[].departureDateTime`, `segments[].arrivalDateTime`, `stopoverDurationMinutes`, `overnight`, `longStopover`, `airlineCodes`, and `fare.price.totalAmount` show whether an itinerary is cheap but exhausting, requires overnight travel, or crosses several carriers.

For travel agencies, this supports early itinerary design before manual review. The `handoffUrl`, `providerCode`, and `tripId` fields can route the best option to a booking workflow, while `refundable` and `exchangeable` hints help distinguish flexible travel from low-cost rigid fares when those fields are populated.

### Fare Monitoring For Route Decisions

A personal agent can periodically compare a small set of planned routes and store price, carrier, stop, and quote-age fields to decide when to alert the traveler. For businesses, the same pattern can support budget forecasting for recurring travel lanes, conference travel, or relocation planning.

The value comes from structured `amount`, `currencyCode`, `last_updated`, `quote_age`, airport, and date fields. The caveat is that FlightAPI docs do not publish data freshness guarantees or long-term historical price access; a monitor would need its own snapshots and should respect provider and MPP request costs.

### Travel Content And Lead Qualification

A travel publisher or destination business can use route price outputs to make lead forms more useful. For example, after a user selects origin, destination, and dates, the app can show indicative fare ranges, directness, carriers, and booking providers before asking the user to continue with an agent.

This use case is strongest when fare fields are used to qualify intent: low price and direct routes can trigger self-serve booking links, while expensive or multi-stop routes can route to a human travel consultant. It should not claim confirmed availability after quote age grows stale.
