# SerpApi: Flight Search And Booking Options API Uses

## What This Endpoint Group Does

This endpoint group lets a caller search Google Flights through SerpApi for current itinerary options and price context. A request can define route, travel dates, trip type, passengers, cabin, currency, locale, airline preferences, stops, baggage, time windows, layover limits, total-duration limits, and emissions filters. The response returns structured itineraries with segment-level airport, time, airline, aircraft, flight-number, legroom, delay, layover, total duration, price, carbon-emission, and token fields.

The same endpoint also supports continuation workflows: `departure_token` selects an outbound option to retrieve return flights or next multi-city legs, while `booking_token` retrieves booking options for a selected itinerary. These token flows make the endpoint useful for moving from broad search to decision-ready comparison and purchase handoff, but the reviewed docs do not fully document the booking-options response schema.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/search` | Google Flights search through the MPP SerpApi wrapper | `engine`, `departure_id`, `arrival_id`, `outbound_date`, `return_date`, `type`, `travel_class`, passenger counts, `currency`, `sort_by`, `stops`, airline filters, `bags`, `max_price`, time windows, `departure_token`, `booking_token` | `best_flights`, `other_flights`, flight segments, layovers, price, total duration, emissions, `departure_token`, `booking_token`, `price_insights`, `airports`, `search_metadata` |

## Field Notes

### Inputs

The core search inputs are route identifiers (`departure_id`, `arrival_id`), dates (`outbound_date`, `return_date`), trip type (`type`), passenger counts, travel class, and localization (`gl`, `hl`, `currency`). The endpoint also supports practical filters: stops, airline inclusion/exclusion, carry-on bags, maximum price, departure/arrival time windows, layover duration, excluded connecting airports, maximum total duration, and lower-emissions-only results.

Round-trip and multi-city flows depend on tokens. `departure_token` is returned in flight results and is used to fetch return flights or the next itinerary leg. `booking_token` is returned for selected flights and is used to retrieve booking options. The two token parameters are mutually exclusive.

### Outputs

Flight outputs are split into `best_flights` and `other_flights`, although `best_flights` is not always present. Each itinerary can include segment arrays, layover arrays, `total_duration`, `price`, `type`, `airline_logo`, `extensions`, `carbon_emissions`, `departure_token`, and `booking_token`. Segment fields include departure and arrival airport names/codes/times, airline, flight number, aircraft, travel class, legroom, overnight flags, delay flags, and operating-airline details.

Price and decision-support outputs include `price_insights.lowest_price`, `price_insights.price_level`, `typical_price_range`, and timestamped `price_history`. Airport outputs include city, country, country code, image, and thumbnail metadata for departure and arrival locations. `search_metadata.status` shows lifecycle state and `error` carries failed-search messages.

### Important Constraints Or Gaps

Direct SerpApi requires `api_key`, while the MPP wrapper probably uses payment authorization instead. That was not verified because no paid MPP call was made. The direct docs require `engine=google_flights`; the wrapper may inject this, but the feed does not say.

`exclude_basic` only works for U.S. domestic economy searches with `gl=us` and `travel_class=1`. `async=true` depends on SerpApi's Searches Archive API in direct use, but the MPP feed exposes no archive endpoint. SerpApi says cached direct searches expire after 1 hour and do not count toward direct monthly quotas; MPP cache billing is unknown.

## Use Cases

### Personal Fare Decisioning For Flexible Trips

A traveler can search candidate routes and dates, sort by price, and compare `price`, `total_duration`, `stops`, `layovers`, `departure_airport.time`, `arrival_airport.time`, and `price_insights.price_level` before deciding whether to book now or keep watching. The `typical_price_range` and `price_history` fields make the output more useful than a simple fare list because they add context around whether the current lowest price is actually attractive.

For a travel app or agent, the same fields can automate "book, wait, or change date" recommendations. The app can flag low-price results that still violate comfort rules, such as overnight layovers, long total duration, or inconvenient departure windows, rather than simply recommending the cheapest ticket.

### Corporate Travel Policy Screening

A business travel team can screen available itineraries against policy before a traveler requests approval. Inputs like `max_price`, `travel_class`, `stops`, `include_airlines`, `exclude_airlines`, `bags`, and time windows can encode hard policy constraints, while outputs like `price`, `total_duration`, `layovers`, `airline`, `flight_number`, and `extensions` support audit trails for why an itinerary was recommended or rejected.

This is most valuable when paired with an internal policy engine. The endpoint does not know company policy or traveler profiles by itself, but it provides current market options and enough structured fields to compare cost, duration, carrier, and baggage implications.

### Return-Leg And Multi-City Itinerary Assembly

For round trips and multi-city trips, a personal assistant or travel platform can first search outbound options, then use `departure_token` to retrieve return flights or the next leg. This lets the workflow preserve a selected outbound while narrowing the next decision, instead of forcing users to manually rebuild a complete itinerary from scratch.

The value comes from keeping itinerary state explicit. The token can carry a selected outbound into the next query, while returned prices, durations, layovers, and emissions can be scored across complete itinerary combinations. The main gap is that the MPP wrapper's support for every direct token flow has not been verified.

### Booking Handoff And Supplier Comparison

When a result includes `booking_token`, a consumer travel assistant can request booking options for the selected itinerary and hand the user to a seller or checkout path. Businesses can use this to compare booking channels, identify fare conditions in `extensions`, and retain the original flight details (`flight_number`, times, airports, airline, price) alongside booking choices.

This is valuable for workflows that need a quote-like handoff rather than just discovery. The reviewed docs document the token mechanism but not a complete booking-options response structure, so downstream booking-channel automation should be treated as partially specified until tested or documented more fully.

### Disruption-Aware Route Selection

A traveler, executive assistant, or corporate travel desk can use segment-level `often_delayed_by_over_30_min`, overnight flags, layover durations, airport connection points, and `total_duration` to avoid fragile itineraries even when they are cheap. Inputs such as `exclude_conns`, `layover_duration`, `max_duration`, `stops`, and time windows make this screen enforceable at query time.

For businesses, this supports lower-risk booking recommendations for time-sensitive trips, conferences, field service, or crew movement. The endpoint is not a real-time flight-status API, so it should not be used as the only source for day-of-operations disruption monitoring; it is better for pre-booking risk screening.

### Carbon-Conscious Flight Selection

Users can request lower-emission results with `emissions=1` and compare `carbon_emissions.this_flight`, `typical_for_this_route`, and `difference_percent` across options. A personal travel assistant can show the tradeoff between price, duration, stops, and emissions instead of treating emissions as an afterthought.

Companies with travel-sustainability goals can use the same fields to recommend lower-emission itineraries that stay within cost and time bounds. The emissions values are estimates returned by Google Flights through SerpApi, so they should be recorded as decision-support data rather than treated as audited carbon accounting.

### Airline And Alliance Preference Automation

Frequent travelers can use `include_airlines` or `exclude_airlines` to focus on preferred carriers, alliances, loyalty programs, or avoided airlines. Returned `airline`, `ticket_also_sold_by`, `plane_and_crew_by`, and `flight_number` fields help distinguish marketed and operated flights when comfort, loyalty credit, or operational reliability matters.

For agencies and corporate programs, these fields support preferred-carrier compliance and negotiated-supplier analysis. The endpoint does not expose negotiated corporate fares, so it should be combined with internal contract data before making procurement conclusions.

### Budget Alerts Without Monthly Provider Commitment

Because the MPP wrapper lists a per-request charge, occasional users can run targeted searches for high-value trips without setting up a direct SerpApi subscription. A personal agent could check a route only when dates or target prices matter, using `max_price`, `price_insights`, and `currency` to decide whether to notify the user.

For small businesses, this can support lightweight travel monitoring for infrequent trips. It is less compelling for high-volume travel search because direct SerpApi plans publish monthly quotas and high-throughput options, and the MPP wrapper's cache and failed-search billing behavior is not documented.
