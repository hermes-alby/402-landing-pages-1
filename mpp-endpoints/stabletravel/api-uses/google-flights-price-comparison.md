# StableTravel: Google Flights Price Comparison API Uses

## What This Endpoint Group Does

Use Google Flights/SerpAPI-style shopping data to compare market prices and booking links before deciding whether to book elsewhere. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream shopping data is Google Flights-style market data surfaced through the Google Flights endpoints. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/google-flights/booking` | Get booking options for a specific flight. Requires a departure_token from a search result. | departure_id, arrival_id, outbound_date, return_date, type, travel_class, adults, children | search_metadata, search_parameters, selected_flights, booking_options, price_insights |
| GET | `/api/google-flights/search` | Search Google Flights for flight offers. Returns best flights, other flights, price insights, and airport info. | departure_id, arrival_id, outbound_date, return_date, type, travel_class, adults, children | search_metadata, search_parameters, best_flights, other_flights, price_insights, airports |

## Field Notes

### Inputs

- departure_id (required)
- arrival_id (required)
- outbound_date (required)
- return_date
- type
- travel_class
- adults
- children
- infants_in_seat
- infants_on_lap
- currency
- hl
- departure_token (required)
- stops
- max_price
- exclude_airlines
- include_airlines
- gl

### Outputs

- search_metadata
- search_parameters
- selected_flights
- booking_options
- price_insights
- best_flights
- other_flights
- airports

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Market Fare Benchmarking Before Booking

Google Flights search returns best flights, other flights, airport information, and price insights such as low price and typical ranges. A traveler can use it to decide whether an Amadeus offer is fair before booking; a business travel team can log market benchmarks before approving an itinerary or asking an agent to search alternatives.

### OTA And Airline Booking-Link Routing

The booking endpoint uses a departure token from search and returns selected flights plus booking options, prices, and URLs. This supports workflows where the user wants to compare whether booking through an airline site, OTA, or separate Amadeus flow is cheaper or more operationally appropriate.

### Flexible-Date Trip Planning

Inputs such as passenger counts, class, stops, currency, max price, included/excluded airlines, and date parameters let an agent screen many candidate trips. The output can rank routes by price and convenience, but clients need controls because every search and booking-option lookup is paid.
