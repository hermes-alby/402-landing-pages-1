# GoFlightLabs: Flight Shopping And Market Search API Uses

## What This Endpoint Group Does

This group supports flight shopping and localization. It searches priced flight options, can group roundtrip legs, and supplies place/country/currency metadata that helps construct or interpret shopping queries.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /flight-prices | Flight price search | originIATACode, destinationIATACode, date, returnDate, sortBy, mode | flights, pairs, pairs[].outbound, pairs[].inbound, unpaired, price, currency, origin |
| GET | /retrieve-airports | Retrieve airports/place search | query | skyId, entityId, presentation, navigation, navigation.relevantFlightParams.skyId, navigation.relevantFlightParams.entityId, navigation.relevantFlightParams.flightPlaceType, navigation.relevantFlightParams.localizedName |
| GET | /retrieve-countries | Retrieve countries | none beyond auth | country, countryCode, market, currencyTitle, currency, currencySymbol |

## Field Notes

### Inputs

Flight Prices uses origin and destination, departure date, optional return date, mode, sort order, and roundtrip grouping. The fetched HTML page documents `originIATACode` and `destinationIATACode`, while the public Postman collection still shows older `originSkyId`, `destinationSkyId`, `originEntityId`, and `destinationEntityId` parameters. Retrieve Airports accepts a free-text `query`; Retrieve Countries has only provider auth in the docs.

### Outputs

Price outputs include numeric price, currency, origin/destination code and city, departure/arrival datetimes, duration, stop count, flight number, marketing carrier, and operating carrier. Roundtrip grouping can return `pairs[].outbound`, `pairs[].inbound`, and `unpaired`. Place search returns `skyId`, `entityId`, presentation labels, and relevant flight parameters. Countries returns country, countryCode, market, currencyTitle, currency, and currencySymbol.

### Important Constraints Or Gaps

The price endpoint appears to scrape public flight options, so freshness, completeness, booking availability, and fare rules are not guaranteed by the docs. Parameter drift between the fetched HTML and Postman collection is a material integration risk. No booking, reservation, ticketing, or payment mutation endpoint is included.

## Use Cases

### Personal Fare Monitoring Before Booking

A traveler can query a route and date, then compare price, stops, duration, carriers, and departure/arrival times. The fields support decisions such as whether to book now, adjust dates, choose a nonstop flight, or trade duration for price.

An agent can repeat the query on a schedule and notify the traveler when the cheapest or best-ranked option crosses a target. Because the endpoint returns options rather than booking rights, the final purchase still needs a booking provider and fare validation.

### Corporate Travel Policy Screening

A business travel tool can enrich an employee's intended trip with priced alternatives. It can compare `price`, `currency`, `durationInMinutes`, `stopCount`, `marketingCarrier`, and `operatingCarrier` against policy before approving reimbursement or suggesting a lower-cost itinerary.

The workflow becomes more useful when joined with company policy, traveler preferences, and booking data. The API does not expose fare class, refundability, baggage allowance, or emissions fields, so those decisions need other sources.

### Roundtrip Pairing For Travel Agents

A travel agent or itinerary-building app can use `group_by_roundtrip=true` to receive outbound/inbound pairs and unpaired legs, reducing the work needed to assemble roundtrip suggestions. This is valuable for comparing complete trip options instead of isolated flight legs.

The field gap is that the docs do not explain the pairing algorithm or provider coverage. Agents should present options as leads for verification, not final inventory.

### Localized Market And Currency Presentation

A travel marketplace can use country and currency metadata to display prices in a user's preferred market and currency context. Place search can normalize user-entered locations into structured flight-place records.

This helps personal users search by city names and helps businesses reduce failed searches caused by ambiguous airport names. The current docs conflict on whether price search wants IATA codes or SkyId/entityId values, so integrations should validate the exact MPP wrapper behavior before automation.
